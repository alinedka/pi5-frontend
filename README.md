# PI5 — Jogador Inteligente

Projeto desenvolvido para implementação de um **jogador inteligente** para o jogo **The Last Graduation**, um jogo de estratégia inspirado no jogo de tabuleiro **Santorini**.

O projeto utiliza técnicas de **Inteligência Artificial** para analisar o estado do tabuleiro, avaliar possíveis jogadas e selecionar ações estratégicas durante a partida.

A aplicação conta com uma **API REST desenvolvida em Python com FastAPI**, responsável por receber o estado atual do jogo e retornar a jogada escolhida pelo algoritmo.

---

## 🧠 Inteligência Artificial

O jogador utiliza algoritmos de busca para analisar diferentes possibilidades de jogadas e tomar decisões durante a partida.

As principais técnicas utilizadas são:

* **Minimax** — análise de possíveis sequências de jogadas para escolha da melhor ação;
* **Alpha-Beta Pruning** — redução do número de estados analisados durante a busca;
* **Iterative Deepening** — realização de buscas progressivamente mais profundas;
* **Ordenação de jogadas** — priorização de jogadas relevantes durante a busca;
* **Função heurística** — avaliação da qualidade dos estados do tabuleiro.

A implementação também utiliza uma abordagem de **make/undo**, permitindo realizar e desfazer movimentos durante a busca sem precisar criar uma cópia completa do tabuleiro a cada operação.

---

## ⚙️ API

O projeto possui um backend desenvolvido utilizando **FastAPI**.

### `GET /health`

Endpoint utilizado para verificar se a aplicação está funcionando corretamente.

### `POST /move`

Recebe o estado atual do jogo e retorna a jogada escolhida pelo jogador inteligente.

---

## 🧪 Testes locais

O projeto possui arquivos auxiliares para desenvolvimento e testes locais do algoritmo.

### 1. Implementação do algoritmo

O algoritmo deve ser desenvolvido em:

```text
pi5-aux/ia_template.py
```

Na função:

```python
escolher_jogada(payload)
```

Essa função recebe o estado atual do jogo e retorna a jogada escolhida pelo algoritmo.

---

### 2. Testar uma jogada

Para executar uma única jogada utilizando um estado aleatório:

```bash
python pi5-aux/rodar_jogada_unica.py
```

O script:

1. Gera um tabuleiro aleatório;
2. Cria o estado do jogo;
3. Executa o algoritmo;
4. Verifica se a resposta corresponde a uma jogada válida.

---

### 3. Simular uma partida completa

Para executar uma partida local:

```bash
python pi5-aux/simular_partida_local.py
```

A simulação utiliza:

* **Time 1:** jogador desenvolvido;
* **Time 2:** jogador aleatório.

A partida é executada até ocorrer:

* vitória de um dos jogadores;
* jogada inválida;
* limite de turnos.

---

## 📊 Validação

As ferramentas de simulação permitem testar o comportamento do jogador inteligente em partidas completas, verificando se as jogadas produzidas pelo algoritmo são válidas e permitindo avaliar seu desempenho contra um jogador aleatório.

As simulações também podem ser utilizadas durante o desenvolvimento para identificar problemas na lógica de decisão e validar alterações realizadas no algoritmo.

---

## 🛠️ Tecnologias

* **Python**
* **FastAPI**
* **Inteligência Artificial**
* **Minimax**
* **Alpha-Beta Pruning**
* **Iterative Deepening**
* **Git**
* **GitHub**

---

## 📁 Estrutura do projeto

```text
pi5/
├── backend/
│   ├── main.py
│   └── ia.py
│
├── pi5-aux/
│   ├── ia_template.py
│   ├── rodar_jogada_unica.py
│   ├── simular_partida_local.py
│   └── game_simulator.py
│
├── game_simulator.py
├── ia_template.py
├── requirements.txt
├── Procfile
├── REPORT.md
└── README.md
```

---

## 📚 Documentação

Para informações mais detalhadas sobre a implementação, algoritmos utilizados e decisões de desenvolvimento, consulte:

* **[REPORT.md](REPORT.md)** — relatório técnico do projeto;
* **[como-usar-pi5-aux.md](como-usar-pi5-aux.md)** — instruções para execução dos testes locais.

---

## 🎮 Sobre o jogo

**The Last Graduation** é um jogo de estratégia inspirado no conceito e na mecânica do jogo de tabuleiro **Santorini**.

O objetivo do projeto é utilizar técnicas de Inteligência Artificial para desenvolver um jogador capaz de analisar o tabuleiro e tomar decisões estratégicas de forma autônoma.
