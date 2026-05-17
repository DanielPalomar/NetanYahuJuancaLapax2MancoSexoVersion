import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Leaf, BarChart2, Users, Target, ArrowRight, ShieldCheck, Package, BookOpen } from 'lucide-react';

// Importación de componentes (asumiendo tus rutas)
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

/*Se usa un prop para transfirir informacion entre componentes y en este caso lo uso para pasar los hijos */
function RutaPrivada(props) {
  // Aquí 'props.children' representa todo lo que envuelves dentro de <RutaPrivada>...</RutaPrivada>
  //verifica si hay un token para mostrar o no
  let token = localStorage.getItem('token');
  if (token) return props.children;
  return <Navigate to="/login" />;
}

{/* para comentar hay que usar las llaves porque así es como va */ }
{/* pagina de inicio */ }
function Inicio() {
  // Verificamos si hay un token para decidir si mostrar el botón
  const autorizado = localStorage.getItem('token');

  return (
    <div className="w-full flex flex-col bg-white">

      {/* contenido principal y subtitulo*/}
      <section className="w-full flex flex-col items-center justify-center pt-20 pb-16 px-6 bg-gradient-to-b from-emerald-50 to-white">
        <div className="w-full max-w-6xl flex flex-col items-center text-center">
          <h1 className="text-7xl md:text-8xl font-black text-emerald-950 mb-4 tracking-tighter leading-tight">
            Tu despensa
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl">
            Gestiona tu inventario evita que los alimentos caduquen con un solo clic.
          </p>

          {/*mostramos el botón si no está identificado y para estar audentificado debemos tener el token*/}
          {autorizado ? (
            <div className="flex flex-col gap-4 w-full max-w-sm mx-auto justify-center px-4 md:hidden">
              <Link to="/despensa" className="w-full">
                <button className="w-full bg-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                  <Package size={22} /> Mi Despensa
                </button>
              </Link>
              <Link to="/recetas" className="w-full">
                <button className="w-full bg-emerald-100 text-emerald-800 border-2 border-emerald-200 px-10 py-4 rounded-full font-bold text-lg hover:bg-emerald-200 transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                  <BookOpen size={22} /> Recetario
                </button>
              </Link>
            </div>
          ) : (
            <Link to="/registro">
              <button className="bg-emerald-600 text-white px-14 py-5 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:scale-105 cursor-pointer">
                Empezar ahora
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Section con el contenido que va a aparecer en el centro de la pagina */}
      <section className="w-full py-12 px-6 md:px-10 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">

          {/* Contenedor de la Imagen */}
          <div className="flex-1 w-full max-w-xl">
            <img
              src="/comida.jpg"
              alt="Despensa organizada"
              className="rounded-[6%] shadow-2xl w-full h-[45%] object-cover"
            />
          </div>

          {/* Gráficas y texto de estas */}
          <div className="flex-1 flex flex-col w-full">
            <div className="flex items-center gap-3 text-emerald-600 font-bold uppercase text-sm tracking-[0.2em] mb-2">
              <BarChart2 size={22} /> ESTADÍSTICAS DE AHORRO
            </div>

            <h2 className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight">
              Reduce el desperdicio al mínimo
            </h2>

            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Nuestros usuarios reportan una reducción drástica en comida tirada.
              La clave es la visibilidad constante de tus productos.
            </p>

            {/* Barras de progreso con más espacio entre ellas (gap-10) */}
            <div className="flex flex-col gap-4 w-full max-w-md">
              <div className="flex flex-col">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  <span>Antes</span>
                  <span>40% Desperdiciado</span>
                </div>
                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                  <div className="bg-slate-300 h-full w-[40%] rounded-full"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wider">
                  <span>Con nuestra plataforma</span>
                  <span>5% Desperdiciado</span>
                </div>
                <div className="w-full bg-emerald-100 h-3.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[5%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// COMPONENTE APP PRINCIPAL
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-white">
        <BarraNavegacion />

        <main className="flex-grow flex flex-col w-full">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Ingreso />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/despensa" element={<RutaPrivada><Despensa /></RutaPrivada>} />
            <Route path="/anadir" element={<RutaPrivada><AnadirProducto /></RutaPrivada>} />
            <Route path="/editar/:id" element={<RutaPrivada><EditarProducto /></RutaPrivada>} />
            <Route path="/recetas" element={<RutaPrivada><Recetas /></RutaPrivada>} />
            <Route path="/recetas/:id" element={<RutaPrivada><DetalleReceta /></RutaPrivada>} />
            <Route path="/admin" element={<RutaPrivada><PanelAdmin /></RutaPrivada>} />
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </main>

        <PieDePagina />
      </div>
    </Router>
  );
}

export default App;