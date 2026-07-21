import { Sparkles } from "lucide-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">

            <Sparkles size={20} className="text-white" />

          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              DevPilot AI
            </h1>

            <p className="text-xs text-slate-400">
              AI-Powered Developer Workspace
            </p>
          </div>

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <a
            href="https://github.com/bhupeshpatil230306-sudo/devpilot-ai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 active:scale-95"
          >
            <span className="text-sm font-medium">GitHub</span>
            GitHub
          </a>

        </div>

      </div>
    </header>
  );
}

export default Header;