/**
 * Apple iPhone BR — script.js
 * Organização modular, nomes semânticos em português
 * alinhados ao padrão do site fenixtoalheiro.com.br
 */

/* ============================================================
   UTILITÁRIOS GLOBAIS
   ============================================================ */

/**
 * Seleciona um único elemento do DOM.
 * @param {string} seletor
 * @param {Element} [contexto=document]
 * @returns {Element|null}
 */
function selecionar(seletor, contexto = document) {
  return contexto.querySelector(seletor);
}

/**
 * Seleciona múltiplos elementos do DOM.
 * @param {string} seletor
 * @param {Element} [contexto=document]
 * @returns {NodeList}
 */
function selecionarTodos(seletor, contexto = document) {
  return contexto.querySelectorAll(seletor);
}

/**
 * Adiciona um listener de evento.
 * @param {Element|Window|Document} elemento
 * @param {string} evento
 * @param {Function} callback
 * @param {object} [opcoes]
 */
function ouvir(elemento, evento, callback, opcoes) {
  if (elemento) elemento.addEventListener(evento, callback, opcoes);
}

/* ============================================================
   MÓDULO: NAVEGAÇÃO GLOBAL (MOBILE)
   ============================================================ */

const moduloNavMobile = (() => {
  const botaoMenu      = selecionar('#btn-menu-mobile');
  const listaLinks     = selecionar('#nav-links');
  const navGlobal      = selecionar('#nav-global');

  let menuAberto = false;

  /**
   * Alterna a visibilidade do menu mobile.
   */
  function alternarMenu() {
    menuAberto = !menuAberto;

    botaoMenu.classList.toggle('menu-ativo', menuAberto);
    botaoMenu.setAttribute('aria-expanded', String(menuAberto));

    if (menuAberto) {
      listaLinks.classList.add('nav-aberto');
      document.body.style.overflow = 'hidden';
    } else {
      listaLinks.classList.remove('nav-aberto');
      document.body.style.overflow = '';
    }
  }

  /**
   * Fecha o menu mobile sem toggle.
   */
  function fecharMenu() {
    if (!menuAberto) return;
    menuAberto = false;
    botaoMenu.classList.remove('menu-ativo');
    botaoMenu.setAttribute('aria-expanded', 'false');
    listaLinks.classList.remove('nav-aberto');
    document.body.style.overflow = '';
  }

  /**
   * Aplica fundo opaco na nav ao rolar a página.
   */
  function controlarFundoNav() {
    const alturaRolada = window.scrollY;
    if (alturaRolada > 10) {
      navGlobal.style.boxShadow = '0 1px 0 rgba(0,0,0,0.15)';
    } else {
      navGlobal.style.boxShadow = '0 1px 0 rgba(0,0,0,0.07)';
    }
  }

  function init() {
    if (!botaoMenu || !listaLinks) return;

    ouvir(botaoMenu, 'click', alternarMenu);

    // Fecha ao clicar em link interno
    const linksNav = selecionarTodos('a', listaLinks);
    linksNav.forEach(link => ouvir(link, 'click', fecharMenu));

    // Fecha ao clicar fora
    ouvir(document, 'click', (evento) => {
      if (menuAberto && !navGlobal.contains(evento.target)) {
        fecharMenu();
      }
    });

    // Fecha ao pressionar ESC
    ouvir(document, 'keydown', (evento) => {
      if (evento.key === 'Escape' && menuAberto) fecharMenu();
    });

    // Controla fundo ao rolar
    ouvir(window, 'scroll', controlarFundoNav, { passive: true });
  }

  return { init };
})();

/* ============================================================
   MÓDULO: MODAIS DE CONTEÚDO
   ============================================================ */

