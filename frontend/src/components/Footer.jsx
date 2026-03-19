import React from "react";
import { Zap, Cpu, Lock, Server } from "lucide-react";

const Footer = () => {
  // Styles for footer links with hover transition
  const linkStyle = "cursor-pointer transition-all duration-300 opacity-40 hover:opacity-100 hover:text-luxe-gold active:scale-95";

  return (
    <footer className="relative mt-20 pb-12 pt-24 border-t border-(--nav-line) overflow-hidden bg-(--bg-primary)">
      
      {/* Background Watermark for Aesthetic Branding */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 opacity-[0.03] select-none pointer-events-none">
        <h1 className="anton text-[18vw] whitespace-nowrap leading-none text-(--text-primary)">
          VEL DOWN
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          
          {/* About Section: Service Overview */}
          <div className="flex flex-col gap-6 max-w-md">
            <div className="flex items-center gap-2 group cursor-default">
              <Zap className="text-luxe-gold fill-luxe-gold group-hover:scale-110 transition-transform" size={24} />
              <span className="anton text-2xl tracking-tighter uppercase text-(--text-primary)">
                VEL DOWN
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] font-bold leading-relaxed opacity-50 uppercase tracking-[0.15em] text-(--text-primary)">
                Vel Down is a high-performance, secure utility engineered for
                the modern web. We provide a seamless and safe environment for
                high-fidelity YouTube video extraction, stripping away intrusive
                ads and trackers.
              </p>
              <p className="text-[11px] font-bold leading-relaxed opacity-50 uppercase tracking-[0.15em] text-(--text-primary)">
                Our infrastructure is built on privacy-first principles ensuring 
                100% secure downloads with no watermarks and no data logging. 
                Pure quality, delivered instantly for creators who value precision.
              </p>
            </div>
          </div>

          {/* Site Navigation and Governance Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-24">
            <div className="flex flex-col gap-5">
              <h4 className="anton text-[12px] tracking-[0.3em] uppercase text-luxe-gold">
                Architecture
              </h4>
              <ul className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-(--text-primary)">
                <li className={`${linkStyle} flex items-center gap-3`}>
                  <Cpu size={14} className="text-luxe-gold/50" /> High Speed API Core
                </li>
                <li className={`${linkStyle} flex items-center gap-3`}>
                  <Lock size={14} className="text-luxe-gold/50" /> Encrypted Handshake
                </li>
                <li className={`${linkStyle} flex items-center gap-3`}>
                  <Server size={14} className="text-luxe-gold/50" /> Edge Delivery Node
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="anton text-[12px] tracking-[0.3em] uppercase text-luxe-gold">
                Governance
              </h4>
              <div className="flex flex-col gap-4 text-[11px] font-black uppercase tracking-widest text-(--text-primary)">
                <p className={linkStyle}>Privacy Protocol</p>
                <p className={linkStyle}>Terms of Service</p>
                <p className={linkStyle}>Legal Documentation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Operational Status & Copyright */}
        <div className="mt-20 pt-8 border-t border-luxe-gold/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 text-(--text-primary)">
              All Systems Operational • 2026
            </span>
          </div>
          <div className="anton text-[10px] tracking-[0.5em] uppercase opacity-20 text-(--text-primary) text-center md:text-right cursor-default hover:opacity-100 transition-opacity">
            © VEL DOWN INFRASTRUCTURE. BUILT FOR THE NEXT GENERATION.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;