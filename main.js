/* ===== Sarwiri Tours - JavaScript simple ===== */

// ---------------------------------------------------------
// 1. DATOS (aquí van los tours y el número de WhatsApp)
// ---------------------------------------------------------

// Número de WhatsApp con código de país, sin + ni espacios (ej: 56912345678)
const NUMERO_WHATSAPP = "56900000000";

// Lista de tours. Puedes agregar, quitar o editar.
// En "imagen" pon la dirección de tu imagen (ej: "img/sandboard.jpg")
const tours = [
  {
    id: 1,
    nombre: "Sandboard en Cerro Dragón",
    categoria: "Aventura",
    duracion: "3 horas",
    precio: 25000,
    maxPersonas: 10,
    imagen: "img/tour1.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Desliza por las dunas del Cerro Dragón con vista a la ciudad y al mar. Incluye tabla e instructor."
  },
  {
    id: 2,
    nombre: "Oficina Salitrera Humberstone",
    categoria: "Cultura",
    duracion: "5 horas",
    precio: 30000,
    maxPersonas: 15,
    imagen: "img/tour2.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Recorre el antiguo pueblo salitrero, Patrimonio de la Humanidad, y conoce la historia del salitre."
  },
  {
    id: 3,
    nombre: "Parapente en Alto Hospicio",
    categoria: "Aventura",
    duracion: "2 horas",
    precio: 60000,
    maxPersonas: 4,
    imagen: "img/tour3.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Vuela sobre la costa de Iquique en un vuelo tándem acompañado de un piloto profesional."
  },
  {
    id: 4,
    nombre: "Oasis de Pica y Matilla",
    categoria: "Cultura",
    duracion: "8 horas",
    precio: 40000,
    maxPersonas: 12,
    imagen: "img/tour4.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Visita el oasis de Pica, sus piscinas naturales y el pueblo de Matilla. Prueba los frutos de la zona."
  },
  {
    id: 5,
    nombre: "City Tour Histórico de Iquique",
    categoria: "Cultura",
    duracion: "3 horas",
    precio: 15000,
    maxPersonas: 20,
    imagen: "img/tour5.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Paseo por la Plaza Prat, el Teatro Municipal, la calle Baquedano y los edificios históricos."
  },
  {
    id: 6,
    nombre: "Kayak en Playa Cavancha",
    categoria: "Aventura",
    duracion: "2 horas",
    precio: 20000,
    maxPersonas: 8,
    imagen: "img/tour6.jpg",              // <-- TU IMAGEN AQUÍ
    descripcion: "Navega por la costa de Iquique en kayak y observa lobos marinos y aves."
  }
];

// ---------------------------------------------------------
// 2. FUNCIONES ÚTILES
// ---------------------------------------------------------

// Pone puntos a los precios: 25000 -> $25.000
function formatoPrecio(numero) {
  return "$" + numero.toLocaleString("es-CL");
}

// Quita tildes y mayúsculas para buscar mejor
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Devuelve la clase de color de la etiqueta según la categoría
function claseBadge(categoria) {
  return categoria === "Aventura" ? "badge-aventura" : "badge-cultura";
}

// Fecha de hoy en formato AAAA-MM-DD (para bloquear fechas pasadas)
function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// Lee un dato de la URL (ej: tour.html?id=2 -> obtenerParametro("id") = "2")
function obtenerParametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

// Busca un tour por su id
function buscarTour(id) {
  return tours.find(function (t) {
    return t.id === Number(id);
  });
}

// ---------------------------------------------------------
// 3. ENLACES DE WHATSAPP (todas las páginas)
// ---------------------------------------------------------
document.querySelectorAll(".link-whatsapp").forEach(function (enlace) {
  enlace.href = "https://wa.me/" + NUMERO_WHATSAPP +
    "?text=" + encodeURIComponent("Hola! Quiero información sobre los tours de Sarwiri Tours.");
  enlace.target = "_blank";
});

// ---------------------------------------------------------
// 4. PÁGINA PRINCIPAL (index.html): catálogo + buscador
// ---------------------------------------------------------
const listaTours = document.getElementById("lista-tours");

