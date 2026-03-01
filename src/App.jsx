import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>

        {/* Redireciona a raiz para o login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login /> } />
        <Route path="/register" element={<Register /> } />

        {/* Rota protegida (Exemplo simples) */}
        <Route path="/dashboard" element={<Dashboard /> } />

      </Routes>
    </Router>
  );
}

export default App;