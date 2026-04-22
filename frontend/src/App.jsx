import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Products from './pages/Products';
import Users from './pages/Users';
import Auditoria from './pages/Auditoria'; // <-- 1. IMPORTAR AUDITORÍA

function App() {
  // Leemos el rol (1=SuperAdmin, 2=Auditor, 3=Registrador)
  const userRole = sessionStorage.getItem('userRole');

  // --- INICIO REQUERIMIENTO RS-04: GESTIÓN DE SESIÓN POR INACTIVIDAD ---
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      
      // 300,000 ms = 5 minutos exactos de inactividad 
      timeout = setTimeout(() => {
        if (sessionStorage.getItem('userRole')) {
          alert("🔒 Sesión expirada por inactividad. Por seguridad, debes ingresar de nuevo.");
          sessionStorage.removeItem('userRole'); 
          window.location.href = "/login"; 
        }
      }, 300000); 
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(timeout);
    };
  }, []);
  // --- FIN REQUERIMIENTO RS-04 ---

  const handleLogout = () => {
    sessionStorage.removeItem('userRole'); 
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="app-container">
        
        <header className="app-header">
          <div className="logo-container">
            <h1>🛡️ WebSegura</h1>
            <span className="badge">Blue Team</span>
          </div>
          <nav className="main-nav">
            {!userRole ? (
              <Link to="/login" className="nav-link">Login</Link>
            ) : (
              <>
                <Link to="/products" className="nav-link">Productos</Link>
                
                {/* RF-05: Solo SuperAdmin (1) puede ver Usuarios */}
                {userRole === '1' && <Link to="/users" className="nav-link">Usuarios</Link>}
                
                {/* RF-06: Solo SuperAdmin (1) y Auditor (2) pueden ver Auditoría */}
                {(userRole === '1' || userRole === '2') && (
                  <Link to="/auditoria" className="nav-link">Auditoría</Link>
                )}

                <button onClick={handleLogout} className="nav-link btn-logout" style={{ background: 'transparent', border: '1px solid #e14eca', color: '#e14eca', cursor: 'pointer', marginLeft: '10px' }}>
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* RUTAS PROTEGIDAS CON RBAC (RF-05) */}
            <Route 
              path="/products" 
              element={userRole ? <Products /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/users" 
              element={userRole === '1' ? <Users /> : <Navigate to="/login" />} 
            />

            {/* RUTA DE AUDITORÍA PROTEGIDA (RF-06) */}
            <Route 
              path="/auditoria" 
              element={(userRole === '1' || userRole === '2') ? <Auditoria /> : <Navigate to="/login" />} 
            />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>© 2026 - Proyecto Calidad de Software | Equipo Blue Team</p>
          <p className="footer-subtext">Sistema con registro de eventos y protección perimetral activa.</p>
        </footer>

      </div>
    </Router>
  );
}

export default App;