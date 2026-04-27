
// TARJETA DE RECETA by Lapaco rabo negro
function RecipeCard({ receta }) {

  return (
    <div className="group cursor-pointer">

      {/* Imagen de la receta */}
      <div className="aspect-[4/5] bg-gray-50 dark:bg-gray-800 rounded-[40px] overflow-hidden mb-6 relative shadow-sm">
        <img
          src={receta.imagen}
          alt={receta.titulo}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Título y categoría*/}
      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 dark:text-gray-700">
          Receta Recomendada
        </div>
        <h3 className="text-3xl font-light text-gray-900 dark:text-gray-100 leading-tight tracking-tight group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
          {receta.titulo}
        </h3>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-600 pt-2">
          <span>{receta.tiempo || "25 min"}</span>
          <span className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <span>Fácil</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
