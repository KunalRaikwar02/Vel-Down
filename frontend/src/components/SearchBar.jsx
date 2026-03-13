import React from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

export const SearchBar = ({ url, setUrl, onFetch, loading, errorMsg }) => (
  <div className="relative max-w-4xl mx-auto mt-16 group px-4">
    {/* Dynamic Glow: Provides a subtle red glow during error states */}
    <div className={`absolute -inset-1 rounded-[2.6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-700 ${errorMsg ? 'bg-red-500/20' : 'bg-white/5 dark:bg-black/5'}`}></div>

    <div className={`relative flex flex-col md:flex-row items-center bg-white/5 dark:bg-black/5 border-2 transition-all duration-300 p-2 rounded-[2.5rem] backdrop-blur-xl shadow-2xl group-focus-within:border-luxe-gold/40 ${errorMsg ? 'border-red-500/50' : 'border-luxe-gold/20'}`}>
      <div className="flex-1 flex items-center w-full">
        <div className={`pl-6 transition-colors ${errorMsg ? 'text-red-500' : 'text-luxe-gold/60'}`}>
          <Search size={22} />
        </div>
        <input 
          type="text"
          // Dynamic placeholder swaps to error message when validation fails
          placeholder={errorMsg ? errorMsg : "Paste YouTube URL here..."}
          className={`w-full bg-transparent border-none py-6 px-4 focus:outline-none font-bold text-xl text-(--input-text) transition-all ${errorMsg ? 'placeholder:text-red-500/60 placeholder:opacity-100' : 'placeholder:opacity-20'}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          // Keyboard accessibility: Triggers fetch on Enter key press
          onKeyDown={(e) => e.key === 'Enter' && onFetch()}
        />
      </div>
      
      <button 
        onClick={onFetch}
        disabled={loading}
        className="anton bg-(--button-bg) text-(--button-text) px-12 py-5 rounded-4xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-2xl tracking-widest w-full md:w-auto shadow-xl"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            DOWNLOAD <ArrowRight size={24} className="opacity-70" />
          </>
        )}
      </button>
    </div>
  </div>
);