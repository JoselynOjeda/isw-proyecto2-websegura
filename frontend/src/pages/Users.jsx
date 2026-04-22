import { useState, useEffect } from 'react';
import api from '../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Registrador' 
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Nota: Si esta ruta no existe aún en el backend, fallará silenciosamente
      const response = await api.get('/api/auth/usuarios');
      setUsers(response.data);
    } catch (err) {
      console.log("El listado de usuarios aún no está implementado en el backend.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    // Mapeo de Roles según init.sql de Joselyn
    const roleIds = {
      'SuperAdmin': 1,
      'Auditor': 2,
      'Registrador': 3
    };

    try {
      // Enviamos los datos exactos que espera el router.post('/register')
      await api.post('/api/auth/register', {
        username: formData.username,
        password: formData.password,
        email: `${formData.username}@sistema.com`, // Email generado para la BD
        rol_id: roleIds[formData.role]
      });

      setMsg("Usuario creado exitosamente en la base de datos.");
      setFormData({ username: '', password: '', role: 'Registrador' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear usuario.");
    }
  };

  return (
    <div className="users-container">
      <h2>Gestión de Usuarios (RF-04 / RF-05)</h2>
      <p>Nivel de acceso requerido: <strong>SuperAdmin</strong></p>

      <form onSubmit={handleSubmit} className="user-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        
        <input 
          type="text" placeholder="Nombre de usuario" 
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <input 
          type="password" placeholder="Contraseña" 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="SuperAdmin">SuperAdmin</option>
          <option value="Auditor">Auditor</option>
          <option value="Registrador">Registrador</option>
        </select>
        <button type="submit">Registrar Usuario</button>
      </form>

      <hr />

      <h3>Usuarios Registrados</h3>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.rol_id}</td>
            </tr>
          )) : <tr><td colSpan="3">No hay datos o el backend no soporta listado aún.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Users;