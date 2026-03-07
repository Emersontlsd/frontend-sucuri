import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importação das Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminFiles from './pages/AdminFiles';
import ProfileEdit from './pages/ProfileEdit';

// --- COMPONENTES DE PROTEÇÃO ---

// Protege rotas de usuários logados
const PrivateRoute = ({ children }) => {
  // Busca qualquer chave que o Supabase use para manter a sessão
  const hasSupabaseSession = Object.keys(localStorage).some(key => 
    key.includes('supabase.auth.token') || key.startsWith('sb-')
  );
  
  // Se não encontrar a sessão do Supabase, manda para o login
  return hasSupabaseSession ? children : <Navigate to="/login" />;
};

// Protege rotas exclusivas de Admin
const AdminRoute = ({ children }) => {
  const hasSupabaseSession = Object.keys(localStorage).some(key => 
    key.includes('supabase.auth.token') || key.startsWith('sb-')
  );
  const role = localStorage.getItem('role'); 
  
  const isAdmin = hasSupabaseSession && role === 'admin';
  
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- ROTAS DO USUÁRIO COMUM (PROTEGIDAS) --- */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <UserHome />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/arquivos" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/perfil" 
          element={
            <PrivateRoute>
              <ProfileEdit />
            </PrivateRoute>
          } 
        />

        {/* --- ROTAS DE ADMINISTRAÇÃO (PROTEGIDAS) --- */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        
        <Route 
          path="/admin/arquivos" 
          element={
            <AdminRoute>
              <AdminFiles />
            </AdminRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer 
        theme="dark" 
        position="bottom-right" 
        autoClose={3000}
      />
    </Router>
  );
}

export default App;