if (listaTours) {
  const formBuscador = document.getElementById("form-buscador");
  const inputPalabra = document.getElementById("palabra");
  const inputFecha = document.getElementById("fecha");
  const inputPersonas = document.getElementById("personas");
  const sinResultados = document.getElementById("sin-resultados");

  inputFecha.min = fechaHoy();

  // Dibuja las tarjetas de los tours recibidos
  function mostrarTours(lista) {
    listaTours.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach(function (t) {
      // Pasamos fecha y personas al detalle por la URL
      let enlace = "tour.html?id=" + t.id;
      if (inputFecha.value) enlace += "&fecha=" + inputFecha.value;
      if (inputPersonas.value) enlace += "&personas=" + inputPersonas.value;

      listaTours.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100">
            <img src="${t.imagen}" class="card-img-top" alt="${t.nombre}">
            <div class="card-body d-flex flex-column">
              <span class="badge ${claseBadge(t.categoria)} align-self-start mb-2">${t.categoria}</span>
              <h5 class="card-title">${t.nombre}</h5>
              <p class="mb-1">Duración: ${t.duracion}</p>
              <p class="precio">Desde ${formatoPrecio(t.precio)} por persona</p>
              <a href="${enlace}" class="btn btn-marca mt-auto">Ver detalle</a>
            </div>
          </div>
        </div>`;
    });
  }

  // Filtra según lo que escribió el usuario
  function filtrarTours() {
    const palabra = normalizar(inputPalabra.value.trim());
    const personas = Number(inputPersonas.value) || 0;

    const resultado = tours.filter(function (t) {
      const texto = normalizar(t.nombre + " " + t.categoria + " " + t.descripcion);
      const coincidePalabra = texto.includes(palabra);
      const cabenPersonas = personas === 0 || personas <= t.maxPersonas;
      return coincidePalabra && cabenPersonas;
    });

    mostrarTours(resultado);
  }

  formBuscador.addEventListener("submit", function (e) {
    e.preventDefault();
    filtrarTours();
  });

  document.getElementById("btn-limpiar").addEventListener("click", function () {
    formBuscador.reset();
    mostrarTours(tours);
  });

  mostrarTours(tours); // al cargar, mostrar todos
}

// ---------------------------------------------------------
// 5. DETALLE DE UN TOUR (tour.html)
// ---------------------------------------------------------
const detalle = document.getElementById("detalle-tour");

if (detalle) {
  const tour = buscarTour(obtenerParametro("id"));

  if (!tour) {
    detalle.innerHTML = '<div class="alert alert-warning">Tour no encontrado. <a href="index.html">Volver al catálogo</a></div>';
  } else {
    detalle.innerHTML = `
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <img src="${tour.imagen}" class="imagen-detalle" alt="${tour.nombre}">
        </div>
        <div class="col-12 col-md-6">
          <span class="badge ${claseBadge(tour.categoria)} mb-2">${tour.categoria}</span>
          <h1 class="h2">${tour.nombre}</h1>
          <p class="mb-1">Duración: ${tour.duracion}</p>
          <p class="precio fs-5">Desde ${formatoPrecio(tour.precio)} por persona</p>
          <p>${tour.descripcion}</p>

          <div class="row g-2 mb-3">
            <div class="col-7">
              <label for="fecha" class="form-label">Fecha</label>
              <input type="date" id="fecha" class="form-control">
            </div>
            <div class="col-5">
              <label for="personas" class="form-label">Personas (máx. ${tour.maxPersonas})</label>
              <input type="number" id="personas" class="form-control" min="1" max="${tour.maxPersonas}" value="1">
            </div>
          </div>
          <div id="aviso" class="text-danger mb-2"></div>
          <button id="btn-reservar" class="btn btn-marca">Reservar este tour</button>
        </div>
      </div>`;

    const inputFecha = document.getElementById("fecha");
    const inputPersonas = document.getElementById("personas");
    inputFecha.min = fechaHoy();
    if (obtenerParametro("fecha")) inputFecha.value = obtenerParametro("fecha");
    if (obtenerParametro("personas")) inputPersonas.value = obtenerParametro("personas");

    document.getElementById("btn-reservar").addEventListener("click", function () {
      const aviso = document.getElementById("aviso");
      const personas = Number(inputPersonas.value);

      if (!inputFecha.value) {
        aviso.textContent = "Por favor elige una fecha.";
      } else if (inputFecha.value < fechaHoy()) {
        aviso.textContent = "La fecha no puede ser anterior a hoy.";
      } else if (personas < 1 || personas > tour.maxPersonas) {
        aviso.textContent = "La cantidad de personas debe ser entre 1 y " + tour.maxPersonas + ".";
      } else {
        window.location.href = "reserva.html?id=" + tour.id +
          "&fecha=" + inputFecha.value + "&personas=" + personas;
      }
    });
  }
}

// ---------------------------------------------------------
// 6. FORMULARIO DE RESERVA (reserva.html) - solo maqueta
// ---------------------------------------------------------
const formReserva = document.getElementById("form-reserva");

if (formReserva) {
  const tour = buscarTour(obtenerParametro("id")) || tours[0]; // si no hay id, usa el primero
  const personas = obtenerParametro("personas") || 1;
  const fecha = obtenerParametro("fecha");

  let textoResumen = tour.nombre + " - " + tour.duracion + " - " + personas +
    (Number(personas) === 1 ? " Persona" : " Personas");
  if (fecha) textoResumen += " - " + fecha;
  document.getElementById("resumen").textContent = textoResumen;

  formReserva.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formReserva.checkValidity()) {
      // Aún no hay Backend: solo pasamos a la página de confirmación
      window.location.href = "confirmacion.html";
    } else {
      formReserva.classList.add("was-validated");
    }
  });
}
