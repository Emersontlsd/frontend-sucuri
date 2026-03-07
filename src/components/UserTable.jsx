import React from 'react'
import { UserCheck, Edit3, Loader2, Ban } from 'lucide-react';

const UserTable = ({ users, loading, onApprove, onDisable, onEdit }) => {
    const getStatusStyles = (status) => {
    switch (status) {
      case 'approved': return 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';
      case 'disabled': return 'border-red-500/30 text-red-400 bg-red-500/10';
      default: return 'border-amber-500/30 text-amber-400 bg-amber-500/10';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
        case 'approved': return 'Ativo'
        case 'disabled': return 'Bloqueado'
        default: return 'Pendente'
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-indigo-500 mb-2" />
        <p className="text-slate-500 text-sm">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#0f172a]/50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
          <tr>
            <th className="p-4">Identificação</th>
            <th className="p-4">Status</th>
            <th className="p-4">Nível</th>
            <th className="p-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-indigo-500/5 transition-all group">
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-bold text-sm">{user.name || "Sem Nome"}</span>
                  <span className="text-[11px] text-slate-500 group-hover:text-indigo-400 transition-colors">
                    {user.email || "E-mail não vinculado"}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <span className={`text-[9px] font-black px-2 py-1 rounded-full border uppercase ${getStatusStyles(user.status)}`}>
                  {translateStatus(user.status)}
                </span>
              </td>
              <td className="p-4">
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                  user.role === 'admin' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-slate-700 text-slate-500'
                }`}>
                  {user.role === 'admin' ? 'ADMIN' : 'USUÁRIO'}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  {user.status !== 'approved' && (
                    <button onClick={() => onApprove(user.id)} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all shadow-lg" title="Aprovar">
                      <UserCheck size={16}/>
                    </button>
                  )}
                  {user.status !== 'disabled' && (
                    <button onClick={() => onDisable(user.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Bloquear">
                      <Ban size={16}/>
                    </button>
                  )}
                  <button onClick={() => onEdit(user)} className="p-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-all" title="Editar">
                    <Edit3 size={16}/>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
