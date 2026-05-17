
function TarjetaReceta({ receta }) {
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 overflow-hidden shadow-sm rounded-xl">
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

      <div className="p-4 flex flex-col items-center text-center flex-grow justify-center">
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
          {receta.titulo}
        </h3>
      </div>
    </div>
  );
}

export default TarjetaReceta;