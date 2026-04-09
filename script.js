document.addEventListener('DOMContentLoaded', () => {


    /* =======================================================
       0. FIX DE NAVEGAÇÃO (Impede o Observer de roubar a tela)
       ======================================================= */
    let isNavigating = false;
    let navTimeout = null;

    // Detecta quando qualquer link do menu for clicado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function() {
            isNavigating = true; // Avisa o sistema que estamos viajando
            clearTimeout(navTimeout);
            
            // Desliga a trava por 1.5 segundos até chegar no destino
            navTimeout = setTimeout(() => { 
                isNavigating = false; 
            }, 1500);
        });
    });
/* =======================================================
       00. CONTROLE DE ANIMAÇÕES (F5 / VOLTANDO DE OUTRAS PÁGINAS)
       ======================================================= */
    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry ? navEntry.type : '';
    
    // Descobre se o usuário veio de um link de dentro do seu próprio site
    const veioDeDentroDoSite = document.referrer.includes(window.location.hostname) && document.referrer !== '';

    let pularAnimacoes = false;

    if (navType === 'reload') {
        // 1. O usuário deu F5 (Atualizou a página) -> DEIXA ANIMAR
        pularAnimacoes = false;
    } else if (navType === 'back_forward') {
        // 2. O usuário clicou na "Seta de Voltar" do navegador -> PULA A ANIMAÇÃO
        pularAnimacoes = true;
    } else if (veioDeDentroDoSite) {
        // 3. O usuário clicou no logo vindo da página Aumark -> PULA A ANIMAÇÃO
        pularAnimacoes = true;
    }

    // Aplica o bloqueio apenas se não for F5 e não for o primeiro acesso limpo
    if (pularAnimacoes) {
        document.body.classList.add('disable-animations');
        document.querySelectorAll('.models-section, .seminovos-section').forEach(sec => {
            sec.classList.add('is-visible');
        });
    }
   
   
   
    if (window.location.hash) {
        isNavigating = true;
        setTimeout(() => {
            isNavigating = false;
        }, 2000); // 2 segundos para dar tempo de carregar e rolar
    }
 
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
      // HERO EFFECT (Protegido para páginas que não tem a Hero)
        if (heroSection) {
            if (currentScroll <= viewportHeight) {
                const progress = currentScroll / viewportHeight;
                const scale = 1 + (progress * 0.20);
                const blur = progress * 12;
                const opacity = 1 - (progress * 0.4);

                heroSection.style.transform = `scale(${scale})`;
                heroSection.style.filter = `blur(${blur}px) brightness(${opacity})`;
            }
        }
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

            if (entry.isIntersecting && !isLocked && !alreadyTriggered && !isNavigating) {

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

            // Quando sair da section, libera só ela
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
    let totalCards = cards ? cards.length : 0;

    function getCardWidth() {
        if (!cards || !cards.length) return 0;
        return cards[0].getBoundingClientRect().width + 30;
    }

    function updateSlider() {
        if (!cards || !cards.length || !track) return;

        const cardWidth = getCardWidth();
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        const viewportWidth = track.parentElement.getBoundingClientRect().width;
        const cardsVisible = Math.round(viewportWidth / cardWidth);
        const maxIndex = totalCards - cardsVisible;

        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    if (nextBtn && prevBtn) {
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
    }

    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);


    /* =======================================================
       4. API DO IBGE (ESTADOS E CIDADES DO CONTATO)
       ======================================================= */
    const estadoSelect = document.getElementById('estadoSelect');
    const cidadeSelect = document.getElementById('cidadeSelect');

    if (estadoSelect && cidadeSelect) {
        
        // 1. Busca os Estados assim que a página carrega
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => res.json())
            .then(estados => {
                estadoSelect.innerHTML = '<option value="" disabled selected>Selecione o estado</option>';
                estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.sigla; // Envia a sigla (Ex: SC, SP)
                    option.textContent = estado.nome;
                    estadoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Erro ao buscar estados:", error);
            });

        // 2. Quando o usuário escolhe um Estado, carrega as Cidades dele
        estadoSelect.addEventListener('change', function() {
            const uf = this.value; // Pega a sigla do estado selecionado
            
            // Coloca em estado de carregamento e trava a caixa
            cidadeSelect.innerHTML = '<option value="" disabled selected>Carregando cidades...</option>';
            cidadeSelect.disabled = true;

            // Busca as cidades daquele estado específico
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
                .then(res => res.json())
                .then(cidades => {
                    cidadeSelect.innerHTML = '<option value="" disabled selected>Selecione a cidade</option>';
                    cidades.forEach(cidade => {
                        const option = document.createElement('option');
                        option.value = cidade.nome;
                        option.textContent = cidade.nome;
                        cidadeSelect.appendChild(option);
                    });
                    
                    // DESTRAVA a caixa para o usuário poder clicar
                    cidadeSelect.disabled = false;
                })
                .catch(error => {
                    console.error("Erro ao buscar cidades:", error);
                    cidadeSelect.innerHTML = '<option value="" disabled>Erro ao carregar</option>';
                });
        });
    }
