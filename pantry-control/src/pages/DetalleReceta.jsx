import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Utensils } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

function DetalleReceta() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [receta, setReceta] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [detalleReceta, despensa] = await Promise.all([
          serviciosAPI.obtenerDetalleReceta(id),
          serviciosAPI.obtenerDespensa()
        ]);
        setReceta(detalleReceta);
        setProductos(despensa || []);
      } catch (err) {
        console.error("Error:", err.message);
        navegar('/recetas');
      }
    };

    if (id) cargarDatos();
  }, [id, navegar]);

  if (!receta) {
    return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Cargando...</div>;
  }

  // Preparar pasos
  let pasos = Array.isArray(receta.instrucciones) 
    ? receta.instrucciones 
    : (receta.instrucciones || "").split('.').filter(function(p) { return p.trim().length > 0; });

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white py-12 px-6">
      
      <div className="w-full flex justify-center mb-8">
        <button onClick={function() { navegar(-1); }} className="text-gray-400 hover:text-black">
          <ArrowLeft size={28} />
        </button>
      </div>

      <header className="text-center w-full mb-10">
        <p className="text-[10px] tracking-[0.3em] uppercase text-emerald-500 font-bold mb-2">Receta del día</p>
        <h1 className="text-4xl font-light text-gray-800 mb-6">{receta.titulo}</h1>
        
        <div className="flex justify-center gap-10 text-[11px] text-gray-400 uppercase tracking-widest border-y border-gray-50 py-4">
          <div className="flex items-center gap-2"><Clock size={16}/> {receta.tiempo || '25 min'}</div>
          <div className="flex items-center gap-2"><Utensils size={16}/> {receta.ingredientes?.length || 0} Ingredientes</div>
        </div>
      </header>

      <div className="w-full flex justify-center mb-16">
        <img src={receta.imagen} className="w-full max-w-2xl h-80 object-cover rounded-[2rem] shadow-2xl" alt={receta.titulo} />
      </div>

      <section className="w-full mb-20 text-center">
        <h2 className="text-xs uppercase tracking-[0.4em] text-gray-300 font-bold mb-10">Ingredientes</h2>
        <div className="max-w-xs mx-auto space-y-4 text-left">
          {(receta.ingredientes || []).map(function (ing, i) {
            // Verificar si tenemos el producto
            const loTengo = productos.some(function(p) {
              return ing.toLowerCase().includes((p.nombre || '').toLowerCase());
            });

            return (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className={loTengo ? "text-sm text-gray-800" : "text-sm text-gray-300 line-through"}>
                  {ing}
                </span>
                <div className={loTengo ? "w-2 h-2 bg-emerald-400 rounded-full" : "w-2 h-2 bg-gray-100 rounded-full"} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full text-center">
        <h2 className="text-xs uppercase tracking-[0.4em] text-gray-300 font-bold mb-12">Preparación</h2>
        <div className="max-w-2xl mx-auto space-y-16">
          {pasos.map(function (paso, i) {
            return (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl font-serif italic text-emerald-500 mb-4">{i + 1}</span>
                <p className="text-gray-500 leading-relaxed text-lg font-light">{paso.trim()}.</p>
              </div>
            );
          })}
        </div>
      </section>
      
    </div>
  );
}

export default DetalleReceta;