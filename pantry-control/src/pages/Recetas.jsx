import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TarjetaReceta from '../components/TarjetaReceta';
import { serviciosAPI } from '../services/servicios';

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);

  // el useEfect es para cargar las recetas y los productos al crear esto 
 useEffect(() => {
    const obtenerInformacion = async () => {
      try {
        const recetas = await serviciosAPI.obtenerRecetasSugeridas();
        const productos = await serviciosAPI.obtenerDespensa();
        setRecetas(recetas || []);
        setProductos(productos || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    obtenerInformacion();
  }, []);

  // Función para crear el diseño de la tarjeta
  function crearTarjeta(receta) {
    return (
      <div key={receta.id} className="w-full md:w-80 mb-10">
        <Link to={'/recetas/' + receta.id}>
          <TarjetaReceta receta={receta} productosPantry={productos} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      
      <header className="text-center mb-16">
        <h1 className="text-4xl font-light text-gray-800">Recetario</h1>
        <p className="text-gray-500 mt-2">Ideas con lo que tienes a mano</p>
      </header>

      {/* Contenedor Flex: centra el contenido y permite salto de línea */}
      {recetas.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-10">
          {recetas.map(crearTarjeta)}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-3xl">
          <p className="text-gray-400">No hay recetas disponibles.</p>
          <Link to="/despensa" className="text-blue-500 block mt-4 font-bold">
            Ir a mi despensa
          </Link>
        </div>
      )}

    </div>
  );
}

export default Recetas;