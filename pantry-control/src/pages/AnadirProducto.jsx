import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Search, ChevronLeft } from "lucide-react";
import Quagga from "quagga";
import { serviciosAPI } from "../services/servicios";

function AnadirProducto() {
  let navigate = useNavigate();

  // estados form
  let [producto, setProducto] = useState({
    nombre: "",
    marca: "",
    codigoBarras: "",
    fechaCaducidad: "",
    cantidad: 1,
  });
  let [escaneando, setEscaneando] = useState(false);

  // Referencias para el control de lectura (para que no se pierda cuando recargue y que ta,ppoco reinicie) (como el livewire en laravel +-)
  let contadorRef = useRef(0);
  let ultimoCodigoRef = useRef(null);

  //ACTUASLIZAR LOS DATOS
  function manejarInput(e) {
    let campo = e.target.name;
    let valor = e.target.value;
    setProducto(function (estadoPrevio) {
      return { ...estadoPrevio, [campo]: valor };
    });
  }

  //BUSCAR DATOS POR CÓDIGO 
  function buscarCodigo(codigo) {
    let url =
      "https://world.openfoodfacts.org/api/v0/product/" + codigo + ".json";
    fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.status === 1) {
          setProducto(function (prev) {
            return {
              ...prev,
              nombre: data.product.product_name || prev.nombre,
              marca: data.product.brands || prev.marca,
              codigoBarras: codigo,
            };
          });
        }
      });
  }

  // CONFIGURACIÓN DEL ESCÁNER 
  useEffect(
    function () {
      if (!escaneando) return;

      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.querySelector("#visor"),
            constraints: { facingMode: "environment" },
          },
          decoder: { readers: ["ean_reader", "ean_8_reader"] },
        },
        function (err) {
          if (!err) Quagga.start();
        },
      );

      Quagga.onDetected(function (data) {
        let codigo = data.codeResult.code;
        if (codigo === ultimoCodigoRef.current) {
          contadorRef.current++;
        } else {
          ultimoCodigoRef.current = codigo;
          contadorRef.current = 1;
        }

        if (contadorRef.current >= 5) {
          // 5 lecturas para mayor seguridad
          buscarCodigo(codigo);
          setEscaneando(false);
        }
      });

      return function () {
        Quagga.stop();
      };
    },
    [escaneando],
  );

  // GUARDAR Y VOLVER
  function guardar(e) {
    e.preventDefault();
    serviciosAPI.anadirProducto(producto).then(function () {
      navigate("/despensa");
    });
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-sm border border-emerald-100">
        {/* Botón Volver */}
        <button
          onClick={function () {
            navigate("/despensa");
          }}
          className="flex items-center text-emerald-600 mb-6 font-semibold"
        >
          <ChevronLeft /> Volver
        </button>

        <h2 className="text-4xl font-bold text-emerald-950 mb-2">
          Nuevo Producto
        </h2>
        <p className="text-emerald-600 mb-8">
          Registra un nuevo alimento en tu despensa
        </p>

        {/* BOTÓN Y VISOR DE CÁMARA */}
        <button
          onClick={function () {
            setEscaneando(!escaneando);
          }}
          className="w-full py-4 border-2 border-dashed border-emerald-300 rounded-2xl mb-6 flex justify-center items-center gap-2 text-emerald-700 font-bold bg-emerald-50"
        >
          <Camera /> {escaneando ? "Detener Escáner" : "Escanear Código"}
        </button>
        <div
          className={`relative overflow-hidden rounded-3xl bg-black transition-all duration-500 mb-8 ${escaneando ? "aspect-video opacity-100" : "h-0 opacity-0"
            } [&_video]:object-cover [&_video]:w-full [&_video]:h-full`}
        >
          <div id="visor" className="w-full h-full"></div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={guardar} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-emerald-900 uppercase mb-2">
              Nombre del Producto
            </label>
            <input
              name="nombre"
              value={producto.nombre}
              onChange={manejarInput}
              required
              className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-2">
                Marca
              </label>
              <input
                name="marca"
                value={producto.marca}
                onChange={manejarInput}
                className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl outline-none"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-2">
                Unidades
              </label>
              <input
                name="cantidad"
                type="number"
                value={producto.cantidad}
                onChange={manejarInput}
                className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-2">
                Código
              </label>
              <div className="flex gap-2">
                <input
                  name="codigoBarras"
                  value={producto.codigoBarras}
                  onChange={manejarInput}
                  className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={function () {
                    buscarCodigo(producto.codigoBarras);
                  }}
                  className="p-4 bg-emerald-600 text-white rounded-xl"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-emerald-900 uppercase mb-2">
                Fecha Caducidad
              </label>
              <input
                name="fechaCaducidad"
                type="date"
                value={producto.fechaCaducidad}
                onChange={manejarInput}
                className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl text-xl shadow-lg hover:bg-emerald-700 transition-colors"
          >
            Guardar Producto
          </button>
        </form>
      </div>
    </div >
  );
}

export default AnadirProducto;