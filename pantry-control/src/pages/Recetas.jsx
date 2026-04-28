import { useState, useEffect } from 'react';
import { Loader2, ChefHat, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { serviciosAPI } from '../services/api';

// RECET(ARIO)卐
function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Carga de sugerencias inteligentes según la despensa
  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const datos = await serviciosAPI.obtenerRecetasSugeridas();
        setRecetas(Array.isArray(datos) ? datos : []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <div className="min-h-screen pb-24 transition-colors">



      {/* Encabezado*/}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-5xl font-light tracking-tight dark:text-white">¿Qué cocinamos hoy?</h1>
        <p className="text-gray-400 dark:text-gray-500 mt-4 text-xl max-w-2xl">
          Ideas basadas en los ingredientes que tienes ahora mismo.
        </p>
      </div>

      {/* Listado de Recetas */}
      <div className="max-w-5xl mx-auto px-6">
        <>
          {recetas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {recetas.map(r => (
                  <Link key={r.id} to={`/recetas/${r.id}`} className="block transition-transform hover:-translate-y-2">
                    <RecipeCard receta={r} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-32">
                <ChefHat size={64} className="mx-auto text-gray-100 dark:text-gray-800 mb-6" />
                <p className="text-gray-400 dark:text-gray-600 text-xl font-light italic">Tu despensa está esperando ingredientes para darte ideas.</p>
                <Link to="/despensa" className="text-black dark:text-white font-bold mt-4 inline-block border-b-2 border-black dark:border-white pb-1">Ir a mi despensa</Link>
              </div>
            )}
          </>
      </div>

      {/* Nota final */}
      {recetas.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-32 border-t border-gray-50 dark:border-gray-800 pt-10">
          <p className="text-gray-400 dark:text-gray-600 italic text-sm text-center">
            "Cocinar con lo que ya tienes es el primer paso para una vida más sostenible."
          </p>
        </div>
      )}
    </div>
  );
}

export default Recetas;