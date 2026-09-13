# 🐾 CLYVO Predict — App Mobile (Sprint 3)

> *Do Reativo ao Preventivo*

Aplicativo mobile desenvolvido para o **FIAP Challenge 2026** (2TDS · 3ª Sprint — Mobile Application Development).
Nesta entrega o app deixou de usar dados 100% locais (AsyncStorage) e passou a consumir a **API Java (Spring Boot)** de verdade, incluindo login com JWT, CRUD completo de pets e de eventos de saúde (Create, Read, Update e Delete, nas duas funcionalidades), histórico com score calculado pelo backend, e cadastro de pet por foto usando IA (Python) — sempre através do backend.

---

## 🎥 Vídeo de Apresentação

📺 **[Assista no YouTube](https://www.youtube.com/watch?v=EkIr_Zg2mhk)**

O vídeo demonstra, na ordem exigida pelo enunciado:
- Navegação entre as telas do app
- Sistema de autenticação (cadastro, login com JWT e sessão persistida)
- Integração com a API backend (cadastro de pet manual e via IA, edição, exclusão)
- CRUD completo de eventos de saúde (registrar, editar e excluir), com o score recalculado em tempo real
- Comportamento do aplicativo em uso real, rodando em dispositivo físico

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

Os dois fluxos passam pela mesma tela (`AddPet.tsx`), diferenciados por um parâmetro de rota (`mode: 'manual' | 'photo'`), acessados a partir da tela de escolha (`AddPetChoice.tsx`).

### Fluxo de CRUD de eventos de saúde

```
Registrar  → POST /api/eventos                          → score recalculado no backend
Consultar  → GET  /api/eventos/pet/{petId}               → histórico + gráfico de evolução
Editar     → PUT  /api/eventos/{id}    (menu do evento em PetDetails)
Excluir    → DELETE /api/eventos/{id}  (menu do evento em PetDetails)
```

Create, Read, Update e Delete acessíveis diretamente pela interface, com cache do TanStack Query invalidado automaticamente após cada operação.

---

## ⚙️ Stack Tecnológica

- **Framework:** React Native + Expo SDK 57
- **Linguagem:** TypeScript (strict mode)
- **Navegação:** React Navigation Stack v7, com troca de stack (auth vs. app) conforme sessão
- **HTTP:** Axios, com interceptor que injeta `Authorization: Bearer <token>` automaticamente
- **Cache e estado assíncrono:** TanStack Query (`useQuery`/`useMutation`) — toda leitura e escrita contra a API (pets e eventos de saúde) passa pelos hooks em `src/hooks/` (`usePets.ts`, `useHealthEvents.ts`), isolados da camada de UI, com invalidação automática de cache após criar/editar/excluir
- **Autenticação:** JWT emitido pela API Java (`POST /api/tutores/login`), guardado com AsyncStorage (só o token/identidade — ver seção de limitações)
- **Upload de imagem:** `expo-image-picker` (câmera ou galeria) + `FormData`/`multipart/form-data`
- **Exportação de PDF:** `expo-print` + `expo-sharing` — geração da carteirinha digital do pet em PDF
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

Precisa expor, na porta que `clyvo.ai.url` aponta:
- `POST /api/v2/pets/analyze-registration-photo` (chamado pelo Java a partir de `/api/pets/analisar-cadastro`)
- `POST /api/v2/score/consolidado` (chamado pelo Java a partir de `/api/ia/score`)

> ⚠️ **Sobre a chave de API**: se o arquivo `.env` do serviço Python tiver uma `GOOGLE_API_KEY` em texto puro, revoguem essa chave no Google AI Studio e gerem uma nova antes de subir o repositório publicamente. Nunca commitem esse arquivo.

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

**Ordem de inicialização recomendada:** Python → Java → Mobile (o Java só falha na hora de chamar `/analisar-cadastro`; as demais rotas de pets/tutores/eventos funcionam mesmo com o Python desligado).

---

## 📱 Telas do Aplicativo

| Tela | Rota | Descrição |
|---|---|---|
| Welcome | `Welcome` | Onboarding |
| Login | `Login` | Autenticação via `POST /api/tutores/login`, guarda o JWT |
| Cadastro de tutor | `Register` | `POST /api/tutores`, loga automaticamente depois |
| Home | `Home` | Lista pets vindos de `GET /api/pets`, com pull-to-refresh |
| Escolha de cadastro | `AddPetChoice` | "Cadastrar pet manualmente" vs. "Cadastrar pet com IA" |
| Cadastrar/Editar Pet | `AddPet` | Formulário único para criar (manual ou por foto) e editar (`mode: manual \| photo \| edit`) |
| Detalhes do Pet | `PetDetails` | Dados de `GET /api/pets/{id}` + histórico de eventos + editar/excluir pet e eventos |
| Registrar/Editar Evento | `AddHealthEvent` | `POST`/`PUT /api/eventos` — vacina, consulta, exame, doença leve/grave, cirurgia, acidente |
| Histórico | `PetHistory` | Gráfico de evolução do score e breakdown por período, a partir dos eventos reais da API |
| Carteirinha Médica | `PetMedicalScreen` | Carteira digital, com exportação em PDF |
| Perfil | `tutorProfile` | Dados da sessão logada + logout real (limpa o JWT) |

---

## 📁 Estrutura de Pastas

```
src/
├── config/
│   └── env.ts                 # IP/porta da API Java
├── constants/
│   ├── theme.ts                # Design tokens (cores)
│   └── races.ts                # Raças suportadas por espécie
├── utils/
│   ├── species.ts               # Normalização única de espécie (corrige bug de ícone)
│   ├── dateInput.ts              # Máscara + validação real de data
│   └── petPdf.ts                 # Geração da carteirinha em PDF
├── models/
│   ├── Pet.ts                    # Alinhado ao PetResponseDTO
│   ├── HealthEvent.ts            # TipoEvento alinhado ao enum real do backend
│   ├── Auth.ts
│   └── PetAiAnalysis.ts          # Espelha a resposta de /analisar-cadastro
├── services/                     # Camada de acesso a dados (chamadas HTTP puras)
│   ├── api.ts                     # Axios + interceptor JWT + parser de erro do Spring
│   ├── session.ts                 # Guarda só o token/identidade (AsyncStorage)
│   ├── authService.ts             # Login/registro/logout reais
│   ├── petService.ts              # CRUD real de pets + análise de foto
│   ├── healthEventService.ts      # CRUD real de eventos de saúde (Create/Read/Update/Delete)
│   └── petExtrasStorage.ts        # Só os campos que o backend ainda não persiste
├── hooks/                         # TanStack Query — isolado da camada de UI
│   ├── usePets.ts                  # useQuery/useMutation de pets + análise por IA
│   └── useHealthEvents.ts          # useQuery/useMutation de eventos de saúde
├── contexts/
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx             # Sessão do tutor disponível em todo o app
├── components/                     # Componentes reutilizáveis de UI
│   ├── PetCard.tsx
│   ├── PetIdentityCard.tsx
│   ├── WalletHeader.tsx
│   ├── FactorBar.tsx
│   ├── NotesSection.tsx
│   ├── PlansSection.tsx
│   ├── PlanDetailsModal.tsx
│   ├── ScoreInfoModal.tsx
│   └── BottomBarTab.tsx
├── navigation/
│   ├── AppNavigator.tsx             # Rotas + troca de stack por sessão
│   └── types.ts
└── screens/                         # Telas — só consomem os hooks acima
```

Camadas separadas de propósito: **telas** não chamam API diretamente, apenas os **hooks**; os **hooks** não sabem de UI, apenas orquestram cache; os **services** só sabem fazer requisições HTTP. Nenhuma lógica de negócio ou chamada HTTP fica dentro de componente de tela.

---

## 🐛 Bugs corrigidos ao longo da sprint

1. **Import quebrado do modelo `Pet`** — consolidado em um único `src/models/Pet.ts`.
2. **Ícone de raça errado em "Outros"** — centralizado em `src/utils/species.ts` (`normalizeSpecies`), usado por todo o app, inclusive pelas sugestões da IA.
3. **Histórico de saúde incompatível com o backend** — o enum local tinha valores (`VERMIFUGO`, `EMERGENCIA`) que não existem no `TipoEvento.java` real. Corrigido em `src/models/HealthEvent.ts`, com os 7 valores reais e o impacto de score de cada um espelhando o backend.
4. **Data inválida podendo ser enviada pro backend** (`dataEvento: "2026-89-01"` → 400 do Spring) — corrigido com máscara + validação de calendário real em `src/utils/dateInput.ts`.
5. **CRUD de eventos de saúde incompleto** — o backend só expunha `POST` e `GET`; os endpoints `PUT`/`DELETE` de `/api/eventos/{id}` foram implementados no `EventoSaudeController`, e o mobile já tinha o client (`healthEventService.ts`) e a UI (menu do evento em `PetDetails.tsx`) prontos esperando por eles. Editar e excluir evento de saúde agora funcionam de ponta a ponta.

---

## ⚠️ Limitações conhecidas

- **Backend só persiste `nome, especie, raca, idade, peso, healthScore`** na entidade `Pet`. Campos como foto, cor, porte, condição corporal, sexo, castração e microchip — que a tela pede e a IA devolve — ficam guardados **localmente por `id` do pet** (`petExtrasStorage.ts`), só para completar a experiência visual. **Nome, espécie, raça, idade, peso e score sempre vêm/vão pela API real.** Não é "fingir integração", é uma limitação documentada do schema atual do banco.
- **`EventoSaude` ainda não persiste o score histórico de cada evento** — o backend devolve o score *atual* do pet repetido em todos os eventos da lista, em vez do score no momento em que cada evento aconteceu. O app contorna isso mostrando o impacto fixo de cada categoria (Vacina +10, Consulta +5, Exame +5, Doença leve −15, Cirurgia −30, Doença grave −40, Acidente −50) em vez de reconstruir um histórico que a API não sustenta.
- Não recebemos o repositório do serviço Python nesta entrega — só o contrato (request/response) foi validado contra o código Java real (`ClyvoAiService.java`, `PetRegistrationAiResponseDTO.java`).

---

## 🧠 Score de Saúde (0–100)

Calculado pelo **backend** a cada evento (`TipoEvento.calcularNovoScore`), não localmente:

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
- `POST /api/tutores/login` — devolve `{ id, nome, email, perfil, token }`; o `token` (JWT) é salvo via `session.ts` e reenviado em todo request subsequente pelo interceptor do Axios (`api.ts`).
- Rotas de `/api/pets/**` e `/api/eventos/**` exigem `ROLE_TUTOR` ou `ROLE_VETERINARIO` — o app assume perfil de tutor.
- Sessão persistida: o usuário não precisa autenticar de novo ao reabrir o app.
- Telas protegidas: o `AppNavigator` só monta o stack interno quando há sessão válida — não é possível acessar telas internas por navegação direta sem login.
- Logout limpa o token local e volta pro fluxo de autenticação; não existe endpoint de logout no backend (JWT stateless), então é só descartar o token do dispositivo mesmo.

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
| Integração com API Backend HTTP (35 pts) | ✅ | TanStack Query (`src/hooks/`) sobre `petService.ts`/`healthEventService.ts`/`authService.ts` — CRUD completo de pets e eventos, com loading state e tratamento de erro |
| Sistema de autenticação — Login (20 pts) | ✅ | JWT real via `/api/tutores/login`, sessão persistida, rotas protegidas (stack condicional), logout funcional |
| Arquitetura e organização do código (20 pts) | ✅ | Camadas separadas: `screens` (UI) / `hooks` (TanStack Query) / `services` (API) / `models` (tipos) / `contexts` (estado global) / `utils` (regras compartilhadas) |
| Documentação e apresentação (20 pts) | ✅ | Este README + vídeo de apresentação publicado no YouTube (link no topo deste documento) |

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
@hooks/*       → src/hooks/*
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