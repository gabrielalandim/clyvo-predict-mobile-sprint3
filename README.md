# 🐾 CLYVO Predict — App Mobile (Sprint 3)

> *Do Reativo ao Preventivo*

Aplicativo mobile desenvolvido para o **FIAP Challenge 2026** (2TDS · 3ª Sprint — Mobile Application Development).
Nesta entrega o app deixou de usar dados 100% locais (AsyncStorage) e passou a consumir a **API Java (Spring Boot)** de verdade, incluindo login com JWT, CRUD de pets, histórico de eventos de saúde e cadastro de pet por foto usando a IA (Python), sempre através do backend.

---

## 👥 Equipe

| Nome | RM |
|---|---|
| Eduarda Weiss Ventura | 564434 |
| Maria Gabriela Landim Severo | 565146 |
| Samara Porto Souza | 559072 |
| Lucas Nunes Soares | 566503 |
| Camily Vitoria Pereira Maciel | 566520 |

---

## 🧩 Arquitetura geral

```
┌──────────────┐        HTTP + JWT        ┌───────────────┐      HTTP interno      ┌──────────────┐
│  App Mobile  │ ───────────────────────▶ │  API Java     │ ─────────────────────▶ │  IA (Python) │
│ (Expo / RN)  │ ◀─────────────────────── │ (Spring Boot) │ ◀───────────────────── │  gemini/etc  │
└──────────────┘                          └───────┬───────┘                        └──────────────┘
                                                   │
                                                   ▼
                                             Oracle (FIAP)
```

**O mobile nunca fala com o Python.** Ele só chama a API Java; é o Java quem decide chamar o serviço de IA (`clyvo.ai.url`, hoje apontando pra `http://localhost:5000`).

### Fluxo de cadastro com foto

```
Usuário escolhe/tira foto
        │
        ▼
POST /api/pets/analisar-cadastro  (multipart, campo "imagem")
        │
        ▼
   Java repassa a imagem pro Python
        │
        ▼
   IA analisa e devolve espécie, raça, cor, porte, faixa de peso, condição corporal
        │
        ▼
   App pré-preenche o formulário (tudo editável)
        │
        ▼
   Usuário confirma / edita
        │
        ▼
POST /api/pets   (só agora o pet é salvo de verdade)
```

### Fluxo de cadastro manual

```
Cadastro manual → formulário vazio → usuário preenche tudo → POST /api/pets
```

Os dois fluxos passam pela mesma tela (`AddPet.tsx`), diferenciados por um parâmetro de rota (`mode: 'manual' | 'photo'`), acessados a partir da nova tela de escolha (`AddPetChoice.tsx`, tela "Cadastrar pet manualmente" vs "Cadastrar pet com IA").

---

## ⚙️ Stack Tecnológica

- **Framework:** React Native + Expo SDK 57 (atualizado nesta revisão — o app do Expo Go nas lojas só suporta a versão mais recente do SDK, então o projeto precisou acompanhar; a versão anterior estava em SDK 54)
- **Linguagem:** TypeScript (strict mode)
- **Navegação:** React Navigation Stack v7, com troca de stack (auth vs. app) conforme sessão
- **HTTP:** Axios, com interceptor que injeta `Authorization: Bearer <token>` automaticamente
- **Autenticação:** JWT emitido pela API Java (`POST /api/tutores/login`), guardado com AsyncStorage (só o token/identidade — ver seção de limitações)
- **Upload de imagem:** `expo-image-picker` (câmera ou galeria) + `FormData`/`multipart/form-data`
- **Ícones:** Expo Vector Icons (Ionicons)

---

## 🚀 Como rodar tudo junto (Java + Python + Mobile)

Isso **precisa rodar em 3 processos separados, ao mesmo tempo**, na mesma rede:

### 1. Backend Java (`clyvo-predict-main`)

```bash
cd clyvo-predict-main
./mvnw spring-boot:run
```

Confirme em `src/main/resources/application.properties`:
- `server.port=8080`
- `clyvo.ai.url=http://localhost:5000` → precisa apontar pro endereço onde o serviço Python está rodando (se Java e Python estiverem na mesma máquina, `localhost` funciona; se estiverem em máquinas diferentes, troque pelo IP da máquina do Python).
- Conexão Oracle FIAP configurada (usuário/senha do banco).

### 2. Serviço de IA (Python)

