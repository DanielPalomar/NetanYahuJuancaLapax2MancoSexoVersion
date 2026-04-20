import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flame, ArrowLeft, CheckCircle2, UtensilsCrossed } from 'lucide-react';
// import { serviciosAPI } from '../services/api';

// Página con el detalle completo de una receta
const DetalleReceta = () => {
  const { id } = useParams();
  const navegar = useNavigate();

  // Datos simulados de la receta (cuando conectemos Spring, vendrán del backend con el id)
  // const receta = await serviciosAPI.obtenerDetalleReceta(id);
  const receta = {
    id,
    titulo: "Pasta Cremosa con Yogur",
    tiempo: "15 min",
    dificultad: "Fácil",
    ingredienteClave: "Yogur Griego",
    imagen: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80",
    raciones: 2,
    // Ingredientes: marcamos cuáles tenemos en la despensa
    ingredientes: [
      { nombre: "Pasta (Macarrones)", cantidad: "200g", enDespensa: true },
      { nombre: "Yogur Griego", cantidad: "1 unidad", enDespensa: true, critico: true },
      { nombre: "Ajo", cantidad: "1 diente", enDespensa: false },
      { nombre: "Queso Parmesano", cantidad: "30g", enDespensa: true },
      { nombre: "Aceite de Oliva", cantidad: "1 cucharada", enDespensa: true }
    ],
    // Pasos para hacer la receta
    pasos: [
      "Hierve la pasta en abundante agua con sal hasta que esté al dente.",
      "Mientras tanto, en una sartén grande con aceite de oliva, sofríe el ajo finamente picado.",
      "Añade el yogur griego a la sartén a fuego muy bajo (para que no se corte) y mezcla bien.",
      "Incorpora la pasta escurrida a la salsa de yogur.",
      "Añade el queso parmesano, pimienta negra al gusto y sirve inmediatamente."
    ]
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 pb-20">
      {/* Imagen hero de la receta */}
      <div className="h-64 md:h-96 w-full relative">
        <img 
          src={receta.imagen} 
          alt={receta.titulo} 
          className="w-full h-full object-cover"
        />
        {/* Overlay oscuro en la imagen */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        
        {/* Botón volver atrás */}
        <button 
          onClick={() => navegar(-1)}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* Título en la imagen */}
        <div className="absolute bottom-6 left-6 right-6 md:left-20 max-w-4xl">
          <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg mb-4 inline-block">
            Usa tu: {receta.ingredienteClave}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {receta.titulo}
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Columna izquierda: ingredientes y detalles */}
        <div className="md:col-span-1 space-y-8">
          {/* Tarjeta de detalles rápidos */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 justify-around text-gray-500">
            {/* Tiempo */}
            <div className="text-center">
              <Clock className="mx-auto mb-1 text-gray-400" size={24} />
              <span className="text-sm font-medium">{receta.tiempo}</span>
            </div>
            {/* Dificultad */}
            <div className="text-center">
              <Flame className="mx-auto mb-1 text-orange-400" size={24} />
              <span className="text-sm font-medium">{receta.dificultad}</span>
            </div>
            {/* Raciones */}
            <div className="text-center">
              <UtensilsCrossed className="mx-auto mb-1 text-gray-400" size={24} />
              <span className="text-sm font-medium">{receta.raciones} pax</span>
            </div>
          </div>

          {/* Lista de ingredientes */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Ingredientes</h3>
            <ul className="space-y-4">
              {receta.ingredientes.map((ing, idx) => (
                <li key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                  {/* Icono si lo tenemos o no */}
                  <div className="flex items-center gap-2">
                    {ing.enDespensa ? (
                      <CheckCircle2 size={18} className={ing.critico ? "text-orange-500" : "text-green-500"} />
                    ) : (
                      <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className={`text-sm ${ing.enDespensa ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {ing.nombre}
                    </span>
                  </div>
                  {/* Cantidad del ingrediente */}
                  <span className="text-sm text-gray-500">{ing.cantidad}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna derecha: pasos de la receta */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Instrucciones</h3>
            <div className="space-y-8">
              {receta.pasos.map((paso, index) => (
                <div key={index} className="flex gap-6 group">
                  {/* Número del paso */}
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-green-600 group-hover:text-white transition-colors shadow-sm">
                    {index + 1}
                  </div>
                  {/* Descripción del paso */}
                  <p className="text-gray-600 leading-relaxed pt-1.5">
                    {paso}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetalleReceta;
