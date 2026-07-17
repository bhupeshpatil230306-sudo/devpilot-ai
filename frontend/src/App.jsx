import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";

function App() {

  const [selectedTool, setSelectedTool] = useState("Linux Commands");

  return (
    <div className="min-h-screen bg-slate-950">

      <Header />

      <div className="flex h-[calc(100vh-64px)]">

        <Sidebar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />

        <Workspace
          selectedTool={selectedTool}
        />

      </div>

    </div>
  );
}

export default App;