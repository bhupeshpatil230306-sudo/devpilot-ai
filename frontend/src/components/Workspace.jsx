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
    <main className="flex-1 p-8 bg-slate-950 text-white">
      <h2 className="text-3xl font-bold">
        🤖 {selectedTool}
      </h2>

      <p className="text-gray-400 mt-2">
        {descriptions[selectedTool]}
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={`Ask AI about ${selectedTool}...`}
        className="w-full mt-6 h-36 bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-cyan-400"
      />

      <div className="mt-6 flex gap-4 flex-wrap">

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "⚡ Generate with AI"}
        </button>

        <button
          onClick={() => {
            setPrompt("");
            setOutput("");
          }}
          className="px-6 py-3 bg-red-500 hover:bg-red-400 rounded-xl font-semibold transition"
        >
          🗑️ Clear
        </button>

        <button
          onClick={downloadResponse}
          disabled={!output}
          className="px-6 py-3 bg-green-500 hover:bg-green-400 rounded-xl font-semibold transition disabled:opacity-50"
        >
          📥 Download
        </button>

      </div>

      <div className="mt-10 bg-slate-900 border border-slate-700 rounded-xl p-6 min-h-[220px]">
        <h3 className="text-xl font-semibold mb-4">
          📄 AI Output
        </h3>

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
            <p className="text-gray-400">
              Your generated result will appear here...
            </p>
          )}

        </div>

      </div>

    </main>
  );
}

export default Workspace;