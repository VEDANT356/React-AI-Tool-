import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Answer = ({ question, answer, time }) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    alert(" Answer copied!");
  };

  return (
    <div className="mb-4">

      <div className="text-right">
        <div className="font-bold">
          👤 
        </div>

        <div className="inline-block bg-blue-600 p-3 rounded-lg">
          {question}
        </div>
        <div>
          <button
            onClick={copyToClipboard}
            className="mt-2 bg-zinc-600 px-3 py-1 rounded text-sm"
          >
            ⧉
          </button>
        </div>
      </div>


      <div className="text-left mt-2">
        <div className="font-bold">
          🤖 
        </div>

        <div className="inline-block bg-zinc-700 p-3 rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {answer}
          </ReactMarkdown>
        </div>

        <div className="text-xs text-zinc-400 mt-1">
          {time}
        </div>


        <div>
          <button
            onClick={copyToClipboard}
            className="mt-2 bg-zinc-600 px-3 py-1 rounded text-sm"
          >
            ⧉
          </button>
        </div>

      </div>

    </div>
  );
};

export default Answer;