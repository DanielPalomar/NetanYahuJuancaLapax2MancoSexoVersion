import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutGrid, Utensils, Users } from 'lucide-react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Páginas
import Despensa from './pages/Pantry';
import AñadirProducto from './pages/AddProduct';
import Recetas from './pages/Recetas';
import DetalleReceta from './pages/RecipeDetail';
import Ingreso from './pages/Login';
import Registro from './pages/Register';
import EditarProducto from './pages/EditProduct';
import AdminPanel from './pages/AdminPanel';

function RutaPrivada({ hijos }) {
  const token = localStorage.getItem('token');

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return hijos;
}

function RutaAdmin({ hijos }) {
  const token = localStorage.getItem('token');
  const esAdministrador = localStorage.getItem('esAdministrador') === 'true';

  if (token === null) {
    return <Navigate to="/login" />;
  }

  if (!esAdministrador) {
    return <Navigate to="/despensa" />;
  }

  return hijos;
}

// PÁGINA DE INICIO
function Inicio() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">

      <div className="hidden dark:block mb-6 animate-bounce">
        <span className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full text-sm font-bold border border-green-800/50">
          Prohibido pedir defensas de codigo MarioMierdas
        </span>
      </div>

      {/* Encabezado */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight transition-colors">
        La Despensa de Lapa
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 transition-colors">
        Organiza tu comida y ahorra dinero cada día.
      </p>

      <div className="flex justify-center gap-4 mb-20">
        <Link to="/despensa" className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
          <LayoutGrid size={18} /> Mi Despensa
        </Link>
        <Link to="/recetas" className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Utensils size={18} /> Recetas
        </Link>
      </div>

      <section className="border-t border-gray-100 dark:border-gray-800 pt-12 transition-colors">
        <div className="flex justify-center mb-4 text-green-600 dark:text-green-400">
          <Users size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 transition-colors">Quiénes Somos</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
          Somos el <strong>Grupo Puente4</strong>. Hemos creado esta plataforma para facilitar
          la gestión de alimentos en el hogar, reducir el desperdicio y promover
          un estilo de vida más organizado y sostenible.
        </p>
      </section>
    </div>
  );
}
//Lapa estuvo aqui...
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Ingreso />} />
          <Route path="/registro" element={<Registro />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />

          <Route path="/despensa" element={<RutaPrivada hijos={<Despensa />} />} />
          <Route path="/recetas" element={<RutaPrivada hijos={<Recetas />} />} />
          <Route path="/recetas/:id" element={<RutaPrivada hijos={<DetalleReceta />} />} />

          <Route path="/añadir" element={<RutaPrivada hijos={<AñadirProducto />} />} />
          <Route path="/editar/:id" element={<RutaPrivada hijos={<EditarProducto />} />} />
          <Route path="/admin" element={<RutaAdmin hijos={<AdminPanel />} />} />

          <Route path="/escanear" element={
            <RutaPrivada hijos={
              <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Escáner de cámara</h2>
              </div>
            } />
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
//gracias Lapa por tanto y perdón por tan poco 