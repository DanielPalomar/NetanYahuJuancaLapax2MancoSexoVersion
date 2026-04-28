import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flame, ArrowLeft, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { serviciosAPI } from '../services/api';

// Página con el detalle completo de una receta
function DetalleReceta() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [receta, setReceta] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(function () {
    async function cargar() {
      try {
        const datos = await serviciosAPI.obtenerDetalleReceta(id);
        if (datos) {
          setReceta(datos);
        }
      } catch (err) {
        console.error('Error al cargar receta:', err);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);


  if (!receta) {
    return <div className="p-20 text-center">No se ha encontrado la receta.</div>;
  }

  let listaPasos = [];
  if (typeof receta.instrucciones === 'string') {
    listaPasos = receta.instrucciones.split('.').filter(function (p) { return p.trim().length > 0; });
  } else if (Array.isArray(receta.instrucciones)) {
    listaPasos = receta.instrucciones;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] pb-16 transition-colors">

      {/* Imagen de la receta */}
      <div className="h-64 md:h-80 w-full relative">
        <img
          src={receta.imagen}
          alt={receta.titulo}
          className="w-full h-full object-cover"
        />
        {/* Overlay en la imagen */}
        <div className="absolute inset-0 bg-gray-900/60"></div>

        {/* Botón volver atrás */}
        <button
          onClick={function () { navegar(-1); }}
          className="absolute top-6 left-6 bg-white/20 dark:bg-black/20 text-white p-2.5 rounded-md hover:bg-white/30 dark:hover:bg-black/40 transition-colors border border-white/30 dark:border-white/10"
        >
          <ArrowLeft size={20} />
        </button>


        {/* Título en la imagen */}
        <div className="absolute bottom-8 left-6 right-6 md:left-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {receta.titulo}
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        <div className="md:col-span-1 space-y-6">

          <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 flex gap-4 justify-around text-gray-600 dark:text-gray-400">

            {/* Tiempo */}
            <div className="text-center">
              <Clock className="mx-auto mb-1 text-gray-400 dark:text-gray-600" size={20} />
              <span className="text-sm font-medium">{receta.tiempo}</span>
            </div>
            {/* Dificultad */}
            <div className="text-center">
              <Flame className="mx-auto mb-1 text-orange-500 dark:text-orange-400" size={20} />
              <span className="text-sm font-medium">{receta.dificultad}</span>
            </div>
            {/* Raciones */}
            <div className="text-center">
              <UtensilsCrossed className="mx-auto mb-1 text-gray-400 dark:text-gray-600" size={20} />
              <span className="text-sm font-medium">2 pax</span>
            </div>
          </div>

          {/* Lista de ingredientes */}
          <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">Ingredientes</h3>
            <ul className="space-y-3">
              {receta.ingredientes.map(function (ingrediente, indice) {
                return (
                  <li key={indice} className="flex gap-2 items-start text-sm">
                    <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {ingrediente}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Pasos de la receta */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-2">Instrucciones</h3>
            <div className="space-y-6">
              {listaPasos.map(function (paso, index) {
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5 text-base">
                      {paso.trim()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DetalleReceta;
