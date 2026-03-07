import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogOut, FileText, UserCircle, Home, LogIn, FolderEdit } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName') || 'Usuário';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md p-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <div className="flex items-center gap-8">
          <Link to={token ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="text-indigo-500" size={24} />
            <h1 className="text-xl font-bold tracking-tighter text-white uppercase">
              Sucuri<span className="text-indigo-400">Drive</span>
            </h1>
          </Link>
          
          {token && (
            <div className="hidden md:flex items-center gap-6 border-l border-slate-700 pl-8">
              {/* Menu Comum: Início */}
              <Link to="/dashboard" className="text-sm font-bold text-slate-300 hover:text-indigo-400 flex items-center gap-2">
                <Home size={16} /> Início
              </Link>

              {/* Menu Dinâmico: Arquivos */}
              {role === 'admin' ? (
                // Se for ADMIN, o link leva para a GESTÃO/INSERÇÃO
                <Link to="/admin/arquivos" className="text-sm font-bold text-emerald-400 hover:text-white flex items-center gap-2">
                  <FolderEdit size={16} /> Gestão de Arquivos
                </Link>
              ) : (
                // Se for USER, o link leva para a GALERIA DE VISUALIZAÇÃO
                <Link to="/arquivos" className="text-sm font-bold text-slate-300 hover:text-indigo-400 flex items-center gap-2">
                  <FileText size={16} /> Meus Arquivos
                </Link>
              )}

              {/* Menu Exclusivo Admin: Gestão de Membros */}
              {role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-indigo-400 hover:text-white flex items-center gap-2">
                  <UserCircle size={16} /> Membros
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {token ? (
            <div className="flex items-center gap-4">
              <Link to="/perfil" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Meu Perfil</span>
                  <span className="text-sm font-bold text-slate-200">{userName}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <UserCircle size={24} />
                </div>
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                title="Sair do sistema"
              >
                <LogOut size={18}/>
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all">
              Acessar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;