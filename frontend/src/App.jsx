import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TradesJournal from './pages/TradesJournal';
import TradeForm from './pages/TradeForm';
import Login from './pages/Login';

export default function App() {
  const { estConnecte } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!estConnecte) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar pageActive={page} onNaviguer={setPage} />
      <main className="flex-1 px-10 py-9">
        {page === 'dashboard' && <Dashboard />}
        {page === 'trades' && <TradesJournal />}
        {page === 'nouveau' && <TradeForm onTradeCree={() => setPage('trades')} />}
      </main>
    </div>
  );
}
