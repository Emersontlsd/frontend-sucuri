import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  UserCheck, UserX, Shield, LogOut, Users, 
  Edit3, X, Loader2, CheckCircle, Clock, Ban, Save 
} from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Estado para o Modal e Formulário de Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    cpf: '',
    role: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://backend-sucuri-api.vercel.app/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (filter === 'all') setFilteredUsers(users);
    else setFilteredUsers(users.filter(u => u.status === filter));
  }, [filter, users]);

  // Abre o modal carregando os dados do usuário selecionado
  const openEditModal = (user) => {
    setEditForm({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      role: user.role || 'user'
    });
    setIsModalOpen(true);
  };

  // Envia todos os dados editados para o Back-end
  const handleFullUpdate = async (e) => {
    e.preventDefault();
    const idToast = toast.loading("Salvando alterações...");

    try {
      const res = await fetch(`https://backend-sucuri-api.vercel.app/api/admin/update-user`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          userId: editForm.id,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          cpf: editForm.cpf,
          role: editForm.role
        })
      });

      if (res.ok) {
        toast.update(idToast, { render: "Usuário atualizado com sucesso!", type: "success", isLoading: false, autoClose: 2000 });
        setIsModalOpen(false);
        fetchUsers();
      } else {
        toast.update(idToast, { render: "Erro ao salvar.", type: "error", isLoading: false, autoClose: 2000 });
      }
    } catch (error) {
      toast.update(idToast, { render: "Falha na conexão.", type: "error", isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="text-indigo-500" />
            <h1 className="text-xl font-bold italic">SUCURI<span className="text-indigo-400">ADMIN</span></h1>
          </div>
          <button onClick={() => {localStorage.clear(); navigate('/login')}} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><LogOut /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {/* CARDS DE FILTRO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setFilter('all')} className={`p-4 rounded-xl border transition-all ${filter === 'all' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-[#1e293b]'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Total</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </button>
          <button onClick={() => setFilter('approved')} className={`p-4 rounded-xl border transition-all ${filter === 'approved' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-[#1e293b]'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Ativos</p>
            <p className="text-2xl font-bold text-emerald-400">{users.filter(u => u.status === 'approved').length}</p>
          </button>
          <button onClick={() => setFilter('pending')} className={`p-4 rounded-xl border transition-all ${filter === 'pending' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-[#1e293b]'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Pendentes</p>
            <p className="text-2xl font-bold text-amber-400">{users.filter(u => u.status === 'pending').length}</p>
          </button>
          <button onClick={() => setFilter('disabled')} className={`p-4 rounded-xl border transition-all ${filter === 'disabled' ? 'border-red-500 bg-red-500/10' : 'border-slate-800 bg-[#1e293b]'}`}>
            <p className="text-xs text-slate-500 uppercase font-bold">Bloqueados</p>
            <p className="text-2xl font-bold text-red-400">{users.filter(u => u.status === 'disabled').length}</p>
          </button>
        </div>

        {/* TABELA */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] text-slate-500 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-4">Membro</th>
                <th className="p-4">Cargo</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-all group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-medium">{user.name}</span>
                      <span className="text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${user.role === 'admin' ? 'border-indigo-500 text-indigo-400' : 'border-slate-600 text-slate-500'}`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => openEditModal(user)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors"><Edit3 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL DE EDIÇÃO COMPLETA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Edit3 size={20} className="text-indigo-400" /> Editar Membro</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleFullUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Nome Completo</label>
                  <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 mt-1 text-sm outline-none focus:border-indigo-500" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">E-mail</label>
                  <input type="email" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 mt-1 text-sm outline-none focus:border-indigo-500" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">Telefone</label>
                  <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 mt-1 text-sm outline-none focus:border-indigo-500" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">CPF</label>
                  <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 mt-1 text-sm outline-none focus:border-indigo-500" value={editForm.cpf} onChange={e => setEditForm({...editForm, cpf: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Nível de Acesso</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 mt-1 text-sm outline-none focus:border-indigo-500" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                  <option value="user">Usuário Comum</option>
                  <option value="admin">Administrador (Total)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                  <Save size={18} /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;