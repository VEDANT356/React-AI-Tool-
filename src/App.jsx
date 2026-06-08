import { useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import './App.css'
import Answer from './components/Answers';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const askQuestion = async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: question,
      });

      setResult([...result, response.text]);
      setQuestion('');

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800'></div>

      <div className='col-span-4'>
        <div className='container h-110 text-white p-4 overflow-y-auto'>

          {
            result && result.map((item, index) => (
              <Answer ans={item} key={index} />
            ))
          }

        </div>

        <div className='bg-zinc-800 w-1/2 p-1 text-white m-auto rounded-4xl border border-zinc-700 flex h-16'>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className='w-full h-full p-3 outline-none'
            placeholder='Ask me Anything...'
          />

          <button onClick={askQuestion} className='px-4'>
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;