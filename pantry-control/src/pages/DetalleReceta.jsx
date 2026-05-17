import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Utensils } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

function DetalleReceta() {
  const { id } = useParams();
  const navegar = useNavigate();
  const location = useLocation();

  // Estado para guardar la receta
  const [receta, setReceta] = useState(null);
  const [productos, setProductos] = useState([]);

  // Cargar los datos iniciales
  useEffect(() => {
    // Si la receta ya viene en el estado de la navegación
    if (location.state) {
      if (location.state.receta) {
        setReceta(location.state.receta);
      }
    }

    // cargar los productos 
    const cargarDespensa = async () => {
      try {
        const datos = await serviciosAPI.obtenerDespensa();
        if (datos) {
          setProductos(datos);
        } else {
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al cargar la despensa:", error.message);
      }
    }

    cargarDespensa();
  }, [location.state]);

  // Si no hay receta, redirigir a la lista
  useEffect(() => {
    if (!receta) {
      if (!location.state) {
        navegar('/recetas');
      }
    }
  }, [receta, location.state, navegar]);

  // en caso de no haber recetas o si estan cargando (con la api demora un tiempillo)
  if (!receta) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-zinc-400 text-sm tracking-widest uppercase">Cargando...</div>
      </div>
    );
  }

  // Preparar los pasos de la preparación
  let pasosFinales = [];
  if (Array.isArray(receta.instrucciones)) {
    pasosFinales = receta.instrucciones;
  } else {
    const texto = receta.instrucciones || "";
    const trozos = texto.split('.');


    pasosFinales = trozos.filter(trozo => trozo.trim().length > 0);
  }

  // Preparamos los ingredientes
  const listaIngredientes = receta.ingredientes || [];

  // Evitamos .map creando los elementos con un bucle
  const elementosIngredientes = [];
  for (let i = 0; i < listaIngredientes.length; i++) {
    elementosIngredientes.push(
      <div key={i} className="flex items-center gap-3 py-1">
        <span className="text-zinc-900 font-medium">{listaIngredientes[i]}</span>
      </div>
    );
  }

  const elementosPasos = [];
  for (let i = 0; i < pasosFinales.length; i++) {
    elementosPasos.push(
      <div key={i} className="flex gap-4">
        <span className="text-emerald-500 font-bold text-lg">{i + 1}.</span>
        <p className="text-zinc-600 leading-relaxed pt-0.5">
          {pasosFinales[i].trim()}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-zinc-900">

      <div className="max-w-4xl mx-auto px-6 pt-10">
        <button
          onClick={() => navegar(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver</span>
        </button>

        <h1 className="text-4xl font-semibold mb-6 tracking-tight">
          {receta.titulo}
        </h1>

        <div className="flex items-center gap-6 text-sm text-zinc-500 mb-10 border-b border-zinc-100 pb-8">
          <div className="flex items-center gap-2">
            <Utensils size={16} className="text-emerald-500" />
            <span>{listaIngredientes.length} ingredientes</span>
          </div>
        </div>
      </div>

      {/* Imagen de fondo */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <img
          src={receta.imagen}
          className="w-full h-[400px] object-cover rounded-2xl shadow-sm"
          alt={receta.titulo}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row gap-12">

        {/* Lista ingredientes*/}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-6">Ingredientes</h2>
          <div className="space-y-3">
            {elementosIngredientes}
          </div>
        </div>

        {/* pasos de preparacion*/}
        <div className="flex-[2]">
          <h2 className="text-lg font-bold mb-6">Preparación</h2>
          <div className="space-y-8">
            {elementosPasos}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DetalleReceta;

