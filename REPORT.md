# REPORT — Frontend

O frontend foi feito com React + Vite, usando React Router para navegação, Tailwind CSS para estilização e WebSocket para atualizações em tempo real na tela de espectador.

---

## Estrutura de Pastas

```
src/
├── core/          #Infraestrutura compartilhada (layout, helpers, constantes)
├── feature/game/  #Toda a lógica de domínio do jogo (API, contexto, hooks, DTOs)
├── routes/        #Páginas roteadas diretamente pelo React Router
└── ui/            #Componentes de UI genéricos e reutilizáveis
```

---

## Componentes e Motivações

### Contexto de Jogo (`feature/game/context/game-context.jsx`)

O estado do jogador autenticado fica num Context do React, persistido em `localStorage`. O motivo principal foi simples: não queríamos que o usuário perdesse o login toda vez que fechasse o navegador. Ao carregar a página, o token é restaurado automaticamente e injetado em todas as chamadas de API via um helper centralizado (fetch.js) — assim não precisamos passar o token manualmente em cada requisição.

### Listagem de Partidas (`routes/home-page.jsx`)

A home lista todas as partidas com paginação de 10 por vez. A lista recarrega sempre que o estado de autenticação muda. Cada card mostra o status com cor diferente, os grupos dos dois times e botões de ação conforme o estado — "Assistir" para partidas em andamento, "Ver partida" para finalizadas, e "Entrar" para partidas aguardando jogador.

Mais tarde adicionamos busca por nome de grupo — ao buscar, a paginação some e buscamos até 100 resultados de uma vez, filtrando no cliente.

### Tela de Espectador (`routes/spectate-page.jsx` + `feature/game/components/spectate-game.jsx`)

Ao entrar em `/spectate/:gameId`, o componente se registra automaticamente como espectador para obter o `spectator_access_token`. Com o token, abre uma conexão WebSocket que recebe cada jogada em tempo real. Adicionamos um indicador "Ao vivo / Conectando..." porque sem ele não tinha como saber se a conexão tinha caído.

Quando a partida está finalizada, o componente mostra o tabuleiro congelado no estado final em vez de tentar conectar o socket — percebemos que dava pra reutilizar o mesmo `SpectateGame` para os dois casos, só condicionando pelo campo `status` que a API já retorna.

### Tabuleiro (`feature/game/components/view-game.jsx`)

Grade 5×5 onde cada célula mostra o nível de construção e o professor que ocupa a posição. Nível 4 aparece como cúpula com ícone diferente. O componente não tem estado próprio — recebe tudo por props, o que facilita usá-lo tanto ao vivo quanto na visualização de partida finalizada.

### Menu de Navegação (`core/components/root-menu.jsx`)

Menu fixo no topo com as seções disponíveis. Quando autenticado, mostra o nome do jogador e um botão "Sair" que limpa o estado e o `localStorage`.

---

## Decisões Técnicas

**Stack:** React + Vite + React Router v7 + Tailwind CSS. Tailwind foi especialmente útil para não criar arquivos CSS separados por componente — estilização direto no JSX agilizou bastante o desenvolvimento.

**Sem gerenciador de estado externo (Redux, Zustand):** o estado do app é basicamente o jogador logado e os dados de espectador. Context + useState foi suficiente e evitou uma dependência desnecessária.

**Fetch centralizado:** criamos um helper `fetch.js` que injeta o header `Authorization` automaticamente. Sem isso teríamos que passar o token em cada chamada de API espalhada pelo código.