const moduloModais = (() => {
  let modalAtual = null;
  let elementoFocoAnterior = null;

  /**
   * Abre um modal pelo ID.
   * @param {string} idModal
   */
  function abrirModal(idModal) {
    const overlay = selecionar(`#${idModal}`);
    if (!overlay) return;

    // Guarda o elemento que tinha foco antes
    elementoFocoAnterior = document.activeElement;

    // Fecha qualquer modal aberto
    if (modalAtual && modalAtual !== overlay) fecharModal(modalAtual);

    modalAtual = overlay;
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Foca no botão de fechar
    const botaoFechar = selecionar('.modal__fechar', overlay);
    if (botaoFechar) {
      requestAnimationFrame(() => botaoFechar.focus());
    }

    // Rastreia foco dentro do modal (trap)
    prender(overlay);
  }

  /**
   * Fecha um modal.
   * @param {Element} [overlay] - overlay a fechar; usa o atual se omitido
   */
  function fecharModal(overlay) {
    const alvo = overlay || modalAtual;
    if (!alvo) return;

    alvo.setAttribute('hidden', '');
    document.body.style.overflow = '';
    modalAtual = null;

    // Devolve foco ao acionador
    if (elementoFocoAnterior) {
      elementoFocoAnterior.focus();
      elementoFocoAnterior = null;
    }
  }

  /**
   * Aprisiona o foco dentro do modal (acessibilidade).
   * @param {Element} overlay
   */
  function prender(overlay) {
    const elementosFocaveis = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const primeiro = elementosFocaveis[0];
    const ultimo   = elementosFocaveis[elementosFocaveis.length - 1];

    function capturarTab(evento) {
      if (evento.key !== 'Tab') return;
      if (!overlay.getAttribute('hidden') === false) return;

      if (evento.shiftKey) {
        if (document.activeElement === primeiro) {
          evento.preventDefault();
          ultimo.focus();
        }
      } else {
        if (document.activeElement === ultimo) {
          evento.preventDefault();
          primeiro.focus();
        }
      }
    }

    // Remove listener anterior se existia
    overlay.removeEventListener('keydown', overlay._trapFocus);
    overlay._trapFocus = capturarTab;
    overlay.addEventListener('keydown', capturarTab);
  }

  function init() {
    // Abre modal ao clicar em cards com data-modal
    const acionadores = selecionarTodos('[data-modal]');
    acionadores.forEach(acionador => {
      ouvir(acionador, 'click', () => {
        const idModal = acionador.getAttribute('data-modal');
        abrirModal(idModal);
      });

      // Acessibilidade: também abre com Enter/Space
      ouvir(acionador, 'keydown', (evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault();
          const idModal = acionador.getAttribute('data-modal');
          abrirModal(idModal);
        }
      });

      // Torna o card focável para teclado
      if (!acionador.hasAttribute('tabindex')) {
        acionador.setAttribute('tabindex', '0');
      }
      acionador.setAttribute('role', 'button');
    });

    // Fecha ao clicar no botão fechar
    const botoesFechar = selecionarTodos('.modal__fechar');
    botoesFechar.forEach(btn => {
      ouvir(btn, 'click', () => fecharModal());
    });

    // Fecha ao clicar no overlay fora do modal
    const overlays = selecionarTodos('.modal-overlay');
    overlays.forEach(overlay => {
      ouvir(overlay, 'click', (evento) => {
        if (evento.target === overlay) fecharModal(overlay);
      });
    });

    // Fecha com ESC
    ouvir(document, 'keydown', (evento) => {
      if (evento.key === 'Escape' && modalAtual) fecharModal();
    });
  }

  return { init, abrirModal, fecharModal };
})();

/* ============================================================
   MÓDULO: ABAS DE FEATURES
   ============================================================ */

const moduloAbas = (() => {
  const containerAbas = selecionar('#features-tabs');

  /**
   * Ativa uma aba e seu painel correspondente.
   * @param {HTMLButtonElement} botaoAtivo
   */
  function ativarAba(botaoAtivo) {
    if (!containerAbas) return;

    const idTab = botaoAtivo.getAttribute('data-tab');
    const painelAlvo = selecionar(`#tab-${idTab}`);
    if (!painelAlvo) return;

    // Desativa todas as abas
    const todasAbas = selecionarTodos('.features-tabs__btn', containerAbas);
    todasAbas.forEach(btn => {
      btn.classList.remove('features-tabs__btn--ativo');
      btn.setAttribute('aria-selected', 'false');
    });

    // Oculta todos os painéis
    const todosPaineis = selecionarTodos('.features-painel');
    todosPaineis.forEach(painel => {
      painel.classList.remove('features-painel--ativo');
      painel.setAttribute('hidden', '');
    });

    // Ativa aba e painel selecionados
    botaoAtivo.classList.add('features-tabs__btn--ativo');
    botaoAtivo.setAttribute('aria-selected', 'true');
    painelAlvo.classList.add('features-painel--ativo');
    painelAlvo.removeAttribute('hidden');
  }

  function init() {
    if (!containerAbas) return;

    const botoesAba = selecionarTodos('.features-tabs__btn', containerAbas);
    botoesAba.forEach(botao => {
      ouvir(botao, 'click', () => ativarAba(botao));

      // Navegação por teclado (setas)
      ouvir(botao, 'keydown', (evento) => {
        const lista = Array.from(botoesAba);
        const indiceAtual = lista.indexOf(botao);

        if (evento.key === 'ArrowRight' || evento.key === 'ArrowDown') {
          evento.preventDefault();
          const proximo = lista[(indiceAtual + 1) % lista.length];
          proximo.focus();
          ativarAba(proximo);
        } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowUp') {
          evento.preventDefault();
          const anterior = lista[(indiceAtual - 1 + lista.length) % lista.length];
          anterior.focus();
          ativarAba(anterior);
        }
      });
    });
  }

  return { init };
})();

