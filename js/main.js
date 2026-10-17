const menu = document.getElementById('myNav');
const menuToggle = document.querySelector('.menu-toggle');

function openNav() {
    menu.inert = false;
    menu.classList.add('is-open');
    menu.style.width = '100%';
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menu.querySelector('.closebtn').focus();
}

function closeNav() {
    menu.inert = true;
    menu.classList.remove('is-open');
    menu.style.width = '0%';
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
}

menu.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) closeNav();
});
document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeNav();
    if (event.key === 'Tab') {
        const links = [...menu.querySelectorAll('a')];
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});
window.matchMedia('(max-width: 800px)').addEventListener('change', (event) => {
    if (!event.matches && menu.classList.contains('is-open')) closeNav();
});

// The introduction remains readable even without external scripts.
const typer = document.querySelector('.typer');
if (typer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = typer.dataset.words.split(',').map((word) => word.trim()).filter(Boolean);
    let wordIndex = 0;
    let count = words[0].length;
    let deleting = true;
    function typeNext() {
        const word = words[wordIndex];
        count += deleting ? -1 : 1;
        typer.textContent = word.slice(0, count);
        let delay = deleting ? 45 : 100;
        if (!deleting && count === word.length) {
            deleting = true;
            delay = 1800;
        } else if (deleting && count === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 300;
        }
        window.setTimeout(typeNext, delay);
    }
    window.setTimeout(typeNext, 1800);
}

// Animate height and counter from the same progress, once the chart is visible.
const skillColumns = [...document.querySelectorAll('.skill-column')];
const skillMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let skillAnimationFrame;
let skillsStarted = false;

function renderSkill(column, progress) {
    const value = Number(column.dataset.level) * progress;
    column.style.setProperty('--level', `${value}%`);
    column.querySelector('.text-skill').textContent = `${Math.round(value)}%`;
}

function finishSkills() {
    cancelAnimationFrame(skillAnimationFrame);
    skillColumns.forEach((column) => renderSkill(column, 1));
}

if (skillColumns.length && !skillMotion.matches && 'IntersectionObserver' in window) {
    skillColumns.forEach((column) => renderSkill(column, 0));
    const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || skillsStarted) return;
        skillsStarted = true;
        observer.disconnect();
        const start = performance.now();
        const duration = 1800;
        function animateSkills(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            skillColumns.forEach((column) => renderSkill(column, eased));
            if (progress < 1) skillAnimationFrame = requestAnimationFrame(animateSkills);
        }
        skillAnimationFrame = requestAnimationFrame(animateSkills);
    }, { threshold: 0.2 });
    observer.observe(document.querySelector('.skills'));
    skillMotion.addEventListener('change', (event) => {
        if (event.matches) {
            observer.disconnect();
            finishSkills();
        }
    });
}