Não recebemos o repositório do serviço Python nesta entrega — só o Java e o mobile. Ele precisa expor, na porta que `clyvo.ai.url` aponta:
- `POST /api/v2/pets/analyze-registration-photo` (chamado pelo Java a partir de `/api/pets/analisar-cadastro`)
- `POST /api/v2/score/consolidado` (chamado pelo Java a partir de `/api/ia/score`)

> ⚠️ **Sobre a chave de API enviada**: o arquivo `env` que veio junto com os uploads contém uma `GOOGLE_API_KEY` em texto puro. Recomendamos fortemente **revogar essa chave agora no Google AI Studio** e gerar uma nova, já que ela ficou exposta fora do `.gitignore` do repositório Python. Nunca commitem esse arquivo.

### 3. Mobile

Antes de rodar, configure o IP do Java em **`src/config/env.ts`**:

```typescript
const API_HOST = '192.168.1.4'; // troque pelo IP da máquina rodando o Java
const API_PORT = 8080;
```

| Onde vai testar | `API_HOST` |
|---|---|
| Emulador Android (AVD) | `10.0.2.2` |
| Simulador iOS | `localhost` |
| Celular físico (Expo Go) | IP da máquina do Java na mesma Wi-Fi (`ipconfig` / `ifconfig`) |

```bash
npm install
npm start
```

Escaneie o QR Code com o **Expo Go**, ou rode `npm run android` / `npm run ios`.

**Ordem de inicialização recomendada:** Python → Java → Mobile (o Java só falha na hora de chamar `/analisar-cadastro`; as demais rotas de pets/tutores funcionam mesmo com o Python desligado).

---

## 📱 Telas do Aplicativo

| Tela | Rota | Descrição |
|---|---|---|
| Welcome | `Welcome` | Onboarding |
| Login | `Login` | Autenticação via `POST /api/tutores/login`, guarda o JWT |
| Cadastro de tutor | `Register` | `POST /api/tutores`, loga automaticamente depois |
| Home | `Home` | Lista pets vindos de `GET /api/pets`, com pull-to-refresh |
| Escolha de cadastro | `AddPetChoice` | "Cadastrar pet manualmente" vs. "Cadastrar pet com IA" |
| Cadastrar Pet | `AddPet` | Formulário único para os dois fluxos (`mode: manual \| photo`) |
| Detalhes do Pet | `PetDetails` | Dados de `GET /api/pets/{id}` + histórico de `GET /api/eventos/pet/{id}` |
| Registrar Evento | `AddHealthEvent` | `POST /api/eventos` — vacina, consulta, exame, doença leve/grave, cirurgia, acidente |
| Histórico | `History` | Gráfico de evolução e breakdown por período, a partir dos eventos reais da API |
| Carteirinha | `Carteirinha` | Carteira digital (seções de vacina/exame/consulta seguem com dados de exemplo — não fazem parte do escopo de CRUD desta sprint) |
| Perfil | `tutorProfile` | Dados da sessão logada + logout real (limpa o JWT) |

---

## 📁 Estrutura de Pastas (o que mudou)

```
src/
├── config/
│   └── env.ts               # NOVO — IP/porta da API Java
├── utils/
│   └── species.ts            # NOVO — normalização única de espécie (corrige bug de ícone)
├── models/
│   ├── Pet.ts                 # RENOMEADO de Pets.tsx/Pet.tsx — alinhado ao PetResponseDTO
│   ├── HealthEvent.ts         # NOVO — TipoEvento alinhado ao enum real do backend
│   ├── Auth.ts                # NOVO
│   └── PetAiAnalysis.ts       # NOVO — espelha a resposta de /analisar-cadastro
├── services/
│   ├── api.ts                 # Axios + interceptor JWT + parser de erro do Spring
│   ├── session.ts             # NOVO — guarda só o token/identidade (AsyncStorage)
│   ├── authService.ts         # NOVO — login/registro/logout reais
│   ├── petService.ts          # NOVO — CRUD real de pets + análise de foto
│   ├── healthEventService.ts  # NOVO — CRUD real de eventos de saúde
│   └── petExtrasStorage.ts    # NOVO — só os campos que o backend ainda não persiste
├── contexts/
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx        # NOVO — sessão do tutor disponível em todo o app
└── screens/
    ├── Login.tsx               # NOVO
    ├── Register.tsx            # NOVO
    ├── AddPetChoice.tsx         # NOVO
    └── (demais telas migradas de AsyncStorage para os services acima)
```

`storage.ts` (o AsyncStorage antigo com pets/eventos) foi **removido** — toda a lógica de pets e eventos agora vive nos services acima, contra a API real.

---

