import { useState, useEffect } from 'react';
import api from '../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Registrador' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('http://localhost:3000/api/auth/usuarios');
      setUsers(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
          setError("No tienes permisos para ver la lista de usuarios.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    const roleIds = { 'SuperAdmin': 1, 'Auditor': 2, 'Registrador': 3 };
    try {
      await api.post('http://localhost:3000/api/auth/register', {
        username: formData.username,
        password: formData.password,
        email: `${formData.username.toLowerCase().replace(/\s/g, '')}@sistema.com`, 
        rol_id: roleIds[formData.role]
      });
      setMsg("✅ Usuario creado exitosamente.");
      setFormData({ username: '', password: '', role: 'Registrador' });
      fetchUsers(); 
    } catch (err) {
      setError(err.response?.data?.error || "❌ Error al crear usuario.");
    } finally { setLoading(false); }
  };

  // RF-04: Editar y Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`http://localhost:3000/api/auth/usuarios/${id}`);
      fetchUsers();
    } catch (err) { alert(err.response?.data?.error || "Error al eliminar"); }
  };

  const handleEdit = async (user) => {
    const newUsername = prompt("Nuevo nombre de usuario:", user.username);
    const newRole = prompt("Nuevo ID de Rol (1=SuperAdmin, 2=Auditor, 3=Registrador):", user.rol_id);
    if (newUsername && newRole) {
      try {
        await api.put(`http://localhost:3000/api/auth/usuarios/${user.id}`, { username: newUsername, rol_id: newRole });
        fetchUsers();
      } catch (err) { alert("Error al editar"); }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>👥 Gestión de Usuarios</h2>
      
      {userRole === '1' ? (
        <div style={styles.card}>
          <div style={styles.headerSection}>
            <h3 style={styles.title}>Registrar Nuevo Usuario</h3>
            <span style={styles.badge}>Solo SuperAdmin</span>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBanner}>{error}</div>}
            {msg && <div style={styles.successBanner}>{msg}</div>}
            <div style={styles.inputRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de Usuario</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Contraseña</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rol en el Sistema</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={styles.input}>
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Registrador">Registrador</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
              {loading ? 'Registrando...' : 'Crear Usuario'}
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.warningBanner}>⚠️ No tienes permisos de SuperAdmin.</div>
      )}

      <div style={{...styles.card, marginTop: '2rem'}}>
        <h3 style={styles.title}>Usuarios Registrados</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th><th style={styles.th}>Usuario</th><th style={styles.th}>Email</th><th style={styles.th}>Rol</th>
              {userRole === '1' && <th style={styles.th}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={styles.roleBadge}>{user.rol_id === 1 ? 'SuperAdmin' : user.rol_id === 2 ? 'Auditor' : 'Registrador'}</span>
                </td>
                {userRole === '1' && (
                  <td style={styles.td}>
                    <button onClick={() => handleEdit(user)} style={styles.editBtn}>Editar</button>
                    <button onClick={() => handleDelete(user.id)} style={styles.deleteBtn}>Borrar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '900px', margin: '0 auto' },
  pageTitle: { color: '#ffffff', marginBottom: '1.5rem', borderBottom: '2px solid #444', paddingBottom: '10px' },
  card: { backgroundColor: '#27293d', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', borderTop: '3px solid #00f2fe' },
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { margin: 0, color: '#ffffff', fontSize: '1.3rem' },
  badge: { backgroundColor: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #00f2fe' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  inputRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  formGroup: { flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { color: '#9a9a9a', fontSize: '0.85rem', fontWeight: '600' },
  input: { padding: '10px', backgroundColor: '#1e1e2f', border: '1px solid #444', borderRadius: '5px', color: '#ffffff', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '12px', backgroundColor: '#00f2fe', color: '#1e1e2f', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
  editBtn: { padding: '6px 10px', backgroundColor: '#f0ad4e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '0.85rem' },
  deleteBtn: { padding: '6px 10px', backgroundColor: 'transparent', color: '#d9534f', border: '1px solid #d9534f', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  errorBanner: { backgroundColor: 'rgba(217, 83, 79, 0.1)', color: '#d9534f', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #d9534f' },
  successBanner: { backgroundColor: 'rgba(92, 184, 92, 0.1)', color: '#5cb85c', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #5cb85c' },
  warningBanner: { backgroundColor: 'rgba(240, 173, 78, 0.1)', color: '#f0ad4e', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f0ad4e' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#ffffff' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #00f2fe', color: '#9a9a9a' },
  tr: { borderBottom: '1px solid #444' },
  td: { padding: '12px' },
  roleBadge: { backgroundColor: '#1e1e2f', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid #444' }
};
export default Users;