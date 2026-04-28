import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ChevronLeft, Package, Tag, Calendar, Hash, Loader2, Sparkles } from 'lucide-react';
import { serviciosAPI } from '../services/api';

// EDITAR PRODUTO
function EditarProducto() {
  const navegar = useNavigate();
  const { id } = useParams();

  // --- Estado de Datos ---
  const [datos, setDatos] = useState({
    nombre: '',
    marca: '',
    codigoBarras: '',
    fechaCaducidad: '',
    cantidad: 1
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // CARGAR PRODUCTO
  // Recuperamos la información actual del producto usando el ID de la URL nen
  useEffect(function () {
    async function cargarProducto() {
      try {
        const productos = await serviciosAPI.obtenerDespensa();
        const encontrado = productos.find(p => p.id === parseInt(id));

        if (encontrado) {
          setDatos({
            nombre: encontrado.nombre || '',
            marca: encontrado.marca || '',
            codigoBarras: encontrado.codigoBarras || '',
            fechaCaducidad: encontrado.fechaCaducidad || '',
            cantidad: encontrado.cantidad || 1
          });
        }
      } catch (err) {
        console.error("Error al cargar producto:", err);
      } finally {
        setCargando(false);
      }
    }
    cargarProducto();
  }, [id]);

  // ACTUALIZAR DATOS
  // Envía los cambios al backend
  async function manejarGuardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await serviciosAPI.actualizarProducto(id, datos);
      navegar('/despensa');
    } catch (error) {
      alert("No se pudo actualizar el producto. Revisa el servidor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center transition-colors">

      <div className="w-full max-w-2xl">

        {/* Botón Volver */}
        <Link
          to="/despensa"
          className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white mb-10 font-bold transition-all group text-sm"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Cancelar y Volver
        </Link>


        {/* Cabecera */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>Actualizar Stock</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Editar Producto</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Estás modificando los detalles de <span className="text-blue-600 dark:text-blue-400 italic">"{datos.nombre}"</span>.</p>
        </div>


        <form onSubmit={manejarGuardar} className="bg-white dark:bg-gray-900 rounded-[44px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 space-y-10">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Nombre */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Package size={14} /> Nombre del Alimento
              </label>
              <input
                type="text"
                required
                className="w-full px-7 py-5 bg-gray-50 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 rounded-[24px] outline-none transition-all font-bold text-gray-800 dark:text-gray-100"
                value={datos.nombre}
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              />

            </div>

            {/* Marca */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Tag size={14} /> Marca
              </label>
              <input
                type="text"
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.marca}
                onChange={(e) => setDatos({ ...datos, marca: e.target.value })}
              />
            </div>

            {/* Cantidad / Stock */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Hash size={14} /> Unidades en Stock
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.cantidad}
                onChange={(e) => setDatos({ ...datos, cantidad: e.target.value })}
              />
            </div>

            {/* Fecha de Caducidad */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Calendar size={14} /> Nueva Fecha de Caducidad
              </label>
              <input
                type="date"
                required
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.fechaCaducidad}
                onChange={(e) => setDatos({ ...datos, fechaCaducidad: e.target.value })}
              />
            </div>
          </div>

          {/* Botón de Acción Final */}
          <button
            type="submit"
            disabled={guardando}
            className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[28px] font-black text-xl shadow-2xl shadow-gray-100 dark:shadow-none hover:bg-black dark:hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <><Save size={24} /> Actualizar Producto</>
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditarProducto;
