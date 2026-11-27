/* ===== AVISO DEL TUTORIAL DE RECARGA (27-nov-2026) =====
   Pone el aviso "¿Cómo pago? · Mira el tutorial" en:
   - Página principal: arriba de los botones JUGAR AHORA / MARKETPLACE
   - Marketplace: debajo del título MARKETPLACE
   - Mi Stud: encima de la palabra RECARGA
   Al tocarlo, abre el video en una ventanita. El video solo carga al abrirla.
   Los valores de abajo se pueden ajustar a mano. */

const AJUSTES_TUTORIAL = {
    video: "/BDG_Tutorial_Recarga_Gloria.mp4",
    titulo: "¿Cómo pago?",
    subtitulo: "Mira el tutorial de recarga · 29 s",
    titulo_ventana: "Cómo recargar Gloria",
    color_fondo: "#5a0f1c",        // vino tinto
    color_borde: "#d4af37",        // dorado
    color_titulo: "#FFD65A",       // amarillo
    color_subtitulo: "#ffffff",    // blanco
    ancho_maximo_aviso: 300,       // px
    ancho_ventana: 320,            // px (alto sale solo, vertical 9:16)
    separacion: 14                 // px arriba y abajo del aviso
};

(function () {
    const A = AJUSTES_TUTORIAL;

    const estilo = document.createElement("style");
    estilo.textContent = `
    .aviso-tutorial { display:flex; align-items:center; gap:12px; width:100%; max-width:${A.ancho_maximo_aviso}px; margin:${A.separacion}px auto; padding:10px 14px; background:${A.color_fondo}; border:2px solid ${A.color_borde}; border-radius:12px; cursor:pointer; text-align:left; font-family:'Montserrat',sans-serif; box-sizing:border-box; }
    .aviso-tutorial:hover { filter:brightness(1.12); }
    .aviso-tutorial .icono { width:42px; height:42px; flex:none; border-radius:50%; background:${A.color_borde}; display:flex; align-items:center; justify-content:center; }
    .aviso-tutorial .icono svg { width:18px; height:18px; margin-left:3px; }
    .aviso-tutorial b { display:block; color:${A.color_titulo}; font-size:16px; font-weight:800; }
    .aviso-tutorial small { display:block; color:${A.color_subtitulo}; font-size:13px; font-weight:500; }
    .ventana-tutorial { position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,.8); display:none; align-items:center; justify-content:center; padding:16px; }
    .ventana-tutorial.abierta { display:flex; }
    .ventana-tutorial .caja { position:relative; width:100%; max-width:${A.ancho_ventana}px; background:#0b0f19; border:2px solid ${A.color_borde}; border-radius:14px; padding:10px; box-sizing:border-box; }
    .ventana-tutorial video { display:block; width:100%; max-height:78vh; aspect-ratio:9/16; background:#000; border-radius:8px; }
    .ventana-tutorial .cerrar { position:absolute; top:-14px; right:-14px; width:32px; height:32px; border-radius:50%; border:none; background:${A.color_borde}; color:#1a1205; font-size:18px; font-weight:800; cursor:pointer; }
    .ventana-tutorial p { margin:8px 0 2px; text-align:center; color:${A.color_titulo}; font-family:'Montserrat',sans-serif; font-weight:700; font-size:14px; }`;
    document.head.appendChild(estilo);

    // ventanita (una sola para toda la página)
    const ventana = document.createElement("div");
    ventana.className = "ventana-tutorial";
    ventana.innerHTML = `<div class="caja"><button class="cerrar" type="button" aria-label="Cerrar">✕</button>
        <video controls playsinline preload="none"></video><p>${A.titulo_ventana}</p></div>`;
    document.body.appendChild(ventana);
    const video = ventana.querySelector("video");

    function abrir() {
        if (!video.src) video.src = A.video;   // carga solo al abrir
        ventana.classList.add("abierta");
        video.currentTime = 0;
        video.play().catch(() => {});
    }
    function cerrar() {
        video.pause();
        ventana.classList.remove("abierta");
    }
    ventana.querySelector(".cerrar").addEventListener("click", cerrar);
    ventana.addEventListener("click", (e) => { if (e.target === ventana) cerrar(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });

    function crearAviso() {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "aviso-tutorial";
        b.innerHTML = `<span class="icono"><svg viewBox="0 0 24 24"><path d="M6 4 L20 12 L6 20 Z" fill="#1a1205"/></svg></span>
            <span><b>${A.titulo}</b><small>${A.subtitulo}</small></span>`;
        b.addEventListener("click", abrir);
        return b;
    }

    // dónde va el aviso (si el sitio no existe en esa página, se salta)
    const lugares = [
        [".botones-portada", "antes"],      // página principal
        [".pagina > .titulo", "despues"],   // Marketplace
        ["#seccion_fortuna .palabra-recarga", "antes"] // Mi Stud
    ];
    lugares.forEach(([selector, donde]) => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.insertAdjacentElement(donde === "antes" ? "beforebegin" : "afterend", crearAviso());
    });
})();