## 🐛 Bugs corrigidos nesta sprint

1. **Import quebrado do modelo `Pet`** — `storage.ts` importava de `@models/Pets` (plural) mas o arquivo real era `src/models/Pet.tsx` (singular). Esse é o tipo de erro que quebra o bundler silenciosamente dependendo de cache do Metro. Consolidado em um único `src/models/Pet.ts`.
2. **Ícone de raça errado em "Outros" (aves, roedores...)** — cada tela (`PetCard`, `PetHistory`, etc.) tinha sua própria lógica ad-hoc pra decidir se um pet era `dog`/`cat`/`other` a partir de strings em português/inglês vindas de fontes diferentes. Bastava uma variação de acentuação ou fonte de dado pra cair no emoji errado. Centralizado em `src/utils/species.ts` (`normalizeSpecies`), usado por todo o app — inclusive pelas sugestões que virão da IA (`especie: "Cao"`).
3. **Histórico de saúde incompatível com o backend** — o enum local de eventos tinha `VERMIFUGO` e `EMERGENCIA`, que **não existem** no `TipoEvento.java` do backend (que tem `DOENCA_LEVE`, `DOENCA_GRAVE`, `ACIDENTE`). Isso não dava erro no app antigo porque tudo era local, mas quebraria (400 do Spring) assim que integrado de verdade. Corrigido em `src/models/HealthEvent.ts`, com os 7 valores reais e o impacto de score de cada um espelhando `TipoEvento.java`.
4. **Score de cada evento no histórico sempre "0" (ou um valor sem sentido)** — o backend (`EventoSaudeService.buscarEventosPorPet`) devolve `evento.getPet().getHealthScore()` — o score **atual** do pet — repetido em todos os eventos da lista, porque a entidade `EventoSaude` não guarda o score resultante de cada evento no momento em que ele foi criado. Isso não tem conserto possível só no mobile (a informação histórica simplesmente não existe na resposta da API). Solução aplicada: o app mostra o impacto fixo de cada categoria (`TipoEvento.java`: Vacina +10, Consulta +5, Exame +5, Doença leve -15, Cirurgia -30, Doença grave -40, Acidente -50) em vez de tentar reconstruir uma diferença que a API não sustenta. A correção definitiva fica documentada abaixo, no backend.
5. **Data inválida podendo ser enviada pro backend** (`dataEvento: "2026-89-01"` → 400 do Spring, "Invalid value for MonthOfYear: 89") — o campo de data deixava passar edição no meio do texto sem revalidar os dígitos. Corrigido com uma máscara + validação de calendário de verdade em `src/utils/dateInput.ts`, usada tanto no cadastro de pet (data de nascimento) quanto no registro de evento de saúde.

---

## ⚠️ Limitações conhecidas (leiam antes de avaliar)

- **Backend só persiste `nome, especie, raca, idade, peso, healthScore`.** A entidade `Pet` do Java (`br.com.fiap.clyvo.model.Pet`) não tem colunas para foto, cor, porte, condição corporal, data de nascimento, sexo, castração, microchip ou observações — campos que a tela pede (e que a IA devolve). Enquanto o backend não expõe isso, esses campos ficam guardados **localmente por `id` do pet** (`petExtrasStorage.ts`), só para completar a experiência visual da tela. **Nome, espécie, raça, idade, peso e score sempre vêm/vão pela API de verdade** — isso não é "fingir integração", é uma limitação documentada do schema atual. Se o time quiser, o próximo passo natural é o pessoal do Java adicionar essas colunas e o app passa a mandar tudo pra API.
- **Rota do backend inconsistente:** `SecurityConfig.java` protege `/api/eventos-saude/**`, mas o `EventoSaudeController` está mapeado em `/api/eventos`. Isso não impede o app de funcionar (a rota real cai na regra genérica `.anyRequest().authenticated()`, que já exige um JWT válido de qualquer perfil), mas vale o time do Java ajustar o path do `SecurityConfig` para exigir explicitamente `TUTOR`/`VETERINARIO` nessa rota também.
- **`EventoSaude` não persiste o score histórico de cada evento** — precisa de uma migration nova adicionando `novo_health_score` em `tb_evento_saude`, preenchida em `EventoSaudeService.cadastrarEvento` e usada (em vez de `evento.getPet().getHealthScore()`) em `buscarEventosPorPet`. Sem isso, o histórico de score por evento nunca vai refletir o valor real de cada momento — ver "Bugs corrigidos" acima.
- **Excluir um pet com eventos de saúde falha com `ORA-02292`** (violação de FK) — falta `cascade = CascadeType.ALL, orphanRemoval = true` na relação `Pet → EventoSaude` (ou `ON DELETE CASCADE` na constraint do banco).
- **Vídeo de apresentação:** não temos como gravar/publicar vídeo por aqui. As instruções acima (rodar Python → Java → Mobile, telas envolvidas) servem de roteiro para a gravação exigida no critério "Vídeo de apresentação do aplicativo (15 pontos)".
- Não recebemos o repositório do serviço Python nesta entrega, então não foi possível testar o fluxo de `/analisar-cadastro` ponta a ponta — só o contrato (request/response) documentado no enunciado foi validado contra o código Java real (`ClyvoAiService.java`, `PetRegistrationAiResponseDTO.java`).

