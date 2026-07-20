import {
  Terminal,
  Container,
  GitBranch,
  Bug,
  FileCode2,
  ChevronRight,
} from "lucide-react";

function Sidebar({ selectedTool, setSelectedTool }) {
  const tools = [
    {
      name: "Linux Commands",
      icon: <Terminal size={18} />,
    },
    {
      name: "Dockerfile Generator",
      icon: <Container size={18} />,
    },
    {
      name: "GitHub Actions",
      icon: <GitBranch size={18} />,
    },
    {
      name: "Error Debugger",
      icon: <Bug size={18} />,
    },
    {
      name: "Bash Script",
      icon: <FileCode2 size={18} />,
    },
  ];

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col">

      <div className="px-6 py-5 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">
          Developer Tools
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Select a tool to begin
        </p>
      </div>

      <div className="flex-1 p-4 space-y-2">

        {tools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => setSelectedTool(tool.name)}
            className={`group w-full flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.97]
            ${
              selectedTool === tool.name
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >

            <div className="flex items-center gap-3">

              {tool.icon}

              <span className="font-medium">
                {tool.name}
              </span>

            </div>

            <ChevronRight
              size={16}
              className="opacity-40 group-hover:translate-x-1 transition-all"
            />

          </button>
        ))}

      </div>

    </aside>
  );
}

export default Sidebar;