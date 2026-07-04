# Latam Explorer

Plataforma web para descoberta de destinos turísticos e planejamento
financeiro de viagens pela América Latina. O projeto reúne guias de
destinos, um conversor de moedas em tempo real e um canal de contato,
com navegação responsiva e suporte a tema claro/escuro.

Desenvolvido para fins acadêmicos na disciplina de Programação Front-End.

## Tecnologias utilizadas

- **HTML5** — marcação semântica (`header`, `main`, `footer`, `nav`),
  atributos de acessibilidade e SEO básico.
- **CSS3** — variáveis customizadas (`:root` / `[data-theme="dark"]`),
  Flexbox, CSS Grid e media queries para responsividade.
- **JavaScript (ES6 Modules)** — código organizado em módulos nativos
  (`import`/`export`), sem bundler, sem frameworks e sem dependências
  externas.

Nenhuma biblioteca ou framework (React, Vue, jQuery etc.) é utilizado.
Toda a interatividade é implementada em Vanilla JS.

## Funcionalidades

### Navegação
- Menu único (`#menu`), presente dentro do `header` em todas as páginas.
- Comportamento responsivo: barra horizontal no desktop e gaveta lateral
  deslizante no mobile, controlada pelo botão hambúrguer (`#btn-mobile`).
- Fecha automaticamente ao clicar em um link ou fora da área do menu.

### Tema claro/escuro
- Alternância de tema via botão `#btn-theme`.
- Preferência persistida em `localStorage` e reaplicada assim que a
  página carrega, evitando flash de tema incorreto.

### Conversor de moedas (página Ferramentas)
- Busca taxas de câmbio em tempo real na API pública
  `exchangerate-api.com` (base BRL).
- Cache em memória para evitar novas requisições a cada digitação.
- Fallback automático para uma tabela de taxas fixas caso a API falhe,
  esteja indisponível ou não retorne todas as moedas suportadas —
  o conversor nunca fica sem funcionar.
- Conversão entre Real (BRL) e moedas da região (ARS, CLP, COP, MXN,
  PEN, UYU), além de USD e EUR, sempre usando o BRL como base
  intermediária do cálculo.
- Botão de inversão rápida entre moeda de origem e destino.

### Destinos (página Destinos)
- Grid responsivo construído com CSS Grid (`auto-fit` + `minmax`),
  ajustando o número de colunas conforme a largura da tela.
- Base de dados local com 22 destinos distribuídos em 8 países
  (Colômbia, Peru, Chile, Argentina, México, Brasil, Bolívia e Uruguai).
- Busca textual por cidade, país ou descrição.
- Filtro por país, com botões gerados dinamicamente a partir dos dados.
- Modal de detalhes com roteiro sugerido e estimativa de gasto diário
  por destino.

### Formulário de contato
- Validação client-side em JavaScript: nome (mínimo 3 caracteres),
  e-mail (formato validado por expressão regular) e mensagem (mínimo
  10 caracteres).
- Mensagens de erro por campo e mensagem de sucesso ao enviar um
  formulário válido.

### FAQ
- Accordion interativo na página Ferramentas: cada pergunta expande e
  recolhe sua resposta, fechando os demais itens abertos.

### SEO e acessibilidade básica
- `lang="pt-BR"` no elemento `html`.
- `meta description` específica por página.
- Atributos `alt` descritivos nas imagens de destinos.
- HTML semântico (`header`, `nav`, `main`, `section`, `footer`).

## Estrutura de pastas

```text
latam-explorer/
├── index.html                          # Página inicial (hero + destaques)
├── destinos.html                       # Grid de destinos, busca e filtros
├── ferramentas.html                    # Conversor de moedas e FAQ
├── contato.html                        # Formulário de contato
├── css/
│   └── style.css                       # Estilos globais, variáveis de tema e responsividade
├── js/
│   ├── main.js                         # Ponto de entrada: inicialização condicional por página
│   ├── controllers/
│   │   ├── menuController.js           # Menu responsivo (desktop/mobile)
│   │   ├── themeController.js          # Alternância e persistência do tema
│   │   ├── converterController.js      # Conversor de moedas + FAQ (página Ferramentas)
│   │   ├── destinationsController.js   # Grid, busca, filtros e modal (página Destinos)
│   │   └── contactController.js        # Validação do formulário (página Contato)
│   └── services/
│       ├── currencyService.js          # Consumo da API de câmbio + fallback + cache
│       └── destinationsService.js      # Acesso aos dados de destinos
└── assets/
    └── data/
        └── destinosData.js             # Base de dados local dos 22 destinos
```

## Arquitetura

### Controllers x Services

O projeto segue uma separação simples entre duas camadas:

