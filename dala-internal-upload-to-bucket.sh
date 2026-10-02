#!/bin/bash

# Upload dist directory to Google Cloud Storage using gsutil with HMAC authentication
# Usage: PROJECT_ID=xxx FRAGMENT_ID=yyy BUCKET_NAME=zzz GCS_ACCESS_KEY=xxx GCS_SECRET_KEY=yyy ./upload-to-gcs.sh

set -e  # Exit on error

# Configuration
MAX_RETRIES=3
RETRY_DELAY=3
VALIDATION_RETRIES=3
VALIDATION_DELAY=2

# Read environment variables
PROJECT_ID="${PROJECT_ID}"
FRAGMENT_ID="${FRAGMENT_ID}"
BUCKET_NAME="${BUCKET_NAME}"
DIST_DIR="${DIST_DIR:-./dist}"
GCS_ACCESS_KEY="${GCS_ACCESS_KEY}"
GCS_SECRET_KEY="${GCS_SECRET_KEY}"

# Retry function for commands
retry_command() {
  local max_attempts=$1
  shift
  local delay=$1
  shift
  local attempt=1
  local exit_code=0

  while [ $attempt -le $max_attempts ]; do
    if "$@"; then
      return 0
    else
      exit_code=$?
      if [ $attempt -lt $max_attempts ]; then
        echo "⚠️  Command failed (attempt $attempt/$max_attempts). Retrying in ${delay}s..."
        sleep $delay
        ((attempt++))
      else
        echo "❌ Command failed after $max_attempts attempts"
        return $exit_code
      fi
    fi
  done
}

# Validate required environment variables
if [ -z "$PROJECT_ID" ] || [ -z "$FRAGMENT_ID" ] || [ -z "$BUCKET_NAME" ]; then
  echo "Error: Missing required environment variables"
  echo "Required: PROJECT_ID, FRAGMENT_ID, BUCKET_NAME"
  echo ""
  echo "For HMAC authentication, also set:"
  echo "  GCS_ACCESS_KEY=your-access-key"
  echo "  GCS_SECRET_KEY=your-secret-key"
  echo ""
  echo "Usage:"
  echo "  PROJECT_ID=myproject FRAGMENT_ID=myfragment BUCKET_NAME=mybucket \\"
  echo "  GCS_ACCESS_KEY=GOOG1E... GCS_SECRET_KEY=... ./upload-to-gcs.sh"
  exit 1
fi

# Validate dist directory and required files
validate_dist_directory() {
  local validation_attempt=1
  
  while [ $validation_attempt -le $VALIDATION_RETRIES ]; do
    echo "🔍 Validating dist directory (attempt $validation_attempt/$VALIDATION_RETRIES)..."
    
    # Check if index.html exists
    if [ ! -f "$DIST_DIR/index.html" ]; then
      echo "❌ Error: index.html not found in $DIST_DIR"
      if [ $validation_attempt -lt $VALIDATION_RETRIES ]; then
        echo "⏳ Waiting ${VALIDATION_DELAY}s before retry..."
        sleep $VALIDATION_DELAY
        ((validation_attempt++))
        continue
      else
        echo "❌ index.html not found after $VALIDATION_RETRIES attempts"
        exit 1
      fi
    fi
    
    # All validations passed
    echo "✅ Validation successful:"
    echo "   - index.html: found"
    echo "   - assets directory: found with $assets_count files"
    echo ""
    return 0
  done
  
  exit 1
}

# Run validation
validate_dist_directory

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
  echo "Error: gsutil is not installed"
  echo "Install it from: https://cloud.google.com/storage/docs/gsutil_install"
  exit 1
fi

# Configure HMAC authentication if keys are provided
if [ -n "$GCS_ACCESS_KEY" ] && [ -n "$GCS_SECRET_KEY" ]; then
  echo "Configuring HMAC authentication..."
  
  # Create a temporary boto config file
  BOTO_CONFIG=$(mktemp)
  
  cat > "$BOTO_CONFIG" << EOF
[Credentials]
gs_access_key_id = $GCS_ACCESS_KEY
gs_secret_access_key = $GCS_SECRET_KEY

[Boto]
https_validate_certificates = True

