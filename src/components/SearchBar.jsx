import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Buscar por nome..." }) => {
  return (
    <div className="relative w-full md:max-w-md group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
      </div>
      <input
        type="text"
        className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-inner"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;