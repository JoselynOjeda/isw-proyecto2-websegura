import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes básicos (Pronto crearás estos archivos en la carpeta /pages)
import Login from './pages/Login';
import Products from './pages/Products';
import Users from './pages/Users';




function App() {
  // --- INICIO REQUERIMIENTO RS-04: GESTIÓN DE SESIÓN POR INACTIVIDAD ---
  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      
      // 300,000 ms = 5 minutos exactos de inactividad 
      timeout = setTimeout(() => {
        alert("Sesión expirada por inactividad. Por seguridad, debes ingresar de nuevo.");
        // Aquí podrías forzar un redireccionamiento al login o borrar el estado del usuario
        window.location.href = "/login";
      }, 300000); 
    };

    // Eventos que detectan actividad del usuario para reiniciar el contador
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Iniciar el timer la primera vez
    resetTimer();

    // Limpieza de eventos al desmontar el componente
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      clearTimeout(timeout);
    };
  }, []);
  // --- FIN REQUERIMIENTO RS-04 ---

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Sistema Web Seguro - Proyecto Calidad</h1>
          <nav>
            <a href="/login">Login</a> | 
            <a href="/products"> Productos</a> | 
            <a href="/users"> Usuarios</a>
          </nav>
        </header>

        <main>
          {/* Configuración de Rutas para cumplir RF-03 y RF-04 */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            {/* Redirigir por defecto al login si la ruta no existe */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        <footer>
          <p>© 2026 - Desarrollo de Software Seguro | Integrante 2: Aaron (Frontend)</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;