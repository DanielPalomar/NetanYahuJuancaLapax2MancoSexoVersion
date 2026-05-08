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
      <li key={m} className="flex items-center justify-between p-2 border-b border-blue-200">
        <span className={falta ? "text-slate-400" : "text-slate-800"}>{ingr}</span>
        {falta && <span className="text-sm text-red-600">Falta</span>}
      </li>
    );
  }

  let listaPasosJSX = [];
  for (let n = 0; n < listaPasos.length; n++) {
    listaPasosJSX.push(
      <div key={n} className="flex gap-4 mb-4">
        <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 rounded">{n + 1}</div>
        <p className="text-slate-700">{listaPasos[n].trim()}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      <div className="max-w mx-auto px-6 py-6">
        <button onClick={volver} className="text-blue-600 font-semibold mb-6 hover:text-blue-700">
          Volver
        </button>
        <div className="bg-white border border-blue-200 rounded-lg overflow-hidden">
          {receta.imagen && (
            <div className="w-full h-48">
              <img src={receta.imagen} alt={receta.titulo} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">{receta.titulo}</h1>
            <div className="flex gap-6 mb-6 pb-6 border-b border-blue-200 text-sm text-slate-600">
              <span>{receta.tiempo || 'N/A'}</span>
              <span>{receta.dificultad || 'N/A'}</span>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-blue-900 mb-3">Ingredientes</h3>
                <ul className="space-y-1">{listaIngJSX}</ul>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-bold text-blue-900 mb-3">Pasos</h3>
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
