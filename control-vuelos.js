// =============================================================================
//  🚀  SPACEX FLIGHT CONTROL CENTER
//  Centro de Control de Lanzamientos Espaciales
//
//  Proyecto de Desempeño · SENA Formación Complementaria 3406211
//  Módulo: JavaScript · Unidades 1 a 7
//
//  INSTRUCCIONES PARA EL APRENDIZ:
//  ─────────────────────────────────────────────────────────────────────────────
//  Este archivo está vacío. Tu tarea es implementar todas las funciones
//  necesarias para que la aplicación funcione de acuerdo al enunciado.
//
//  Pasos recomendados:
//    1. Lee el enunciado completo en ENUNCIADO.md
//    2. Abre spacex_control_vuelos.html en el navegador con F12 activo
//    3. Revisa el HTML para conocer los IDs disponibles
//    4. Revisa el CSS para conocer las clases que debes aplicar
//    5. Implementa las secciones de este archivo en orden
//
//  IMPORTANTE: No modifiques spacex_control_vuelos.html ni styles-vuelos.css
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 1 — ALMACÉN DE DATOS
//
//  Declara aquí las variables que guardarán el estado global de la aplicación:
//  la colección de lanzamientos registrados y cualquier variable de control
//  que necesites para el funcionamiento de la interfaz.
//
//  Piensa en qué tipo de estructura de datos es más apropiada para
//  mantener una lista de registros, cada uno con múltiples propiedades.
// ─────────────────────────────────────────────────────────────────────────────
const lanzamientos = [];

let contadorIds = 1;
let filtroActivo = "todos";


// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 2 — FUNCIONES UTILITARIAS
//
//  Funciones de propósito general que pueden reutilizarse en distintas
//  partes del código. Considera qué operaciones se repiten frecuentemente
//  y valdría la pena encapsular como función auxiliar.
//
//  Por ejemplo: generar un identificador único para cada registro,
//  o transformar una fecha al formato que se mostrará en las tarjetas.
// ─────────────────────────────────────────────────────────────────────────────

const generarId = () => {
  const id = `SX-2026-${String(contadorIds).padStart(3, "0")}`;
  contadorIds++;
  return id;
};

