import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, X } from "lucide-react";

// Componentes
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import UserTable from "../components/UserTable";
import EditUserModal from "../components/EditUserModal";
import SearchBar from "../components/SearchBar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    cpf: "",
    role: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend-sucuri-api.vercel.app/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchUsers();
  }, []);

  useEffect(() => {
    // Criamos uma variável temporária com todos os usuários
    let result = users;
    // 1. Aplicamos o filtro de Status (Cards)
    if (filter !== "all") {
      result = result.filter((u) => u.status === filter);
    }
    // 2. Aplicamos o filtro de Nome (Search Bar)
    if (searchTerm) {
      result = result.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    // 3. Atualizamos o estado com o resultado final da "peneira"
    setFilteredUsers(result);
  }, [filter, searchTerm, users]);

  const handleStatusChange = async (id, action) => {
    try {
      const res = await fetch(
        `https://backend-sucuri-api.vercel.app/api/admin/${action}/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        toast.success("Status atualizado com sucesso!");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Erro na operação.");
    }
  };

  const handleFullUpdate = async (e) => {
    e.preventDefault();

    const idToast = toast.loading("Salvando alterações...");

    try {
      const res = await fetch(
        `https://backend-sucuri-api.vercel.app/api/admin/update-user`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: editForm.id,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            cpf: editForm.cpf,
            role: editForm.role,
          }),
        },
      );
      if (res.ok) {
        toast.update(idToast, {
          render: "Usuário atualizado!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast.update(idToast, {
        render: "Erro ao conectar.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const stats = {
    total: users.length,
    approved: users.filter((u) => u.status === "approved").length,
    pending: users.filter((u) => u.status === "pending" || !u.status).length,
    disabled: users.filter((u) => u.status === "disabled").length,
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-slate-500 font-medium">
            Gerenciamento central de membros e permissões
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Geral"
            value={stats.total}
            color="indigo"
            isActive={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <StatCard
            label="Membros Ativos"
            value={stats.approved}
            color="emerald"
            isActive={filter === "approved"}
            onClick={() => setFilter("approved")}
          />
          <StatCard
            label="Pendentes"
            value={stats.pending}
            color="amber"
            isActive={filter === "pending"}
            onClick={() => setFilter("pending")}
          />
          <StatCard
            label="Bloqueados"
            value={stats.disabled}
            color="red"
            isActive={filter === "disabled"}
            onClick={() => setFilter("disabled")}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-white">
            Membros da Comunidade
          </h2>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        <div className="bg-[#1e293b] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          {filteredUsers.length === 0 && !loading ? (
            <div className="p-20 text-center border-t border-slate-800">
              <p className="text-slate-500">
                Nenhum usuário encontrado com os filtros aplicados.
              </p>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              loading={loading}
              onApprove={(id) => handleStatusChange(id, "approve")}
              onDisable={(id) => handleStatusChange(id, "disable")}
              onEdit={(user) => {
                setEditForm({ ...user });
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
      </main>

      {/* Modal reutilizavel */}
      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={editForm}
        setFormData={setEditForm}
        onSave={handleFullUpdate}
      />
    </div>
  );
}; // fim AdminDashboard

export default AdminDashboard;
