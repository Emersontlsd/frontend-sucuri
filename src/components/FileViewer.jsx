import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

const FileViewer = ({ file, onClose }) => {
  if (!file) return null;

  // Adicionamos o parâmetro #toolbar=0 para esconder a barra de ferramentas do Chrome/Edge
  const viewUrl = `${file.url}#toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-sm">
      <div className="bg-[#1e293b] w-full max-w-5xl h-[90vh] rounded-[32px] border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header do Visualizador */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm leading-none">{file.title}</h3>
              <p className="text-[10px] text-slate-500 uppercase font-black mt-1">Apenas Visualização Protegida</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Área do Conteúdo */}
        <div className="flex-1 bg-slate-900 relative">
          <iframe 
            src={viewUrl}
            title={file.title}
            className="w-full h-full border-none"
            onContextMenu={(e) => e.preventDefault()}
          />
          
          {/* Camada Invisível para dificultar clique direito sobre o iframe */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ background: 'transparent' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default FileViewer;