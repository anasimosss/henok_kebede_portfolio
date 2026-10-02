import { Toaster } from "sonner";
import AboutAndSkills from "./components/AboutAndSkills";
import CaseStudyAndProjects from "./components/CaseStudyAndProjects";
import ContactAndFooter from "./components/ContactAndFooter";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-[#070c1a] font-sans text-slate-300 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main">
        <Hero />
        <AboutAndSkills />
        <CaseStudyAndProjects />
      </main>

      <ContactAndFooter />

      <Toaster position="bottom-right" theme="dark" closeButton />
    </div>
  );
}