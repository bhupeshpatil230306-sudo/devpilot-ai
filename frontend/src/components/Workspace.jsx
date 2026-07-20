import { Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

function Workspace({ selectedTool }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const descriptions = {
    "Linux Commands": "Generate and explain Linux commands instantly.",
    "Dockerfile Generator": "Create production-ready Dockerfiles.",
    "GitHub Actions": "Generate CI/CD workflows using GitHub Actions.",
    "Error Debugger": "Understand and fix programming errors quickly.",
    "Bash Script": "Generate powerful Bash scripts for automation.",
  };

  const handleGenerate = async () => {
  if (!prompt.trim()) {
    setOutput("⚠️ Please enter a prompt.");
    return;
  }

  setLoading(true);
  setOutput("");

  try {
    const res = await axios.post(
      "https://devpilot-ai-4gi4.onrender.com/generate",
      {
        tool: selectedTool,
        text: prompt,
      }
    );

    console.log("Status:", res.status);
    console.log("Data:", res.data);

    const responseText =
      res.data.response ||
      res.data.result ||
      res.data.output ||
      res.data.message ||
      JSON.stringify(res.data, null, 2);

    setOutput(responseText);

  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.response) {
      console.log("Response:", error.response);

      setOutput(
        `❌ Backend Error (${error.response.status})\n\n${JSON.stringify(
          error.response.data,
          null,
          2
        )}`
      );
    } else if (error.request) {
      console.log("Request:", error.request);

      setOutput(
        "❌ Request sent successfully, but no response was received from the backend."
      );
    } else {
      setOutput(error.message);
    }
  } finally {
    setLoading(false);
  }
};


    const downloadResponse = () => {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "DevPilot_AI_Response.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
  <main className="flex-1 bg-slate-900 overflow-y-auto">
    <div className="max-w-6xl mx-auto px-8 py-10">

      <div className="mb-10 border-b border-slate-800 pb-6">

        <h2 className="text-5xl font-bold tracking-tight text-white">
          {selectedTool}
        </h2>

        <p className="mt-3 text-lg leading-7 text-slate-400 max-w-3xl">
          {descriptions[selectedTool]}
        </p>

      </div>

      <textarea
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  placeholder={`Describe your request...

Try asking:
• Explain chmod 777
• Generate Dockerfile for FastAPI
• Debug this Python error`}
  className="w-full mt-6 h-52 resize-none rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
/>

      <div className="mt-6 flex gap-4 flex-wrap">

        <button
  onClick={handleGenerate}
  disabled={loading}
  className="px-6 py-3 rounded-xl font-semibold text-white hover:bg-cyan-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
>
  {loading ? "Generating Response..." : "⚡ Generate Response"}
</button>

        <button
          onClick={() => {
            setPrompt("");
            setOutput("");
          }}
          className="px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-95"
        >
          Clear Workspace
        </button>

        <button
          onClick={downloadResponse}
          disabled={!output}
          className="px-6 py-3 rounded-xl bg-cyan-500 font-semibold text-white hover:bg-cyan-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          Download
        </button>

      </div>

      <div className="mt-10 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl shadow-cyan-500/5 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden">

  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">

    <div>
      <h3 className="text-lg font-semibold text-white">
        AI Response
      </h3>

      <p className="text-sm text-slate-400">
        Powered by DevPilot AI
      </p>

</div>
  </div>
  

  <div className="p-8 min-h-[250px] overflow-auto">
        <div className="overflow-auto">

          {output ? (

            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {

                  const match = /language-(\w+)/.exec(className || "");

                  if (!inline && match) {
                    return (
                      <div className="relative">

                        <CopyToClipboard
                          text={String(children).replace(/\n$/, "")}
                          onCopy={() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                        >
                          <button className="absolute right-3 top-3 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded text-sm font-semibold">
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </CopyToClipboard>

                        <SyntaxHighlighter
                          language={match[1]}
                          style={oneDark}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>

                      </div>
                    );
                  }

                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {output}
              </ReactMarkdown>

          ) : (

            <div className="flex flex-col items-center justify-center py-24 text-center">

  <div className="mb-5">
    <Sparkles size={52} className="text-cyan-400 mx-auto" />
  </div>

  <h3 className="text-2xl font-semibold text-white">
    Ready to Generate
  </h3>

  <p className="mt-3 text-slate-400 max-w-lg">
    Describe your task above and DevPilot AI will generate a professional response.
  </p>

</div>
)} 

        </div>

      </div>
</div>

</div>
    </main>
  );
}

export default Workspace;