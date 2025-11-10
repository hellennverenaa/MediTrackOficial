import { useState, useEffect } from 'react';
import { notificationService, UpcomingNotification } from '../services/api';

function UpcomingNotifications() {
  const [notifications, setNotifications] = useState<UpcomingNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Atualizar a cada minuto
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getUpcoming();
      setNotifications(data);
    } catch (err) {
      console.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (medicationId: string) => {
    try {
      await notificationService.markAsTaken(medicationId);
      // Recarregar notificações
      loadNotifications();
      alert('Medicamento marcado como tomado!');
    } catch (err) {
      alert('Erro ao marcar medicamento');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Próximos Medicamentos</h2>
      {notifications.length === 0 ? (
        <p>Nenhum medicamento pendente hoje</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              <strong>{notif.scheduledTime}</strong> - {notif.medicationName} ({notif.dosageMg}mg)
              <button onClick={() => handleMarkAsTaken(notif.medicationId)}>
                ✓ Tomei
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}