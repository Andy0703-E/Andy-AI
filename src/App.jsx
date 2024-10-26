import { useState, useEffect } from "react"; 
import { requestToGroqAi } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import './App.css';

function App() {
  const [data, setData] = useState("");
  const [content, setContent] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [language, setLanguage] = useState("en"); 
  const [greetingMessage, setGreetingMessage] = useState(""); 

  useEffect(() => {
    const greeting = getGreetingMessage();
    setGreetingMessage(greeting);
  }, []);

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Selamat pagi!";
    } else if (hour < 17) {
      return "Selamat siang!";
    } else if (hour < 20) {
      return "Selamat sore!";
    } else {
      return "Selamat malam!";
    }
  };

  const handleAiSubmit = async () => {
    setLoading(true);
    
    if (detectIndonesian(content)) {
      setLanguage("id");
    } else {
      setLanguage("en");
    }

    const aiResponse = await requestToGroqAi(content);
    setData(aiResponse);
    setLoading(false);
    setContent("");
  };

  const detectIndonesian = (inputText) => {
    const indonesianWords = [
      "saya", "apakah", "pacar", "berapa", "berikan", 
      "itu", "apa", "bagaimana", "siapa","siapakah", "kenapa", 
      "dimana", "contoh", "pengertian", "mengapa", 
      "seperti", "mungkin", "sangat", "tentang", 
      "bisa", "lebih", "akan", "coba"
    ];
    return indonesianWords.some(word => inputText.toLowerCase().includes(word));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
        handleAiSubmit(); 
    }
  };

  return (
    <main className="flex flex-col min-h-screen justify-between items-center bg-primary-color rounded-lg p-4">
      <header className="w-full bg-gradient-to-r py-6 rounded-lg flex items-center px-6 justify-center md:justify-start">
        <h1 className="text-4xl text-white font-semibold tracking-wider text-shadow animate-pulse">
          <span className="text-blue-400">ANDY</span> <span className="text-pink-400">AI</span>
        </h1>
      </header>

      <div className="flex flex-col flex-grow w-full max-w-2xl mx-auto">
        <div className="p-8 flex-grow text-white overflow-auto transition-transform duration-500 hover:scale-105">
          {data ? (
            <div className="text-left">
              <SyntaxHighlight language="swift" style={darcula} wrapLongLines={true}>
                {data}
              </SyntaxHighlight>
            </div>
          ) : (
            <>
              <p className="text-indigo-300 animate-pulse text-center">{greetingMessage}</p>
            </>
          )}
          {loading && (
            <div className="flex justify-center items-center mt-4">
              <div className="loader"></div>
              <span className="ml-3 text-white">Sedang memproses...</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleAiSubmit(); }} className="w-full max-w-2xl mx-auto mt-4 p-4 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
        <textarea 
          placeholder="💬 Kirim pesan ke ANDY"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 rounded-md mb-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
          rows="3"
        ></textarea>
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-2 rounded-md text-white font-bold shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Kirim 🚀
        </button>
        {errorMessage && (
          <p className="text-red-500 mt-2">{errorMessage}</p> 
        )}
      </form>

      <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-left-color: #ffffff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}

export default App;
