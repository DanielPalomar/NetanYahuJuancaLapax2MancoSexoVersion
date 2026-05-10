import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

/**
 * FORMULARIO DE EDITAR PRODUCTO (HUMANO)
 */
function EditarProducto() {
  let navigate = useNavigate();
  let params = useParams();
  let id = params.id;
  let [nombre, setNombre] = useState('');
  let [marca, setMarca] = useState('');
  let [codigoBarras, setCodigoBarras] = useState('');
  let [fechaCaducidad, setFechaCaducidad] = useState('');
  let [cantidad, setCantidad] = useState(1);

  useEffect(function () {
    serviciosAPI.obtenerDespensa().then(function (productos) {
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === parseInt(id)) {
          setNombre(productos[i].nombre);
          setMarca(productos[i].marca);
          setCodigoBarras(productos[i].codigoBarras);
          setFechaCaducidad(productos[i].fechaCaducidad);
          setCantidad(productos[i].cantidad);
          break;
        }
      }
    }).catch(function () {
      console.log('error');
    });
  }, [id]);

  function manejarGuardar(e) {
    e.preventDefault();
    serviciosAPI.actualizarProducto(id, {
      nombre: nombre,
      marca: marca,
      codigoBarras: codigoBarras,
      fechaCaducidad: fechaCaducidad,
      cantidad: cantidad
    }).then(function () {
      navigate('/despensa');
    }).catch(function () {
      alert("Error");
    });
  }

  function volver() {
    navigate('/despensa');
  }

  return (
    <div className="min-h-screen bg-emerald-50 pb-24">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={volver} className="flex items-center gap-2 text-emerald-600/80 font-medium mb-8 hover:text-emerald-900 transition-colors">
          <ChevronLeft size={20} />
          <span>Volver a la despensa</span>
        </button>

        <div className="bg-white p-8 md:p-10 border border-emerald-100 shadow-sm rounded-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-emerald-950 tracking-tight">Editar Producto</h2>
            <p className="text-emerald-700/80 mt-2">Modifica los detalles de este producto en tu inventario.</p>
          </div>

          <form onSubmit={manejarGuardar} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">Nombre del producto</label>
              <input
                type="text" required
                className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                value={nombre}
                onChange={function (e) { setNombre(e.target.value); }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">Código de barras</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  value={codigoBarras}
                  onChange={function (e) { setCodigoBarras(e.target.value); }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  value={cantidad}
                  onChange={function (e) { setCantidad(e.target.value); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">Marca</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  value={marca}
                  onChange={function (e) { setMarca(e.target.value); }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">Fecha de caducidad</label>
                <input
                  type="date" required
                  className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  value={fechaCaducidad}
                  onChange={function (e) { setFechaCaducidad(e.target.value); }}
                />
              </div>
            </div>

            <div className="pt-4 mt-8 border-t border-emerald-100">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarProducto;
