import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pantry from './pages/Pantry'; 
import AddProduct from './pages/AddProduct';
import Recetas from './pages/Recetas';
import RecipeDetail from './pages/RecipeDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Componente para proteger las rutas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente de Inicio con Tailwind v4
const Home = () => (
  <main className="bg-gradient-to-b from-white to-green-50 min-h-[calc(100vh-64px)] flex items-center">
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Controla tu despensa, <br />
        <span className="text-green-600 italic">evita el desperdicio.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        La forma más inteligente de organizar tus alimentos y descubrir recetas 
        basadas en lo que ya tienes. Únete al consumo responsable. 🍏
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/despensa" className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-100">
          Ir a mi Despensa
        </Link>
        <Link to="/recetas" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm">
          Ver Recetas (RF7)
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-3xl mb-4 block">⏰</span>
          <h3 className="font-bold text-gray-800 mb-2">Alertas de Caducidad</h3>
          <p className="text-gray-500 text-sm">Te avisamos antes de que tus productos se estropeen.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-3xl mb-4 block">🔍</span>
          <h3 className="font-bold text-gray-800 mb-2">Escaneo Inteligente</h3>
          <p className="text-gray-500 text-sm">Añade productos en segundos con tu cámara.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-3xl mb-4 block">♻️</span>
          <h3 className="font-bold text-gray-800 mb-2">Impacto Positivo</h3>
          <p className="text-gray-500 text-sm">Ayuda al planeta reduciendo el desperdicio alimentario.</p>
        </div>
      </div>
    </div>
  </main>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />

        {/* Contenido Principal */}
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            {/* Rutas Privadas */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/despensa" element={<PrivateRoute><Pantry /></PrivateRoute>} />
            <Route path="/recetas" element={<PrivateRoute><Recetas /></PrivateRoute>} />
            <Route path="/recetas/:id" element={<PrivateRoute><RecipeDetail /></PrivateRoute>} />
            <Route path="/escanear" element={
              <PrivateRoute>
                <div className="p-10 text-center">
                  <h2 className="text-3xl font-bold text-gray-800">Escáner de Productos</h2>
                  <p className="text-gray-500 mt-2">Usa la cámara para registrar alimentos (RF2).</p>
                </div>
              </PrivateRoute>
            } />
            <Route path="/añadir" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
          <p>© 2026 Grupo Puente4 - IES Julio Verne</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;