---

## 🧠 Score de Saúde (0–100)

Calculado pelo **backend** a cada evento (`TipoEvento.calcularNovoScore`), não mais localmente:

| Evento | Impacto |
|---|---|
| Vacina | +10 pts |
| Consulta de rotina | +5 pts |
| Exame | +5 pts |
| Doença leve | −15 pts |
| Cirurgia | −30 pts |
| Doença grave | −40 pts |
| Acidente | −50 pts |

| Faixa | Status |
|---|---|
| 80–100 | Excelente |
| 50–79 | Regular |
| 0–49 | Crítico |

---

## 🔐 Autenticação

- `POST /api/tutores` — cria a conta do tutor.
- `POST /api/tutores/login` — devolve `{ id, nome, email, perfil, token }`; o `token` (JWT RS256) é salvo via `sessionStorage.ts` e reenviado em todo request subsequente pelo interceptor do Axios (`api.ts`).
- Rotas de `/api/pets/**` e `/api/eventos/**` exigem `ROLE_TUTOR` ou `ROLE_VETERINARIO` — o app assume perfil de tutor.
- Logout limpa o token local; não existe endpoint de logout no backend (JWT stateless), então é só descartar o token do dispositivo mesmo.

---

## 🐾 Espécies e Raças Suportadas

**Cão:** Golden Retriever, Vira-lata (SRD), Pastor Alemão, Bulldog, Labrador, Pinscher
**Gato:** Persa, Siamês, Vira-lata (SRD), Maine Coon, Angorá, Ragdoll
**Outro:** Calopsita, Coelho Netherland, Hamster Sírio, Porquinho da Índia, Ferret, Chinchila

Se a IA sugerir uma raça fora dessa lista fixa, o app cai automaticamente no modo "raça digitada" (`isCustomBreed`) para não esconder o palpite da IA atrás de uma lista incompleta.

---

## 📋 Requisitos avaliativos da Sprint 3 — status

| Requisito | Status | Onde |
|---|---|---|
| Navegação entre telas (5 pts) | ✅ | 11 rotas, `AppNavigator.tsx`, com troca de stack por sessão |
| Integração com API Backend HTTP (35 pts) | ✅ | `petService.ts`, `healthEventService.ts`, `authService.ts` — todas as chamadas reais, com loading state e tratamento de erro |
| Sistema de autenticação — Login (20 pts) | ✅ | JWT real via `/api/tutores/login`, sessão persistida, rotas protegidas (stack condicional) |
| Arquitetura e organização do código (20 pts) | ✅ | Camadas separadas: `screens` (UI) / `services` (API) / `models` (tipos) / `contexts` (estado global) / `utils` (regras compartilhadas) |
| Documentação e apresentação (20 pts) | ⚠️ Parcial | README completo nesta seção; **vídeo ainda precisa ser gravado pelo time** |

---

## 🎨 Design System

```typescript
// src/constants/theme.ts
COLORS = {
  primary:     '#289fce',
  secondary:   '#126ca8',
  accent:      '#F96167',
  dark:        '#1E2761',
  scoreGreen:  '#5792aa',
  scoreYellow: '#FFD93D',
  scoreRed:    '#F96167',
  background:  '#F8F9FA',
  border:      '#E0E0E0',
}
```

### Path Aliases (tsconfig.json)

```
@components/*  → src/components/*
@screens/*     → src/screens/*
@services/*    → src/services/*
@models/*      → src/models/*
@constants/*   → src/constants/*
@navigation/*  → src/navigation/*
@contexts/*    → src/contexts/*
@config/*      → src/config/*
@utils/*       → src/utils/*
```

---

## 📄 Licença

Projeto acadêmico — FIAP Challenge 2026. Todos os direitos reservados à equipe.
