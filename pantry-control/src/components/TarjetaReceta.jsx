/**
 * TARJETA DE RECETA - Versión Minimalista
 */
function TarjetaReceta({ receta }) {
  // Fallback de tiempo más limpio
  const tiempo = receta.tiempo || '50 min';

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-transparent overflow-hidden">
      {/* Contenedor de Imagen con Aspect Ratio fijo */}
      {receta.imagen && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
          <img 
            src={receta.imagen} 
            alt={receta.titulo} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {/* Overlay sutil para el tiempo sobre la imagen (opcional) */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-900">{tiempo}</span>
          </div>
        </div>
      )}

      {/* Contenido centrado */}
      <div className="py-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {receta.titulo}
        </h3>
        
        <p className="text-sm text-gray-400 dark:text-gray-500 font-light tracking-wide uppercase">
          Listo en {tiempo}
        </p>

        {/* El enlace ahora es un detalle sutil o puedes dejar que toda la card sea el link */}
        <span className="mt-4 text-xs font-bold border-b border-black dark:border-white pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          VER DETALLES
        </span>
      </div>
    </div>
  );
}

export default TarjetaReceta;