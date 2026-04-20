"use strict";

/*HELPERS*/
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* 1. MODO OSCURO */
const THEME_KEY = "amir-theme";
const html = document.documentElement;

function setTheme(t) {
  html.setAttribute("data-theme", t);
  const btn = $("#themeToggle");
  if (btn) {
    btn.innerHTML =
      t === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    btn.setAttribute(
      "aria-label",
      t === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
    );
  }
  localStorage.setItem(THEME_KEY, t);
}

//dark por defecto
setTheme(localStorage.getItem(THEME_KEY) || "dark");

$("#themeToggle") &&
  $("#themeToggle").addEventListener("click", () => {
    setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

/*NAVEGACIÓN*/
const SECTIONS = ["hero", "projects", "about", "contact"];
let currentSection = "hero";

function showSection(id) {
  if (!SECTIONS.includes(id)) return;

  // 1. Ir al tope PRIMERO, antes de cambiar el contenido
  window.scrollTo(0, 0);

  // 2. Ocultar TODAS las secciones
  SECTIONS.forEach((sid) => {
    const s = $(`#${sid}`);
    if (s) s.classList.remove("active");
  });

  currentSection = id;

  // 3. Mostrar la nueva
  const next = $(`#${id}`);
  if (!next) return;
  next.classList.add("active");

  // 4. Actualizar links activos
  $$("[data-nav]").forEach((el) => {
    el.classList.toggle("active", el.dataset.nav === id);
  });

  // 5. Cerrar menú mobile
  closeMobileMenu();

  // 6. Animar barras de skill si es "about"
  if (id === "about") setTimeout(animateSkills, 200);
}

// Inicializar: mostrar solo hero al cargar
SECTIONS.forEach((id) => {
  const sec = $(`#${id}`);
  if (!sec) return;
  sec.classList.remove("active");
});
// Mostrar hero
const heroSec = $("#hero");
if (heroSec) {
  heroSec.classList.add("active");
  animateSection(heroSec);
}

// Escuchar clicks en cualquier [data-nav]
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-nav]");
  if (!trigger) return;
  e.preventDefault();
  showSection(trigger.dataset.nav);
});

/*HAMBURGUESA (mobile)*/
const burger = $("#hamburger");
const mMenu = $("#mobileMenu");

function closeMobileMenu() {
  if (!burger || !mMenu) return;
  burger.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
  mMenu.classList.remove("open");
  mMenu.setAttribute("aria-hidden", "true");
}

burger &&
  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    mMenu.classList.toggle("open", open);
    mMenu.setAttribute("aria-hidden", String(!open));
  });

document.addEventListener("click", (e) => {
  if (
    mMenu &&
    mMenu.classList.contains("open") &&
    !mMenu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

/* ANIMACIONES DE ENTRADA */
function animateSection(sec) {
  if (!sec) return;
  // Mostrar todo de inmediato — el fade de la sección ya hace la transición
  $$(".anim", sec).forEach((el) => el.classList.add("show"));
}

/* BARRAS DE HABILIDAD */
let skillsDone = false;

function animateSkills() {
  if (skillsDone) return;
  $$(".sk-fill").forEach((bar) => {
    const pct = parseInt(bar.dataset.pct, 10) || 0;
    bar.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.width = pct + "%";
      }),
    );
  });
  skillsDone = true;
}

/* TYPEWRITER en el prompt del hero*/
const CMD_TEXT = "whoami";
const typedEl = $("#typedText");

(function typewriter() {
  if (!typedEl) return;
  typedEl.textContent = "";
  let i = 0;
  setTimeout(() => {
    const iv = setInterval(() => {
      if (i < CMD_TEXT.length) {
        typedEl.textContent += CMD_TEXT[i++];
      } else clearInterval(iv);
    }, 95);
  }, 700);
})();

/* AÑO DINÁMICO EN EL FOOTER */
const yrEl = $("#yr");
if (yrEl) yrEl.textContent = new Date().getFullYear();

/* 8. NAVBAR — sombra al hacer scroll */
const navbar = $("#navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar && navbar.classList.toggle("scrolled", window.scrollY > 20);
  },
  { passive: true },
);
