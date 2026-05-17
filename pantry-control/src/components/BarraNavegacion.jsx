import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserPlus, UserCircle, Sprout } from "lucide-react";
// Porno y putas? (jose elimino o esto o lo dejo como huellita del live share kjasjkdashjkdajosdiasojdoisajdoisa)
function BarraNavegacion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const esAdmin = localStorage.getItem("esAdministrador") === "true";

  function cerrarSesion() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav className="w-full border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full px-8 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <Sprout
            size={26}
            className="text-emerald-500 transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Tu despensa
          </span>
        </Link>
        {token && (
          <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-500 ">
            <Link
              to="/despensa"
              className="hover:text-emerald-600 transition-colors after:bg-emerald-500 hover:after:w-full"
            >
              Inventario
            </Link>
            <Link
              to="/recetas"
              className="hover:text-emerald-600 transition-colors after:bg-emerald-500 hover:after:w-full"
            >
              Recetas
            </Link>
            {esAdmin && (
              <Link
                to="/admin"
                className="hover:text-rose-500"
              >
                Admin
              </Link>
            )}
          </div>
        )}
        <div className="flex items-center gap-6">
          {token ? (
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-all group"
            >
              <span className="text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100">
                Salir
              </span>
              <LogOut size={24} strokeWidth={1.5} />
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <UserCircle size={28} strokeWidth={1.5} />
              </Link>
              <Link
                to="/registro"
                className="text-slate-400 hover:text-emerald-500 transition-colors border-l pl-5 border-slate-200"
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
