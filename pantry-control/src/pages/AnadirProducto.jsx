import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, ChevronLeft } from 'lucide-react';
import Quagga from 'quagga';
import { serviciosAPI } from '../services/servicios';

/**
 * FORMULARIO DE AÑADIR PRODUCTO 
 */
function AnadirProducto() {
  let navigate = useNavigate();

  let [nombre, setNombre] = useState('');
  let [marca, setMarca] = useState('');
  let [codigoBarras, setCodigoBarras] = useState('');
  let [fechaCaducidad, setFechaCaducidad] = useState('');
  let [cantidad, setCantidad] = useState(1);
  let [escaneando, setEscaneando] = useState(false);
  let ultimoCodigoRef = useRef(null);
  let contadorRef = useRef(0);

  function buscarProductoExterno(codigo) {
    if (!codigo) return;
    fetch("https://world.openfoodfacts.org/api/v0/product/" + codigo + ".json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.status === 1 && data.product) {
          if (data.product.product_name) setNombre(data.product.product_name);
          if (data.product.brands) setMarca(data.product.brands);
        }
        setCodigoBarras(codigo);
      }).catch(function() {
        setCodigoBarras(codigo);
      });
  }

  /**
   * useEffect que controla el escáner de código de barras (Quagga).
   * Solo se activa cuando 'escaneando' cambia a true.
   * Al desmontar o parar, llama a Quagga.stop() para liberar la cámara.
   */
  useEffect(function () {
    if (!escaneando) {
      return;
    }

    // Cada vez que Quagga detecta un código, se ejecuta esta función.
    // Esperamos que lea el MISMO código 3 veces seguidas para evitar lecturas falsas.
    function alDetectar(data) {
      let codigo = data.codeResult.code;
      if (codigo === ultimoCodigoRef.current) {
        // Mismo código que antes -> sumar 1 al contador
        contadorRef.current = contadorRef.current + 1;
      } else {
        // Código diferente -> resetear contador
        ultimoCodigoRef.current = codigo;
        contadorRef.current = 1;
      }

      // Si se leyó 3 veces seguidas, confiamos en la lectura
      if (contadorRef.current >= 3) {
        buscarProductoExterno(codigo);
        setEscaneando(false);
      }
    }

    // Callback que se ejecuta cuando Quagga termina de inicializarse
    function inicioQuagga(err) {
      if (!err) {
        Quagga.start();
      }
    }

    // Inicializar Quagga con la cámara trasera del móvil
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: document.querySelector('#scanner'),
        constraints: { facingMode: 'environment' }
      },
      decoder: {
        readers: ['ean_reader', 'ean_8_reader', 'code_128_reader']
      }
    }, inicioQuagga);

    Quagga.onDetected(alDetectar);

    // Función de limpieza: se ejecuta al desmontar el componente o al parar el escaneo
    return function limpiar() {
      Quagga.stop();
    };
  }, [escaneando]);

  function manejarGuardar(e) {
    e.preventDefault();
    serviciosAPI.anadirProducto({
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

  function alBuscar() { buscarProductoExterno(codigoBarras); }
  function volver() { navigate('/despensa'); }
  let scannerBlock = escaneando ? (
    <div className="mb-4 bg-black aspect-video relative border border-blue-400 rounded">
      <div id="scanner" className="w-full h-full" />
    </div>
  ) : null;

  return (
    <div className="max-w mx-auto p-8 min-h-screen bg-blue-50">
      <button onClick={volver} className="text-blue-600 font-semibold mb-6 hover:text-blue-700">
        Volver
      </button>

      <div className="bg-white p-6 border border-blue-200 rounded">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Nuevo Producto</h2>

        <button
          type="button"
          onClick={function() { setEscaneando(!escaneando); }}
          className="w-full bg-blue-500 text-white font-semibold py-2 mb-4 rounded hover:bg-blue-600"
        >
          {escaneando ? "Detener" : "Escanear"}
        </button>

        {scannerBlock}

        <form onSubmit={manejarGuardar} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nombre</label>
            <input
              type="text" required
              placeholder="Nombre del producto"
              className="w-full px-4 py-2 border border-blue-200 rounded focus:outline-none focus:border-blue-500"
              value={nombre}
              onChange={function(e) { setNombre(e.target.value); }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Marca</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300"
                value={marca}
                onChange={function(e) { setMarca(e.target.value); }}
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-2 border border-gray-300"
                value={cantidad}
                onChange={function(e) { setCantidad(e.target.value); }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Código</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border border-gray-300"
                  value={codigoBarras}
                  onChange={function(e) { setCodigoBarras(e.target.value); }}
                />
                <button type="button" onClick={alBuscar} className="bg-gray-300 px-3 hover:bg-gray-400">
                  B
                </button>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Vence el día</label>
              <input
                type="date" required
                className="w-full px-4 py-2 border border-gray-300"
                value={fechaCaducidad}
                onChange={function(e) { setFechaCaducidad(e.target.value); }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 hover:bg-blue-700 mt-6"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnadirProducto;
