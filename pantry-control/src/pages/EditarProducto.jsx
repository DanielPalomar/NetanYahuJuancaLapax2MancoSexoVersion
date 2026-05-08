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

  useEffect(function() {
    serviciosAPI.obtenerDespensa().then(function(productos) {
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
    }).catch(function() {
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
    }).then(function() {
      navigate('/despensa');
    }).catch(function() {
      alert("Error");
    });
  }

  function volver() {
    navigate('/despensa');
  }

  return (
    <div className="max-w mx-auto p-8 min-h-screen bg-blue-50">
      <button onClick={volver} className="text-blue-600 font-semibold mb-6 hover:text-blue-700">
        Cancelar
      </button>

      <div className="bg-white p-6 border border-blue-200 rounded">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Editar Producto</h2>

        <form onSubmit={manejarGuardar} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nombre</label>
            <input
              type="text" required
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              value={nombre}
              onChange={function(e) { setNombre(e.target.value); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Código</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={codigoBarras}
                onChange={function(e) { setCodigoBarras(e.target.value); }}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={cantidad}
                onChange={function(e) { setCantidad(e.target.value); }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Marca</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={marca}
                onChange={function(e) { setMarca(e.target.value); }}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vence el día</label>
              <input
                type="date" required
                className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
                value={fechaCaducidad}
                onChange={function(e) { setFechaCaducidad(e.target.value); }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 mt-6"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditarProducto;
