const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const fetchRestaurants = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurants`);
    if (!response.ok) throw new Error('Error fetching restaurants');
    const data = await response.json();
    
    return data.map((r, index) => {
      const restaurantImages = [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Modern
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', // Formal
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // Cozy/Pizza
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80', // Bar/Tapas
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80'  // Healthy
      ];
      return {
        id: r.restauranteID,
        name: r.restaurante,
        description: `Restaurante de calidad ubicado en ${r.barrio}. Especialistas en cocina local y ambiente acogedor.`,
        image: restaurantImages[index % restaurantImages.length],
        address: r.barrio,
        rating: (4 + Math.random()).toFixed(1)
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchRestaurantDetails = async (id) => {
  try {
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

    const restaurantImages = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
      'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80'
    ];

    const restaurant = {
      id: rawRestaurant.restauranteID,
      name: rawRestaurant.restaurante,
      description: `Disfruta de la mejor experiencia gastronómica en ${rawRestaurant.barrio}.`,
      image: restaurantImages[(rawRestaurant.restauranteID - 1) % restaurantImages.length],
      address: rawRestaurant.barrio,
      rating: 4.8
    };

    const dishes = allDishes
      .filter(d => d.restauranteID === parseInt(id))
      .map(d => {
        const cat = allCategories.find(c => c.categoriaID === d.categoriaID);
        const dishName = d.plato.toLowerCase();
        
        // Keyword to Unsplash bridge
        let photoKeyword = 'food';
        if (dishName.includes('pizza')) photoKeyword = 'pizza';
        else if (dishName.includes('hamburguesa') || dishName.includes('burger')) photoKeyword = 'burger';
        else if (dishName.includes('ensalada') || dishName.includes('salad')) photoKeyword = 'salad';
        else if (dishName.includes('carne') || dishName.includes('filete') || dishName.includes('ternasco')) photoKeyword = 'steak';
        else if (dishName.includes('pescado') || dishName.includes('bacalao') || dishName.includes('sepia') || dishName.includes('calamar')) photoKeyword = 'seafood';
        else if (dishName.includes('tarta') || dishName.includes('chocolate') || dishName.includes('postre')) photoKeyword = 'dessert';
        else if (dishName.includes('croqueta') || dishName.includes('tapa')) photoKeyword = 'tapas';
        else if (dishName.includes('pasta') || dishName.includes('macarrones') || dishName.includes('lasaña')) photoKeyword = 'pasta';
        else if (dishName.includes('bocadillo') || dishName.includes('sandwich')) photoKeyword = 'sandwich';
        else if (dishName.includes('pollo')) photoKeyword = 'chicken';

        // ARASAAC Pictograms Mapping
        const pictogramMap = {
          'Tapas y raciones': '35064',
          'Entrantes': '2337',
          'Pizzas': '2356', 
          'Platos internacionales': '29532',
          'Bocadillos': '34267',
          'Guarniciones': '31969',
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
          pictogram: `https://static.arasaac.org/pictograms/${pictId}/${pictId}_300.png`,
          photo: `https://images.unsplash.com/photo-1?w=400&q=40&auto=format&fit=crop&sig=${d.platoID}&${photoKeyword}` 
          // Note: using a search query via unsplash source or featured is better for mocks
          ,dummyPhoto: `https://loremflickr.com/400/300/${photoKeyword},food/all?lock=${d.platoID}`
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
