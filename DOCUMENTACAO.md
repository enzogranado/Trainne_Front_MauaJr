# Documentação — Apple iPhone BR (Recriação)


---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Estrutura de Arquivos](#2-estrutura-de-arquivos)
3. [index.html](#3-indexhtml)
4. [style.css](#4-stylecss)
5. [script.js](#5-scriptjs)
6. [Convenções de Código](#6-convenções-de-código)
7. [Dependências Externas](#7-dependências-externas)
8. [Responsividade](#8-responsividade)
9. [Acessibilidade](#9-acessibilidade)
10. [Como Usar](#10-como-usar)

---

## 1. Visão Geral

| Item              | Detalhe                                      |
|-------------------|----------------------------------------------|
| Página recriada   | https://www.apple.com/br/iphone/             |
| Referência de código | https://fenixtoalheiro.com.br/index.html  |
| Idioma            | Português (Brasil)                           |
| Tecnologias       | HTML5, CSS3 puro, JavaScript (ES6+) puro     |
| Dependências      | Nenhuma biblioteca externa                   |
| Imagens           | Carregadas diretamente dos servidores Apple  |

O projeto replica fielmente o conteúdo, layout, tipografia e interações
da página oficial do iPhone no Brasil, incluindo: navbar global fixa,
banner promocional, navegação por modelos (ChapterNav), cards com modais,
grid de família de produtos, abas de features, seção de ecossistema e
rodapé completo.

---

## 2. Estrutura de Arquivos

```
apple-iphone/
├── iphone.html        # Estrutura e conteúdo HTML completo
├── style.css         # Todos os estilos e variáveis CSS
├── script.js         # Lógica e interatividade em módulos JS
└── DOCUMENTACAO.md   # Este arquivo
```

---

## 3. index.html

### 3.1 Cabeçalho (`<head>`)

| Atributo/Tag            | Finalidade                                     |
|-------------------------|------------------------------------------------|
| `charset="UTF-8"`       | Suporte a caracteres especiais (ç, ã, é, etc.) |
| `viewport`              | Responsividade em dispositivos móveis          |
| `<title>`               | "iPhone — Apple (BR)"                          |
| `<link rel="stylesheet">` | Importa o `style.css`                        |
| `<link rel="icon">`     | Favicon oficial da Apple                       |

---

### 3.2 Seções do `<body>`

Cada bloco é delimitado por comentários `/* === */` para fácil localização.

#### `<header class="nav-global">` — Navegação Global

Navbar fixa no topo da viewport. Contém:

- **Logo Apple** em SVG inline (sem dependência de imagem externa)
- **`<ul class="nav-global__links">`** — 10 links do menu principal
- **`.nav-global__acoes`** — ícones de busca (SVG), sacola (SVG) e botão hambúrguer mobile

O botão hambúrguer (`#btn-menu-mobile`) é exibido apenas em telas ≤ 767px via CSS
e controlado pelo módulo `moduloNavMobile` no JavaScript.

---

#### `<section class="banner-promo">` — Banner Promocional

Faixa fixa abaixo da navbar exibindo oferta sazonal ("Dia das Mães").
Contém texto e link de ação. Posicionada com `position: fixed; top: 44px`.

---

#### `<section class="titulo-pagina">` — Título Principal

Exibe o `<h1>iPhone</h1>` centralizado. Serve como âncora visual de entrada na página.

---

#### `<nav class="nav-modelos">` — ChapterNav (Navegação por Modelos)

Barra de navegação secundária posicionada com `position: sticky`.
Lista os 9 atalhos: iPhone 17 Pro, Air, 17, 17e, 16, Comparar, Acessórios,
Comprar iPhone e iOS. Cada item tem imagem + rótulo de texto.

Implementa scroll horizontal com arrasto (drag scroll), controlado por
`moduloNavModelos` no JavaScript.

---

#### `<section class="secao-consideracoes">` — "Mude para o iPhone"

Grade de 7 cards clicáveis (`card-consideracao`), cada um com:

- `data-modal="ID"` — atributo que define qual modal abrir ao clicar
- Subtítulo temático (ex.: "Dê o primeiro passo")
- Título principal da seção
- Imagem de capa

Ao clicar, o módulo `moduloModais` abre o modal correspondente.

---

#### Modais (`.modal-overlay`)

Existem 7 modais de conteúdo (considerações) + 3 modais de incentivos,
todos seguindo a mesma estrutura:

```html
<div class="modal-overlay" id="ID-DO-MODAL" role="dialog" aria-modal="true" hidden>
  <div class="modal">
    <button class="modal__fechar">×</button>
    <div class="modal__corpo">
      <h2 class="modal__titulo-secao">...</h2>
      <h3 class="modal__subtitulo">...</h3>
      <div class="modal__lista-itens">
        <div class="modal__item">
          <h4>...</h4>
          <p>...</p>
          <img ... />
        </div>
      </div>
    </div>
  </div>
</div>
```

| ID do Modal              | Conteúdo                    |
|--------------------------|-----------------------------|
| `modal-primeiros-passos` | Migração do Android         |
| `modal-durabilidade`     | Ceramic Shield, IP68        |
| `modal-ios`              | iOS 26, Apple Intelligence  |
| `modal-privacidade`      | Proteção de dados           |
| `modal-camera`           | Câmeras e vídeo             |
| `modal-ambiente`         | Reciclagem e carbono        |
| `modal-seguranca`        | Detecção de Acidente        |
| `modal-pagamento`        | Parcelas e desconto à vista |
| `modal-especialista`     | Atendimento Apple           |
| `modal-app-store`        | App Apple Store             |

---

#### `<section class="secao-familia">` — "Conheça a Família"

Grade com 5 cards de modelos (`card-modelo`), cada um contendo:

- Imagem do produto (link para página do modelo)
- Swatches de cores (`.card-modelo__cor`) com `background-color` inline
- Nome, descrição e dois botões: "Saiba mais" e "Comprar"

Badge "Novo" posicionado absolutamente no iPhone 17e.

---

#### `<section class="secao-tour">` — Tour Guiado

Fundo preto com título, botão "Assistir ao vídeo" e imagem de capa.
O botão aponta para o arquivo `.m3u8` (HLS) do vídeo oficial da Apple.

---

#### `<section class="secao-incentivos">` — "Motivos para Comprar"

Grade de 4 cards com imagem + texto. Três deles possuem `data-modal`
que abre modais compactos (`modal--compacto`) com informações detalhadas.

---

#### `<section class="secao-upgrade">` — "Vem para o iPhone"

Layout de duas colunas (texto à esquerda, imagem à direita).
Em mobile, empilha em coluna única centralizada.

---

#### `<section class="secao-features">` — "Conheça Melhor o iPhone"

Sistema de abas com 7 categorias:

| Aba (`data-tab`) | Conteúdo                        |
|------------------|---------------------------------|
| `inovacao`       | Design, Ceramic Shield          |
| `cameras`        | Câmera, Zoom, Cinema            |
| `chip`           | A19/A19 Pro, bateria, 5G        |
| `ios-ai`         | iOS 26, Liquid Glass, Siri      |
| `ambiente`       | Reciclagem, embalagem           |
| `priv`           | Apple Intelligence, Safari      |
| `seguranca`      | Detecção de Acidente, Buscar    |

Cada painel tem: imagem hero, label + título introdutório e grade de itens.

---

#### `<section class="secao-acessorios">` — "Parceiros Perfeitos"

Dois cards lado a lado: Acessórios iPhone e AirTag.
Layout interno em duas colunas (texto + imagem).

---

#### `<section class="secao-ecossistema">` — "Companheiros Ilustres"

Três cards descrevendo integração com: Mac, Apple Watch e AirPods.

---

#### `<section class="secao-notas">` — Notas Legais

Lista numerada `<ol>` com 8 disclaimers técnicos e legais.

---

#### `<footer class="rodape-global">` — Rodapé

Estrutura em 5 colunas de links organizados por categoria:
Descobrir e Comprar, Entretenimento, Apple Store, Empresas/Educação
e Valores/Sobre a Apple. Inclui breadcrumb, texto de copyright
e links de política de privacidade.

---

## 4. style.css

### 4.1 Variáveis CSS (`:root`)

Todas as configurações globais estão centralizadas em variáveis no `:root`,
seguindo a convenção de nomenclatura do Fenix Toalheiro
(`--prefixo-categoria-detalhe`):

#### Cores

| Variável                      | Valor padrão              | Uso                        |
|-------------------------------|---------------------------|----------------------------|
| `--cor-fundo-pagina`          | `#ffffff`                 | Fundo geral da página      |
| `--cor-fundo-nav`             | `rgba(255,255,255,0.85)`  | Navbar com blur            |
| `--cor-fundo-secao-cinza`     | `#f5f5f7`                 | Cards e seções alternadas  |
| `--cor-fundo-secao-escura`    | `#000000`                 | Seção tour guiado          |
| `--cor-fundo-rodape`          | `#f5f5f7`                 | Rodapé global              |
| `--cor-fundo-modal`           | `rgba(0,0,0,0.5)`         | Overlay dos modais         |
| `--cor-texto-primario`        | `#1d1d1f`                 | Títulos e textos principais|
| `--cor-texto-secundario`      | `#6e6e73`                 | Subtítulos e parágrafos    |
| `--cor-texto-terciario`       | `#86868b`                 | Rodapé e notas legais      |
| `--cor-azul-apple`            | `#0066cc`                 | Links, CTAs e botões       |
| `--cor-cinza-borda`           | `#d2d2d7`                 | Divisórias e bordas        |

#### Tipografia

| Variável                          | Valor                          |
|-----------------------------------|--------------------------------|
| `--fonte-principal`               | SF Pro / system-ui / Helvetica |
| `--tamanho-fonte-base`            | `17px`                         |
| `--tamanho-fonte-nav`             | `12px`                         |
| `--tamanho-fonte-titulo-secao`    | `48px`                         |
| `--tamanho-fonte-titulo-card`     | `28px`                         |
| `--peso-fonte-semibold`           | `600`                          |
| `--altura-linha-corpo`            | `1.58`                         |

#### Espaçamento e Layout

| Variável                        | Valor     |
|---------------------------------|-----------|
| `--espaco-secao-vertical`       | `80px`    |
| `--espaco-container-horizontal` | `22px`    |
| `--largura-maxima-container`    | `980px`   |
| `--largura-maxima-container-larga` | `1200px` |
| `--altura-nav`                  | `44px`    |
| `--altura-banner`               | `44px`    |

#### Bordas, Sombras e Transições

| Variável               | Valor                                      |
|------------------------|--------------------------------------------|
| `--raio-borda-card`    | `18px`                                     |
| `--raio-borda-btn`     | `980px` (pill)                             |
| `--raio-borda-modal`   | `18px`                                     |
| `--sombra-nav`         | `0 1px 0 rgba(0,0,0,0.1)`                 |
| `--sombra-card`        | `0 4px 20px rgba(0,0,0,0.08)`             |
| `--sombra-modal`       | `0 20px 60px rgba(0,0,0,0.3)`             |
| `--transicao-padrao`   | `0.3s cubic-bezier(0.4, 0, 0.2, 1)`       |
| `--transicao-rapida`   | `0.15s ease`                               |

---

### 4.2 Convenção de Nomenclatura (BEM em Português)

As classes seguem a metodologia BEM adaptada para português:

```
.bloco
.bloco__elemento
.bloco__elemento--modificador
```

Exemplos do projeto:

| Classe                              | Significado                             |
|-------------------------------------|-----------------------------------------|
| `.nav-global`                       | Bloco: barra de navegação global        |
| `.nav-global__links`                | Elemento: lista de links da nav         |
| `.nav-global__link--ativo`          | Modificador: link da página atual       |
| `.card-modelo`                      | Bloco: card de modelo de iPhone         |
| `.card-modelo__btn`                 | Elemento: botão do card                 |
| `.card-modelo__btn--saiba`          | Modificador: botão "Saiba mais"         |
| `.card-modelo__btn--comprar`        | Modificador: botão "Comprar"            |
| `.modal`                            | Bloco: caixa do modal                   |
| `.modal--compacto`                  | Modificador: modal de tamanho reduzido  |
| `.modal__fechar`                    | Elemento: botão de fechar o modal       |
| `.features-tabs__btn--ativo`        | Modificador: aba selecionada            |

---

### 4.3 Blocos CSS por Seção

| Bloco CSS                  | Corresponde a                        |
|----------------------------|--------------------------------------|
| `.nav-global`              | Navbar fixa                          |
| `.banner-promo`            | Faixa promocional                    |
| `.titulo-pagina`           | H1 "iPhone"                          |
| `.nav-modelos`             | ChapterNav sticky                    |
| `.secao-consideracoes`     | "Mude para o iPhone"                 |
| `.grade-consideracoes`     | Grid dos cards de consideração       |
| `.card-consideracao`       | Card individual                      |
| `.modal-overlay` / `.modal`| Sistema de modais                    |
| `.secao-familia`           | "Conheça a família"                  |
| `.grade-familia`           | Grid dos modelos                     |
| `.card-modelo`             | Card de modelo de iPhone             |
| `.secao-tour`              | Tour guiado (fundo preto)            |
| `.secao-incentivos`        | "Motivos para comprar"               |
| `.grade-incentivos`        | Grid dos incentivos                  |
| `.card-incentivo`          | Card de incentivo de compra          |
| `.secao-upgrade`           | "Vem para o iPhone"                  |
| `.secao-features`          | "Conheça melhor o iPhone"            |
| `.features-tabs`           | Barra de abas                        |
| `.features-painel`         | Painel de conteúdo da aba            |
| `.secao-acessorios`        | "Parceiros perfeitos"                |
| `.card-acessorio`          | Card de acessório                    |
| `.secao-ecossistema`       | "Companheiros ilustres"              |
| `.card-ecossistema`        | Card de produto do ecossistema       |
| `.secao-notas`             | Notas legais                         |
| `.rodape-global`           | Rodapé completo                      |

---

## 5. script.js

O JavaScript é organizado em **módulos IIFE** (Immediately Invoked Function Expression),
um padrão sem dependências externas. Cada módulo expõe apenas um método `init()`,
e todos são chamados pela função `inicializar()` no final do arquivo.

### 5.1 Utilitários Globais

Funções auxiliares definidas no escopo global do arquivo, usadas por todos os módulos:

| Função                              | Parâmetros                        | Retorno         |
|-------------------------------------|-----------------------------------|-----------------|
| `selecionar(seletor, contexto?)`    | Seletor CSS, elemento pai opcional | `Element\|null` |
| `selecionarTodos(seletor, contexto?)` | Seletor CSS, elemento pai opcional | `NodeList`    |
| `ouvir(elemento, evento, callback, opcoes?)` | Elemento DOM, nome do evento, função | `void` |

---

### 5.2 `moduloNavMobile`

**Responsabilidade:** Controla a abertura/fechamento do menu mobile e o fundo da navbar ao rolar.

| Função interna     | Descrição                                                              |
|--------------------|------------------------------------------------------------------------|
| `alternarMenu()`   | Liga/desliga o menu; trava scroll do body quando aberto                |
| `fecharMenu()`     | Fecha o menu sem toggle; utilizado por listeners externos              |
| `controlarFundoNav()` | Ajusta `box-shadow` da nav conforme posição de rolagem              |
| `init()`           | Registra listeners no botão hambúrguer, links, `document` e `window` |

**Estado interno:** variável `menuAberto` (boolean) controla se o menu está visível.

---

### 5.3 `moduloModais`

**Responsabilidade:** Abre e fecha modais de conteúdo, gerencia foco e acessibilidade.

| Função interna         | Descrição                                                           |
|------------------------|---------------------------------------------------------------------|
| `abrirModal(idModal)`  | Exibe o modal pelo ID, guarda foco anterior, chama `prender()`     |
| `fecharModal(overlay?)` | Oculta o modal ativo, restaura scroll e devolve foco             |
| `prender(overlay)`     | Aprisiona o foco (Tab/Shift+Tab) dentro do modal aberto            |
| `init()`               | Registra listeners em todos `[data-modal]`, `.modal__fechar` e overlays |

**Acessibilidade implementada:**
- `role="dialog"` e `aria-modal="true"` nos overlays
- Trap de foco via listener de `keydown` dentro do modal
- Fechamento com tecla `Escape`
- `tabindex="0"` e `role="button"` adicionados dinamicamente aos cards

---

### 5.4 `moduloAbas`

**Responsabilidade:** Gerencia o sistema de abas na seção "Conheça melhor o iPhone".

| Função interna       | Descrição                                                          |
|----------------------|--------------------------------------------------------------------|
| `ativarAba(botao)`   | Desativa todas as abas/painéis, ativa a selecionada               |
| `init()`             | Registra listeners de `click` e `keydown` (setas do teclado) nas abas |

**Navegação por teclado:** setas `ArrowRight`/`ArrowDown` avançam, `ArrowLeft`/`ArrowUp` retrocedem.

---

### 5.5 `moduloNavModelos`

**Responsabilidade:** Habilita drag scroll horizontal na ChapterNav.

| Função interna  | Descrição                                                              |
|-----------------|------------------------------------------------------------------------|
| `centralizarItem(item)` | Centraliza item ativo (utilitária, para uso futuro)           |
| `init()`        | Registra `mousedown`, `mousemove`, `mouseup` e `mouseleave` para arrasto |

**Variáveis de estado:** `arrastando` (boolean), `inicioX` e `scrollInicio` (numbers).

---

### 5.6 `moduloAnimacoesScroll`

**Responsabilidade:** Anima elementos ao entrarem na viewport com `IntersectionObserver`.

| Função interna    | Descrição                                                        |
|-------------------|------------------------------------------------------------------|
| `criarObservador()` | Instancia `IntersectionObserver` com threshold `0.12`        |
| `init()`          | Injeta estilos de animação no `<head>` e observa todos os elementos definidos |

**Elementos animados (com atraso escalonado):**
`.card-consideracao`, `.card-modelo`, `.card-incentivo`, `.card-ecossistema`,
`.card-acessorio`, `.features-painel__item`, `.secao-tour__imagem-wrap`,
`.secao-upgrade__conteudo`, `.secao-upgrade__imagem-wrap`.

Animação: `opacity: 0 → 1` + `translateY(24px → 0)` em `0.6s`.
Respeitado quando `prefers-reduced-motion: reduce`.

---

### 5.7 `moduloStickyNav`

**Responsabilidade:** Prepara controle de visibilidade da ChapterNav conforme rolagem.

| Função interna | Descrição                                            |
|----------------|------------------------------------------------------|
| `controlar()`  | Verifica posição relativa ao título da página        |
| `init()`       | Registra listener de `scroll` passivo no `window`    |

---

### 5.8 `moduloCorModelo`

**Responsabilidade:** Adiciona highlight visual ao passar o mouse nos swatches de cor.

| Função interna | Descrição                                                       |
|----------------|-----------------------------------------------------------------|
| `init()`       | Registra `mouseenter` e `mouseleave` em cada swatch de cor      |

---

### 5.9 `moduloBannerPromo`

**Responsabilidade:** Verifica `sessionStorage` para controlar visibilidade do banner.

| Função interna         | Descrição                                                    |
|------------------------|--------------------------------------------------------------|
| `ajustarPaddingMain(visivel)` | Recalcula `padding-top` do `<main>` e `top` da nav-modelos |
| `init()`               | Lê chave `banner_promo_fechado` do `sessionStorage`         |

---

### 5.10 `moduloLazyLoad`

**Responsabilidade:** Fallback de lazy loading para browsers sem suporte nativo.

| Função interna | Descrição                                                         |
|----------------|-------------------------------------------------------------------|
| `init()`       | Verifica suporte nativo; se ausente, usa `IntersectionObserver`   |

Em browsers modernos (todos os atuais), o atributo `loading="lazy"` já é suficiente
e este módulo não faz nada.

---

### 5.11 `moduloRolagemSuave`

**Responsabilidade:** Intercepta cliques em âncoras internas (`href="#id"`) e
rola suavemente descontando a altura das barras fixas.

| Função interna | Descrição                                                         |
|----------------|-------------------------------------------------------------------|
| `init()`       | Registra `click` em todos `a[href^="#"]`; calcula deslocamento correto |

**Deslocamento calculado:** `44px (nav) + 44px (banner) + 52px (nav-modelos) = 140px`.

---

### 5.12 `inicializar()`

Função principal que chama `init()` de todos os módulos na ordem correta:

```
inicializar()
  ├── moduloNavMobile.init()
  ├── moduloModais.init()
  ├── moduloAbas.init()
  ├── moduloNavModelos.init()
  ├── moduloAnimacoesScroll.init()
  ├── moduloStickyNav.init()
  ├── moduloCorModelo.init()
  ├── moduloBannerPromo.init()
  ├── moduloLazyLoad.init()
  └── moduloRolagemSuave.init()
```

Executada após `DOMContentLoaded` (ou imediatamente se o DOM já estiver pronto).

---

## 6. Convenções de Código

### HTML

- Semântica correta: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `aria-label` em todas as seções e elementos interativos
- `role="dialog"` + `aria-modal="true"` nos modais
- `loading="lazy"` em todas as imagens fora da viewport inicial
- Comentários delimitadores `<!-- === NOME DA SEÇÃO === -->` entre blocos
- IDs em português, descritivos: `#nav-modelos`, `#familia-iphone`, `#tour-guiado`

### CSS

- Variáveis em `:root` com prefixo semântico (`--cor-`, `--fonte-`, `--espaco-`)
- BEM em português: `.bloco__elemento--modificador`
- Comentários de seção com `/* === */` e linha divisória
- Mobile-first via `@media (min-width: ...)` nos grids
- `prefers-reduced-motion` respeitado em animações

### JavaScript

- Módulos IIFE com retorno de objeto `{ init }` ou `{ init, métodoPublico }`
- Funções nomeadas (sem arrow functions anônimas em posições principais)
- Comentários JSDoc em funções públicas (`@param`, `@returns`)
- Nenhum `var` — apenas `const` e `let`
- Nenhuma dependência externa

---

## 7. Dependências Externas

| Recurso              | URL Base                                       | Tipo        |
|----------------------|------------------------------------------------|-------------|
| Imagens dos produtos | `https://www.apple.com/v/iphone/home/cj/...`   | Imagem      |
| Imagens (BR)         | `https://www.apple.com/br/iphone/home/...`     | Imagem      |
| Favicon              | `https://www.apple.com/favicon.ico`            | Ícone       |
| Vídeo tour           | `https://www.apple.com/105/media/br/...m3u8`   | HLS (vídeo) |

> ⚠️ As imagens são carregadas diretamente dos servidores da Apple.
> Seria importante alterar para local assim que possível.

---

## 8. Responsividade

| Breakpoint   | Comportamento                                              |
|--------------|------------------------------------------------------------|
| `> 1024px`   | Grid de 5 colunas nos modelos; layout completo desktop     |
| `768–1024px` | Grid de 3 colunas nos modelos                              |
| `< 767px`    | Menu hambúrguer; grids de 2 colunas; fontes reduzidas      |
| `< 480px`    | Grids de 1 coluna; cards acessórios empilhados             |

Variáveis de espaçamento sobrescritas no breakpoint `< 767px`:
- `--espaco-secao-vertical`: `80px → 48px`
- `--espaco-container-horizontal`: `22px → 16px`

---

## 9. Acessibilidade

| Recurso                        | Implementação                                     |
|--------------------------------|---------------------------------------------------|
| Foco visível                   | `:focus-visible` com outline azul                 |
| Trap de foco nos modais        | `moduloModais.prender()` via `keydown` listener   |
| Fechamento por ESC             | `moduloModais` e `moduloNavMobile`                |
| ARIA em modais                 | `role="dialog"`, `aria-modal`, `aria-label`       |
| ARIA em abas                   | `role="tablist"`, `role="tab"`, `aria-selected`   |
| Navegação por teclado nas abas | Setas ← → ↑ ↓ no `moduloAbas`                    |
| Cards focáveis                 | `tabindex="0"` e `role="button"` nos cards-modal  |
| Imagens decorativas            | `alt` descritivos em todas as imagens             |
| Movimento reduzido             | `prefers-reduced-motion: reduce` desativa animações |

---

## 10. Como Usar

### Localmente (sem servidor)

Abra o `index.html` diretamente no navegador:

```
Duplo clique em index.html
```

> As imagens carregam dos servidores Apple — requer conexão com internet.
> Seria importante alterar para local assim que possível.

### Com servidor local (recomendado)

```bash
# Python 3
cd apple-iphone
python -m http.server 8000

# Node.js (npx)
npx serve apple-iphone

# VS Code
Instale a extensão "Live Server" e clique em "Go Live"
```

Acesse: `http://localhost:8000`

### Hospedagem

Os três arquivos podem ser enviados para qualquer servidor estático
(Netlify, Vercel, GitHub Pages, etc.) sem configuração adicional.

---

*Documentação gerada para o projeto Apple iPhone BR — Recriação.*
*Última atualização: Abril de 2026.*