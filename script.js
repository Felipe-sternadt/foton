
document.addEventListener('DOMContentLoaded', () => {

    /* =======================================================
       1. HERO + SMART NAVBAR
       ======================================================= */
    const heroSection = document.querySelector('.hero');
    const navbarContainer = document.querySelector('.navbar-container');
    const viewportHeight = window.innerHeight;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        // HERO EFFECT
        if (currentScroll <= viewportHeight) {
            const progress = currentScroll / viewportHeight;
            const scale = 1 + (progress * 0.20);
            const blur = progress * 12;
            const opacity = 1 - (progress * 0.4);

            heroSection.style.transform = `scale(${scale})`;
            heroSection.style.filter = `blur(${blur}px) brightness(${opacity})`;
        }

        // NAVBAR SMART
        if (currentScroll <= 50) {
            navbarContainer.classList.remove('navbar-hidden');
        } else if (currentScroll > lastScroll) {
            navbarContainer.classList.add('navbar-hidden');
        } else {
            navbarContainer.classList.remove('navbar-hidden');
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    });


    /* =======================================================
       2. SCROLL LOCK + OBSERVER PREMIUM (SEM TREMER)
       ======================================================= */
    let isLocked = false;
    let lastSection = null;

    function lockScroll(duration = 1200) {
        if (isLocked) return;

        isLocked = true;
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            document.body.style.overflow = '';
            isLocked = false;
        }, duration);
    }

  const sectionStates = new Map();

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const section = entry.target;

        if (!sectionStates.has(section)) {
            sectionStates.set(section, false);
        }

        const alreadyTriggered = sectionStates.get(section);

        if (entry.isIntersecting && !isLocked && !alreadyTriggered) {

            sectionStates.set(section, true);

            window.scrollTo({
                top: section.offsetTop,
                behavior: 'auto'
            });

            setTimeout(() => {
                section.classList.add('is-visible');

                if (section.classList.contains('models-section')) {
                    lockScroll(1400);
                }

                if (section.classList.contains('seminovos-section')) {
                    lockScroll(1400);
                }

            }, 120);
        }

        // 🔥 quando sair da section, libera só ela
        if (!entry.isIntersecting) {
            sectionStates.set(section, false);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('.models-section, .seminovos-section')
    .forEach(section => sectionObserver.observe(section));
    /* =======================================================
       3. SLIDER
       ======================================================= */
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const cards = document.querySelectorAll('.model-card');

    let currentIndex = 0;
    const totalCards = cards.length;

    function getCardWidth() {
        if (!cards.length) return 0;
        return cards[0].getBoundingClientRect().width + 30;
    }

    function updateSlider() {
        if (!cards.length) return;

        const cardWidth = getCardWidth();
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        const viewportWidth = track.parentElement.getBoundingClientRect().width;
        const cardsVisible = Math.round(viewportWidth / cardWidth);
        const maxIndex = totalCards - cardsVisible;

        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    nextBtn.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        const viewportWidth = track.parentElement.getBoundingClientRect().width;
        const cardsVisible = Math.round(viewportWidth / cardWidth);
        const maxIndex = totalCards - cardsVisible;

        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);

});