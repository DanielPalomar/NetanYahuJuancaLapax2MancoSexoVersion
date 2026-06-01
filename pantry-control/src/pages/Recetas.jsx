import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaReceta from '../components/TarjetaReceta';
import { serviciosAPI } from '../services/servicios';
import Cargador from '../components/Cargador';

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Carga las recetas de manera inteligente teniendo en cuenta todos los ingredientes de la despensa
  useEffect(() => {
    const obtenerInformacion = async () => {
      try {
        setCargando(true);
        // 1. Obtener todos los productos guardados en la despensa
        const productosDespensa = await serviciosAPI.obtenerDespensa();
        setProductos(productosDespensa || []);

        let todasLasRecetas = [];

        if (productosDespensa && productosDespensa.length > 0) {
          // Limitamos a los primeros 6 productos para no sobrecargar de llamadas al backend
          const ingredientesBuscados = productosDespensa.slice(0, 6);
          
          // Lanzamos las peticiones de recetas en paralelo para cada ingrediente
          const promesasRecetas = ingredientesBuscados.map(prod => 
            serviciosAPI.obtenerRecetasSugeridas(prod.nombre)
              .catch(err => {
                console.error(`Error buscando recetas para ${prod.nombre}:`, err);
                return [];
              })
          );
          
          const resultados = await Promise.all(promesasRecetas);
          
          // Unimos todas las recetas en una única lista
          resultados.forEach(lista => {
            if (lista && Array.isArray(lista)) {
              todasLasRecetas = todasLasRecetas.concat(lista);
            }
          });
        } else {
          // Si no hay productos en la despensa, buscamos por el ingrediente por defecto "pollo"
          todasLasRecetas = await serviciosAPI.obtenerRecetasSugeridas('pollo');
        }

        // 2. Filtramos recetas duplicadas por su ID
        const mapaRecetasUnicas = new Map();
        todasLasRecetas.forEach(receta => {
          if (receta && receta.id) {
            mapaRecetasUnicas.set(receta.id, receta);
          }
        });
        
        let recetasFiltradas = Array.from(mapaRecetasUnicas.values());

        // 3. Calculamos la coincidencia de ingredientes (Match Score) de cada receta con nuestra despensa
        if (productosDespensa && productosDespensa.length > 0) {
          recetasFiltradas = recetasFiltradas.map(receta => {
            let coincidenciasCount = 0;
            const ingredientesReceta = receta.ingredientes || [];

            // Contamos cuántos ingredientes de la receta coinciden con los que tenemos en la despensa
            ingredientesReceta.forEach(ing => {
              const ingMin = ing.toLowerCase();
              const coincide = productosDespensa.some(prod => {
                const prodMin = prod.nombre.toLowerCase();
                // Coincidencia si el ingrediente de la receta contiene el nombre del producto o viceversa
                return ingMin.includes(prodMin) || prodMin.includes(ingMin);
              });
              
              if (coincide) {
                coincidenciasCount++;
              }
            });

            return {
              ...receta,
              coincidencias: coincidenciasCount
            };
          });

          // Ordenamos las recetas de mayor a menor número de ingredientes que ya posee el usuario
          recetasFiltradas.sort((a, b) => (b.coincidencias || 0) - (a.coincidencias || 0));
        }

        setRecetas(recetasFiltradas);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerInformacion();
  }, []);

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

        {cargando ? (
          <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-xl p-8 max-w-md w-full border border-emerald-100 shadow-sm flex flex-col items-center">
            <Cargador />
            <p className="text-emerald-950/70 text-sm mt-3 font-semibold">Buscando las mejores recetas para ti...</p>
          </div>
        ) : recetas.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center w-full gap-8">
            {recetas.map(receta => (
              <div key={receta.id} className="relative w-[340px] max-w-[90vw] flex-shrink-0">
                <Link to={'/recetas/' + receta.id} state={{ receta }} className="block w-full h-full">
                  <TarjetaReceta receta={receta} productosPantry={productos} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 px-8 border border-dashed border-emerald-200 bg-white/50 rounded-xl w-full max-w-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Aún no hay recetas</h3>
            <Link to="/despensa" className="inline-flex items-center justify-center px-8 py-4 text-white bg-emerald-600 rounded-lg font-bold shadow-sm hover:bg-emerald-700 transition-colors">
              Ir a mi despensa
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default Recetas;