/* ============================================================
   MÓDULO: NAVEGAÇÃO DE MODELOS (CHAPTERNAV) — SCROLL ATIVO
   ============================================================ */

const moduloNavModelos = (() => {
  const navModelos = selecionar('#nav-modelos');

  /**
   * Centraliza o item ativo na nav de modelos ao rolar.
   * (Para uso futuro com IntersectionObserver por seção)
   * @param {Element} item
   */
  function centralizarItem(item) {
    if (!navModelos || !item) return;
    const offsetLeft = item.offsetLeft;
    const larguraItem = item.offsetWidth;
    const larguraNa = navModelos.offsetWidth;
    navModelos.scrollTo({
      left: offsetLeft - (larguraNa / 2) + (larguraItem / 2),
      behavior: 'smooth'
    });
  }

  function init() {
    if (!navModelos) return;
    // Prepara estrutura para scroll horizontal com arrasto (drag scroll)
    let arrastando = false;
    let inicioX;
    let scrollInicio;

    ouvir(navModelos, 'mousedown', (evento) => {
      arrastando = true;
      inicioX = evento.pageX - navModelos.offsetLeft;
      scrollInicio = navModelos.scrollLeft;
      navModelos.style.cursor = 'grabbing';
      navModelos.style.userSelect = 'none';
    });

    ouvir(navModelos, 'mouseleave', () => {
      arrastando = false;
      navModelos.style.cursor = '';
    });

    ouvir(navModelos, 'mouseup', () => {
      arrastando = false;
      navModelos.style.cursor = '';
      navModelos.style.userSelect = '';
    });

    ouvir(navModelos, 'mousemove', (evento) => {
      if (!arrastando) return;
      evento.preventDefault();
      const x = evento.pageX - navModelos.offsetLeft;
      const delta = (x - inicioX) * 1.2;
      navModelos.scrollLeft = scrollInicio - delta;
    });
  }

  return { init, centralizarItem };
})();

/* ============================================================
   MÓDULO: ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
   ============================================================ */

