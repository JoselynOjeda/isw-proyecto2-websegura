import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ajuste: Enviamos 'email' porque así lo pide tu backend
      // La cookie HttpOnly se maneja automáticamente en el navegador gracias a withCredentials en axios.js
      const response = await api.post('/api/auth/login', { 
        email: credentials.username, 
        password: credentials.password
      });
      
      if (response.status === 200) {
        // Capturamos el rol real devuelto por tu backend actualizado (RF-05)
        const rolUsuario = response.data.rol;
        
        // Usamos sessionStorage en lugar de localStorage (Seguridad: RS-04)
        sessionStorage.setItem('userRole', rolUsuario); 
        
        // Redirigir a la pantalla de productos
        navigate('/products');
        
        // Forzar una pequeña recarga para que el Navbar se entere del nuevo rol
        window.location.reload(); 
      }
    } catch (err) {
      // Capturamos el error de Rate Limiting (429) o Credenciales Inválidas (401) (RS-07)
      const message = err.response?.data?.error || "Error de conexión con el servidor";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.headerSection}>
          <h2 style={styles.title}>Acceso Seguro</h2>
          <span style={styles.badge}>Rate Limiting Activo</span>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico:</label>
            <input
              type="email"
              name="username"
              placeholder="admin@ejemplo.com"
              value={credentials.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Estilos en línea para asegurar que se vea perfecto independientemente de App.css ---
const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: '2rem'
  },
  loginCard: {
    backgroundColor: '#27293d', // Fondo del panel (hace juego con el App.css)
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '400px',
    borderTop: '4px solid #e14eca' // Borde superior rosado/morado
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    margin: '0 0 10px 0',
    color: '#ffffff',
    fontSize: '1.8rem'
  },
  badge: {
    backgroundColor: 'rgba(225, 78, 202, 0.1)',
    color: '#e14eca',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    border: '1px solid #e14eca'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    textAlign: 'left'
  },
  label: {
    color: '#9a9a9a',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  input: {
    padding: '12px',
    backgroundColor: '#1e1e2f', // Fondo de input más oscuro
    border: '1px solid #444',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    backgroundColor: '#e14eca',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 4px 6px rgba(225, 78, 202, 0.3)'
  },
  errorBanner: {
    backgroundColor: 'rgba(217, 83, 79, 0.1)',
    color: '#d9534f',
    padding: '12px',
    borderRadius: '6px',
    borderLeft: '4px solid #d9534f',
    fontSize: '0.9rem',
    textAlign: 'center'
  }
};

export default Login;