import { authService } from '../services/api';

function Header() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <header>
      <h1>MediTrack</h1>
      {user && (
        <div>
          <span>Olá, {user.name}!</span>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </header>
  );
}