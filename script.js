/* THIRSTY — données, menu, carrousel, panier, WhatsApp */
const PHONE = '261388486747';
const DRINKS = [
  { id: 'latte-cannelle', name: 'Latte Cannelle', cat: 'Lattes glacés', price: 11500, img: 'images/latte-cannelle.jpg', alt: 'Latte glacé saupoudré de cannelle', desc: 'Espresso et lait glacés, nuage de cannelle sur les glaçons.' },
  { id: 'latte-velours', name: 'Latte Velours', cat: 'Lattes glacés', price: 10500, img: 'images/latte-velours.jpg', alt: 'Latte glacé en verre côtelé', desc: 'Lait frais et café en deux couches nettes, servi dans un verre côtelé.' },
  { id: 'latte-dore', name: 'Latte Doré', cat: 'Lattes glacés', price: 11000, img: 'images/latte-dore.jpg', alt: 'Latte glacé avec paille en verre', desc: 'Marbrure dorée de café et de lait sur glace, avec sa paille en verre.' },
  { id: 'mocha-swirl', name: 'Mocha Swirl', cat: 'Cafés signature', price: 12000, img: 'images/mocha-swirl.jpg', alt: 'Café glacé avec spirales de chocolat', desc: 'Café glacé crémeux, spirales de sauce chocolat et fine mousse.' },
  { id: 'dalgona-cloud', name: 'Dalgona Cloud', cat: 'Cafés signature', price: 12500, img: 'images/dalgona-cloud.jpg', alt: 'Café fouetté sur lait glacé', desc: 'Café fouetté en nuage dense posé sur du lait glacé.' },
  { id: 'cocktail-soleil', name: 'Cocktail Soleil', cat: 'Cocktails sans alcool', price: 15000, img: 'images/cocktail-soleil.jpg', alt: 'Cocktail sans alcool à l’ananas séché et à la menthe', desc: 'Mousse onctueuse, ananas séché, menthe fraîche et fleur comestible.' },
  { id: 'choco-frappe', name: 'Choco Frappé', cat: 'Gourmands', price: 14000, img: 'images/choco-frappe.jpg', alt: 'Frappé chocolat avec chantilly', desc: 'Frappé au chocolat, chantilly, sauce chocolat et pépites.' }
];
const POPULAR = ['cocktail-soleil', 'dalgona-cloud', 'choco-frappe', 'mocha-swirl', 'latte-cannelle'];
const FAVS = ['choco-frappe', 'cocktail-soleil', 'dalgona-cloud'];

const $ = (s, r = document) => r.querySelector(s);
const by = id => DRINKS.find(d => d.id === id);
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ar';
const wa = text => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const orderLink = d => wa(`Bonjour THIRSTY, je souhaite commander : ${d.name} (${fmt(d.price)}). Quantité : à préciser, merci !`);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Révélation au défilement ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target); } }), { threshold: .12 });
const watch = root => root.querySelectorAll('.reveal:not(.v)').forEach(el => io.observe(el));

/* ---------- Menu + filtres ---------- */
const cats = ['Tous', ...new Set(DRINKS.map(d => d.cat))];
const grid = $('#grid'), filters = $('#filters');
filters.innerHTML = cats.map((c, i) => `<button class="${i ? '' : 'a'}" data-cat="${c}">${c}</button>`).join('');
const cardHTML = d => `<article class="card in"><img src="${d.img}" alt="${d.alt}" loading="lazy"><div class="tx"><h3>${d.name}</h3><p>${d.desc}</p><span class="price">${fmt(d.price)}</span><div class="acts"><a class="btn sm" href="${orderLink(d)}" target="_blank" rel="noopener">Commander</a><button class="btn sm ghost add" data-add="${d.id}">Ajouter</button></div></div></article>`;
function showMenu(cat) {
  grid.innerHTML = DRINKS.filter(d => cat === 'Tous' || d.cat === cat).map(cardHTML).join('');
  [...grid.children].forEach((c, i) => c.style.animationDelay = i * 70 + 'ms');
}
filters.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  [...filters.children].forEach(x => x.classList.toggle('a', x === b));
  showMenu(b.dataset.cat);
});
showMenu('Tous');

/* ---------- Favoris ---------- */
$('#bento').innerHTML = FAVS.map((id, i) => { const d = by(id);
  return `<article class="tile reveal${i ? '' : ' big'}"><img src="${d.img}" alt="${d.alt}" loading="lazy"><div><h3>${d.name}</h3><p>${d.desc}</p><a class="btn sm" href="${orderLink(d)}" target="_blank" rel="noopener">Commander · ${fmt(d.price)}</a></div></article>`; }).join('');
watch(document);

/* ---------- Carrousel populaires (auto, flèches, points, tactile) ---------- */
const slider = $('#slider'), dots = $('#dots');
slider.innerHTML = POPULAR.map(id => { const d = by(id);
  return `<article class="slide"><img src="${d.img}" alt="${d.alt}" loading="lazy"><div><h3>${d.name}</h3><span>${fmt(d.price)}</span></div></article>`; }).join('');
