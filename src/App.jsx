import { useState, useEffect , useRef } from 'react'
import { GoogleGenAI } from "@google/genai";
import './App.css'
import Answer from './components/Answers';
import logo from "./assets/smarttalk-logo.png";

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect (() => {
    const savedChats = localStorage. getItem("chats");
    if (savedChats) {
      setResult(JSON.parse(savedChats))
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(result));
  }, [result]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [result]);

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
  
      const fullAnswer = response.text;

      console.log("full Answer :", fullAnswer)

      setResult([
  ...result,
  {
    question: question,
    answer: "",
    time : new Date().toLocaleTimeString()
  }
]);

let currentText = "";

for (let i=0; i< fullAnswer.length; i++){
  currentText +=  fullAnswer[i];

  setResult((prev) => {
    const updated = [...prev];

    updated[updated.length -1] ={
      ...updated[updated.length -1],
      answer: currentText
    };

    return updated;
    });

    await new Promise((resolve) => setTimeout (resolve, 10 ));
  }

    setQuestion('');

}catch (error) {
      console.error(error);

      setResult([
  ...result,
  {
    question: question,
    answer: "Gemini server busy hai. Thodi der baad try karo." ,
    time : new Date().toLocaleTimeString()
  }
]);
    }

    setLoading(false);
  };

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800 text-white p-4'>

<div className="flex items-center gap-1 mb-4">
  <img
    src={logo}
    alt="SmartTalk Logo"
    className="w-25 h-25 "
  />

  <h1 className="text-3xl font-bold">
    SmartTalk
  </h1>
</div>

<button
  onClick={() => setResult([])}
  className='w-full bg-zinc-700 p-2 rounded mb-3 hover:bg-zinc-600'>
  New Chat
</button>

  <button
    onClick={() =>{
        setResult([]);
      localStorage.removeItem("chats");
    }}
    className='mt-4 bg-red-500 px-4 py-2 rounded'>
    Clear Chats
  </button>

  <h1 className='text-xl font-bold mb-4 mb-3 text-zinc-300'>
    Recent Chats
  </h1>

  {
    result.map((item, index) => (
      <div
        key={index}
        className='bg-zinc-700 p-3 mb-2 rounded text-sm truncate cursor-pointer hover:bg-zinc-600 transition-all duration-200'>

          💬 {item.question}
      </div>
    ))
  }
</div>
      <div className='col-span-4'>
        <div className='container h-110 text-white p-4 overflow-y-auto'>

          {
  result && result.map((item, index) => (
    <Answer
      question={item.question}
      answer={item.answer}
      time={item.time}
      key={index}
    />
  ))
} 
<div ref={chatEndRef}></div>

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
            placeholder='Ask SmartTalk...'
          />

          <button onClick={askQuestion} disabled={loading} className="px-4 w-24">
            {loading  ? " thinking...." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default App;  