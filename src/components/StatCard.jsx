import React from "react";

const StatCard = ({ label, value, color, isActive, onClick }) => {
    //
    const colorVariants = {
    indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-indigo-500/5',
    emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5',
    amber: 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-amber-500/5',
    red: 'border-red-500 bg-red-500/10 text-red-400 shadow-red-500/5'
  };

  return (
    <button 
      onClick={onClick} 
      className={`p-6 rounded-3xl border transition-all text-left shadow-xl ${
        isActive 
          ? `${colorVariants[color]} scale-[1.02] ring-1 ring-white/10` 
          : 'border-slate-800 bg-[#1e293b] text-slate-400 hover:border-slate-600'
      }`}
    >
      {/* Label is passed from parent, e.g., "Total", "Ativos" */}
      <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mb-1">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </button>
  );
};

export default StatCard;
