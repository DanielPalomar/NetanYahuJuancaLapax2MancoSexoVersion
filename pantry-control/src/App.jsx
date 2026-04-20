import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutGrid, Utensils, Users } from 'lucide-react'; 
import Barra from './components/Navbar';
import Despensa from './pages/Pantry'; 
import AñadirProducto from './pages/AddProduct';
import Recetas from './pages/Recetas';
import DetalleReceta from './pages/RecipeDetail';
import Ingreso from './pages/Login';
import Registro from './pages/Register';

function RutaPrivada({ hijos }) {
  const token = localStorage.getItem('token');

  // Si no hay token, lo mandamos al login
  if (token === null) {
    return <Navigate to="/login" />;
  }

  // Si hay token, cargamos la página
  return hijos;
}

// PÁGINA DE INICIO: Limpia y con sección Quiénes Somos
function Inicio() {
  return (
    <main className="bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        
        {/* Encabezado */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PantryControl
        </h1>
        <p className="text-lg text-gray-500 mb-10">
          Organiza tu comida y ahorra dinero cada día.
        </p>
        
        {/* Botones principales */}
        <div className="flex justify-center gap-4 mb-20">
          <Link to="/despensa" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-medium">
            <LayoutGrid size={18} /> Mi Despensa
          </Link>
          <Link to="/recetas" className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-md font-medium">
            <Utensils size={18} /> Recetas
          </Link>
        </div>

        {/* Sección Quiénes Somos */}
        <section className="border-t border-gray-100 pt-12">
          <div className="flex justify-center mb-4 text-green-600">
            <Users size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quiénes Somos</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Somos el <strong>Grupo Puente4</strong>. Hemos creado esta plataforma para facilitar 
            la gestión de alimentos en el hogar, reducir el desperdicio y promover 
            un estilo de vida más organizado y sostenible.
          </p>
        </section>

      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Menú de navegación */}
        <Barra />

        {/* Contenido según la URL */}
        <div className="flex-1">
          <Routes>
            {/* Rutas para cualquier usuario */}
            <Route path="/login" element={<Ingreso />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas protegidas (solo para usuarios con cuenta) */}
            <Route path="/" element={<RutaPrivada hijos={<Inicio />} />} />
            <Route path="/despensa" element={<RutaPrivada hijos={<Despensa />} />} />
            <Route path="/recetas" element={<RutaPrivada hijos={<Recetas />} />} />
            <Route path="/recetas/:id" element={<RutaPrivada hijos={<DetalleReceta />} />} />
            
            {/* Otras páginas */}
            <Route path="/escanear" element={
              <RutaPrivada hijos={
                <div className="p-10 text-center">
                  <h2 className="text-xl font-bold">Escáner de cámara</h2>
                </div>
              } />
            } />
            
            <Route path="/añadir" element={<RutaPrivada hijos={<AñadirProducto />} />} />
          </Routes>
        </div>

        {/* Pie de página final */}
        <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-50">
          <p>© 2026 PantryControl | Grupo Puente4</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
//gracias Lapa por tanto y perdón por tan poco 