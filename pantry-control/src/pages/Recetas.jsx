import { Link } from 'react-router-dom';
import { Clock, Flame, ArrowRight, Sparkles, Utensils } from 'lucide-react';
// import { serviciosAPI } from '../services/api';

// Página de recetas - Marcos te sugiere qué cocinar basado en lo que tienes
const Recetas = () => {
  // Recetas sugeridas (cuando conectemos Spring, vendrán del backend)
  // const [recetas, setRecetas] = useState([]);
  // useEffect(() => {
  //   const cargar = async () => {
  //     try {
  //       const datos = await serviciosAPI.obtenerRecetasSugeridas();
  //       setRecetas(datos);
  //     } catch (err) {
  //       console.error('Error al obtener recetas:', err);
  //     }
  //   };
  //   cargar();
  // }, []);
  const recetas = [
    {
      id: 1,
      titulo: "Pasta Cremosa con Yogur",
      tiempo: "15 min",
      dificultad: "Fácil",
      ingredienteClave: "Yogur Griego",
      imagen: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=500&q=80",
      proximaACaducar: true
    },
    {
      id: 2,
      titulo: "Arroz con Leche y Canela",
      tiempo: "40 min",
      dificultad: "Media",
      ingredienteClave: "Leche Entera",
      imagen: "https://images.unsplash.com/photo-1590085223164-399083594896?auto=format&fit=crop&w=500&q=80",
      proximaACaducar: true
    },
    {
      id: 3,
      titulo: "Ensalada de Arroz Fría",
      tiempo: "10 min",
      dificultad: "Muy Fácil",
      ingredienteClave: "Arroz",
      imagen: "https://images.unsplash.com/photo-1512058560366-cd2429555e54?auto=format&fit=crop&w=500&q=80",
      proximaACaducar: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado inspiracional */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Sparkles className="text-yellow-500" size={24} />
            <span className="text-sm font-bold text-green-600 uppercase tracking-widest">Sugerencias Inteligentes</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">¿Qué cocinamos hoy?</h2>
          <p className="text-gray-500 text-lg max-w-2xl">
            Estas recetas aprovechan los productos que tienes en tu despensa y que están cerca de su fecha de caducidad.
          </p>
        </header>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recetas.map((receta) => (
            <div 
              key={receta.id} 
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Imagen con overlay */}
              <div className="relative h-56 overflow-hidden flex-shrink-0">
                <img 
                  src={receta.imagen} 
                  alt={receta.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-md ${
                    receta.proximaACaducar 
                    ? 'bg-orange-500/90 text-white' 
                    : 'bg-green-500/90 text-white'
                  }`}>
                    Usa tu: {receta.ingredienteClave}
                  </span>
                </div>
              </div>

              {/* Contenido de la receta */}
              <div className="p-6 flex flex-col flex-1">
                {/* Información rápida */}
                <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> {receta.tiempo}
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame size={14} /> {receta.dificultad}
                  </div>
                </div>

                {/* Título de la receta */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors flex-1">
                  {receta.titulo}
                </h3>

                {/* Botón para ver receta completa */}
                <Link 
                  to={`/recetas/${receta.id}`}
                  className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 group-hover:bg-green-600 group-hover:text-white transition-all mt-auto"
                >
                  Ver Receta Completa
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de tip sostenibilidad */}
        <div className="mt-16 bg-green-900 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-green-200">
          <div className="bg-green-800 p-6 rounded-full">
            <Utensils size={40} className="text-green-400" />
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-2">¿Sabías que...?</h4>
            <p className="text-green-100/80 leading-relaxed">
              Al cocinar estas recetas estás reduciendo un 15% tu huella de desperdicio mensual. 
              El sistema prioriza automáticamente los lácteos y frescos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recetas;