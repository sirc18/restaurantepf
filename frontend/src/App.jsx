import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container text-center">
          <p className="text-muted mb-0">© 2026 GastroHub - Tu plataforma de restauración </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
