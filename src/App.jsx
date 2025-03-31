import { useState, useEffect, useRef } from "react";
import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false); 
  const chatEndRef = useRef(null); 

  const stickers = ["\ud83e\udd16", "\ud83d\udca1", "\ud83d\ude80", "\u2728", "\ud83d\ude03"]; 

  const handleSend = async () => {
    if (input.trim() !== '') {
      try {
        setIsTyping(true); 

        const genAI = new GoogleGenerativeAI("AIzaSyCnlxZOdRYgjpXh9nUIFqfthg0qJUYMMQw"); 
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const result = await model.generateContent({ 
          contents: [{ role: "user", parts: [{ text: input }] }]
        });

        const aiText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
        const sticker = stickers[Math.floor(Math.random() * stickers.length)];

        setChatHistory([...chatHistory, { userText: input, aiText, sticker }]);
        setInput('');
      } catch (error) {
        console.error("Error in handleSend:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      
      <header className="p-4 text-center text-xl font-bold bg-gray-800">
        Mike__Talk__AI 🤖
      </header>

      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {chatHistory.map((val, i) => (
          <div key={i} className="flex flex-col">
          
            <div className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg max-w-md md:max-w-lg lg:max-w-xl">
              <strong>You:</strong> {val.userText}
            </div>
           
            <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-lg max-w-md md:max-w-lg lg:max-w-2xl mt-2">
              {val.sticker} {val.aiText}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

    
      {isTyping && (
        <p className="text-center text-gray-400">Mike is typing<span>.</span><span>.</span><span>.</span></p>
      )}

     
      <div className="flex items-center p-4 bg-gray-800 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); 
              handleSend();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 p-2 pr-4 rounded-lg bg-gray-700 border-none outline-none text-white"
        />
        <button 
          onClick={handleSend} 
          className="ml-4 bg-red-600 px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