[GSUtil]
default_project_id = $PROJECT_ID
prefer_api = json
EOF
  
  # Export the boto config location
  export BOTO_CONFIG
  
  echo "HMAC authentication configured"
  echo ""
else
  echo "Warning: No HMAC keys provided, using default authentication"
  echo ""
fi

# Construct the destination path
DESTINATION="gs://${BUCKET_NAME}/${PROJECT_ID}/${FRAGMENT_ID}/"

echo "🚀 Starting upload to ${DESTINATION}"
echo "📁 Source directory: ${DIST_DIR}"
echo ""

# Function to inject required scripts into index.html if they don't exist
# Returns the path to the file to upload (either original or modified temp file)
inject_required_scripts() {
  local index_file="$DIST_DIR/index.html"
  local modified=false
  
  echo "🔍 Checking index.html for required script tags..."
  
  # Read the current content
  local content=$(<"$index_file")
  
  # Check if thumbnail-capture.js is already included
  if ! echo "$content" | grep -q "thumbnail-capture.js"; then
    echo "   ➕ Adding thumbnail-capture.js"
    modified=true
  else
    echo "   ✓ thumbnail-capture.js already included"
  fi
  
  # Check if iframe-error-reporter.js is already included
  if ! echo "$content" | grep -q "iframe-error-reporter.js"; then
    echo "   ➕ Adding iframe-error-reporter.js"
    modified=true
  else
    echo "   ✓ iframe-error-reporter.js already included"
  fi
  
  # If modifications are needed, inject the script tags
  if [ "$modified" = true ]; then
    # Create a temporary file for the modified index.html
    TEMP_INDEX_FILE=$(mktemp)
    
    # Create script tags to inject
    local scripts_to_inject=""
    
    if ! echo "$content" | grep -q "thumbnail-capture.js"; then
      scripts_to_inject="${scripts_to_inject}    <script src=\"https://images.gp.gebeya.io/dala-assets/thumbnail-capture.js\"></script>\n"
    fi
    
    if ! echo "$content" | grep -q "iframe-error-reporter.js"; then
      scripts_to_inject="${scripts_to_inject}    <script src=\"https://images.gp.gebeya.io/dala-assets/iframe-error-reporter.js\"></script>\n"
    fi
    
    # Try to inject before </body> tag, if it exists
    if echo "$content" | grep -q "</body>"; then
      echo "$content" | sed "s|</body>|${scripts_to_inject}  </body>|" > "$TEMP_INDEX_FILE"
      echo "   ✅ Scripts injected before </body> tag"
    else
      echo "   ⚠️  Warning: Could not find </body> tag, scripts not injected"
      rm -f "$TEMP_INDEX_FILE"
      TEMP_INDEX_FILE=""
      echo ""
      return 1
    fi
    
    echo "   📝 Modified version created in temporary file"
  else
    echo "   ✅ All required scripts already present"
    TEMP_INDEX_FILE=""
  fi
  
  echo ""
  return 0
}

# Global variable to store temp file path
TEMP_INDEX_FILE=""

# Inject required scripts before uploading
inject_required_scripts

# Upload index.html with retry (use temp file if modifications were made)
echo "📤 Uploading index.html..."
if [ -n "$TEMP_INDEX_FILE" ] && [ -f "$TEMP_INDEX_FILE" ]; then
  echo "   📄 Using modified version from temporary file"
  retry_command $MAX_RETRIES $RETRY_DELAY \
    gsutil -h "Content-Type:text/html" -h "Cache-Control:public, max-age=100" \
    cp "$TEMP_INDEX_FILE" "${DESTINATION}index.html"
else
  echo "   📄 Using original file"
  retry_command $MAX_RETRIES $RETRY_DELAY \
    gsutil -h "Content-Type:text/html" -h "Cache-Control:public, max-age=100" \
    cp "$DIST_DIR/index.html" "${DESTINATION}index.html"
fi

if [ $? -ne 0 ]; then
  echo "❌ Failed to upload index.html"
  exit 1
fi
echo "✅ index.html uploaded successfully with correct Content-Type"
echo ""

