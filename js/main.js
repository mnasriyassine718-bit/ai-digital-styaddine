// WhatsApp number: international format, no + or spaces
const WA_NUMBER = "21623308393";
const waLink = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }
});

// Scroll progress + header border
const header = document.querySelector(".site-header");
const bar = document.getElementById("progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  header.classList.toggle("scrolled", scrollY > 10);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const targets = document.querySelectorAll(".section h2, .sub, .about p, .stats div, .card, .steps li, .form, .or");
targets.forEach((el, i) => {
  el.classList.add("rv");
  el.style.setProperty("--d", `${(i % 4) * 0.09}s`);
});

// Count-up numbers
function countUp(el) {
  const end = +el.dataset.count;
  if (reduce) { el.textContent = end; return; }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1400, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const n = en.target.querySelector("[data-count]");
    if (n) countUp(n);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
targets.forEach((el) => io.observe(el));

// Card spotlight following finger / mouse
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// WhatsApp links
document.querySelectorAll("[data-wa]").forEach((a) => {
  a.href = waLink(a.dataset.wa);
  a.target = "_blank";
  a.rel = "noopener";
});

// Contact form -> WhatsApp
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  let msg = `Hello, my name is ${f.get("name")}. I am interested in: ${f.get("service")}.`;
  if (f.get("message")) msg += ` ${f.get("message")}`;
  window.open(waLink(msg), "_blank", "noopener");
});
