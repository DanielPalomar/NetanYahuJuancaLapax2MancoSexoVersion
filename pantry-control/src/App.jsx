import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import BarraNavegacion from './components/BarraNavegacion';
import PieDePagina from './components/PieDePagina';

import Despensa from './pages/Despensa';
import AnadirProducto from './pages/AnadirProducto';
import Recetas from './pages/Recetas';
import DetalleReceta from './pages/DetalleReceta';
import EditarProducto from './pages/EditarProducto';
import Ingreso from './pages/Ingreso';
import Registro from './pages/Registro';
import PanelAdmin from './pages/PanelAdmin';
import NoEncontrado from './pages/NoEncontrado';

function RutaPrivada(props) {
  let token = localStorage.getItem('token');
  if (token) return props.children;
  return <Navigate to="/login" />;
}

function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 px-6">
      <div className="text-center max-w">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          Pantry Control
        </h1>
        <p className="text-slate-700 mb-8 text-lg">
          Gestiona tu despensa, controla vencimientos y descubre recetas
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/registro" className="bg-blue-600 text-white px-6 py-2 font-semibold rounded hover:bg-blue-700">
            Registrarse
          </Link>
          <Link to="/login" className="bg-slate-200 text-slate-800 px-6 py-2 font-semibold rounded hover:bg-slate-300">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-[#fdfbf7]">
        <BarraNavegacion />
        <main className="flex-grow">
          <Routes>
            {/* Rutas públicas: cualquiera puede acceder */}
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Ingreso />} />
            <Route path="/registro" element={<Registro />} />
            
            {/* Rutas privadas: se envuelven en RutaPrivada para exigir login */}
            {/* <Route path="/despensa" element={<RutaPrivada><Despensa /></RutaPrivada>} />
            <Route path="/añadir" element={<RutaPrivada><AnadirProducto /></RutaPrivada>} />
            <Route path="/editar/:id" element={<RutaPrivada><EditarProducto /></RutaPrivada>} />
            <Route path="/recetas" element={<RutaPrivada><Recetas /></RutaPrivada>} />
            <Route path="/recetas/:id" element={<RutaPrivada><DetalleReceta /></RutaPrivada>} /> */}
            <Route path="/despensa" element={<Despensa />} />
            <Route path="/añadir" element={<AnadirProducto />} />
            <Route path="/editar/:id" element={<EditarProducto />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route path="/recetas/:id" element={<DetalleReceta />} />
            
            {/* Ruta de admin: también privada */}
            <Route path="/admin" element={<RutaPrivada><PanelAdmin /></RutaPrivada>} />
            
            {/* Cualquier otra ruta -> página 404 */}
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </main>
        <PieDePagina />
      </div>
    </Router>
  );
}

export default App;
