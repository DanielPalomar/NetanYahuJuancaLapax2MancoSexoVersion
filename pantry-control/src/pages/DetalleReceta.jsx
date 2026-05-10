import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart, ListCheck } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

function DetalleReceta() {
  let params = useParams();
  let id = params.id;
  let navegar = useNavigate();
  let [receta, setReceta] = useState(null);
  let [productos, setProductos] = useState([]);

  useEffect(function() {
    Promise.all([
      serviciosAPI.obtenerDetalleReceta(id),
      serviciosAPI.obtenerDespensa()
    ]).then(function(resultados) {
      setReceta(resultados[0]);
      setProductos(resultados[1] || []);
    }).catch(function() {
      console.log('error al poner la recetilla o la despensota'); 
    });
  }, [id]);

  function volver() { navegar(-1); }

  if (!receta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-800">No encontrado</p>
          <button onClick={volver} className="text-blue-600 font-bold">Volver</button>
        </div>
      </div>
    );
  }

  let nombresPantry = [];
  for (let i = 0; i < productos.length; i++) {
    let nom = productos[i].nombre || '';
    nombresPantry.push(nom.toLowerCase());
  }

  function esFaltante(ingrediente) {
    let ing = ingrediente.toLowerCase();
    for (let j = 0; j < nombresPantry.length; j++) {
      if (ing.includes(nombresPantry[j]) || nombresPantry[j].includes(ing)) return false;
    }
    return true;
  }

  let listaPasos = [];
  if (typeof receta.instrucciones === 'string') {
    let partes = receta.instrucciones.split('.');
    for (let k = 0; k < partes.length; k++) {
      if (partes[k].trim()) listaPasos.push(partes[k]);
    }
  } else if (Array.isArray(receta.instrucciones)) {
    listaPasos = receta.instrucciones;
  }

  let ingredientes = receta.ingredientes || [];
  let listaIngJSX = [];
  for (let m = 0; m < ingredientes.length; m++) {
    let ingr = ingredientes[m];
    let falta = esFaltante(ingr);
    listaIngJSX.push(
      <li key={m} className="flex items-center justify-between p-3 border-b border-emerald-50 last:border-0 hover:bg-emerald-50/50 transition-colors rounded-lg">
        <span className={falta ? "text-emerald-400 line-through" : "text-emerald-900 font-medium"}>{ingr}</span>
        {falta && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Falta</span>}
      </li>
    );
  }

  let listaPasosJSX = [];
  for (let n = 0; n < listaPasos.length; n++) {
    listaPasosJSX.push(
      <div key={n} className="flex gap-4 mb-6">
        <div className="bg-emerald-600 text-white w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 rounded-full shadow-sm">{n + 1}</div>
        <p className="text-emerald-800 leading-relaxed pt-1">{listaPasos[n].trim()}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-24">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={volver} className="flex items-center gap-2 text-emerald-600/80 font-medium mb-8 hover:text-emerald-900 transition-colors">
          <ArrowLeft size={20} />
          <span>Volver a recetas</span>
        </button>
        
        <div className="bg-white border border-emerald-100 rounded-[2rem] shadow-sm overflow-hidden">
          {receta.imagen && (
            <div className="w-full h-64 md:h-80 relative">
              <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <h1 className="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">{receta.titulo}</h1>
            </div>
          )}
          
          <div className="p-8 md:p-10">
            {!receta.imagen && (
              <h1 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6 tracking-tight">{receta.titulo}</h1>
            )}
            
            <div className="flex gap-6 mb-8 pb-8 border-b border-emerald-100 text-sm font-medium text-emerald-700/80">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" />
                <span>{receta.tiempo || 'Tiempo no especificado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart size={18} className="text-emerald-400" />
                <span>{receta.dificultad || 'Dificultad no especificada'}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <ListCheck size={20} className="text-emerald-700" />
                  <h3 className="text-xl font-bold text-emerald-950">Ingredientes</h3>
                </div>
                <ul className="space-y-1">{listaIngJSX}</ul>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-emerald-950 mb-6">Instrucciones</h3>
                <div>{listaPasosJSX}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleReceta;
