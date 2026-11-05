# 🐾 CLYVO Predict — App Mobile (Sprint 4 · entrega final)

> *Do Reativo ao Preventivo*

Aplicativo mobile do **FIAP Challenge 2026 × Clyvo** (2TDS · Mobile Application Development).
Na sprint 4 o app foi finalizado: todas as telas têm ação real, a integração usa a **API Java da sprint 4**, o JWT passou a ficar em **armazenamento criptografado**, o app ganhou **notificações locais** ligadas ao fluxo de saúde do pet e foi **publicado no Firebase App Distribution**.

---

## 📦 Entrega

| Item | Onde |
|---|---|
| 🎥 Vídeo de apresentação (sprint 4) | **https://youtu.be/LFDP5aBK7wc** |
| 📲 App publicado | Firebase App Distribution — o e-mail institucional do professor está cadastrado como tester |
| 🔖 Versão publicada | `1.0.4` (versionCode 5) · commit **`84e460b`** (o mesmo exibido em **Perfil › Sobre o App**) |
| ☕ API Java (sprint 4) | Branch `sprint-04` do repositório `clyvo-predict` — hospedada em **https://clyvo-api-kr5f.onrender.com/api** ([Swagger](https://clyvo-api-kr5f.onrender.com/swagger-ui/index.html)) |
| 🤖 Serviço de IA (Python) | Hospedado em **https://clyvo-ia.onrender.com** (consumido pela API Java) |

> A API e a IA estão no plano gratuito do Render: a primeira requisição depois de um tempo parado pode levar até 1 minuto.

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

## ✅ Feedback da sprint 3 → o que mudou

| Feedback do professor | O que fizemos |
|---|---|
| **"Não usar AsyncStorage para persistência do JWT, utilize um banco criptografado"** | A sessão (JWT) vai para o **`expo-secure-store`** (Keychain no iOS / Keystore no Android) em `src/storage/sessionStorage.ts`. Sessões antigas no AsyncStorage são migradas e apagadas na primeira abertura. Token vencido (`exp`) é descartado ao abrir o app. |
| **"Centralizar mais a lógica de telas em hooks"** | Toda a lógica de formulário, validação, filtros e cálculos saiu das telas para hooks (`usePetForm`, `useHealthEventForm`, `useLoginForm`, `useRegisterForm`, `usePetScoreHistory`, `usePetWallet`, `usePetNotes`, `useEditProfileForm`, `useReminderForm`…). Nenhuma tela ou componente importa `services/`, `storage/` ou `AsyncStorage`. |

---

## 🆕 Novidades da sprint 4

- **Integração com a API da sprint 4**
  - Novos tipos de evento do backend: `RELATO_SINTOMA` e `ALTERACAO_COMPORTAMENTO` (−5 pts cada).
  - O tutor do pet passa a ser definido pelo **JWT** no backend (o app não envia mais `tutorId`).
  - `403` agora significa "recurso de outro tutor" e não derruba mais a sessão; só `401` encerra o login.
  - **Editar perfil e alterar senha** com `GET/PUT /api/tutores/{id}` (com confirmação da senha atual e renovação do token).
- **Perfis Tutor e Veterinário**: Login e Cadastro têm a escolha do perfil e usam o endpoint de cada um (`/api/tutores` ou `/api/veterinarios`; o veterinário informa o CRMV). O veterinário vê todos os pacientes e registra eventos, mas não cria, edita nem exclui pets, nem vê planos. As permissões vêm do `role` do JWT validado pela API.
- **Notificações locais (expo-notifications)** — ver seção abaixo.
- **Lembretes no horário exato**: o app declara `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM`, então o Android não atrasa os lembretes agendados mesmo com o app fechado.
- **Telas que antes não tinham ação agora funcionam**: sino da Home (central de notificações), Editar Perfil, Alterar Senha, Central de Ajuda, Termos de Uso, Privacidade (LGPD), Ver Premium, Sobre o App, switches de preferências e o card "Próximos cuidados".
- **Tela "Sobre o App"** com versão, data do build e **hash do commit** da versão publicada.
- **Correção de navegação**: no React Navigation 7 o `navigate()` empilhava telas repetidas (voltar levava ao formulário já salvo). Agora usamos `popTo`/`goBack` e a barra inferior reaproveita a aba aberta.
- **Tema claro/escuro** segue o sistema até o usuário escolher no perfil.
- **Android 15/16**: fonte Roboto embarcada (`assets/fonts` + `components/AppText`), `targetSdk 34` e respeito à barra de navegação do sistema, para evitar textos cortados e rodapé escondido.
- **Publicação**: `eas.json` gera APK, URL da API vem de variável de ambiente (`EXPO_PUBLIC_API_URL`), `requireCommit` garante que todo build corresponde a um commit.

---

## 🔔 Notificações (local)

Escolhemos **notificações locais** porque os dois cenários nascem de eventos reais do próprio app — sem mensagens fixas nem disparo manual.

### 1. Alerta de saúde (disparado pelo processamento do backend)