/* =======================================================
       CONTROLE DO MODAL DE TELEFONES
       ======================================================= */
    const btnOpen = document.getElementById('btnOpenTelefones');
    const btnClose = document.getElementById('btnCloseTelefones');
    const modal = document.getElementById('modalTelefones');

    if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
            modal.classList.add('active');
        });

        btnClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Fecha ao clicar fora do conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}); // Fim do DOMContentLoaded (Tudo deve ficar antes desta linha)

/* =======================================================
   FUNÇÕES DA GALERIA DO AUMARK S 315
   ======================================================= */
function changeGalleryImage(thumbnail) {
    // 1. Muda a imagem principal
    const mainImg = document.getElementById('mainGalleryImg');
    mainImg.style.opacity = 0; // Faz um pequeno "piscar" elegante
    
    setTimeout(() => {
        mainImg.src = thumbnail.src;
        mainImg.style.opacity = 1;
    }, 150);

    // 2. Remove a classe 'active' de todas as miniaturas visíveis
    const allThumbs = document.querySelectorAll('#galleryThumbnails .thumb');
    allThumbs.forEach(t => t.classList.remove('active'));

    // 3. Adiciona 'active' na miniatura clicada
    thumbnail.classList.add('active');
}

function filterGallery(type, btn) {
    // 1. Atualiza os botões laterais (Exterior / Interior)
    const allBtns = document.querySelectorAll('.sidebar-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Filtra as miniaturas
    const allThumbs = document.querySelectorAll('#galleryThumbnails .thumb');
    let firstVisibleThumb = null;

    allThumbs.forEach(thumb => {
        if (thumb.getAttribute('data-type') === type) {
            thumb.style.display = 'block';
            if (!firstVisibleThumb) firstVisibleThumb = thumb; // Guarda a primeira imagem da categoria
        } else {
            thumb.style.display = 'none';
        }
    });

    // 3. Clica automaticamente na primeira imagem da nova categoria escolhida
    if (firstVisibleThumb) {
        changeGalleryImage(firstVisibleThumb);
    }
}
/* =======================================================
   FUNÇÕES DA SEÇÃO DE VERSÕES E ACORDEÃO
   ======================================================= */

// 1. Função para trocar a Aba da Versão (MT / AMT) mantendo o estado do acordeão
function selectVersion(versionId, selectedTab) {
    const allSpecs = document.querySelectorAll('.specs-accordion');
    let openIndex = -1;

    // A) Antes de trocar, verifica se existe algum item aberto e salva o índice dele
    allSpecs.forEach(spec => {
        if (getComputedStyle(spec).display !== 'none') {
            const items = spec.querySelectorAll('.accordion-item');
            items.forEach((item, index) => {
                if (item.classList.contains('active')) {
                    openIndex = index;
                }
            });
        }
    });

    // B) Troca o visual das abas
    const tabs = document.querySelectorAll('.version-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    selectedTab.classList.add('active');
    
    // C) Esconde todos os grupos de especificações
    allSpecs.forEach(spec => {
        spec.style.display = 'none';
    });

    // D) Mostra a versão selecionada e sincroniza o item aberto
    const activeSpec = document.getElementById('specs-' + versionId);
    if (activeSpec) {
        activeSpec.style.display = 'flex';

        // E) Se havia um item aberto, abre o mesmo índice na nova aba
        if (openIndex !== -1) {
            const newItems = activeSpec.querySelectorAll('.accordion-item');
            if (newItems[openIndex]) {
                const targetItem = newItems[openIndex];
                const targetContent = targetItem.querySelector('.accordion-content');
                
                // Remove 'active' de qualquer outro item que pudesse estar aberto por erro
                newItems.forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = null;
                });

                targetItem.classList.add('active');
                
                // Timeout para garantir que o display 'flex' foi processado antes de medir scrollHeight
                setTimeout(() => {
                    targetContent.style.maxHeight = targetContent.scrollHeight + 50 + "px";
                }, 50);
            }
        }
    }
}

// 2. Função para abrir/fechar as caixas do Acordeão (APENAS NO CLIQUE)
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Buscamos o conteúdo e os outros itens dentro do MESMO acordeão visível
        const parentAccordion = item.closest('.specs-accordion');
        const content = item.querySelector('.accordion-content');
        const allSiblingItems = parentAccordion.querySelectorAll('.accordion-item');

        if (item.classList.contains('active')) {
            // Se clicar no que já está aberto, ele fecha
            item.classList.remove('active');
            content.style.maxHeight = null;
        } else {
            // Fecha todos os outros itens do mesmo grupo antes de abrir o novo
            allSiblingItems.forEach(sibling => {
                sibling.classList.remove('active');
                sibling.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Abre o item clicado
            item.classList.add('active');
            setTimeout(() => {
                content.style.maxHeight = content.scrollHeight + 50 + "px";
            }, 10);
        }
    });
});