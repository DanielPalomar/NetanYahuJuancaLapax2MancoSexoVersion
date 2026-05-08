import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import TarjetaReceta from '../components/TarjetaReceta';
import { serviciosAPI } from '../services/servicios';

/**
 * PÁGINA DE RECETAS 
 */
function Recetas() {
  let [recetas, setRecetas] = useState([]);
  let [productos, setProductos] = useState([]);

  //promesa en honor a Marco Javier 
  useEffect(function() {
    Promise.all([
      serviciosAPI.obtenerRecetasSugeridas(),
      serviciosAPI.obtenerDespensa()
    ]).then(function(resultados) {
      setRecetas(resultados[0] || []);
      setProductos(resultados[1] || []);
    }).catch(function() {
      console.log('error');
    });
  }, []);

  let tarjetas = [];
  for (let i = 0; i < recetas.length; i++) {
    let r = recetas[i];
    tarjetas.push(
      <Link key={r.id} to={'/recetas/' + r.id}>
        <TarjetaReceta receta={r} productosPantry={productos} />
      </Link>
    );
  }

  let contenido = tarjetas.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tarjetas}
    </div>
  ) : (
    <div className="text-center py-16 bg-white border border-blue-200 rounded">
      <p className="text-slate-500">No hay recetas</p>
    </div>
  );

  return (
    <div className="pb-24">
      <div className="py-6 mb-6 border-b border-blue-200 bg-blue-50">
        <div className="max-w mx-auto px-8">
          <h1 className="text-4xl font-bold text-blue-900">Recetas</h1>
          <p className="text-slate-700 text-sm mt-1">Recetas sugeridas con tus ingredientes</p>
        </div>
      </div>

      <div className="max-w mx-auto px-8">
        {contenido}
      </div>
    </div>
  );
}

export default Recetas;
