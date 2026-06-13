import { useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import './App.css'
import Answer from './components/Answers';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: question,
      });
  
      setResult([
  ...result,
  {
    question: question,
    answer: response.text
  }
]);
      setQuestion('');
    } catch (error) {
      console.error(error);

      setResult([
  ...result,
  {
    question: question,
    answer: "Gemini server busy hai. Thodi der baad try karo."
  }
]);
    }

    setLoading(false);
  };

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800'></div>

      <div className='col-span-4'>
        <div className='container h-110 text-white p-4 overflow-y-auto'>

          {
  result && result.map((item, index) => (
    <Answer
      question={item.question}
      answer={item.answer}
      key={index}
    />
  ))
} 

        </div>

        <div className='bg-zinc-800 w-1/2 p-1 text-white m-auto rounded-4xl border border-zinc-700 flex h-16'>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(e) =>{
              if (e.key === 'Enter') {
                askQuestion();
              }
            }}
            className='w-full h-full p-3 outline-none'
            placeholder='Ask me Anything...'
          />

          <button onClick={askQuestion} disabled={loading} className="px-4 w-24">
            {loading  ? "thinking ..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;