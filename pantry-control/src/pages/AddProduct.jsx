import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Camera, ArrowLeft, Package, Tag, Calendar, Hash } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    fecha_caducidad: '',
    cantidad: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de guardado. Aquí iría la llamada a apiServices.addProduct(formData)
    console.log("Producto guardado:", formData);
    setTimeout(() => {
      setLoading(false);
      navigate('/despensa');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Volver a la despensa
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header de la tarjeta */}
          <div className="bg-green-600 p-8 text-white text-center">
            <h2 className="text-3xl font-extrabold mb-2">Añadir Producto</h2>
            <p className="text-green-100">Escanea o introduce los datos manualmente</p>
          </div>

          <div className="p-8">
            {/* Sección de Escáner */}
            <button className="w-full bg-blue-50 text-blue-600 border border-blue-100 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-100 hover:border-blue-200 transition-all mb-8 font-bold shadow-sm group">
              <Camera size={24} className="group-hover:scale-110 transition-transform" /> 
              Escanear Código de Barras
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-sm font-medium">O añade manualmente</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Formulario con Tailwind */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Nombre del producto (ej: Leche)" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-700 font-medium"
                  required 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Marca" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-700 font-medium"
                  value={formData.marca}
                  onChange={(e) => setFormData({...formData, marca: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-700 font-medium"
                    required 
                    value={formData.fecha_caducidad}
                    onChange={(e) => setFormData({...formData, fecha_caducidad: e.target.value})}
                  />
                  <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-400 font-medium rounded">Caducidad</label>
                </div>

                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="number" 
                    placeholder="Cantidad" 
                    min="1"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-700 font-medium"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                  />
                  <label className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-400 font-medium rounded">Cantidad</label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-70"
              >
                {loading ? 'Guardando...' : (
                  <>
                    <Save size={20} /> Guardar en Despensa
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;