- **Services** (`js/services/`) não manipulam o DOM. Sua responsabilidade
  é buscar e retornar dados: `currencyService.js` fala com a API de
  câmbio (e aplica o fallback), `destinationsService.js` lê a lista de
  destinos em `assets/data/destinosData.js`.
- **Controllers** (`js/controllers/`) manipulam o DOM: selecionam
  elementos, escutam eventos e renderizam resultados na tela. Eles
  consomem os services por meio de funções importadas, mas não sabem
  de onde os dados vêm.

Essa divisão mantém a lógica de obtenção de dados isolada da lógica de
interface, facilitando testar ou trocar uma fonte de dados sem alterar
o código que atualiza a tela.

### Inicialização condicional por página

Como as quatro páginas compartilham o mesmo `js/main.js`, a
inicialização de cada funcionalidade é condicionada à presença de um
elemento específico daquela página no DOM:

```javascript
document.addEventListener('DOMContentLoaded', () => {

    // Globais: presentes em TODAS as páginas
    inicializarMenu();
    inicializarTema();

    // Página Ferramentas: conversor de moedas + FAQ
    if (document.getElementById('valorOrigem')) {
        inicializarConversor();
    }

    if (document.querySelector('.faq-pergunta')) {
        inicializarFaq();
    }

    // Página Contato: formulário
    if (document.getElementById('formContato')) {
        inicializarContato();
    }

    // Página Destinos: grid + filtros + modal
    if (document.getElementById('grid-destinos')) {
        inicializarDestinos();
    }

});
```

Isso evita erros de elemento inexistente ao carregar um script comum em
páginas que não possuem aquele recurso, sem precisar de um roteador ou
de scripts separados por página. Apenas `inicializarMenu()` e
`inicializarTema()` rodam incondicionalmente, pois o menu e o tema
existem em todas as páginas.

### Por que Vanilla JS, sem framework

O escopo do projeto — quatro páginas estáticas com interatividade
pontual (menu, tema, conversor, busca/filtro, modal, formulário) — não
justifica a complexidade de build tooling, gerenciamento de estado ou
um framework de componentes. ES6 Modules nativos já fornecem
organização de código (`import`/`export`) e encapsulamento suficientes
para este tamanho de aplicação, mantendo o projeto simples de rodar,
ler e avaliar academicamente sem etapa de compilação.

## Como executar localmente

O projeto usa `import`/`export` de ES6 Modules (`<script type="module">`),
que os navegadores bloqueiam por política de CORS quando o HTML é aberto
diretamente do disco (protocolo `file://`). É necessário servir os
arquivos por HTTP.

**Opção 1 — Live Server (VS Code)**

Instale a extensão "Live Server", clique com o botão direito em
`index.html` e selecione "Open with Live Server".

**Opção 2 — Servidor HTTP embutido do Python**

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080` no navegador.

**Opção 3 — Node.js**

```bash
npx serve .
```

Qualquer uma das opções acima expõe os arquivos por `http://`, permitindo
que os módulos ES6 sejam carregados corretamente.

## Decisões de design

- **Paleta de cores**: inspirada na identidade visual latino-americana,
  fugindo da paleta genérica "flat UI" azul/laranja. Combina verde-selva
  profundo (cor primária), terracota/pôr-do-sol (cor secundária) e areia
  quente (fundo), remetendo aos Andes, ao deserto e à arquitetura
  colonial da região.
- **Dark mode**: implementado via atributo `data-theme="dark"` na raiz
  do documento, redefinindo as variáveis CSS de cor. O tema escuro usa
  tons de marrom/verde escuro dessaturados em vez de cinza-azulado
  genérico, mantendo a identidade visual e o contraste de texto em
  conformidade com WCAG AA.
- **Responsividade mobile-first no menu**: a navegação é a mesma marcação
  HTML em todas as páginas, alternando entre layout horizontal (desktop)
  e gaveta lateral (mobile) apenas via CSS, com o JavaScript controlando
  somente a classe de estado (`.active`).
- **Grid fluido de destinos**: uso de `repeat(auto-fit, minmax(...))` no
  CSS Grid para adaptar automaticamente o número de colunas à largura da
  tela, sem media queries adicionais para cada breakpoint intermediário.

## Créditos

- **Imagens**: fotos de destinos e imagem de fundo do hero fornecidas
  pelo [Unsplash](https://unsplash.com), usadas conforme a licença
  gratuita da plataforma.
- **API de câmbio**: cotações fornecidas por
  [exchangerate-api.com](https://www.exchangerate-api.com), com fallback
  local para taxas fixas em caso de indisponibilidade.

## Licença / uso acadêmico

Projeto desenvolvido exclusivamente para fins educacionais, como
atividade da disciplina de Programação Front-End. Não possui fins
comerciais.
