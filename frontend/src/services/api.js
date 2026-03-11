const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const fetchRestaurants = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    if (!response.ok) throw new Error('Error fetching restaurants');
    const data = await response.json();
    
    return data.map(r => ({
      id: r.restauranteID,
      name: r.restaurante,
      description: `Restaurante de calidad ubicado en ${r.barrio}. Especialistas en cocina local y ambiente acogedor.`,
      image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`,
      address: r.barrio,
      rating: (4 + Math.random()).toFixed(1)
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRestaurantDetails = async (id) => {
  try {
    // parallel fetch for performance
    const [resResp, dishesResp, ordersResp, custResp, catsResp] = await Promise.all([
      fetch(`${API_URL}/restaurants`),
      fetch(`${API_URL}/dishes`),
      fetch(`${API_URL}/orders`),
      fetch(`${API_URL}/customers`),
      fetch(`${API_URL}/categories`)
    ]);

    const restaurants = await resResp.json();
    const rawRestaurant = restaurants.find(r => r.restauranteID === parseInt(id));
    if (!rawRestaurant) return null;

    const allDishes = await dishesResp.json();
    const allOrders = await ordersResp.json();
    const allCustomers = await custResp.json();
    const allCategories = await catsResp.json();

    const restaurant = {
      id: rawRestaurant.restauranteID,
      name: rawRestaurant.restaurante,
      description: `Disfruta de la mejor experiencia gastronómica en ${rawRestaurant.barrio}.`,
      image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`,
      address: rawRestaurant.barrio,
      rating: 4.8
    };

    const dishes = allDishes
      .filter(d => d.restauranteID === parseInt(id))
      .map(d => {
        const cat = allCategories.find(c => c.categoriaID === d.categoriaID);
        // Map common categories to ARASAAC pictogram IDs (examples: 2356=pizza, 2350=meat, 2352=fish, 5459=dessert)
        const pictogramMap = {
          'Tapas y raciones': '35064', // Tapas
          'Entrantes': '2337', // Food/Plate
          'Pizzas': '2356', 
          'Platos internacionales': '29532', // Globe/Food
          'Bocadillos': '34267', // Sandwich
          'Guarniciones': '31969', // Salad/Side
          'Carnes': '2350',
          'Pescados': '2352', 
          'Postres': '5459'
        };
        const categoryName = cat ? cat.categoria : 'Otros';
        const pictId = pictogramMap[categoryName] || '2337';

        return {
          id: d.platoID,
          name: d.plato,
          price: d.precio,
          category: categoryName,
          pictogram: `https://static.arasaac.org/pictograms/${pictId}/${pictId}_300.png`
        };
      });

    const orders = allOrders
      .filter(o => o.restauranteID === parseInt(id))
      .map(o => {
        const client = allCustomers.find(c => c.clienteID === o.clienteID);
        return {
          id: `PED-${o.pedidoID}`,
          date: new Date(o.fecha).toLocaleDateString('es-ES'),
          total: (Math.random() * 40 + 15).toFixed(2),
          status: o.pedidoID % 3 === 0 ? 'Pendiente' : 'Entregado',
          client: {
            name: client ? `${client.nombre} ${client.apellido1}` : 'Anonimo',
            email: client ? `${client.nombre.toLowerCase()}.${client.apellido1.toLowerCase()}@delivery.es` : 'noemail@example.com',
            phone: '6' + Math.floor(Math.random() * 90000000 + 10000000)
          }
        };
      });

    return { restaurant, dishes, orders };
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Use the variable in your code
// const API_URL = import.meta.env.VITE_API_URL;
fetch(`${API_URL}/users`)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log('Fetch example (users):', err.message));
