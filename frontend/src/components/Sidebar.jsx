function Sidebar({ selectedTool, setSelectedTool }) {
  const tools = [
    "Linux Commands",
    "Dockerfile Generator",
    "GitHub Actions",
    "Error Debugger",
    "Bash Script",
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-700 p-5">
      <h2 className="text-lg font-semibold text-white mb-6">
        Developer Tools
      </h2>

      <div className="space-y-3">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool)}
            className={`w-full text-left p-3 rounded-lg transition ${
              selectedTool === tool
                ? "bg-cyan-500 text-white"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            {tool}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;