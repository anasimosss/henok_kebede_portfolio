import fs from "fs";

export default function clearLogPlugin() {
  return {
    name: "clear-log-on-build",
    buildStart() {
      // This runs on every build trigger in watch mode
      fs.writeFileSync("build.log", "");
    },
  };
}
