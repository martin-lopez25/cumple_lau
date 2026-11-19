// Carta
const regalo = document.querySelector(".regalo");
const regalos = document.querySelector(".regalos");
const modalCarta = document.getElementById("modalCarta");
const portadaTarjeta = modalCarta.querySelector(".tarjeta-portada");
const mensajeTarjeta = document.getElementById("mensajeTarjeta");
const cerrarTarjeta = modalCarta.querySelector(".cerrar-tarjeta");
const fondoTarjeta = modalCarta.querySelector(".fondo-dorado");
let detenerFondoTarjeta;

function mostrarTarjeta() {
  modalCarta.inert = false;
  modalCarta.classList.add("activo");
  detenerFondoTarjeta ??= animarFondoDorado(fondoTarjeta);
  portadaTarjeta.focus();
}

function cambiarTarjeta(abierta) {
  portadaTarjeta.setAttribute("aria-expanded", String(abierta));
  portadaTarjeta.setAttribute("aria-label", abierta ? "Plegar tarjeta" : "Abrir tarjeta");
  mensajeTarjeta.inert = !abierta;
}

function ocultarTarjeta() {
  modalCarta.inert = true;
  modalCarta.classList.remove("activo");
  detenerFondoTarjeta?.();
  detenerFondoTarjeta = undefined;
  cambiarTarjeta(false);
}

regalo.addEventListener("click", mostrarTarjeta);
regalos.addEventListener("click", mostrarTarjeta);
portadaTarjeta.addEventListener("click", () => {
  cambiarTarjeta(portadaTarjeta.getAttribute("aria-expanded") === "false");
});
cerrarTarjeta.addEventListener("click", ocultarTarjeta);
modalCarta.addEventListener("click", (event) => {
  if (event.target === modalCarta) ocultarTarjeta();
});
modalCarta.addEventListener("keydown", (event) => {
  if (event.key === "Escape") ocultarTarjeta();
});

// Todo Oscuro + Soplido + Canción
const overlay = document.querySelector(".overlay");
const soplido = document.getElementById("soplido");
const cancion = document.getElementById("cancion");
const llama = document.querySelector(".llama");
const bordeGlobos = document.querySelector(".borde-globos");
const fondoSoplido = overlay.querySelector(".fondo-dorado");
const animacionSoplido = document.querySelector(".animacion-soplido");
const duracionSoplido = 1600;

function animarFondoDorado(lienzo) {
  const contexto = lienzo.getContext("2d");
  if (!contexto) return () => {};

  lienzo.hidden = false;
  let fotograma;

  function ajustarFondo() {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (lienzo.width !== ancho || lienzo.height !== alto) {
      lienzo.width = ancho;
      lienzo.height = alto;
    }
  }

  ajustarFondo();
  const particulas = Array.from({ length: 200 }, () => ({
    x: Math.random() * lienzo.width,
    y: Math.random() * lienzo.height,
    radio: Math.random() * 2 + 1,
    velocidad: Math.random() * 0.7 + 0.3,
    opacidad: Math.random() * 0.5 + 0.5,
  }));

  function dibujarFondo() {
    ajustarFondo();
    contexto.clearRect(0, 0, lienzo.width, lienzo.height);
    for (const particula of particulas) {
      contexto.beginPath();
      contexto.arc(particula.x, particula.y, particula.radio, 0, 2 * Math.PI);
      contexto.fillStyle = `rgba(255,215,0,${particula.opacidad})`;
      contexto.fill();

      particula.y += particula.velocidad;
      if (particula.y > lienzo.height || particula.x > lienzo.width) {
        particula.y = -10;
        particula.x = Math.random() * lienzo.width;
      }
    }
    fotograma = requestAnimationFrame(dibujarFondo);
  }

  dibujarFondo();
  return () => {
    cancelAnimationFrame(fotograma);
    lienzo.hidden = true;
  };
}

async function soplarVela() {
  llama.style.pointerEvents = "none";
  soplido.currentTime = 0;
  soplido.play().catch(() => {});

  llama.style.animation = "apagar 0.5s forwards"; // forwards -> Ultimo frame (to)

  animacionSoplido.src = "recursos/soplar.gif";
  const gifDisponible = await animacionSoplido.decode().then(() => true, () => false);
  if (gifDisponible) {
    overlay.classList.add("soplando");
    animacionSoplido.hidden = false;
    const detenerFondoSoplido = animarFondoDorado(fondoSoplido);
    await new Promise((resolve) => setTimeout(resolve, duracionSoplido));
    animacionSoplido.hidden = true;
    detenerFondoSoplido();
  }

  overlay.classList.add("hidden");
  bordeGlobos.classList.add("visible");
  cancion.currentTime = 0;
  cancion.play().catch(() => {});
}

llama.addEventListener("click", soplarVela, { once: true });
