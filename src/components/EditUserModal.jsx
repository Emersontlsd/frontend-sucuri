import React from 'react';
import { X, Save } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, formData, setFormData, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Header do Modal */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]/30">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24}/>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={onSave} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Nome Completo</label>
              <input 
                type="text" 
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 mt-1 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">E-mail Corporativo</label>
              <input 
                type="email" 
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 mt-1 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Telefone</label>
              <input 
                type="text" 
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 mt-1 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">CPF</label>
              <input 
                type="text" 
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 mt-1 text-white outline-none focus:border-indigo-500 transition-all" 
                value={formData.cpf} 
                onChange={e => setFormData({...formData, cpf: e.target.value})} 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Cargo / Permissão</label>
            <select 
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl p-3 mt-1 text-white outline-none focus:border-indigo-500 appearance-none transition-all cursor-pointer" 
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Usuário Comum</option>
              <option value="admin">Administrador Geral</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;