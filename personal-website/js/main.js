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
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000; // 2 секунды
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        
        updateNumber();
    });
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

// Запуск анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    typeText();
    animateSkillBars();
    
    // Анимация чисел при появлении секции
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }
});
