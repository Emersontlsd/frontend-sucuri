import React, { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";
import Header from '../components/Header';
import FileCard from '../components/FileCard'; // O novo componente que criamos
import { 
  Upload, Plus, Folder, FileText, 
  Loader2, ShieldAlert, Filter 
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminFiles = () => {
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const [newCategory, setNewCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([fetchCategories(), fetchDocuments()]);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (data) setDocuments(data);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return toast.warn("Digite o nome da categoria.");
    const { error } = await supabase.from('categories').insert([{ name: newCategory }]);
    if (!error) {
      toast.success("Categoria criada!");
      setNewCategory("");
      fetchCategories();
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedCategoryId || !fileTitle) {
      return toast.warn("Preencha todos os campos.");
    }

    setUploading(true);
    const idToast = toast.loading("Enviando arquivo...");

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('documents').insert([{
        title: fileTitle,
        url: publicUrl,
        category_id: selectedCategoryId,
        is_visible: true
      }]);

      if (dbError) throw dbError;

      toast.update(idToast, { render: "Sucesso!", type: "success", isLoading: false, autoClose: 2000 });
      setFileTitle("");
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      toast.update(idToast, { render: error.message, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (id, currentStatus) => {
    const { error } = await supabase
      .from('documents')
      .update({ is_visible: !currentStatus })
      .eq('id', id);

    if (!error) {
      toast.success("Status atualizado!");
      fetchDocuments();
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Excluir permanentemente "${doc.title}"?`)) return;
    const fileName = doc.url.split('/').pop();
    await supabase.storage.from('documents').remove([fileName]);
    const { error } = await supabase.from('documents').delete().eq('id', doc.id);
    if (!error) {
      toast.success("Arquivo removido.");
      fetchDocuments();
    }
  };

  const filteredDocs = documents.filter(doc => 
    activeFilter === "all" || doc.category_id === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="max-w-7xl mx-auto p-6 space-y-10">
        
        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Arquivos & Mídia</h1>
            <p className="text-slate-500 font-medium">Gerencie o acervo digital da comunidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* BARRA LATERAL: FORMULÁRIOS */}
          <aside className="lg:col-span-1 space-y-6">
            <section className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2">
                <Folder size={14}/> Categorias
              </h2>
              <div className="flex gap-2">
                <input 
                  className="flex-1 bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-indigo-500 transition-all text-white"
                  placeholder="Nome..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleCreateCategory} className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                  <Plus size={20}/>
                </button>
              </div>
            </section>

            <section className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4 flex items-center gap-2">
                <Upload size={14}/> Novo Upload
              </h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <input 
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 text-white"
                  placeholder="Título do arquivo"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                />
                <select 
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 text-sm outline-none cursor-pointer text-slate-300"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Categoria...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center group hover:border-emerald-500/50 transition-all bg-[#0f172a]/50">
                  <input type="file" id="fileInput" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
                    <FileText size={32} className={selectedFile ? "text-emerald-400" : "text-slate-600"} />
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      {selectedFile ? selectedFile.name : "Selecionar Arquivo"}
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                >
                  {uploading ? "Processando..." : "Salvar no Sistema"}
                </button>
              </form>
            </section>
          </aside>

          {/* ÁREA PRINCIPAL: FILTROS E CARDS */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* TABS DE FILTRO */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="p-2 text-slate-500"><Filter size={16}/></div>
              <button 
                onClick={() => setActiveFilter("all")}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeFilter === "all" ? 'bg-white text-black' : 'bg-[#1e293b] text-slate-500 hover:text-white border border-slate-800'
                }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    activeFilter === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#1e293b] text-slate-500 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* GRID DE CARDS */}
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <span className="font-bold text-xs uppercase tracking-[0.3em]">Sincronizando...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDocs.map(doc => (
                  <FileCard 
                    key={doc.id} 
                    doc={doc} 
                    onToggle={toggleVisibility} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && filteredDocs.length === 0 && (
              <div className="p-20 text-center bg-[#1e293b]/50 rounded-[40px] border border-dashed border-slate-800 flex flex-col items-center">
                <ShieldAlert size={48} className="text-slate-700 mb-4" />
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">Nenhum arquivo nesta categoria</h3>
                <p className="text-slate-600 text-xs mt-2 italic">Suba um novo arquivo para começar a organizar.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminFiles;