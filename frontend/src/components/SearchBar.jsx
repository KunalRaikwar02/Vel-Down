import React from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

/**
 * SearchBar component for URL input and fetch triggering.
 * Features dynamic error states and focus-based aesthetic enhancements.
 */
export const SearchBar = ({ url, setUrl, onFetch, loading, errorMsg }) => (
  <div className="relative max-w-4xl mx-auto mt-16 group px-4">
    
    {/* Dynamic glow effect synchronized with focus and error states */}
    <div className={`absolute -inset-1 rounded-[2.6rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-700 ${errorMsg ? 'bg-red-500/20' : 'bg-luxe-gold/10'}`}></div>

    <div className={`relative flex flex-col md:flex-row items-center bg-white/5 border-2 transition-all duration-300 p-2 rounded-[2.5rem] backdrop-blur-xl shadow-2xl group-focus-within:border-luxe-gold/40 ${errorMsg ? 'border-red-500/50' : 'border-luxe-gold/20'}`}>
      
      <div className="flex-1 flex items-center w-full">
        {/* Visual Indicator: Search Icon with state-based coloring */}
        <div className={`pl-6 transition-colors ${errorMsg ? 'text-red-500' : 'text-luxe-gold'}`}>
          <Search size={22} />
        </div>
        
        {/* Primary Input Field */}
        <input 
          type="text"
          placeholder={errorMsg ? errorMsg : "PASTE YOUTUBE URL HERE..."}
          className={`w-full bg-transparent border-none py-6 px-4 focus:outline-none font-bold text-xl transition-all ${errorMsg ? 'placeholder:text-red-500/60' : 'placeholder:text-luxe-gold/20'}`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onFetch()}
        />
      </div>
      
      {/* Action Trigger: High-contrast download button */}
      <button 
        onClick={onFetch}
        disabled={loading}
        className="anton bg-black text-white px-12 py-5 rounded-4xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-2xl tracking-widest w-full md:w-auto shadow-xl"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            DOWNLOAD <ArrowRight size={24} className="text-white" />
          </>
        )}
      </button>
    </div>
  </div>
);