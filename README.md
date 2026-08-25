# PI5 — Frontend

Frontend web desenvolvido para o projeto **The Last Graduation**, um jogo de estratégia inspirado no jogo de tabuleiro **Santorini**.

A aplicação fornece a interface para interação com as partidas, permitindo visualizar jogos em andamento ou finalizados, entrar em partidas disponíveis e acompanhar partidas em tempo real como espectador.

O frontend foi desenvolvido com **React e Vite**, utilizando **React Router** para navegação, **Tailwind CSS** para estilização e **WebSocket** para atualização das partidas em tempo real.

---

## 🎮 Funcionalidades

### 🏠 Listagem de partidas

A página inicial apresenta as partidas disponíveis, com:

* Paginação das partidas;
* Busca por nome de grupo;
* Identificação do status da partida;
* Visualização dos grupos participantes;
* Ações disponíveis de acordo com o estado da partida.

As opções apresentadas incluem **Entrar**, **Assistir** e **Ver partida**, dependendo da situação de cada jogo.

---

### 👁️ Modo espectador

A aplicação possui uma tela específica para acompanhar partidas como espectador.

Ao acessar uma partida em andamento:

1. O usuário é registrado como espectador;
2. A aplicação recebe um `spectator_access_token`;
3. Uma conexão **WebSocket** é estabelecida;
4. As jogadas são recebidas em tempo real;
5. O tabuleiro é atualizado conforme a partida acontece.

A interface também apresenta o estado da conexão, indicando quando a partida está **ao vivo** ou quando está **conectando**.

Quando a partida já terminou, o tabuleiro é apresentado no seu estado final sem necessidade de estabelecer uma conexão WebSocket.

---

## 🎲 Tabuleiro

O tabuleiro possui uma grade **5×5**, representando o estado atual da partida.

Cada célula apresenta:

* Nível de construção;
* Posição do professor;
* Identificação visual das construções;
* Representação diferenciada para construções de nível 4, utilizando uma cúpula.

O componente do tabuleiro foi desenvolvido de forma reutilizável, recebendo o estado através de `props` e podendo ser utilizado tanto em partidas ao vivo quanto em partidas finalizadas.

---

## 🔐 Autenticação

O estado do jogador autenticado é gerenciado utilizando **React Context**.

O token de autenticação é persistido no `localStorage`, permitindo que a sessão seja restaurada quando o usuário retorna à aplicação.

As requisições à API utilizam um helper centralizado para adicionar automaticamente o header de autorização, evitando a necessidade de passar o token manualmente em cada chamada.

---

## 🧩 Arquitetura

A estrutura do frontend foi organizada separando infraestrutura, domínio do jogo, rotas e componentes reutilizáveis:

```text
src/
├── core/
│   ├── components/
│   └── helpers/
│
├── feature/
│   └── game/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       └── ...
│
├── routes/
│
├── styles/
│
├── ui/
│
└── main.jsx
```

A separação permite manter a lógica específica do jogo concentrada em `feature/game`, enquanto componentes e funcionalidades compartilhadas ficam organizados em `core` e `ui`.

---

## ⚙️ Tecnologias

* **React 19**
* **Vite**
* **React Router**
* **Tailwind CSS**
* **React Hook Form**
* **Zod**
* **WebSocket**
* **JavaScript**
* **HTML/CSS**
* **Git/GitHub**

As principais dependências e ferramentas utilizadas estão definidas no `package.json` do projeto.

---

## 🚀 Executando o projeto

### Pré-requisitos

É necessário ter o **Node.js** instalado.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/alinedka/pi5-frontend.git
```

Entre na pasta:

```bash
cd pi5-frontend
```

Instale as dependências:

```bash
npm install
```

### Ambiente de desenvolvimento

Execute:

```bash
npm run dev
```

O Vite iniciará o servidor de desenvolvimento.

### Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

Os scripts disponíveis no projeto incluem `dev`, `build`, `start`, `lint` e `preview`.

---

## 🔗 Integração com o Backend

O frontend faz parte do projeto **PI5 — Jogador Inteligente** e foi desenvolvido para trabalhar em conjunto com a API responsável pelo gerenciamento das partidas e pela comunicação com o jogador inteligente.

O backend utiliza **Python + FastAPI**, enquanto o frontend é responsável pela interface web e pela interação visual com as partidas.

---

## 📚 Documentação

Para informações mais detalhadas sobre a arquitetura, componentes e decisões técnicas do frontend, consulte:

* **[REPORT.md](REPORT.md)** — relatório técnico do frontend.

---

## 🎯 Objetivo do projeto

O objetivo do frontend é fornecer uma interface web organizada e interativa para o **The Last Graduation**, permitindo aos jogadores e espectadores acompanhar as partidas de forma intuitiva e receber atualizações em tempo real durante os jogos.
