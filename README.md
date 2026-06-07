# PI5 — Frontend

Interface web do projeto integrador PI5, onde desenvolvemos uma IA jogadora para competir em partidas do jogo de tabuleiro **The Last Graduation**.

## O jogo

Inspirado no Santorini, The Last Graduation é disputado em um tabuleiro 5×5. Dois times se enfrentam tentando ser o primeiro a levar um professor ao **nível 3**:

- **Time Turing**: CLARO e REY
- **Time Lovelace**: KARIN e BEATRIZ

Em cada turno, o jogador move um professor para uma célula adjacente (subindo no máximo 1 nível) e depois constrói em uma célula adjacente ao destino, elevando-a 1 nível. Células no nível 4 (cúpula) ficam permanentemente bloqueadas.

## Funcionalidades

- **Jogador**: cadastro do grupo e configuração do endpoint da IA
- **Listagem de partidas**: todas as partidas com status em tempo real e busca por grupo
- **Espectador**: acompanhe partidas ao vivo via WebSocket
- **Detalhe de partida**: visualize o tabuleiro final de partidas encerradas

## Como rodar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Build para produção

```bash
npm run build
npm run start
```
