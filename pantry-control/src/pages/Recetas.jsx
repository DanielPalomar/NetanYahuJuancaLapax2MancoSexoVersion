import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaReceta from '../components/TarjetaReceta';
import { serviciosAPI } from '../services/servicios';

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);

  // el usefet es para cargar las recetas y los productos al crear esto 
  useEffect(() => {
    const obtenerInformacion = async () => {
      try {
        // 1. Obtener la despensa primero
        const productosDespensa = await serviciosAPI.obtenerDespensa();
        setProductos(productosDespensa || []);

        // 2. Escoger un ingrediente de la despensa para buscar recetas
        // Si no tiene nada, usamos un ingrediente por defecto (ej. 'pollo')
        let ingredienteABuscar = 'pollo';
        if (productosDespensa && productosDespensa.length > 0) {
          ingredienteABuscar = productosDespensa[0].nombre; // Busca por el primer producto
        }

        // 3. Obtener recetas basadas en ese ingrediente
        const recetasSugeridas = await serviciosAPI.obtenerRecetasSugeridas(ingredienteABuscar);
        setRecetas(recetasSugeridas || []);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    obtenerInformacion();
  }, []);

  function crearTarjeta(receta) {
    return (
      <div key={receta.id} className="relative w-[340px] max-w-[90vw] flex-shrink-0">
        <Link to={'/recetas/' + receta.id} state={{ receta }} className="block w-full h-full">
          <TarjetaReceta receta={receta} productosPantry={productos} />
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 overflow-hidden">

      {/* Fondo con imagen semi difuminada */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg')" }}
      >
        <div className="absolute inset-0 bg-emerald-50/70 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">

        <header className="w-full text-center flex flex-col items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight drop-shadow-sm">Recomendaciones para ti</h1>
        </header>

        {recetas.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center w-full gap-8">
            {recetas.map(crearTarjeta)}
          </div>
        ) : (
          <div className="text-center py-24 px-8 border-2 border-dashed border-emerald-200 bg-white/50 rounded-[2.5rem] w-full max-w-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Aún no hay recetas</h3>
            <Link to="/despensa" className="inline-flex items-center justify-center px-8 py-4 text-white bg-emerald-600 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all">
              Ir a mi despensa
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Recetas;