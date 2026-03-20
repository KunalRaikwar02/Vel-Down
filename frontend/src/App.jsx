import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard'; 
import Footer from './components/Footer';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize theme with document root class
  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [darkMode]);

  /**
   * Triggers video metadata extraction from the backend.
   * Handles validation and error states for the search flow.
   */
  const onFetch = async () => {
    if (!url.trim()) {
      setErrorMsg("ENTER URL FIRST");
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setData(null);

    try {
      // Backend request for video info and available qualities
        const res = await axios.get(`/api/youtube/info?url=${encodeURIComponent(url)}`);
      
      if (res.data.success) {
        setData({
          video: res.data.video,
          qualities: res.data.qualities || []
        });
        setShowModal(true);
      } else {
        setErrorMsg("VIDEO NOT FOUND");
      }
    } catch (err) {
      setErrorMsg("SERVER OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen selection:bg-luxe-gold selection:text-black bg-(--bg-primary) text-(--text-primary) transition-colors duration-500 overflow-x-hidden">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="pt-32 pb-32 px-4 relative z-10">
        <Hero />
        <SearchBar 
          url={url} 
          setUrl={setUrl} 
          onFetch={onFetch} 
          loading={loading} 
          errorMsg={errorMsg} 
        />
      </main>

      {/* --- Overlay Modal Logic --- */}
      {showModal && data && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop Blur & Exit Trigger */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-500" 
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Result Card Container */}
          <div className="relative w-full max-w-6xl z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
            <ResultCard 
              videoData={data.video} 
              qualities={data.qualities} 
              url={url} 
              onClose={() => setShowModal(false)} 
            />
          </div>
        </div>
      )}

      <Footer />

      {/* Aesthetic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-luxe-gold/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-luxe-gold/5 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}

export default App;