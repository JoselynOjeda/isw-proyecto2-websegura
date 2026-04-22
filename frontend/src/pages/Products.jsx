import { useState, useEffect } from 'react';
import api from '../api/axios'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // RF-05: Obtenemos el rol para saber qué permisos darle
  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // FIX: URL completa para evitar 404
      const response = await api.get('http://localhost:3000/api/productos');
      setProducts(response.data);
    } catch (err) {
      console.error("Error al obtener productos", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Sesión expirada o sin permisos. Por favor, inicia sesión de nuevo.");
      }
    }
  };

  // --- REQUERIMIENTO RF-03: VALIDACIÓN EN FRONTEND ---
  const validateForm = () => {
    const { codigo, nombre, cantidad, precio } = formData;
    if (!codigo || !nombre || !cantidad || !precio) {
      setError("Todos los campos excepto la descripción son obligatorios.");
      return false;
    }
    if (isNaN(cantidad) || cantidad < 0) {
      setError("La cantidad debe ser un número positivo.");
      return false;
    }
    if (isNaN(precio) || precio < 0) {
      setError("El precio debe ser un número positivo.");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setMsg('');

    try {
      // FIX: URL completa y método POST
      await api.post('http://localhost:3000/api/productos', formData);
      setFormData({ codigo: '', nombre: '', descripcion: '', cantidad: '', precio: '' });
      setMsg("✅ Producto agregado con éxito");
      fetchProducts(); // Recargamos la tabla
    } catch (err) {
      setError(err.response?.data?.error || "❌ Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Función extra para eliminar (Solo SuperAdmin)
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`http://localhost:3000/api/productos/${id}`);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Error al eliminar");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>📦 Gestión de Productos </h2>
      
      {/* RF-05: RBAC - Solo SuperAdmin (1) y Registrador (3) pueden ver el formulario */}
      {(userRole === '1' || userRole === '3') ? (
        <div style={styles.card}>
          <div style={styles.headerSection}>
            <h3 style={styles.title}>Registrar Nuevo Producto</h3>
            <span style={styles.badge}>Modo Escritura</span>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBanner}>{error}</div>}
            {msg && <div style={styles.successBanner}>{msg}</div>}
            
            <div style={styles.inputRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Código Alfanumérico</label>
                <input 
                  type="text" placeholder="Ej: PROD-001" 
                  value={formData.codigo} 
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Producto</label>
                <input 
                  type="text" placeholder="Ej: Laptop Dell" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad</label>
                <input 
                  type="number" placeholder="0" 
                  value={formData.cantidad}
                  onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Precio ($)</label>
                <input 
                  type="number" step="0.01" placeholder="0.00" 
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descripción</label>
              <textarea 
                placeholder="Detalles del producto..." 
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              />
            </div>

            <button type="submit" disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.warningBanner}>
          👁️ Modo de Solo Lectura. Eres un Auditor, por lo que no tienes permisos para crear o modificar productos.
        </div>
      )}

      {/* TABLA DE PRODUCTOS (Visible para todos los roles) */}
      <div style={{...styles.card, marginTop: '2rem'}}>
        <h3 style={styles.title}>Inventario Actual</h3>
        {/* RS-02: React escapa automáticamente los datos renderizados */}
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Precio</th>
                {userRole === '1' && <th style={styles.th}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? products.map((p) => (
                <tr key={p.id || p.codigo} style={styles.tr}>
                  <td style={styles.td}>{p.codigo}</td>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={styles.td}>{p.descripcion}</td>
                  <td style={styles.td}>{p.cantidad}</td>
                  <td style={{...styles.td, color: '#5cb85c'}}>${p.precio}</td>
                  {/* Solo SuperAdmin puede borrar */}
                  {userRole === '1' && (
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        style={styles.deleteBtn}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{...styles.td, textAlign: 'center', color: '#9a9a9a'}}>
                    No hay productos en el inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Estilos Oscuros / Tema Hacker ---
const styles = {
  container: { width: '100%', maxWidth: '1000px', margin: '0 auto' },
  pageTitle: { color: '#ffffff', marginBottom: '1.5rem', borderBottom: '2px solid #444', paddingBottom: '10px' },
  card: { backgroundColor: '#27293d', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', borderTop: '3px solid #ba54f5' }, // Borde morado para productos
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { margin: 0, color: '#ffffff', fontSize: '1.3rem' },
  badge: { backgroundColor: 'rgba(186, 84, 245, 0.1)', color: '#ba54f5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #ba54f5' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  inputRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  formGroup: { flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { color: '#9a9a9a', fontSize: '0.85rem', fontWeight: '600' },
  input: { padding: '10px', backgroundColor: '#1e1e2f', border: '1px solid #444', borderRadius: '5px', color: '#ffffff', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '12px', backgroundColor: '#ba54f5', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.3s' },
  deleteBtn: { padding: '6px 12px', backgroundColor: 'transparent', color: '#d9534f', border: '1px solid #d9534f', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  errorBanner: { backgroundColor: 'rgba(217, 83, 79, 0.1)', color: '#d9534f', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #d9534f', fontSize: '0.9rem' },
  successBanner: { backgroundColor: 'rgba(92, 184, 92, 0.1)', color: '#5cb85c', padding: '10px', borderRadius: '5px', borderLeft: '4px solid #5cb85c', fontSize: '0.9rem' },
  warningBanner: { backgroundColor: 'rgba(240, 173, 78, 0.1)', color: '#f0ad4e', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #f0ad4e', marginBottom: '2rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#ffffff', minWidth: '600px' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #ba54f5', color: '#9a9a9a' },
  tr: { borderBottom: '1px solid #444' },
  td: { padding: '12px' }
};

export default Products;