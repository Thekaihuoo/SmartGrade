
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white/95 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-gray-50/50">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all text-gray-500 hover:rotate-90">
            <span className="text-xl">✕</span>
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export const SectionHeader: React.FC<{ 
  title: string; 
  icon?: React.ReactNode; 
  color?: string; 
  description?: string 
}> = ({ title, icon, color = '#26A69A', description }) => (
  <div className="mb-10 flex items-start gap-5">
    <div 
      className="p-4 rounded-[1.25rem] shadow-lg text-white floating" 
      style={{ 
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        boxShadow: `0 10px 20px -5px ${color}66`
      }}
    >
      {icon}
    </div>
    <div className="pt-1">
      <h2 className="text-3xl font-black text-gray-800 tracking-tight">{title}</h2>
      {description && <p className="text-gray-500 font-medium mt-1">{description}</p>}
    </div>
  </div>
);

export const Card: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  accentColor?: string;
  isGradient?: boolean;
}> = ({ children, className = "", accentColor, isGradient = false }) => (
  <div 
    className={`bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${className}`}
    style={{ 
      borderTop: accentColor ? `6px solid ${accentColor}` : 'none',
      background: isGradient && accentColor ? `linear-gradient(180deg, ${accentColor}08 0%, #ffffff 100%)` : 'white'
    }}
  >
    {children}
  </div>
);

export const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'white' | 'purple' | 'pink';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = "", type = 'button', disabled }) => {
  const base = "px-8 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary-light to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50",
    secondary: "bg-gradient-to-br from-secondary-light to-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/50",
    danger: "bg-gradient-to-br from-danger to-[#d32f2f] text-white shadow-lg shadow-danger/30 hover:shadow-danger/50",
    warning: "bg-gradient-to-br from-warning to-[#fbc02d] text-white shadow-lg shadow-warning/30 hover:shadow-warning/50",
    purple: "bg-gradient-to-br from-accent-purple to-[#5e35b1] text-white shadow-lg shadow-accent-purple/30 hover:shadow-accent-purple/50",
    pink: "bg-gradient-to-br from-accent-pink to-[#c2185b] text-white shadow-lg shadow-accent-pink/30 hover:shadow-accent-pink/50",
    ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    white: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm",
  };
  
  return (
    <button disabled={disabled} type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = '#26A69A' }) => (
  <span 
    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm inline-flex items-center gap-1.5"
    style={{ 
      background: `linear-gradient(135deg, ${color}, ${color}ee)`,
      boxShadow: `0 4px 10px ${color}33`
    }}
  >
    {children}
  </span>
);
