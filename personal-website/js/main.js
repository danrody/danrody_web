// Анимация печатающегося текста
const roles = [
    "Веб-разработчик",
    "UI/UX Дизайнер",
    "Frontend Разработчик",
    "Full Stack Разработчик"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

function typeText() {
    const typedText = document.getElementById('typed-text');
    const currentRole = roles[roleIndex];
    
    if (!typedText) return;

    if (isWaiting) {
        setTimeout(typeText, 2000); // Ждем 2 секунды перед удалением
        isWaiting = false;
        return;
    }

    if (isDeleting) {
        // Удаляем текст
        charIndex--;
        typedText.textContent = currentRole.substring(0, charIndex);
    } else {
        // Печатаем текст
        charIndex++;
        typedText.textContent = currentRole.substring(0, charIndex);
    }

    let typingSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentRole.length) {
        // Закончили печатать слово
        isWaiting = true;
        isDeleting = true;
        typingSpeed = 500;
    } else if (isDeleting && charIndex === 0) {
        // Закончили удалять слово
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    setTimeout(typeText, typingSpeed);
}

// Анимация чисел в статистике
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        const finalValue = parseInt(stat.getAttribute('data-count'));
                        animateValue(stat, 0, finalValue, 2000);
                        stat.classList.add('animated');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
}

// Анимация прогресс-баров при скролле
function animateSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'scaleX(1)';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.transform = 'scaleX(0)';
        observer.observe(bar);
    });
}

// Service Cards Highlight on Mobile
function initServiceCardsHighlight() {
    // Only initialize on mobile devices
    if (window.innerWidth > 480) return;

    const options = {
        root: null,
        rootMargin: '-20% 0px',
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, options);

    // Observe all service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    typeText();
    animateSkillBars();
    initServiceCardsHighlight();
    initStatsAnimation(); // Используем единую функцию для инициализации статистики
});

// Reinitialize on resize (in case of orientation change)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Remove all existing in-view classes
        document.querySelectorAll('.service-card.in-view').forEach(card => {
            card.classList.remove('in-view');
        });
        // Reinitialize the animations
        initServiceCardsHighlight();
    }, 250);
});
