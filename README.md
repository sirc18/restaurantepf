### Pasos de Creación y Comandos Core:

1.  **Frontend (React + Vite)**: 
    *   Setup: `npm create vite@latest frontend`
    *   Dependencias: `npm install bootstrap lucide-react react-router-dom`
    *   Ejecución: `npm run dev`
2.  **Backend (Node.js + Docker)**:
    *   Infraestructura: Docker Compose para MySQL, phpMyAdmin y Node.
    *   Levantamiento: `docker-compose up -d`
3.  **Despliegue (GitHub Pages)**:
    *   Configuración: `base: "/restaurantepf/"` en `vite.config.js`.
    *   Publicación: `npm run deploy` (usa `gh-pages`).

### Desarrollo del Frontend:
1. **Interfaz**: Creación de componentes con **React-Bootstrap** y **Lucide-React** para diseño moderno.
2. **Navegación**: Se usa React Router para moverse entre páginas, por ejemplo, de la lista de restaurantes a los detalles de un plato.
3. **Conexión con datos**: Se obtiene la información de los platos y pedidos desde un servidor usando Fetch API, y se guarda en el estado para mostrarla en la pantalla.

La lógica real de conexión con la API se ha centralizado en `src/services/api.js`.
