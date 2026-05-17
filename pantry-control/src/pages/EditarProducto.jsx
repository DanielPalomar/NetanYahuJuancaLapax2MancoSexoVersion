import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Package2 } from 'lucide-react';
import { serviciosAPI } from '../services/servicios';

function EditarProducto() {
  let navegar = useNavigate();
  let parametros = useParams();
  let id = parametros.id;

  let [nombre, setNombre] = useState('');
  let [marca, setMarca] = useState('');
  let [codigoBarras, setCodigoBarras] = useState('');
  let [fechaCaducidad, setFechaCaducidad] = useState('');
  let [cantidad, setCantidad] = useState(1);

  // Esto se ejecuta al cargar la pagina para traer los datos del producto seleccionado
  useEffect(() => {
    serviciosAPI.obtenerDespensa().then(function (productos) {
      for (let i = 0; i < productos.length; i++) {
        let p = productos[i];
        if (p.id === parseInt(id)) {
          setNombre(p.nombre);
          setMarca(p.marca);
          setCodigoBarras(p.codigoBarras);
          setFechaCaducidad(p.fechaCaducidad);
          setCantidad(p.cantidad);
          break;
        }
      }
    }).catch(function (error) {
      console.error('Error al cargar datos:', error); //error por consola cool
    });
  }, [id]); // el "id" aqui es para que se vuelva a ejecutar si el id cambia o algo

  {/* guardado del producto editado con un precentDefacult para que no se recargue la pagina */ }
  function manejarGuardar(e) {
    e.preventDefault();

    let datosNuevos = {
      nombre: nombre,
      marca: marca,
      codigoBarras: codigoBarras,
      fechaCaducidad: fechaCaducidad,
      cantidad: cantidad
    };

    serviciosAPI.actualizarProducto(id, datosNuevos)
      .then(function () {
        navegar('/despensa');
      })
      .catch(function () {
        alert("Error al guardar");
      });
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-start">

      <div className="w-full max-w-2xl px-6 py-10 flex flex-col">

        {/* BOTÓN VOLVER al presionar nos devuekve a despensa */}
        <button
          onClick={function () { navegar('/despensa'); }}
          className="flex flex-row items-center gap-2 text-emerald-700 font-bold mb-6 w-fit hover:text-emerald-900"
        >
          <ChevronLeft size={20} />
          <span>Volver a la despensa</span>
        </button>

        {/* Marcos corrige esto que creo que era de los que me da problemas  */}
        {/* OK agora lo miro!!!!!!!!  */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-200/50">

          <div className="flex flex-col items-center mb-8">
            <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600 mb-3">
              <Package2 size={32} />
            </div>
            <h2 className="text-3xl font-black text-emerald-950">Editar Datos</h2>
            <p className="text-emerald-600 font-medium text-sm">Ajusta los detalles de tu producto</p>
          </div>

          {/* llama a la funcion para guardar el cambio */}
          <form onSubmit={manejarGuardar} className="flex flex-col gap-6">

            {/*Formulario de toda la vida con los datos del producto seleccionado */}
            {/* NOMBRE */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-emerald-800 ml-1">Nombre del producto</label>
              <input
                type="text" required
                className="px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-900 font-medium transition-all"
                value={nombre}
                onChange={function (e) { setNombre(e.target.value); }}
              />
            </div>

            {/* FILA CÓDIGO Y CANTIDAD */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs font-black uppercase text-emerald-800 ml-1">Código de Barras</label>
                <input
                  type="text"
                  className="px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-900"
                  value={codigoBarras}
                  onChange={function (e) { setCodigoBarras(e.target.value); }}
                />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-36">
                <label className="text-xs font-black uppercase text-emerald-800 ml-1">Cantidad</label>
                <input
                  type="number" min="1"
                  className="px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-900 font-bold"
                  value={cantidad}
                  onChange={function (e) { setCantidad(e.target.value); }}
                />
              </div>
            </div>

            {/* MARCA Y FECHA*/}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs font-black uppercase text-emerald-800 ml-1">Marca</label>
                <input
                  type="text"
                  className="px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-900"
                  value={marca}
                  onChange={function (e) { setMarca(e.target.value); }}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-xs font-black uppercase text-emerald-800 ml-1">Fecha de Caducidad</label>
                <input
                  type="date"
                  className="px-5 py-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl focus:outline-none focus:border-emerald-500 text-emerald-900 font-bold"
                  value={fechaCaducidad}
                  onChange={function (e) { setFechaCaducidad(e.target.value); }}
                />
              </div>
            </div>

            {/*  GUARDAR */}
            <button
              type="submit"
              className="mt-4 w-full bg-emerald-600 text-white font-black py-5 rounded-2xl flex flex-row items-center justify-center gap-2 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
            >
              <Save size={20} />
              GUARDAR CAMBIOS
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarProducto;