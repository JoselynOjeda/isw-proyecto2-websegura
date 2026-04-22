import { useState, useEffect } from 'react';
import api from '../api/axios';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const userRole = sessionStorage.getItem('userRole');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('http://localhost:3000/api/auditoria');
        setLogs(response.data);
      } catch (err) {
        setError('Acceso denegado. Este módulo es exclusivo para el equipo de Seguridad y Administración.');
      }
    };
    if (userRole === '1' || userRole === '2') fetchLogs();
  }, [userRole]);

  if (userRole !== '1' && userRole !== '2') {
    return <div style={styles.errorBanner}>⚠️ RF-06: ACCESO RESTRINGIDO. Solo SuperAdmin y Auditor.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>🛡️ Log de Auditoría (RF-06)</h2>
      {error && <div style={styles.errorBanner}>{error}</div>}
      
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fecha / Hora</th>
              <th style={styles.th}>ID Usuario</th>
              <th style={styles.th}>Evento</th>
              <th style={styles.th}>Ruta Solicitada</th>
              <th style={styles.th}>IP Origen</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={styles.tr}>
                <td style={styles.td}>{new Date(log.fecha).toLocaleString()}</td>
                <td style={styles.td}>{log.usuario_id || 'Anónimo'}</td>
                <td style={{...styles.td, color: log.evento.includes('FALLIDO') || log.evento.includes('DENEGADO') ? '#d9534f' : '#5cb85c'}}>{log.evento}</td>
                <td style={styles.td}>{log.ruta_solicitada}</td>
                <td style={styles.td}>{log.ip_origen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', maxWidth: '1000px', margin: '0 auto' },
  pageTitle: { color: '#ffffff', marginBottom: '1.5rem', borderBottom: '2px solid #444', paddingBottom: '10px' },
  card: { backgroundColor: '#27293d', padding: '1rem', borderRadius: '10px', borderTop: '3px solid #f0ad4e' },
  table: { width: '100%', borderCollapse: 'collapse', color: '#ffffff', fontSize: '0.9rem' },
  th: { textAlign: 'left', padding: '10px', borderBottom: '2px solid #f0ad4e', color: '#9a9a9a' },
  tr: { borderBottom: '1px solid #444' },
  td: { padding: '10px' },
  errorBanner: { backgroundColor: 'rgba(217, 83, 79, 0.1)', color: '#d9534f', padding: '15px', borderRadius: '5px', borderLeft: '4px solid #d9534f', marginTop: '2rem' }
};

export default Auditoria;