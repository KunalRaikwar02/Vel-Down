import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
// Import matching the filename and component export: ResultCard
import { ResultCard } from './components/ResultCard'; 
import Footer from './components/Footer';
import { fetchVideoDetails } from './api/youtube';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handles theme switching by toggling the 'light-mode' class on the root element
  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [darkMode]);

  // Main function to fetch video metadata from the API
  const onFetch = async () => {
    // Validation: Check if the input URL is empty or just whitespace
    if (!url.trim()) {
      setErrorMsg("PLEASE ENTER A VALID LINK"); // User feedback for empty input
      setTimeout(() => setErrorMsg(''), 3000); // Reset error after 3 seconds
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setData(null);

    const res = await fetchVideoDetails(url);
    
    if (res.success) {
      setData(res);
      setShowModal(true); // Display the modal if the API call is successful
    } else {
      // Show error message 
      setErrorMsg(res.message.toUpperCase());
      setTimeout(() => setErrorMsg(''), 4000); // Reset error after 4 seconds
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen selection:bg-luxe-gold selection:text-coffee bg-(--bg-primary) transition-colors duration-500">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="pt-24 pb-32 px-4 relative">
        <Hero />
        {/* Search interface for URL input and action trigger */}
        <SearchBar 
          url={url} 
          setUrl={setUrl} 
          onFetch={onFetch} 
          loading={loading} 
          errorMsg={errorMsg} 
        />
      </main>

      {/* --- MODAL DISPLAY LOGIC --- */}
      {showModal && data && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">

          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowModal(false)}></div>
          
          <div className="relative w-full max-w-6xl z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
            {/* Displaying fetched video results and quality options */}
            <ResultCard 
              videoData={data.video} 
              qualities={data.qualities} 
              url={url} 
              onClose={() => setShowModal(false)} // Pass modal close handler
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;