import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import Header from '../components/Header';
import FileViewer from '../components/FileViewer';
import { FileText, Eye, Search, Loader2, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchData();
    // Bloqueio preventivo de botão direito
    const preventClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', preventClick);
    return () => document.removeEventListener('contextmenu', preventClick);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Buscamos apenas o que o Admin marcou como visível
    const { data: docs } = await supabase
      .from('documents')
      .select('*, categories(name)')
      .eq('is_visible', true)
      .order('created_at', { ascending: false });

    const { data: cats } = await supabase.from('categories').select('*').order('name');

    if (docs) setDocuments(docs);
    if (cats) setCategories(cats);
    setLoading(false);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeFilter === "all" || doc.category_id === activeFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 select-none">
      <Header />
      <FileViewer file={selectedFile} onClose={() => setSelectedFile(null)} />

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FolderOpen className="text-indigo-500" /> Arquivos Disponíveis
            </h1>
            <p className="text-slate-500 text-sm">Consulte os documentos oficiais da plataforma.</p>
          </div>
          
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Pesquisar documento..."
              className="w-full bg-[#1e293b] border border-slate-800 rounded-2xl py-3 pl-10 pr-4 outline-none focus:border-indigo-500/50 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Filtros de Categoria */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === "all" ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] text-slate-500 border border-slate-800'
            }`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === cat.id ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] text-slate-500 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de Visualização */}
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => setSelectedFile(doc)}
                className="bg-[#1e293b] border border-slate-800 rounded-[32px] p-6 hover:border-indigo-500/40 transition-all group cursor-pointer shadow-xl"
              >
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <h3 className="font-bold text-slate-200 text-sm mb-4 line-clamp-2">{doc.title}</h3>
                <div className="text-[9px] font-black text-slate-500 uppercase mb-4">{doc.categories?.name}</div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Eye size={14} /> Clique para visualizar
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;