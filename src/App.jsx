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
  const [showSidebar , setShowsidebar] =useState(true);

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
    model: "gemini-2.5-flash",
    contents: question,
  });

  const fullAnswer = response.text;

  console.log("full Answer :", fullAnswer);
  

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
    answer: "You Hit Your Free Plan Limit ! please Try Again Later" ,
    time : new Date().toLocaleTimeString()
  }
]);
    }

    setLoading(false);
  };

  return (

    <div className='flex h-screen overflow-hidden'>
      {showSidebar && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setShowsidebar(false)}
      />
    )}
    <div
  className={`
  w-72
  bg-zinc-800
  text-white
  p-4
  h-full
  overflow-y-auto
  transition-transform duration-300

  fixed 
  top-0 left-0
  z-50

  ${showSidebar ? "translate-x-0" : "-translate-x-full"}

`}
>
<div className="flex justify-end ">
  <button
    className="text-2xl"
    onClick={() => setShowsidebar(false)}
  >
    ✕
  </button>
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


<div className='flex-1 min-w-0 overflow-hidden'>

<div className="hidden md:flex items-center gap-3 p-4 text-white bg-zinc-900">
  <button
    className="bg-zinc-800 p-2 rounded"
    onClick={() => setShowsidebar(!showSidebar)}
  >
    ☰
  </button>
    <img
    src={logo}
    alt="SmartTalk Logo"
    className="w-12 h-12"
  />
  <h1 className="text-3xl font-bold">
    SmartTalk
  </h1>
</div>


<div className="md:hidden flex items-center gap-3 p-4 text-white bg-zinc-900">
  <button
    className="bg-zinc-800 p-2 rounded"
    onClick={() => setShowsidebar(!showSidebar)}
  >
    ☰
  </button>

  <img
    src={logo}
    alt="SmartTalk Logo"
    className="w-12 h-12"
  />

  <h1 className="text-2xl font-bold">
    SmartTalk
  </h1>
</div>


<div className='h-[calc(100vh-140px)] overflow-y-auto text-white p-4 pb-24'>  {
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
        <div
        className='
          bg-zinc-800
        w-[90%]
        max-w-3xl
        p-1
    text-white
    rounded-4xl
    border border-zinc-700
    flex h-16
    fixed
    bottom-4 left-1/2
    -translate-x-1/2
    z-30
  '
>
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