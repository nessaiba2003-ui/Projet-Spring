import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Petite page temporaire pour tester
const Dashboard = () => <h2 className="text-2xl font-bold">Statistiques Générales</h2>;
const Projets = () => <h2 className="text-2xl font-bold">Liste des Projets</h2>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="projets" element={<Projets />} />
        <Route path="*" element={<div>404 - Page Introuvable</div>} />
      </Route>
    </Routes>
  );
}

export default App;

