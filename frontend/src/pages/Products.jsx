import { useState, useEffect } from 'react';
import api from '../api/axios'; // Importamos tu configuración segura de Axios

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

  // Cargar productos al entrar (RF-03)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/productos');
      setProducts(response.data);
    } catch (err) {
      console.error("Error al obtener productos", err);
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

    try {
      // RS-05: Axios enviará automáticamente la cookie de sesión gracias a withCredentials
      await api.post('/api/productos', formData);
      setFormData({ codigo: '', nombre: '', descripcion: '', cantidad: '', precio: '' });
      fetchProducts();
      alert("Producto agregado con éxito");
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el producto");
    }
  };

  return (
    <div className="products-container">
      <h2>Gestión de Productos (RF-03)</h2>
      
      {/* Formulario de Creación */}
      <form onSubmit={handleSubmit} className="product-form">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input 
          type="text" placeholder="Código Alfanumérico" 
          value={formData.codigo} 
          onChange={(e) => setFormData({...formData, codigo: e.target.value})}
        />
        <input 
          type="text" placeholder="Nombre del Producto" 
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
        />
        <textarea 
          placeholder="Descripción" 
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />
        <input 
          type="number" placeholder="Cantidad" 
          value={formData.cantidad}
          onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
        />
        <input 
          type="number" step="0.01" placeholder="Precio" 
          value={formData.precio}
          onChange={(e) => setFormData({...formData, precio: e.target.value})}
        />
        <button type="submit">Guardar Producto</button>
      </form>

      <hr />

      {/* --- REQUERIMIENTO RS-02: PROTECCIÓN CONTRA XSS --- */}
      {/* React escapa automáticamente los datos renderizados entre llaves {} */}
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.codigo}>
              <td>{p.codigo}</td>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;