1. O tutor registra, edita ou exclui um evento de saúde.
2. A API recalcula o **Score de Saúde** e devolve o novo valor.
3. O hook de mutação compara com o score anterior (cache do TanStack Query) e aplica a regra de `src/utils/scoreAlerts.ts`:
   - mudou de faixa (**Excelente ≥ 80 · Regular 50–79 · Crítico < 50**) → notifica;
   - continuou caindo dentro da faixa crítica → notifica;
   - variação dentro da mesma faixa → não notifica.
4. A notificação aparece **na hora, com o app aberto** (banner em foreground) — ex.: *"🚨 Score de Thor está crítico — O Score de Saúde caiu de 70 para 40…"*.
5. **Tocar** na notificação abre os **detalhes do pet**.

### 2. Lembrete de cuidado (agendado pelo tutor)

1. Em **Detalhes do pet › Próximos cuidados › Agendar lembrete**, o tutor escolhe consulta, vacina ou exame + data e horário.
2. O app agenda uma notificação local no sistema; ela toca **mesmo com o app fechado**.
3. **Tocar** no lembrete abre **Registrar Evento** já com o tipo e a descrição preenchidos — o tutor só confirma, e o score é atualizado na API.

### Integração com o resto do app
- **Central de notificações** no sino da Home, com badge apenas quando há itens não lidos.
- **Preferências** em Perfil: "Alertas de saúde" e "Lembretes de cuidados" (pedem permissão ao sistema quando ligados).
- Lembretes são cancelados ao excluir o pet ou sair da conta.

---

## 📱 Telas

| Tela | Rota | O que faz |
|---|---|---|
| Welcome | `Welcome` | Onboarding |
| Login | `Login` | Escolha Tutor/Veterinário, `POST /api/tutores/login` ou `/api/veterinarios/login`, guarda o JWT no SecureStore |
| Cadastro | `Register` | `POST /api/tutores` (telefone) ou `/api/veterinarios` (CRMV) e login automático |
| Home | `Home` | Tutor: seus pets, sino e planos · Veterinário: todos os pacientes (`GET /api/pets`) |
| Escolha de cadastro | `AddPetChoice` | Manual ou com IA |
| Cadastrar/Editar pet | `AddPet` | Formulário único (`manual`/`photo`/`edit`), análise de foto via `POST /api/pets/analisar-cadastro` |
| Detalhes do pet | `PetDetails` | Score, breakdown, próximos cuidados, anotações, histórico com editar/excluir evento |
| Registrar/Editar evento | `AddHealthEvent` | `POST`/`PUT /api/eventos` (9 tipos), também aberto pelo lembrete |
| Agendar lembrete | `ScheduleReminder` | Agenda notificação local de consulta/vacina/exame |
| Histórico | `PetHistory` | Gráfico de evolução e breakdown por período |
| Carteirinha | `PetWallet` | Carteira digital com exportação em PDF |
| Notificações | `Notifications` | Central com alertas e lembretes recebidos |
| Perfil | `TutorProfile` | Estatísticas, conta, preferências, suporte, logout |
| Editar perfil / senha | `EditProfile` | `GET`/`PUT /api/tutores/{id}` |
| Ajuda, Termos, Privacidade | `Info` | Conteúdo de suporte e LGPD |
| Sobre o App | `About` | Versão, data do build, hash do commit, URL da API e equipe |

---

## 🧩 Arquitetura

```
Telas (screens/) ──▶ Hooks (hooks/) ──▶ Services (services/) ──▶ API Java / sistema
       │                    │                 └──▶ Storage (storage/) ──▶ SecureStore / AsyncStorage
       ▼                    ▼
 Componentes de UI    Regras puras (utils/) + Tipos (models/)
```