# Upload assets directory with retry
echo "📤 Uploading assets directory..."
retry_command $MAX_RETRIES $RETRY_DELAY \
  gsutil -m rsync -r -d \
  -x ".*\.DS_Store$|.*\.git/.*" \
  "$DIST_DIR/assets" \
  "${DESTINATION}assets"

if [ $? -ne 0 ]; then
  echo "❌ Failed to upload assets directory"
  exit 1
fi
echo "✅ assets directory uploaded successfully"
echo ""

# Upload remaining files in dist directory (excluding already uploaded)
echo "📤 Uploading remaining files..."

# First, upload JavaScript files with proper content type
if compgen -G "$DIST_DIR/*.js" > /dev/null; then
  retry_command $MAX_RETRIES $RETRY_DELAY \
    gsutil -m -h "Content-Type:application/javascript" -h "Cache-Control:public, max-age=100" \
    cp "$DIST_DIR/*.js" "$DESTINATION" || echo "⚠️  Warning: Some JS files may not have been uploaded"
fi

# Then upload any other remaining files (excluding already uploaded ones)
retry_command $MAX_RETRIES $RETRY_DELAY \
  gsutil -m rsync -r \
  -x ".*\.DS_Store$|.*\.git/.*|.*index\.html$|.*assets/.*|.*\.js$" \
  "$DIST_DIR" \
  "$DESTINATION"

if [ $? -ne 0 ]; then
  echo "⚠️  Warning: Some additional files may not have been uploaded"
fi
echo "✅ Remaining files uploaded"
echo ""

# Verify critical files were uploaded
echo "🔍 Verifying upload..."
verify_upload() {
  # Use ls with -L flag to avoid ACL operations (compatible with uniform bucket-level access)
  gsutil ls "${DESTINATION}index.html" > /dev/null 2>&1 && \
  gsutil ls "${DESTINATION}assets/" > /dev/null 2>&1
}

if ! retry_command $MAX_RETRIES $RETRY_DELAY verify_upload; then
  echo "❌ Upload verification failed"
  exit 1
fi
echo "✅ Upload verification successful"
echo ""

# Note: Cache control for index.html is already set during upload

# Set cache control and content-type for assets (longer cache)
echo "⚙️  Setting cache control and content-type for static assets..."

# Set metadata for JavaScript files
retry_command $MAX_RETRIES $RETRY_DELAY \
  gsutil -m setmeta -h "Content-Type:application/javascript" -h "Cache-Control:public, max-age=100" \
  "${DESTINATION}assets/**.js" || echo "⚠️  Warning: Could not set metadata for JS files"

# Set metadata for CSS files
retry_command $MAX_RETRIES $RETRY_DELAY \
  gsutil -m setmeta -h "Content-Type:text/css" -h "Cache-Control:public, max-age=100" \
  "${DESTINATION}assets/**.css" || echo "⚠️  Warning: Could not set metadata for CSS files"

# Set cache control for other assets
retry_command $MAX_RETRIES $RETRY_DELAY \
  gsutil -m setmeta -h "Cache-Control:public, max-age=100" \
  "${DESTINATION}assets/**" || echo "⚠️  Warning: Could not set metadata for other assets"

# Clean up temporary boto config
if [ -n "$BOTO_CONFIG" ] && [ -f "$BOTO_CONFIG" ]; then
  rm -f "$BOTO_CONFIG"
fi

# Clean up temporary index.html file
if [ -n "$TEMP_INDEX_FILE" ] && [ -f "$TEMP_INDEX_FILE" ]; then
  rm -f "$TEMP_INDEX_FILE"
  echo "🧹 Cleaned up temporary files"
fi

echo ""
echo "🎉 Upload completed successfully!"
echo ""
echo "📊 Upload Summary:"
echo "   Base URL: ${DESTINATION}"
echo "   Index: ${DESTINATION}index.html"
echo "   Assets: ${DESTINATION}assets/"
echo ""
echo "💡 To make files publicly accessible:"
echo ""
echo "   For buckets with uniform bucket-level access (recommended):"
echo "   gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}"
echo ""
echo "   For buckets with legacy ACL:"
echo "   gsutil -m acl ch -r -u AllUsers:R ${DESTINATION}"
echo ""
echo "🔗 Quick verification:"
echo "   gsutil ls ${DESTINATION}"