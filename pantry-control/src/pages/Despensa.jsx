import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, Hash } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';
import TarjetaProducto from '../components/TarjetaProducto';

// Esta es la página principal donde vemos todos nuestros productos
function Despensa() {
  const navegar = useNavigate();
  //lista de productos que nos da el servidor
  const [productos, setProductos] = useState([]);

  // para saber si ha habido un fallo al cargar los datos
  const [error, setError] = useState(false);


  // esto carga los datitos
  function cargarDatosDelServidor() {
    serviciosAPI.obtenerDespensa()
      .then(function (datos) {
        if (datos != null) {
          setProductos(datos);
        }
      })
      .catch(function (fallo) {
        setError(true);
      });
  }

  // Esta función sirve para borrar 
  function borrarProducto(id) {
    serviciosAPI.eliminarProducto(id)
      .then(function () {
        let listaNueva = [];
        for (let i = 0; i < productos.length; i++) {
          let p = productos[i];
          if (p.id !== id) {
            listaNueva.push(p);
          }
        }
        setProductos(listaNueva);
      })
      .catch(function (errorBorrado) {
        alert("Vaya, no se pudo eliminar el producto");
      });
  }

  // Esto se ejecuta una sola vez cuando entramos en la página
  useEffect(function () {
    cargarDatosDelServidor();
  }, []);

  // --- RENDERIZADO ---

  return (
    <div className="min-h-screen bg-[#f6f9f7]">

      {/* Cabecera de la página con el título y el botón de añadir */}
      <header className="relative flex items-center justify-between px-8 py-6 border-b border-emerald-100 bg-white min-h-[100px]">

        <div className="hidden sm:block flex-1"></div>


        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full pointer-events-none">
          <h1 className="text-3xl font-bold text-emerald-950">Mi Despensa</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-sm text-xs font-bold flex items-center gap-1">
              <Hash size={12} /> {productos.length}
            </span>
            <p className="text-sm text-slate-500 font-medium">productos en total</p>
          </div>
        </div>

        {/*El Z-index para que el boton se sobreponga y pueda ser usado*/}
        <div className="flex-1 flex justify-end z-10">
          <Link to="/anadir" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-sm flex items-center gap-2 font-semibold transition-colors">
            <Plus size={18} /> Añadir producto
          </Link>
        </div>
      </header>

      <main className="w-full flex flex-col items-center px-8 py-12">
        {/* Contenedor donde se muestran las tarjetas */}
        <div className="flex flex-row flex-wrap justify-center items-center w-full gap-8">

          {/* Si tenemos productos, los mostramos uno por uno */}
          {productos.length > 0 ? (
            productos.map(p => {

              // Funciones sencillas para cada tarjeta
              function editar() {
                navegar('/editar/' + p.id);
              }

              function borrar() {
                borrarProducto(p.id);
              }

              return (
                <div key={p.id} className="pt-6 w-[340px]">
                  <TarjetaProducto
                    producto={p}
                    alEditar={editar}
                    alEliminar={borrar}
                  />
                </div>
              );
            })
          ) : (
            // Si la lista está vacía, mostramos un mensaje limpio con esmeralda
            <div className="text-center py-20 w-full max-w-lg border border-emerald-100 bg-white rounded-sm">
              <p className="text-3xl font-bold text-emerald-800 uppercase tracking-wider">0 Productos</p>
              <p className="text-sm font-medium mt-2 text-slate-400 uppercase tracking-widest">Añade algo al inventario</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Despensa;