dots.innerHTML = POPULAR.map((_, i) => `<button aria-label="Boisson ${i + 1}" data-i="${i}"></button>`).join('');
const slides = [...slider.children];
const cur = () => { const m = slider.scrollLeft + slider.clientWidth / 2; let b = 0, bd = 1e9;
  slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - m); if (d < bd) { bd = d; b = i; } }); return b; };
const go = i => { i = (i + slides.length) % slides.length; const s = slides[i];
  slider.scrollTo({ left: s.offsetLeft - (slider.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' }); };
const sync = () => [...dots.children].forEach((d, i) => d.classList.toggle('a', i === cur()));
slider.addEventListener('scroll', () => requestAnimationFrame(sync)); sync();
$('#prev').onclick = () => go(cur() - 1); $('#next').onclick = () => go(cur() + 1);
dots.onclick = e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); };
slider.onkeydown = e => { if (e.key === 'ArrowRight') go(cur() + 1); if (e.key === 'ArrowLeft') go(cur() - 1); };
let timer, paused = false;
const play = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => { if (!paused && !document.hidden) go(cur() + 1); }, 3800); };
['mouseenter', 'touchstart', 'focusin'].forEach(ev => slider.addEventListener(ev, () => paused = true, { passive: true }));
['mouseleave', 'touchend', 'focusout'].forEach(ev => slider.addEventListener(ev, () => { paused = false; play(); }, { passive: true }));
play();

/* ---------- Panier ---------- */
let cart = {};
try { cart = JSON.parse(localStorage.getItem('thirsty-cart')) || {}; } catch (e) {}
const save = () => { try { localStorage.setItem('thirsty-cart', JSON.stringify(cart)); } catch (e) {} };
const panel = $('#cart'), veil = $('#veil'), list = $('#cart-list');
function drawCart() {
  const items = Object.entries(cart).filter(([id]) => by(id));
  const count = items.reduce((n, [, q]) => n + q, 0), total = items.reduce((n, [id, q]) => n + by(id).price * q, 0);
  $('#cart-count').textContent = count; $('#total').textContent = fmt(total);
  list.innerHTML = items.length ? items.map(([id, q]) => { const d = by(id);
    return `<li><img src="${d.img}" alt=""><div><b>${d.name}</b><small>${fmt(d.price)}</small></div><div class="qty"><button data-q="-1" data-id="${id}" aria-label="Retirer une unité">−</button><span>${q}</span><button data-q="1" data-id="${id}" aria-label="Ajouter une unité">+</button></div></li>`; }).join('')
    : '<li class="empty">Votre panier est vide. Ajoutez une boisson depuis le menu.</li>';
  const send = $('#send'); send.classList.toggle('dis', !items.length);
  send.href = items.length ? wa('Bonjour THIRSTY, je souhaite commander :\n' + items.map(([id, q]) => `- ${q} × ${by(id).name} (${fmt(by(id).price * q)})`).join('\n') + `\nTotal : ${fmt(total)}\nMerci de me confirmer la commande.`) : '#';
  save();
}
const openCart = o => { panel.classList.toggle('o', o); veil.classList.toggle('o', o); panel.setAttribute('aria-hidden', !o); document.body.style.overflow = o ? 'hidden' : ''; };
$('#open-cart').onclick = () => openCart(true); $('#close-cart').onclick = () => openCart(false); veil.onclick = () => { openCart(false); menu(false); };
$('#clear').onclick = () => { cart = {}; drawCart(); };
document.addEventListener('click', e => {
  const a = e.target.closest('[data-add]');
  if (a) { cart[a.dataset.add] = (cart[a.dataset.add] || 0) + 1; drawCart();
    const c = $('#cart-count'); c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 250);
    a.textContent = 'Ajouté ✓'; setTimeout(() => a.textContent = 'Ajouter', 1100); }
  const q = e.target.closest('[data-q]');
  if (q) { const id = q.dataset.id; cart[id] = (cart[id] || 0) + +q.dataset.q; if (cart[id] <= 0) delete cart[id]; drawCart(); }
});
drawCart();

/* ---------- Menu mobile + en-tête ---------- */
const nav = $('#nav'), burger = $('#burger'), bar = $('#top-bar');
function menu(o) { nav.classList.toggle('o', o); burger.classList.toggle('o', o); burger.setAttribute('aria-expanded', o);
  burger.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); document.body.style.overflow = o ? 'hidden' : ''; head(); }
burger.onclick = () => menu(!nav.classList.contains('o'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { menu(false); openCart(false); } });
const head = () => bar.classList.toggle('s', scrollY > 40 && !nav.classList.contains('o'));

/* ---------- Parallaxe légère ---------- */
const px = [...document.querySelectorAll('[data-speed]:not(.reveal)')];
let tick = false;
addEventListener('scroll', () => { head(); if (reduce || tick) return; tick = true;
  requestAnimationFrame(() => { px.forEach(el => { if (el.classList.contains('float')) return; el.style.transform = `translateY(${scrollY * el.dataset.speed}px)`; }); tick = false; }); }, { passive: true });
head();
