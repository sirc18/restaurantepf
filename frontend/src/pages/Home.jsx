import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../services/api';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      const data = await fetchRestaurants();
      setRestaurants(data);
      setLoading(false);
    };
    loadRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="text-center mb-5">
        <h1 className="display-4 title-gradient mb-3">Nuestros Restaurantes</h1>
        <p className="text-muted fs-5">Descubre los mejores sabores de la ciudad en un solo lugar.</p>
      </div>

      <div className="row g-4">
        {restaurants.map((res) => (
          <div key={res.id} className="col-md-6 col-lg-4">
            <div className="glass-card h-100 overflow-hidden d-flex flex-column">
              <img 
                src={res.image} 
                className="card-img-top" 
                alt={res.name} 
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h4 fw-bold mb-0">{res.name}</h3>
                  <div className="badge bg-warning text-dark d-flex align-items-center gap-1">
                    <Star size={14} fill="currentColor" /> {res.rating}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-1 text-muted small mb-3">
                  <MapPin size={14} /> {res.address}
                </div>
                <p className="text-secondary mb-4 flex-grow-1">{res.description}</p>
                <button 
                  onClick={() => navigate(`/restaurant/${res.id}`)}
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                >
                  Ver Menú y Pedidos <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
