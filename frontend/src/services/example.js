const API_URL = import.meta.env.VITE_API_URL;

// Ejemplo de uso de la variable de entorno
fetch(`${API_URL}/customers`)
  .then(res => res.json())
  .then(data => console.log('Clientes:', data));