const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);

  return nuevaFecha.toLocaleString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const obtenerNombreCohete = (tipo) => {
  const nombres = {
    falcon: "FALCON 9",
    "falcon-heavy": "FALCON HEAVY",
    starship: "STARSHIP"
  };

  return nombres[tipo] || tipo;
};
const limpiarFormulario = () => {
  document.getElementById("form-lanzamiento").reset();
  document.getElementById("input-id-edicion").value = "";

  document.getElementById("btn-registrar").innerHTML =
    "&#9654;&nbsp;REGISTRAR LANZAMIENTO";

  document.getElementById("btn-cancelar-edicion").style.display = "none";
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 3 — RENDERIZADO DE TARJETAS
//
//  Funciones que leen el almacén de datos y convierten cada lanzamiento
//  en un elemento HTML visible dentro del contenedor del grid.
//
//  La tarjeta debe construirse como un elemento del DOM con la estructura
//  documentada en el archivo HTML. Revisa los comentarios del grid para
//  conocer exactamente qué clases y atributos debe tener cada parte.
//
//  IDs relevantes del HTML:
//    · #grid-lanzamientos  → contenedor donde se insertan las tarjetas
//    · #estado-vacio       → se muestra cuando no hay tarjetas
//    · #contador-visibles  → muestra cuántas tarjetas son visibles
//    · #contador-lanzamientos → contador de vuelos en la topbar
// ─────────────────────────────────────────────────────────────────────────────

const renderizarLanzamientos = () => {

  const grid = document.getElementById("grid-lanzamientos");

  
  grid.innerHTML = "";

  let visibles = 0;

  const lanzamientosFiltrados = lanzamientos.filter((lanzamiento) => {

    return filtroActivo === "todos"
      ? true
      : lanzamiento.estado === filtroActivo;

  });


  if (lanzamientosFiltrados.length === 0) {

    const estadoVacio = document.createElement("div");

    estadoVacio.classList.add("organism-empty-state");

    estadoVacio.innerHTML = `
      <p class="organism-empty-state__title">
        NO HAY LANZAMIENTOS REGISTRADOS
      </p>

      <p class="organism-empty-state__subtitle">
        Completa el formulario para registrar el primer vuelo
      </p>
    `;

    grid.appendChild(estadoVacio);

  } else {

    lanzamientosFiltrados.forEach((lanzamiento) => {

      visibles++;

    
      const tarjeta = document.createElement("article");

      tarjeta.classList.add(
        "organism-launch-card",
        `organism-launch-card--${lanzamiento.estado}`
      );

      tarjeta.dataset.id = lanzamiento.id;
      tarjeta.dataset.tipo = lanzamiento.tipo;
      tarjeta.dataset.estado = lanzamiento.estado;


     
      const header = document.createElement("div");
      header.classList.add("molecule-card-header");

      const id = document.createElement("span");
      id.classList.add("molecule-card-header__id", "atom-mono");
      id.textContent = lanzamiento.id;

      const badge = document.createElement("span");
      badge.classList.add(
        "atom-badge",
        `atom-badge--${lanzamiento.estado}`
      );

      badge.textContent = lanzamiento.estado.toUpperCase();

      header.appendChild(id);
      header.appendChild(badge);


      
      const body = document.createElement("div");
      body.classList.add("molecule-card-body");

      const nombre = document.createElement("div");
      nombre.classList.add("molecule-card-body__name");
      nombre.textContent = lanzamiento.nombre;

      const tipo = document.createElement("div");
      tipo.classList.add("molecule-card-body__type");
      tipo.textContent = obtenerNombreCohete(lanzamiento.tipo);

      const objetivo = document.createElement("div");
      objetivo.classList.add("molecule-card-body__objective");
      objetivo.textContent = lanzamiento.objetivo;

      const fecha = document.createElement("div");
      fecha.classList.add(
        "molecule-card-body__date",
        "atom-mono"
      );

      fecha.textContent = formatearFecha(lanzamiento.fecha);

      body.appendChild(nombre);
      body.appendChild(tipo);
      body.appendChild(objetivo);
      body.appendChild(fecha);


      
      const footer = document.createElement("div");
      footer.classList.add("molecule-card-footer");

      const btnEditar = document.createElement("button");

      btnEditar.classList.add(
        "atom-btn",
        "atom-btn--secondary",
        "atom-btn--sm"
      );

      btnEditar.textContent = "EDITAR";

      btnEditar.addEventListener("click", () => {
        cargarModoEdicion(lanzamiento.id);
      });


      const btnCancelar = document.createElement("button");

      btnCancelar.classList.add(
        "atom-btn",
        "atom-btn--danger",
        "atom-btn--sm"
      );

      btnCancelar.textContent = "CANCELAR";

      btnCancelar.addEventListener("click", () => {
        cancelarLanzamiento(lanzamiento.id);
      });


      if (lanzamiento.estado !== "pendiente") {
        btnEditar.disabled = true;
        btnCancelar.disabled = true;
      }

      footer.appendChild(btnEditar);
      footer.appendChild(btnCancelar);


      
      tarjeta.appendChild(header);
      tarjeta.appendChild(body);
      tarjeta.appendChild(footer);


    
      activarEventosHover(tarjeta);


      grid.appendChild(tarjeta);

    });

  }


  
  document.getElementById(
    "contador-visibles"
  ).textContent = `${visibles} REGISTROS`;

  document.getElementById(
    "contador-lanzamientos"
  ).textContent = lanzamientos.length;

};

// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 4 — ANIMACIONES DE TARJETAS (HOVER)
//
//  Cada tarjeta creada debe escuchar eventos del cursor y responder
//  aplicando o removiendo la clase CSS que activa la animación.
//
//  La clase de activación está definida en el archivo de estilos.
//  El CSS ya tiene la transición configurada para entrada y salida.
//
//  Eventos que debes capturar en cada tarjeta:
//    · mouseover  → activar el estado de hover
//    · mouseout   → desactivar el estado de hover
// ─────────────────────────────────────────────────────────────────────────────

const activarEventosHover = (tarjeta) => {
  tarjeta.addEventListener("mouseover", () => {
    tarjeta.classList.add("is-hovered");
  });

  tarjeta.addEventListener("mouseout", () => {
    tarjeta.classList.remove("is-hovered");
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 5 — FORMULARIO: REGISTRO Y EDICIÓN
//
//  Función que responde al evento de envío del formulario.
//  Debe leer el valor de cada campo, verificar que no estén vacíos,
//  construir el objeto del lanzamiento y añadirlo al almacén.
//  Si el campo oculto de edición contiene un ID, debe actualizar el
//  registro existente en lugar de crear uno nuevo.
//
//  IDs relevantes del HTML:
//    · #form-lanzamiento        → el elemento <form>
//    · #input-nombre-serie      → campo texto nombre
//    · #select-tipo-cohete      → campo selección tipo
//    · #input-fecha-lanzamiento → campo fecha y hora
//    · #input-objetivo-mision   → campo texto objetivo
//    · #input-id-edicion        → campo oculto con el ID en modo edición
//    · #btn-registrar           → botón principal del formulario
//    · #btn-cancelar-edicion    → botón para salir del modo edición
// ─────────────────────────────────────────────────────────────────────────────

const manejarFormulario = (evento) => {
  evento.preventDefault();

  try {
    const nombre = document
      .getElementById("input-nombre-serie")
      .value
      .trim();

    const tipo = document
      .getElementById("select-tipo-cohete")
      .value
      .trim();

    const fecha = document
      .getElementById("input-fecha-lanzamiento")
      .value
      .trim();

    const objetivo = document
      .getElementById("input-objetivo-mision")
      .value
      .trim();
     const idEdicion = document
      .getElementById("input-id-edicion")
      .value;

    if (!nombre || !tipo || !fecha || !objetivo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (idEdicion) {
      const lanzamiento = lanzamientos.find(
        (item) => item.id === idEdicion
      );

      if (lanzamiento) {
        lanzamiento.nombre = nombre;
        lanzamiento.tipo = tipo;
        lanzamiento.fecha = fecha;
        lanzamiento.objetivo = objetivo;
      }
      } else {

      const nuevoLanzamiento = {
        id: generarId(),
        nombre,
        tipo,
        fecha,
        objetivo,
        estado: "pendiente"
      };

      lanzamientos.push(nuevoLanzamiento);
    }

    limpiarFormulario();
    renderizarLanzamientos();
    actualizarEstadisticas();

  } catch (error) {
    console.error(error);
    alert("Ocurrió un error al registrar el lanzamiento.");
  }
};
// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 6 — CAMBIOS DE ESTADO
//
//  Funciones que modifican un lanzamiento existente:
//    · Modo edición: cargar los datos del registro en el formulario
//    · Cancelación: cambiar el estado del registro a "cancelado"
//
//  Las tarjetas tienen botones con los atributos data-id y data-action.
//  Puedes usar estos atributos para saber qué registro modificar y
//  qué acción ejecutar cuando el usuario hace clic.
// ─────────────────────────────────────────────────────────────────────────────

const cargarModoEdicion = (id) => {
  const lanzamiento = lanzamientos.find((item) => item.id === id);

  if (!lanzamiento || lanzamiento.estado !== "pendiente") {
    return;
  }

  document.getElementById("input-nombre-serie").value =
    lanzamiento.nombre;

  document.getElementById("select-tipo-cohete").value =
    lanzamiento.tipo;

  document.getElementById("input-fecha-lanzamiento").value =
    lanzamiento.fecha;

  document.getElementById("input-objetivo-mision").value =
    lanzamiento.objetivo;

  document.getElementById("input-id-edicion").value =
    lanzamiento.id;

  document.getElementById("btn-registrar").innerHTML =
    "&#9998;&nbsp;GUARDAR CAMBIOS";

  document.getElementById("btn-cancelar-edicion").style.display =
    "block";
};
const cancelarLanzamiento = (id) => {
  const lanzamiento = lanzamientos.find((item) => item.id === id);

  if (!lanzamiento || lanzamiento.estado !== "pendiente") {
    return;
  }

  lanzamiento.estado = "cancelado";

  renderizarLanzamientos();
  actualizarEstadisticas();
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 7 — FILTRADO POR ESTADO
//
//  Funciones que muestran u ocultan tarjetas según el filtro activo.
//  Al aplicar un filtro, solo deben verse las tarjetas que coincidan
//  con el estado seleccionado. El botón activo debe marcarse visualmente.
//
//  IDs relevantes del HTML:
//    · #grupo-filtros  → contenedor de los botones de filtro
//
//  Atributo en los botones de filtro: data-filter
//  Valores posibles: "todos" · "pendiente" · "lanzado" · "cancelado"
//
//  Clase CSS del botón activo: atom-btn--filter-active
// ─────────────────────────────────────────────────────────────────────────────
const aplicarFiltro = (estado) => {
  filtroActivo = estado;

  const botones = document.querySelectorAll(
    ".atom-btn--filter"
  );

  botones.forEach((boton) => {
    boton.classList.remove("atom-btn--filter-active");

    if (boton.dataset.filter === estado) {
      boton.classList.add("atom-btn--filter-active");
    }
  });

  renderizarLanzamientos();
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 8 — RELOJ Y MONITOREO AUTOMÁTICO
//
//  Un intervalo de tiempo que se ejecuta cada segundo y realiza dos tareas:
//
//    Tarea A: Reloj en tiempo real
//      Obtener la hora actual en UTC y mostrarla en el elemento del reloj
//      usando el formato HH:MM:SSZ (horas, minutos, segundos + letra Z).
//
//    Tarea B: Detección automática de lanzamientos
//      Recorrer el almacén y buscar registros con estado "pendiente"
//      cuya fecha programada ya se haya alcanzado o superado.
//      Cuando se detecte uno, cambiar su estado a "lanzado" y
//      actualizar la vista para reflejar el cambio.
//
//  ID relevante del HTML:
//    · #reloj-principal → elemento donde se despliega la hora
// ─────────────────────────────────────────────────────────────────────────────

const actualizarReloj = () => {

  const ahora = new Date();

  const horas = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const segundos = String(ahora.getSeconds()).padStart(2, "0");

  const horaLocal = `${horas}:${minutos}:${segundos}`;

  document.getElementById("reloj-principal").textContent =
    horaLocal;
};

const monitorearLanzamientos = () => {
  const ahora = new Date();

  lanzamientos.forEach((lanzamiento) => {

    if (
      lanzamiento.estado === "pendiente" &&
      new Date(lanzamiento.fecha) <= ahora
    ) {
      lanzamiento.estado = "lanzado";
    }

  });
  renderizarLanzamientos();
  actualizarEstadisticas();
};



// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 9 — ESTADÍSTICAS
//
//  Función que recorre el almacén, cuenta los registros por estado
//  y actualiza los elementos del panel de estadísticas con los totales.
//
//  IDs relevantes del HTML:
//    · #stat-pendientes  → contador de lanzamientos pendientes
//    · #stat-lanzados    → contador de lanzamientos ejecutados
//    · #stat-cancelados  → contador de lanzamientos cancelados
//    · #stat-total       → total de registros en el sistema
// ─────────────────────────────────────────────────────────────────────────────

const actualizarEstadisticas = () => {

  const pendientes = lanzamientos.filter(
    (item) => item.estado === "pendiente"
  ).length;

  const lanzados = lanzamientos.filter(
    (item) => item.estado === "lanzado"
  ).length;

  const cancelados = lanzamientos.filter(
    (item) => item.estado === "cancelado"
  ).length;

  document.getElementById("stat-pendientes").textContent =
    pendientes;

  document.getElementById("stat-lanzados").textContent =
    lanzados;

  document.getElementById("stat-cancelados").textContent =
    cancelados;

  document.getElementById("stat-total").textContent =
    lanzamientos.length;
};

// ─────────────────────────────────────────────────────────────────────────────
//  SECCIÓN 10 — INICIALIZACIÓN
//
//  Punto de arranque de la aplicación. Todo el código que necesita
//  interactuar con elementos del DOM debe ejecutarse aquí, dentro de
//  un mecanismo que garantice que la página ya terminó de cargar.
//
//  Desde aquí debes:
//    · Conectar los eventos del formulario y los botones
//    · Iniciar el intervalo del reloj y el monitor automático
//    · Hacer el primer renderizado y actualizar las estadísticas
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

 
  document
    .getElementById("form-lanzamiento")
    .addEventListener("submit", manejarFormulario);


  
  document
    .getElementById("btn-cancelar-edicion")
    .addEventListener("click", limpiarFormulario);

  document.getElementById(
    "btn-cancelar-edicion"
  ).style.display = "none";


  
  const botonesFiltro = document.querySelectorAll(
    ".atom-btn--filter"
  );

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      aplicarFiltro(boton.dataset.filter);
    });
  });
 
  actualizarReloj();
  setInterval(actualizarReloj, 1000);


  
  setInterval(monitorearLanzamientos, 1000);


 
  renderizarLanzamientos();
  actualizarEstadisticas();

});