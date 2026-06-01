
function TarjetaReceta({ receta }) {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 overflow-hidden rounded-sm">
      {/* Imagen en caso de que la receta tenga con su titulo */}
      {receta.imagen && (
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={receta.imagen}
            alt={receta.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex flex-col items-center text-center flex-grow justify-center gap-2">
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
          {receta.titulo}
        </h3>
        {receta.coincidencias !== undefined && receta.coincidencias > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Tienes {receta.coincidencias} {receta.coincidencias === 1 ? 'ingrediente' : 'ingredientes'}
          </span>
        )}
      </div>
    </div>
  );
}

export default TarjetaReceta;