- **screens/** e **components/**: só interface. Recebem dados e callbacks dos hooks; mostram alertas e navegam.
- **hooks/**: TanStack Query (`useQuery`/`useMutation`), estado de formulários, orquestração (ex.: alerta de score após mutação).
- **services/**: acesso a dados externos — HTTP com Axios (`api.ts`, `petService`, `healthEventService`, `tutorService`, `authService`) e notificações do sistema (`notificationService`).
- **storage/**: persistência no aparelho — `sessionStorage` (SecureStore), preferências, anotações, extras do pet e central de notificações.
- **utils/**: regras de negócio puras e testáveis (faixas de score, regra do alerta, gráfico do histórico, datas, validações, JWT).
- **models/**: tipos alinhados aos DTOs da API.
- **navigation/**: rotas tipadas, `navigationRef` e o mapeamento notificação → tela.

```
src/
├── components/   BottomTabBar, PetCard, NotesSection, UpcomingCareCard, PlanDetailsModal…
├── config/       env.ts (URL da API via EXPO_PUBLIC_API_URL)
├── constants/    theme, races, plans, infoContent, team
├── contexts/     AuthContext, ThemeContext
├── hooks/        usePets, useHealthEvents, usePetForm, useHealthEventForm, useScoreAlerts,
│                 useCareReminders, useNotificationNavigation, useThemedStyles…
├── models/       Pet, HealthEvent, Auth, Tutor, CareReminder, AppNotification, FormResult…
├── navigation/   AppNavigator, types, navigationRef, notificationRoutes
├── screens/      16 telas
├── services/     api, authService, petService, healthEventService, tutorService, notificationService
├── storage/      sessionStorage (SecureStore), preferencesStorage, petNotesStorage,
│                 petExtrasStorage, notificationInboxStorage
└── utils/        score, scoreAlerts, scoreHistory, healthEvents, date, dateInput, validation, jwt, appInfo, petPdf
```

**Stack:** React Native 0.88 + Expo SDK 58 · TypeScript (strict) · React Navigation 7 · TanStack Query 5 · Axios · expo-secure-store · expo-notifications · expo-image-picker · expo-print/expo-sharing.

---

## 🚀 Como rodar

São 3 processos: **Python (IA) → Java (API) → Mobile**. Só o cadastro por foto depende do Python.

### 1. API Java (`clyvo-predict-sprint-04`)

```bash
# variáveis do banco Oracle FIAP (não vão para o Git)
export DB_USERNAME=rmXXXXX
export DB_PASSWORD=sua_senha
./mvnw spring-boot:run          # Windows: .\mvnw.cmd spring-boot:run
```

- A chave `src/main/resources/keys/private_key.pem` **não está no Git**; peça ao grupo ou gere um par novo (ver README da API).
- Teste em `http://localhost:8080/swagger-ui.html`.

### 2. Serviço de IA (Python)

Rodando na URL de `clyvo.ai.url` (padrão `http://localhost:5000`). Na versão publicada, a API usa `CLYVO_AI_URL=https://clyvo-ia.onrender.com`.

### 3. Mobile

```bash
npm install
cp .env.example .env.local      # edite EXPO_PUBLIC_API_URL com o IP da máquina do Java
npx expo start -c
```

| Onde vai testar | `EXPO_PUBLIC_API_URL` |
|---|---|
| API hospedada (sem rodar o Java) | `https://clyvo-api-kr5f.onrender.com/api` |
| Emulador Android | `http://10.0.2.2:8080/api` |
| Simulador iOS | `http://localhost:8080/api` |
| Celular físico (Expo Go) | `http://IP_DO_PC:8080/api` (mesma Wi-Fi) |

> As notificações locais funcionam no Expo Go; para o fluxo completo use o APK publicado.

`npm run typecheck` roda o TypeScript em modo estrito.

---

## 📲 Publicação (Firebase App Distribution)

1. API hospedada e URL configurada em `eas.json` › `build.preview.env.EXPO_PUBLIC_API_URL`.
2. `git commit` de tudo (o EAS recusa build com alterações não commitadas — `requireCommit`).
3. `eas build -p android --profile preview` → gera o **APK**.
4. Firebase Console › App Distribution › enviar o APK › adicionar o **e-mail institucional do professor** como tester.
5. Conferir no celular: **Perfil › Sobre o App** mostra o mesmo hash do commit usado no build.

---

## 📋 Requisitos da sprint 4

| Requisito | Status | Onde |
|---|---|---|
| Implementação funcional de todas as telas (20) | ✅ | 16 telas, nenhum botão sem ação; fluxo completo cadastro → pet → evento → score → alerta/lembrete → histórico/carteirinha |
| Publicação do aplicativo (20) | ✅ | Firebase App Distribution + tela **Sobre o App** com hash do commit |
| Notificações (20) | ✅ | Local: alerta de score (evento do backend) + lembretes agendados, ambos com navegação ao tocar |
| Arquitetura e organização (20) | ✅ | screens → hooks → services/storage, utils puros, sem HTTP/regra de negócio em tela |
| Vídeo de apresentação (20) | ✅ | Link no topo deste README |
| Tema claro/escuro | ✅ | `ThemeContext` + `useThemedStyles` em todas as telas |

---

## ⚠️ Limitações conhecidas

- O backend persiste só `nome, espécie, raça, idade, peso, healthScore` do pet. Foto, sexo, castração, microchip, cor, porte e condição corporal ficam no aparelho (`storage/petExtrasStorage.ts`).
- `EventoSaude` não guarda o score histórico de cada evento; o gráfico do histórico reconstrói os meses a partir do score atual e do impacto de cada evento.
- Anotações do tutor, lembretes e a central de notificações ficam no aparelho (não há endpoints para eles na API).

---

## 🧠 Score de Saúde (0–100)

Calculado pelo **backend** (`TipoEvento.calcularNovoScore`). Todo pet começa com 100.

| Evento | Impacto |
|---|---|
| Vacina | +10 |
| Consulta de rotina | +5 |
| Exame | +5 |
| Relato de sintoma | −5 |
| Mudança de comportamento | −5 |
| Doença leve | −15 |
| Cirurgia | −30 |
| Doença grave | −40 |
| Acidente | −50 |

---

Projeto acadêmico — FIAP Challenge 2026 × Clyvo.
