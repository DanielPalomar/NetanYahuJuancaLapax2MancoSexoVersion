/**
 * FOOTER "LAPA'S STUDIO" 
 */

function PieDePagina() {
  let anio = new Date().getFullYear();

 return (
    <footer className="bg-[oklch(92.2%_0_0)] border-t border-[oklch(76.8%_0.233_130.85)] py-8 mt-auto rounded-t-lg">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Lado Izquierdo: Marca */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            LAPA'S STUDIO
          </span>
        </div>

        {/* Centro: Copyright */}
        <p className="text-sm text-slate-500 font-medium order-last md:order-none">
          © {anio} — Todos los derechos reservados.
        </p>

        {/* Lado Derecho: Redes Sociales (Ahora dentro del contenedor flex) */}
        <div className="flex items-center gap-6">
          {/* Instagram */}
          <a
            href="#"
            className="text-slate-400 hover:text-pink-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>

          {/* Twitter / X */}
          <a
            href="#"
            className="text-slate-400 hover:text-sky-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24" /* Añadido el viewBox que faltaba */
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
export default PieDePagina;
