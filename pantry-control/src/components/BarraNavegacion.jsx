import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserPlus, UserCircle, Sprout } from "lucide-react";
// componente
function BarraNavegacion() {
  const navigate = useNavigate();
  //obtenemos token
  const token = localStorage.getItem("token");
  const esAdmin = localStorage.getItem("esAdministrador") === "true";

  //limpiamos token 
  function cerrarSesion() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    //barra de navegacion de la pagina
    <nav className="w-full border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="w-full px-8 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Sprout
            size={26}
            className="text-emerald-600"
          />
          <span className="text-xl font-bold tracking-tight text-emerald-950">
            Tu despensa
          </span>
        </Link>
        {token && (
          <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-600">
            <Link
              to="/despensa"
              className="hover:text-emerald-600 transition-colors"
            >
              Inventario
            </Link>
            <Link
              to="/recetas"
              className="hover:text-emerald-600 transition-colors"
            >
              Recetas
            </Link>
            {/* En caso de ser admin */}
            {esAdmin && (
              <Link
                to="/admin"
                className="text-rose-500 hover:text-rose-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        )}
        {/* si tiene token se muestra la opcionde de cerrar sesion */}
        <div className="flex items-center gap-6">
          {token ? (
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors"
            >
              <span className="text-xs font-semibold uppercase tracking-widest">
                Salir
              </span>
              <LogOut size={24} strokeWidth={1.5} />
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <UserCircle size={28} strokeWidth={1.5} />
              </Link>
              <Link
                to="/registro"
                className="text-slate-500 hover:text-emerald-600 transition-colors border-l pl-5 border-emerald-100"
              >
                <UserPlus size={28} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default BarraNavegacion;
