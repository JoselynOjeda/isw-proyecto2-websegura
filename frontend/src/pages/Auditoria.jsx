import { useState, useEffect } from 'react';
import api from '../api/axios';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/auditoria');
        setLogs(res.rows || res.data);
      } catch (err) {
        console.error("Error al ver auditoría");
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Bitácora de Auditoría (RF-06)</h2>
      <table border="1" style={{width: '100%'}}>
        <thead>
          <tr>
            <th>Evento</th>
            <th>IP Origen</th>
            <th>Ruta</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.evento}</td>
              <td>{log.ip_origen}</td>
              <td>{log.ruta_solicitada}</td>
              <td>{new Date(log.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Auditoria;