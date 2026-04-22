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
      // Ajuste: Enviamos 'email' porque así lo pide el backend de Joselyn
      const response = await api.post('/api/auth/login', {
        email: credentials.username, 
        password: credentials.password
      });
      
      if (response.status === 200) {
        // Guardamos un rol por defecto ya que el backend aún no lo devuelve en el JSON
        localStorage.setItem('userRole', 'SuperAdmin'); 
        alert("Bienvenido al sistema");
        navigate('/products');
      }
    } catch (err) {
      // Capturamos el error de Rate Limiting o Credenciales Inválidas (RS-07)
      const message = err.response?.data?.error || "Error de conexión con el servidor";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ingreso al Sistema</h2>
        <p style={{ fontSize: '0.8em', color: '#666' }}>Protección contra Fuerza Bruta activa</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="text"
              name="username"
              placeholder="ejemplo@correo.com"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-banner" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;