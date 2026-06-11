const Answer = ({ question, answer }) => {
  return (
    <div className="mb-4">

      <div className="text-right">
        <div className="inline-block bg-blue-600 p-3 rounded-lg">
          {question}
        </div>
      </div>

      <div className="text-left mt-2">
        <div className="inline-block bg-zinc-700 p-3 rounded-lg">
          {answer}
        </div>
      </div>

    </div>
  );
};

export default Answer;