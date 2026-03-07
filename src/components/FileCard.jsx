import React from 'react';
import { FileText, Eye, EyeOff, Trash2, ExternalLink, ShieldAlert } from 'lucide-react';

const FileCard = ({ doc, onToggle, onDelete }) => {
  const isVisible = doc.is_visible;

  return (
    <div className={`relative group p-5 rounded-3xl border transition-all duration-300 ${
      isVisible 
      ? 'bg-[#1e293b] border-slate-800 hover:border-indigo-500/50 shadow-xl' 
      : 'bg-[#0f172a] border-red-500/20 opacity-75 shadow-none'
    }`}>
      
      {/* Badge de Status */}
      <div className="absolute top-4 right-4">
        {isVisible ? (
          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-tighter">
            <Eye size={10} /> Público
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[9px] font-black text-red-400 bg-red-400/10 px-2 py-1 rounded-full uppercase tracking-tighter">
            <EyeOff size={10} /> Privado
          </span>
        )}
      </div>

      {/* Icone e Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-2xl ${isVisible ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
          <FileText size={28} />
        </div>
        <div className="pr-12">
          <h3 className="font-bold text-slate-200 text-sm line-clamp-1 group-hover:text-white transition-colors">
            {doc.title}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {doc.categories?.name || 'Geral'}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/50 pt-4">
        <button 
          onClick={() => onToggle(doc.id, doc.is_visible)}
          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-all"
          title="Alterar Visibilidade"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          <span className="text-[8px] mt-1 font-bold uppercase">Status</span>
        </button>

        <a 
          href={doc.url} 
          target="_blank" 
          rel="noreferrer"
          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
        >
          <ExternalLink size={18} />
          <span className="text-[8px] mt-1 font-bold uppercase">Abrir</span>
        </a>

        <button 
          onClick={() => onDelete(doc)}
          className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
        >
          <Trash2 size={18} />
          <span className="text-[8px] mt-1 font-bold uppercase">Excluir</span>
        </button>
      </div>
    </div>
  );
};

export default FileCard;