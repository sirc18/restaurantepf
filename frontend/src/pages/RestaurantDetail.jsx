import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRestaurantDetails } from '../services/api';
import { Tabs, Tab, Badge } from 'react-bootstrap';
import { ChevronLeft, ShoppingBag, UtensilsCrossed, User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const result = await fetchRestaurantDetails(id);
      setData(result);
      setLoading(false);
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!data || !data.restaurant) {
    return <div className="container text-center py-5">Restaurante no encontrado</div>;
  }

  const { restaurant, dishes, orders } = data;

  return (
    <div className="container animate-fade-in py-4">
      <Link to="/" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 mb-4">
        <ChevronLeft size={18} /> Volver
      </Link>

      <div className="row mb-5 align-items-center">
        <div className="col-md-4 mb-4 mb-md-0">
          <img src={restaurant.image} className="img-fluid rounded-4 shadow-lg" alt={restaurant.name} />
        </div>
        <div className="col-md-8">
          <h1 className="display-5 fw-bold mb-2">{restaurant.name}</h1>
          <p className="lead text-muted mb-4">{restaurant.description}</p>
          <div className="d-flex gap-3">
             <Badge bg="primary" className="px-3 py-2 fs-6">{restaurant.address}</Badge>
             <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">Rating: {restaurant.rating} ★</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="dishes" id="restaurant-tabs" className="mb-4 custom-tabs">
        <Tab eventKey="dishes" title={<span className="d-flex align-items-center gap-2"><UtensilsCrossed size={18} /> Platos</span>}>
          <div className="row g-3 py-3">
            {dishes.length > 0 ? dishes.map(dish => (
              <div key={dish.id} className="col-md-6">
                <div className="card border-0 shadow-sm p-3 rounded-3 d-flex flex-row justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold">{dish.name}</h5>
                    <span className="text-muted small">{dish.category}</span>
                  </div>
                  <span className="fs-5 fw-bold text-primary">{dish.price}€</span>
                </div>
              </div>
            )) : <p className="text-center py-4">No hay platos disponibles.</p>}
          </div>
        </Tab>
        
        <Tab eventKey="orders" title={<span className="d-flex align-items-center gap-2"><ShoppingBag size={18} /> Pedidos y Clientes</span>}>
          <div className="table-responsive py-3">
            <table className="custom-table text-nowrap">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map(order => (
                  <tr key={order.id}>
                    <td><span className="fw-bold">{order.id}</span></td>
                    <td><div className="d-flex align-items-center gap-2"><Calendar size={14} /> {order.date}</div></td>
                    <td><div className="d-flex align-items-center gap-1"><DollarSign size={14} /> {order.total}</div></td>
                    <td>
                      <Badge bg={order.status === 'Entregado' ? 'success' : 'info'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light p-2 rounded-circle"><User size={16} className="text-primary" /></div>
                        {order.client.name}
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        <div className="d-flex align-items-center gap-2 text-muted"><Mail size={12} /> {order.client.email}</div>
                        <div className="d-flex align-items-center gap-2 text-muted"><Phone size={12} /> {order.client.phone}</div>
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="6" className="text-center py-5">No hay pedidos registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default RestaurantDetail;
