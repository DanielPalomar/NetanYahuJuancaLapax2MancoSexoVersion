import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Save, Camera, ChevronLeft,
  Package, Tag, Calendar,
  Hash, Search, Sparkles
} from 'lucide-react';
import Quagga from 'quagga';
import { serviciosAPI } from '../services/api';

// PÁGINA DE AÑADIR PRODUCTO
function AñadirProducto() {
  const navegar = useNavigate();

  // Estado de Datos
  const [datos, setDatos] = useState({
    nombre: '',
    marca: '',
    codigoBarras: '',
    fechaCaducidad: '',
    cantidad: 1,
  });

  const [cargando, setCargando] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [buscandoManual, setBuscandoManual] = useState(false);

  // Referencias para el escáner
  const ultimoCodigoRef = useRef(null);
  const contadorRef = useRef(0);
  const sonidoRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));

  // BUSCAR PRODUCTO POR CÓDIGO

  async function fetchProducto(codigo) {
    try {
      const resultado = await serviciosAPI.obtenerProductoPorCodigoBarras(codigo);
      if (resultado) {
        setDatos(prev => ({
          ...prev,
          nombre: resultado.nombre || prev.nombre,
          marca: resultado.marca || prev.marca,
          codigoBarras: codigo,
          url_image: resultado.url_image || prev.url_image
        }));
      } else {
        setDatos(prev => ({ ...prev, codigoBarras: codigo }));
      }
    } catch (e) {
      console.error('Error buscando producto:', e);
      setDatos(prev => ({ ...prev, codigoBarras: codigo }));
    }
  }

  // CONFIGURACIÓN DEL ESCÁNER
  useEffect(() => {
    if (!escaneando) return;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: document.querySelector('#scanner'),
        constraints: isMobile ? { facingMode: 'environment' } : { facingMode: 'user' }
      },
      locator: { patchSize: 'medium', halfSample: true },
      decoder: { readers: ['ean_reader', 'ean_8_reader', 'code_128_reader'] },
      locate: true,
      frequency: 5
    }, (err) => {
      if (!err) Quagga.start();
    });

    Quagga.onDetected((data) => {
      const codigo = data.codeResult.code;
      if (codigo.length < 8) return;

      // Control de precisión
      if (codigo === ultimoCodigoRef.current) {
        contadorRef.current++;
      } else {
        ultimoCodigoRef.current = codigo;
        contadorRef.current = 1;
      }

      // Si detectamos el mismo código 3 veces seguidas, lo damos por válido
      if (contadorRef.current >= 3) {
        fetchProducto(codigo);
        if (sonidoRef.current) sonidoRef.current.play().catch(() => { });
        setEscaneando(false);
        contadorRef.current = 0;
      }
    });

    return () => Quagga.stop();
  }, [escaneando]);

  // GUARDAR EN LA DESPENSA
  async function manejarGuardar(e) {
    e.preventDefault();
    setCargando(true);
    try {
      await serviciosAPI.anadirProducto(datos);
      navegar('/despensa');
    } catch (error) {
      alert("Error al guardar el producto. Verifica la conexión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 pt-12 px-6 transition-colors">

      <div className="max-w-2xl mx-auto">

        {/* Volver */}
        <button onClick={() => navegar('/despensa')} className="inline-flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors font-bold text-sm mb-10 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver a mi Despensa
        </button>


        {/* Cabecera */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>Nuevo Ingrediente</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Añadir Producto</h2>
        </div>


        {/* Control del Escáner */}
        <div className="mb-10">
          <button
            onClick={() => setEscaneando(!escaneando)}
            className={`w-full py-5 rounded-[32px] font-black flex items-center justify-center gap-3 transition-all shadow-sm ${escaneando ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            <Camera size={24} />
            {escaneando ? "Cerrar Escáner" : "Escanear Código de Barras"}
          </button>


          {escaneando && (
            <div className="mt-6 relative rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-black aspect-video">
              <div id="scanner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-32 border-2 border-green-400/50 rounded-xl" />
              </div>
            </div>
          )}
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
                placeholder="Ej: Macarrones integrales"
                className="w-full px-7 py-5 bg-gray-50 dark:bg-gray-800 border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-700 rounded-[24px] outline-none transition-all font-bold text-gray-800 dark:text-gray-100 placeholder:text-gray-200 dark:placeholder:text-gray-600"
                value={datos.nombre}
                onChange={e => setDatos({ ...datos, nombre: e.target.value })}
              />

            </div>

            {/* Código de Barras y Búsqueda */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Hash size={14} /> Código de Barras
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="841000..."
                  className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                  value={datos.codigoBarras}
                  onChange={e => setDatos({ ...datos, codigoBarras: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => fetchProducto(datos.codigoBarras)}
                  disabled={buscandoManual || !datos.codigoBarras}
                  className="absolute right-3 top-3 bottom-3 px-5 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 font-bold hover:bg-green-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-30"
                >
                  <Search size={18} />
                  <span>Buscar</span>
                </button>

              </div>
            </div>

            {/* Marca */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Tag size={14} /> Marca
              </label>
              <input
                type="text"
                placeholder="Marca del producto"
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.marca}
                onChange={e => setDatos({ ...datos, marca: e.target.value })}
              />
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Hash size={14} /> Cantidad
              </label>
              <input
                type="number"
                min="1"
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.cantidad}
                onChange={e => setDatos({ ...datos, cantidad: e.target.value })}
              />
            </div>

            {/* Fecha Caducidad */}
            <div className="md:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                <Calendar size={14} /> Fecha de Caducidad
              </label>
              <input
                type="date"
                required
                className="w-full px-7 py-5 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white rounded-[24px] outline-none transition-all font-bold text-gray-800"
                value={datos.fechaCaducidad}
                onChange={e => setDatos({ ...datos, fechaCaducidad: e.target.value })}
              />
            </div>
          </div>

          {/* Botón Final */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[28px] font-black text-xl shadow-2xl shadow-gray-200 dark:shadow-none hover:bg-black dark:hover:bg-gray-100 transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <><Save size={24} /> Registrar en Despensa</>
          </button>

        </form>
      </div>
    </div>
  );
}

export default AñadirProducto;