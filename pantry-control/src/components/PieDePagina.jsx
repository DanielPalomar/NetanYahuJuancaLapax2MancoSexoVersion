/**
 * FOOTER "LAPA'S STUDIO" 
 */

//iconos de la biblioteca react icons
//https://react-icons.github.io/react-icons/search/#q=instagram
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";


//conseguimos la fecha para el pie de pagina 
function PieDePagina() {
  let anio = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-emerald-50 py-6 mt-auto">
      <div className="max-w mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Marca mega molona */}
        <span className="text-sm font-bold tracking-[0.2em] text-emerald-700">
          MarkFoods'Study
        </span>

        <p className="text-[10px] uppercase tracking-wider text-slate-400">
          © {anio} — Todos los derechos reservados.
        </p>

        {/* Enlaces  */}
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com"
            className="text-slate-300 hover:text-emerald-600 transition-all duration-300"
            aria-label="Instagram"
          >
            { /*cada uno vale por 0.25rem así que 24px = 6rem (no entiendoo porque se hace así pero bueno)*/}
            <FaInstagram size={24} />
          </a>
          <a
            href="https://twitter.com"
            className="text-slate-300 hover:text-emerald-600 transition-all duration-300"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </a>

          <a
            href="https://facebook.com"
            className="text-slate-300 hover:text-emerald-600 transition-all duration-300"
            aria-label="Facebook"
          >
            <FaFacebook size={24} />
          </a>
        </div>

      </div>
    </footer>
  );
}
export default PieDePagina;

