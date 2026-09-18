/* ===================================================================
   COSMIC NEON AURORA PORTFOLIO — script.js
   3D Space Engine (Starfield Warp, Constellations, Nebulae, Comets)
   + Bulletproof Preloader & ScrollSpy Interactions
   =================================================================== */
(function () {
  'use strict';

  const GITHUB_USERNAME = 'suprittotigeri07-source';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // DOM Elements
  const preloader  = document.getElementById('preloader');
  const navbar     = document.getElementById('navbar');
  const navToggle  = document.getElementById('nav-toggle');
  const navLinks   = document.getElementById('nav-links');
  const copyBtn    = document.getElementById('copy-email');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pcards     = document.querySelectorAll('.pcard');
  const canvas     = document.getElementById('hero-canvas');
  const ctx        = canvas ? canvas.getContext('2d') : null;

  // ═══════════════════════════════════════
  // 1. DEEP SPACE VISUALIZATION CANVAS ENGINE
  // ═══════════════════════════════════════
  let canvasW, canvasH, dpr;
  const stars = [];
  const constellationNodes = [];
  const comets = [];
  const nebulae = [];
  const orbits = [];

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let lastScrollY = window.scrollY;
  let scrollSpeed = 0;

  function initSpaceCanvas() {
    if (!canvas || !ctx) return;
    try {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resizeCanvas();
      window.addEventListener('resize', debounce(resizeCanvas, 150));

      // Mouse movement parallax
      window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX - window.innerWidth / 2) * 0.06;
        targetMouseY = (e.clientY - window.innerHeight / 2) * 0.06;
      }, { passive: true });

      // 1. Generate 420+ 3D Stars with Aurora Colors
      const starColors = ['#FFFFFF', '#FFFFFF', '#00F2FE', '#38BDF8', '#A855F7', '#E100FF', '#FFB703'];
      for (let i = 0; i < 420; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2600,
          y: (Math.random() - 0.5) * 2600,
          z: Math.random() * 2000 + 40,
          size: Math.random() * 2.0 + 0.4,
          baseAlpha: Math.random() * 0.8 + 0.2,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.05 + 0.015,
          color: starColors[Math.floor(Math.random() * starColors.length)]
        });
      }

      // 2. Select 50 stars for 3D Constellations
      for (let i = 0; i < 50; i++) {
        constellationNodes.push({
          x: (Math.random() - 0.5) * 1600,
          y: (Math.random() - 0.5) * 1600,
          z: Math.random() * 1200 + 100,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        });
      }

      // 3. Multi-layer Cosmic Aurora Nebulae
      const nebulaColors = [
        { r: 0,   g: 242, b: 254 }, // Electric Cyan
        { r: 168, g: 85,  b: 247 }, // Neon Violet
        { r: 225, g: 0,   b: 255 }, // Vibrant Magenta
        { r: 14,  g: 165, b: 233 }  // Cosmic Deep Blue
      ];
      for (let i = 0; i < 6; i++) {
        nebulae.push({
          x: (Math.random() - 0.5) * 900,
          y: (Math.random() - 0.5) * 900,
          radius: Math.random() * 380 + 260,
          color: nebulaColors[i % nebulaColors.length],
          alpha: Math.random() * 0.09 + 0.04,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() - 0.5) * 0.0025
        });
      }

      // 4. Rotating 3D Cosmic Wireframe Orbits
      for (let i = 0; i < 5; i++) {
        orbits.push({
          radius: 130 + i * 80,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          segments: 64,
          color: i % 2 === 0 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, '
        });
      }

      // 5. Comets
      spawnComet();
      setInterval(spawnComet, 3500);

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderSpaceCanvas);
      } else {
        renderStaticSpaceCanvas();
      }
    } catch (err) {
      console.warn('Canvas init error (fallback rendering):', err);
    }
  }

  function spawnComet() {
    if (comets.length > 3) return;
    comets.push({
      x: Math.random() * canvasW * 1.2 - canvasW * 0.1,
      y: -50,
      length: Math.random() * 140 + 90,
      speed: Math.random() * 9 + 6,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
      alpha: 1
    });
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    canvas.width = canvasW * dpr;
    canvas.height = canvasH * dpr;
    canvas.style.width = canvasW + 'px';
    canvas.style.height = canvasH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getScrollProgress() {
    const hero = document.getElementById('hero');
    if (!hero) return 0;
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, -rect.top / total));
  }

  function renderSpaceCanvas() {
    if (!ctx) return;

    try {
      const scrollY = window.scrollY;
      scrollSpeed = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;

      const progress = getScrollProgress();

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = '#020208';
      ctx.fillRect(0, 0, canvasW, canvasH);

      const cx = canvasW / 2 + mouseX;
      const cy = canvasH / 2 + mouseY;

      // ── A. Render Nebulae ──
      nebulae.forEach((neb) => {
        neb.angle += neb.speed;
        const nx = cx + neb.x + Math.cos(neb.angle + progress * Math.PI) * 120;
        const ny = cy + neb.y + Math.sin(neb.angle + progress * Math.PI) * 120;
        const nr = neb.radius * (1 + progress * 0.35);

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        const a = neb.alpha + progress * 0.04;
        grad.addColorStop(0, `rgba(${neb.color.r}, ${neb.color.g}, ${neb.color.b}, ${a})`);
        grad.addColorStop(0.5, `rgba(${neb.color.r}, ${neb.color.g}, ${neb.color.b}, ${a * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(nx - nr, ny - nr, nr * 2, nr * 2);
      });

      // ── B. Render 3D Constellations ──
      const projectedNodes = [];
      const fov = 750;

      constellationNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (Math.abs(node.x) > 850) node.vx *= -1;
        if (Math.abs(node.y) > 850) node.vy *= -1;

        const rotY = progress * Math.PI * 0.85;
        const rx = node.x * Math.cos(rotY) - node.z * Math.sin(rotY);
        const rz = node.x * Math.sin(rotY) + node.z * Math.cos(rotY);

        const scale = fov / (fov + rz + 400);
        const sx = cx + rx * scale;
        const sy = cy + node.y * scale;

        projectedNodes.push({ sx, sy, scale, z: rz });
      });

      // Connect constellation lines
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 + progress * 0.12})`;
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const p1 = projectedNodes[i];
          const p2 = projectedNodes[j];
          const dx = p1.sx - p2.sx;
          const dy = p1.sy - p2.sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
          }
        }
      }
      ctx.stroke();

      // Draw constellation node points
      projectedNodes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 2.2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── C. Render 3D Cosmic Wireframe Orbits ──
      orbits.forEach((orbit, oi) => {
        const rotSpeed = 0.2 + oi * 0.1;
        const rx = orbit.rotX + progress * Math.PI * rotSpeed;
        const ry = orbit.rotY + progress * Math.PI * (rotSpeed * 0.7);
        const rz = orbit.rotZ + progress * Math.PI * 0.3;
        const scaleMult = 1 + progress * 0.5;
        const r = orbit.radius * scaleMult;

        ctx.beginPath();
        const alphaVal = Math.max(0.04, 0.28 - oi * 0.04);
        ctx.strokeStyle = `${orbit.color}${alphaVal})`;
        ctx.lineWidth = 1.3;

        for (let j = 0; j <= orbit.segments; j++) {
          const angle = (j / orbit.segments) * Math.PI * 2;
          let px = Math.cos(angle) * r;
          let py = Math.sin(angle) * r;
          let pz = 0;

          let y1 = py * Math.cos(rx) - pz * Math.sin(rx);
          let z1 = py * Math.sin(rx) + pz * Math.cos(rx);
          let x2 = px * Math.cos(ry) + z1 * Math.sin(ry);
          let z2 = -px * Math.sin(ry) + z1 * Math.cos(ry);
          let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
          let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

          const perspective = fov / (fov + z2 + 300);
          const sx = cx + x3 * perspective;
          const sy = cy + y3 * perspective;

          if (j === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      });

      // ── D. Render 3D Starfield with Warp Speed on Scroll ──
      const speedWarp = Math.min(scrollSpeed * 0.45, 30);

      stars.forEach(star => {
        star.z -= 0.6 + progress * 3.5 + speedWarp * 0.12;
        if (star.z <= 10) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * 2600;
          star.y = (Math.random() - 0.5) * 2600;
        }

        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;

        const scale = fov / (fov + star.z);
        const sx = cx + star.x * scale;
        const sy = cy + star.y * scale;

        if (sx >= -20 && sx <= canvasW + 20 && sy >= -20 && sy <= canvasH + 20) {
          const size = Math.max(0.4, star.size * scale * (1 + progress * 0.6));
          const alpha = Math.min(1, star.baseAlpha * twinkle * (1 - star.z / 2200));

          if (speedWarp > 2) {
            const streakLen = speedWarp * scale * 1.8;
            const angle = Math.atan2(sy - cy, sx - cx);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(angle) * streakLen, sy + Math.sin(angle) * streakLen);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = size;
            ctx.globalAlpha = alpha;
            ctx.stroke();
            ctx.globalAlpha = 1;
          } else {
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      });

      // ── E. Render Comets ──
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.alpha -= 0.006;

        if (c.alpha <= 0 || c.y > canvasH + 100) {
          comets.splice(i, 1);
          continue;
        }

        const tailX = c.x - Math.cos(c.angle) * c.length;
        const tailY = c.y - Math.sin(c.angle) * c.length;

        const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${c.alpha})`);
        grad.addColorStop(0.4, `rgba(0, 242, 254, ${c.alpha * 0.85})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Comet Head Glow
        ctx.beginPath();
        ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── F. Glowing Super-Massive Core Star ──
      const coreR = 50 + progress * 160;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.18 + progress * 0.28})`);
      coreGrad.addColorStop(0.4, `rgba(0, 242, 254, ${0.12 + progress * 0.18})`);
      coreGrad.addColorStop(0.8, `rgba(168, 85, 247, ${0.06 + progress * 0.1})`);
      coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = coreGrad;
      ctx.fillRect(cx - coreR, cy - coreR, coreR * 2, coreR * 2);
    } catch (e) {
      console.warn('Canvas render error:', e);
    }

    requestAnimationFrame(renderSpaceCanvas);
  }

  function renderStaticSpaceCanvas() {
    if (!ctx) return;
    const cx = canvasW / 2;
    const cy = canvasH / 2;
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, canvasW, canvasH);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
    grad.addColorStop(0, 'rgba(0, 242, 254, 0.18)');
    grad.addColorStop(0.6, 'rgba(168, 85, 247, 0.1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  // ═══════════════════════════════════════
  // 2. BULLETPROOF PRELOADER (NEVER STUCK)
  // ═══════════════════════════════════════
  function initPreloader() {
    if (document.body) document.body.classList.add('no-scroll');

    let dismissed = false;
    function dismissPreloader() {
      if (dismissed) return;
      dismissed = true;
      if (preloader) preloader.classList.add('done');
      if (document.body) document.body.classList.remove('no-scroll');
      showNavbar();
      animateHero();
    }

    // Dismiss preloader safely
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(dismissPreloader, 400);
    } else {
      window.addEventListener('load', () => setTimeout(dismissPreloader, 400));
    }

    // Absolute hard safety timeout (max 800ms)
    setTimeout(dismissPreloader, 800);
  }

  // ═══════════════════════════════════════
  // 3. NAVBAR & SCROLLSPY
  // ═══════════════════════════════════════
  function showNavbar() { if (navbar) navbar.classList.add('visible'); }

  function initNavbar() {
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        if (navLinks) navLinks.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
      });
    }

    if (navLinks) {
      navLinks.querySelectorAll('.nav-menu__link').forEach(link => {
        link.addEventListener('click', () => {
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
          navLinks.classList.remove('open');
          document.body.classList.remove('no-scroll');
        });
      });
    }

    initScrollspy();
  }

  function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-menu__link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  // ═══════════════════════════════════════
  // 4. HERO ANIMATIONS
  // ═══════════════════════════════════════
  function animateHero() {
    const words = document.querySelectorAll('.hero-scene .anim-word');
    words.forEach((word, i) => {
      setTimeout(() => word.classList.add('revealed'), i * 80);
    });
    const ctas = document.getElementById('hero-ctas');
    const hint = document.getElementById('scroll-hint');
    if (ctas) setTimeout(() => ctas.classList.add('revealed'), words.length * 80 + 100);
    if (hint) setTimeout(() => hint.classList.add('revealed'), words.length * 80 + 300);
  }

  // ═══════════════════════════════════════
  // 5. SCROLL REVEAL OBSERVER
  // ═══════════════════════════════════════
  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(item => observer.observe(item));
  }

  // ═══════════════════════════════════════
  // 6. PROJECT FILTERS
  // ═══════════════════════════════════════
  function initProjectFilters() {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');

        pcards.forEach(card => {
          const cardCat = card.getAttribute('data-cat');
          if (cat === 'all' || cardCat === cat) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeUp .4s forwards';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════
  // 7. COPY EMAIL TO CLIPBOARD
  // ═══════════════════════════════════════
  function initCopyEmail() {
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email');
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 2500);
      }).catch(err => console.error('Copy failed:', err));
    });
  }

  // ═══════════════════════════════════════
  // 8. FETCH GITHUB STATS
  // ═══════════════════════════════════════
  async function fetchGitHubData() {
    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`)
      ]);
      if (!uRes.ok || !rRes.ok) return;

      const user = await uRes.json();
      const repos = await rRes.json();

      // Stats
      animateCounter('gh-repos', user.public_repos || 0);
      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
      animateCounter('gh-stars', totalStars);
      animateCounter('gh-forks', totalForks);

      // Estimate contributions
      animateCounter('gh-contribs', Math.max(50, repos.length * 8));

      // Languages
      const langCounts = {};
      repos.forEach(r => {
        if (r.language) {
          langCounts[r.language] = (langCounts[r.language] || 0) + 1;
        }
      });
      const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const totalLangs = sortedLangs.reduce((a, b) => a + b[1], 0);

      sortedLangs.forEach(([lang, cnt], idx) => {
        const pct = Math.round((cnt / totalLangs) * 100);
        const nameEl = document.getElementById(`lang-${idx + 1}-name`);
        const fillEl = document.getElementById(`lang-${idx + 1}-fill`);
        const pctEl  = document.getElementById(`lang-${idx + 1}-pct`);

        if (nameEl) nameEl.textContent = lang;
        if (pctEl)  pctEl.textContent  = pct + '%';
        if (fillEl) setTimeout(() => { fillEl.style.width = pct + '%'; }, 300 + idx * 100);
      });

    } catch (e) {
      console.log('GitHub API fallback in place');
    }
  }

  function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 40);
  }

  // ═══════════════════════════════════════
  // 9. BUTTON RIPPLE EFFECT
  // ═══════════════════════════════════════
  function initButtonRipples() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        circle.classList.add('ripple');
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        const radius = diameter / 2;
        const rect = this.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
      });
    });
  }

  // ═══════════════════════════════════════
  // UTILS
  // ═══════════════════════════════════════
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // ═══════════════════════════════════════
  // SAFE INITIALIZATION WORKFLOW
  // ═══════════════════════════════════════
  function startApp() {
    initPreloader();
    initSpaceCanvas();
    initNavbar();
    initScrollReveal();
    initProjectFilters();
    initCopyEmail();
    initButtonRipples();
    fetchGitHubData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }

})();