const moduloAnimacoesScroll = (() => {
  const CLASSE_VISIVEL   = 'elemento-visivel';
  const CLASSE_ANIMAVEL  = 'animar-entrada';

  /**
   * Cria e configura o IntersectionObserver.
   * @returns {IntersectionObserver}
   */
  function criarObservador() {
    return new IntersectionObserver(
      (entradas) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add(CLASSE_VISIVEL);
            // Para de observar após animar
            observador.unobserve(entrada.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );
  }

  let observador;

  function init() {
    // Reduz movimento se o usuário preferir
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    observador = criarObservador();

    // Injeta estilos de animação dinamicamente
    const estilos = document.createElement('style');
    estilos.textContent = `
      .${CLASSE_ANIMAVEL} {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .${CLASSE_ANIMAVEL}.${CLASSE_VISIVEL} {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(estilos);

    // Observa elementos que devem animar
    const seletoresAnimaveis = [
      '.card-consideracao',
      '.card-modelo',
      '.card-incentivo',
      '.card-ecossistema',
      '.card-acessorio',
      '.features-painel__item',
      '.secao-tour__imagem-wrap',
      '.secao-upgrade__conteudo',
      '.secao-upgrade__imagem-wrap',
    ];

    seletoresAnimaveis.forEach(seletor => {
      const elementos = selecionarTodos(seletor);
      elementos.forEach((el, indice) => {
        el.classList.add(CLASSE_ANIMAVEL);
        // Atraso escalonado para elementos em grade
        el.style.transitionDelay = `${Math.min(indice * 0.07, 0.4)}s`;
        observador.observe(el);
      });
    });
  }

  return { init };
})();

/* ============================================================
   MÓDULO: STICKY NAV MODELOS — OCULTAR/MOSTRAR
   ============================================================ */

const moduloStickyNav = (() => {
  const navModelos = selecionar('#nav-modelos');
  const titulo     = selecionar('.titulo-pagina');

  let ultimoScroll = 0;

  function controlar() {
    if (!navModelos || !titulo) return;
    const scrollAtual = window.scrollY;
    const limiteOcultar = titulo.getBoundingClientRect().bottom + window.scrollY;

    if (scrollAtual < limiteOcultar) {
      navModelos.style.opacity = '1';
      navModelos.style.pointerEvents = 'auto';
    } else {
      navModelos.style.opacity = '1';
    }

    ultimoScroll = scrollAtual;
  }

  function init() {
    ouvir(window, 'scroll', controlar, { passive: true });
  }

  return { init };
})();

/* ============================================================
   MÓDULO: HIGHLIGHT DE COR NOS CARDS DE MODELO
   ============================================================ */

const moduloCorModelo = (() => {
  /**
   * Adiciona interatividade aos swatches de cor dos cards de modelo.
   */
  function init() {
    const cards = selecionarTodos('.card-modelo');

    cards.forEach(card => {
      const swatches = selecionarTodos('.card-modelo__cor', card);

      swatches.forEach(swatch => {
        ouvir(swatch, 'mouseenter', () => {
          swatches.forEach(s => s.style.outline = '');
          swatch.style.outline = '2px solid #0066cc';
          swatch.style.outlineOffset = '2px';
        });

        ouvir(swatch, 'mouseleave', () => {
          swatch.style.outline = '';
          swatch.style.outlineOffset = '';
        });
      });
    });
  }

  return { init };
})();

/* ============================================================
   MÓDULO: BANNER PROMO — FECHAR
   ============================================================ */

const moduloBannerPromo = (() => {
  // Guarda preferência no sessionStorage
  const CHAVE_STORAGE = 'banner_promo_fechado';

  function init() {
    const bannerFechado = sessionStorage.getItem(CHAVE_STORAGE);
    const banner = selecionar('.banner-promo');
    if (!banner) return;

    if (bannerFechado === 'true') {
      banner.style.display = 'none';
      ajustarPaddingMain(false);
      return;
    }

    ajustarPaddingMain(true);
  }

  /**
   * Ajusta o padding-top do main conforme o banner.
   * @param {boolean} bannerVisivel
   */
  function ajustarPaddingMain(bannerVisivel) {
    const alturaNav    = 44;
    const alturaBanner = bannerVisivel ? 44 : 0;
    const main = selecionar('#conteudo-principal');
    if (main) {
      main.style.paddingTop = `${alturaNav + alturaBanner}px`;
    }
    const navModelos = selecionar('#nav-modelos');
    if (navModelos) {
      navModelos.style.top = `${alturaNav + alturaBanner}px`;
    }
  }

  return { init };
})();

/* ============================================================
   MÓDULO: LAZY LOADING APRIMORADO
   ============================================================ */

const moduloLazyLoad = (() => {
  function init() {
    // Browsers modernos já suportam loading="lazy" nativamente.
    // Este módulo adiciona suporte manual para casos mais específicos.
    if ('loading' in HTMLImageElement.prototype) return;

    const imagens = selecionarTodos('img[loading="lazy"]');
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          const img = entrada.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observador.unobserve(img);
        }
      });
    });

    imagens.forEach(img => observador.observe(img));
  }

  return { init };
})();

/* ============================================================
   MÓDULO: ROLAGEM SUAVE PARA ÂNCORAS INTERNAS
   ============================================================ */

const moduloRolagemSuave = (() => {
  function init() {
    const links = selecionarTodos('a[href^="#"]');
    links.forEach(link => {
      ouvir(link, 'click', (evento) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const alvo = selecionar(href);
        if (!alvo) return;

        evento.preventDefault();
        const deslocamento = 44 + 44 + 52; // nav + banner + nav-modelos
        const posicao = alvo.getBoundingClientRect().top + window.scrollY - deslocamento;

        window.scrollTo({ top: posicao, behavior: 'smooth' });
      });
    });
  }

  return { init };
})();

/* ============================================================
   INICIALIZAÇÃO GERAL
   ============================================================ */

function inicializar() {
  moduloNavMobile.init();
  moduloModais.init();
  moduloAbas.init();
  moduloNavModelos.init();
  moduloAnimacoesScroll.init();
  moduloStickyNav.init();
  moduloCorModelo.init();
  moduloBannerPromo.init();
  moduloLazyLoad.init();
  moduloRolagemSuave.init();
}

// Executa após o DOM estar pronto
if (document.readyState === 'loading') {
  ouvir(document, 'DOMContentLoaded', inicializar);
} else {
  inicializar();
}