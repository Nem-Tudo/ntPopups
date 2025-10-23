# ntPopups 🚀

> **Ease and powerful popup library for React**

Uma biblioteca de popups moderna, totalmente personalizável e responsiva para React. Crie popups elegantes com suporte a temas, internacionalização e componentes customizados de forma simples e poderosa.

[![npm version](https://img.shields.io/npm/v/ntpopups.svg)](https://www.npmjs.com/package/ntpopups)
[![License](https://img.shields.io/npm/l/ntpopups.svg)](https://github.com/Nem-Tudo/ntpopups/blob/main/LICENSE)

> <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1fa-1f1f8.png" width="20" alt="en" style="vertical-align: middle;" /> [Read this in english](https://github.com/Nem-Tudo/ntPopups/blob/main/README.md)

# [Veja a demonstração](https://ntpopups.nemtudo.me/demo)

## ✨ Características

- 🎨 **Temas**: Suporte para tema claro e escuro
- 🌍 **Internacionalização**: Suporte para múltiplos idiomas (EN, PTBR)
- 📱 **Responsivo**: Funciona perfeitamente em mobile e desktop
- 🎭 **Popups Prontos**: Vários popups pra você só pegar e usar
- 🔧 **Personalizável**: Crie seus próprios popups customizados
- ⚡ **Leve e Rápido**: Performance otimizada. Nenhuma dependência extra


## 📦 Instalação

```bash
npm install ntpopups
```

ou

```bash
yarn add ntpopups
```


## 🎯 Configuração Inicial

### React Puro

Envolva sua aplicação com o `NtPopupProvider`:

```jsx
// App.jsx
import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css'; // Importar os estilos

function App() {
  return (
    <NtPopupProvider language="ptbr" theme="white">
      {/* Seu app aqui */}
    </NtPopupProvider>
  );
}

export default App;
```

### Next.js (App Router)

Crie um componente Providers separado como Client Component:

```jsx
// components/Providers.jsx
'use client';

import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';

export default function Providers({ children }) {
  return (
    <NtPopupProvider language="ptbr" theme="white">
      {children}
    </NtPopupProvider>
  );
}
```

E use no layout principal:

```jsx
// app/layout.jsx
import Providers from '@/components/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### Next.js (Pages Router)

```jsx
// pages/_app.jsx
import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <NtPopupProvider language="ptbr" theme="white">
      <Component {...pageProps} />
    </NtPopupProvider>
  );
}

export default MyApp;
```

---

## 🎨 Uso Básico

### Hook Principal

```jsx
import useNtPopups from 'ntpopups';

function MeuComponente() {
  const { openPopup, closePopup } = useNtPopups();

  const handleClick = () => {
    openPopup('generic', {
      data: {
        title: 'Olá!',
        message: 'Este é um popup simples.',
      }
    });
  };

  return <button onClick={handleClick}>Abrir Popup</button>;
}
```

---

## 🧩 Popups Nativos

### 1. **Generic** - Popup de Mensagem Simples

```jsx
openPopup('generic', {
  data: {
    title: 'Aviso',
    message: 'Esta é uma mensagem informativa.',
    closeLabel: 'Entendi',
    icon: '⚠️'
  }
});
```

**Props disponíveis:**
- `title` (ReactNode): Título do popup
- `message` (ReactNode): Mensagem principal
- `closeLabel` (ReactNode): Texto do botão de fechar
- `icon` (ReactNode): Ícone ao lado do título (padrão: "ⓘ")

---

### 2. **Confirm** - Popup de Confirmação

```jsx
openPopup('confirm', {
  data: {
    title: 'Confirmação',
    message: 'Tem certeza que deseja continuar?',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Sim, continuar',
    confirmStyle: 'Danger',
    icon: '❓',
    onChoose: (confirmado) => {
      if (confirmado) {
        console.log('Usuário confirmou!');
      } else {
        console.log('Usuário cancelou.');
      }
    }
  }
});
```

**Props disponíveis:**
- `title` (ReactNode): Título do popup
- `message` (ReactNode): Mensagem de confirmação
- `cancelLabel` (ReactNode): Texto do botão cancelar
- `confirmLabel` (ReactNode): Texto do botão confirmar
- `confirmStyle` ('default'|'Secondary'|'Success'|'Danger'): Estilo do botão de confirmação
- `icon` (ReactNode): Ícone ao lado do título
- `onChoose` (Function): Callback que recebe `true` (confirmar) ou `false` (cancelar)

---

### 3. **Crop Image** - Editor de Imagem com Recorte

```jsx
openPopup('crop_image', {
  requireAction: false,
  data: {
    image: arquivoOuUrl, // File ou string (base64/URL)
    format: 'circle', // 'circle' ou 'square'
    onCrop: (resultado) => {
      console.log('Blob:', resultado.blob);
      console.log('Base64:', resultado.base64);
      console.log('File:', resultado.file);
    }
  }
});
```

**Props disponíveis:**
- `image` (File | string): Arquivo de imagem ou URL/base64
- `format` ('circle' | 'square'): Formato do recorte (padrão: 'circle')
- `onCrop` (Function): Callback com o resultado `{ blob, base64, file }`

**💡 Dica:**
- Quando `requireAction = true`, o botão de "Cancelar" é removido
---

### 4. **Form** - Formulário Dinâmico

```jsx
openPopup('form', {
  data: {
    title: 'Cadastro',
    message: 'Preencha os campos abaixo:',
    doneLabel: 'Enviar',
    icon: '📝',
    components: [
      {
        id: 'nome', //chave que será utilizada no objeto do resultado final
        type: 'text',
        label: 'Nome Completo',
        placeholder: 'Digite seu nome',
        required: true,
        minLength: 3,
        maxLength: 50
      },
      {
        id: 'email',
        type: 'text',
        label: 'E-mail',
        placeholder: 'seu@email.com',
        required: true,
        matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      },
      {
        id: 'bio',
        type: 'textarea',
        label: 'Biografia',
        placeholder: 'Conte um pouco sobre você...',
        maxLength: 200,
        disableResize: true
      },
      {
        id: 'aceito',
        type: 'checkbox',
        label: 'Aceito os termos',
        defaultValue: false
      },
      // Campos em linha (array dentro do array)
      [
        {
          id: 'cidade',
          type: 'text',
          label: 'Cidade',
          placeholder: 'São Paulo'
        },
        {
          id: 'estado',
          type: 'text',
          label: 'Estado',
          placeholder: 'SP',
          maxLength: 2
        }
      ]
    ],
    onSubmit: (valores) => {
      console.log('Dados do formulário:', valores);
      // { nome: "...", email: "...", bio: "...", aceito: true, cidade: "...", estado: "..." }
    }
  }
});
```

**Props do Form:**
- `title` (ReactNode): Título do formulário
- `message` (ReactNode): Mensagem explicativa opcional
- `doneLabel` (ReactNode): Texto do botão de submissão
- `icon` (ReactNode): Ícone do cabeçalho
- `components` (Array): Lista de componentes de formulário
- `onSubmit` (Function): Callback com objeto contendo todos os valores `{ id: value }`

**Tipos de Componentes:**

#### Text Input
```javascript
{
  id: 'campo_unico',      // string (obrigatório)
  type: 'text',           // 'text'
  label: 'Rótulo',        // string (obrigatório)
  placeholder: 'Digite...', // string (opcional)
  defaultValue: '',       // string (opcional)
  required: false,        // boolean (opcional)
  disabled: false,        // boolean (opcional)
  minLength: 3,           // number (opcional)
  maxLength: 50,          // number (opcional)
  matchRegex: '^[A-Z].*'  // string regex (opcional)
}
```

#### Textarea
```javascript
{
  id: 'campo_texto',
  type: 'textarea',
  label: 'Descrição',
  placeholder: 'Digite uma descrição...',
  defaultValue: '',
  required: false,
  disabled: false,
  disableResize: false,   // boolean (opcional) - desabilita redimensionamento do usuário
  minLength: 10,
  maxLength: 500,
  matchRegex: '.*'
}
```

#### Checkbox
```javascript
{
  id: 'aceito_termos',
  type: 'checkbox',
  label: 'Aceito os termos de uso',
  defaultValue: false,    // boolean (opcional)
  disabled: false,
  required: false         // Se true, deve estar marcado
}
```

**💡 Dicas:**
- Quando `requireAction = true`, o botão de "Cancelar" é removido
- O botão de submissão fica desabilitado até que todos os campos sejam válidos
- Campos inválidos recebem borda vermelha automaticamente
- Validações aplicadas: `required`, `minLength`, `maxLength`, `matchRegex`

---

## 🎨 Criando Popups Customizados

### 1. Estrutura básica
```jsx
export default function MyCustomPopup({
  // ⚙️ PROPS DA BIBLIOTECA (automáticas)
  closePopup,      // Função para fechar o popup
  popupstyles,     // Classes CSS predefinidas da biblioteca
  requireAction,   // Boolean - se o popup exige ação para fechar
  
  // 📦 PROPS CUSTOMIZADAS (definidas por você!)
  data = {}
}) {
  
  return (
    <>
      {/* CABEÇALHO */}
      <div className={popupstyles.header}> 
        <div className={popupstyles.icon}>ⓘ</div>
        Título
      </div>

      {/* CORPO */}
      <div className={popupstyles.body}>
        <p>Corpo</p>
      </div>

      {/* RODAPÉ */}
      <div className={popupstyles.footer}>        
        <button
          className={popupstyles.baseButton}
          base-button-style="0" // default: 0 | Disponíveis: "0", "1", "2"
          base-button-no-flex={"false"} // default: false
          onClick={() => closePopup(true)}
        >Ok</button>
      </div>
    </>
  );
}
```

### 2. Criar o Componente

```jsx
// components/popups/MyCustomPopup.jsx
import styles from './mystyles.module.css';

export default function MyCustomPopup({
  closePopup,
  popupstyles,
  requireAction,
  
  // 📦 PROPS CUSTOMIZADAS (definidas por você!)
  data: {
    message = 'Mensagem padrão',
    myProp1,
    myProp2 = 'Esta é uma lib incrível! :D',
    myProp3,
    myCallback = () => {}
  } = {}
}) {
  
  // Lógica customizada
  const handleReady = () => {
    myCallback(myProp1 + myProp2);
    closePopup(true); // true = ação intencional do usuário
  };

  return (
    <>
      {/* CABEÇALHO */}
      <div className={popupstyles.header}> 
        <div className={popupstyles.icon}>💡</div>
        Popup Customizado
      </div>

      {/* CORPO */}
      <div className={popupstyles.body}>
        <p>{message}</p>
        <h3>Propriedade 1: {myProp1}</h3>
        
        {/* Usando seus próprios estilos */}
        <button 
          className={styles.myCustomButton}
          onClick={() => alert(myProp3)}
        >
          {myProp2}
        </button>
      </div>

      {/* RODAPÉ */}
      <div className={popupstyles.footer}>
        {/* Botão condicional - só aparece se não requer ação */}
        {!requireAction && (
          <button 
            className={popupstyles.baseButton}
            base-button-style="1"
            onClick={() => closePopup()} // false implícito - Não tem efeito quando requireAction=true
          >
            Cancelar
          </button>
        )}
        
        <button 
          className={popupstyles.baseButton}
          onClick={handleReady}
        >
          Confirmar
        </button>
      </div>
    </>
  );
}
```
**💡 Dica:**
Quando `requireAction = true`, a função `closePopup()` só surtirá efeito se houver alguma ação. (`closePopup(true)`)

### 3. Registrar no Provider

```jsx
import { NtPopupProvider } from 'ntpopups';
import MyCustomPopup from './components/MyCustomPopup';

function App() {
  return (
    <NtPopupProvider
      language="ptbr"
      theme="white"
      customPopups={{
        'my_custom': MyCustomPopup, 
        'outro_custom': OutroPopup //Adicione quantos quiser! :D
      }}
    >
      {/* Seu app */}
    </NtPopupProvider>
  );
}
```

### 4. Usar o Popup Customizado

```jsx
const { openPopup } = useNtPopups();

openPopup('my_custom', {
  data: {
    message: 'Olá do popup customizado!',
    myProp1: 'Valor 1',
    myProp2: 'Valor 2',
    myProp3: 'Segredo revelado!',
    myCallback: (resultado) => {
      console.log('Callback executado:', resultado);
    }
  },
  requireAction: true,
  maxWidth: '600px'
});
```

---

## ⚙️ Configurações Globais

### Props do Provider

```jsx
<NtPopupProvider
  language="ptbr"           // 'en' ou 'ptbr'
  theme="white"             // 'white' ou 'dark'
  customPopups={{}}         // Objeto com popups customizados
  config={{
    defaultSettings: {
      all: { // Todos os popups
        closeOnEscape: true,
        closeOnClickOutside: true,
      },
      generic: { // Você pode configurar popups da biblioteca
        closeOnClickOutside: false,
        timeout: 20 * 1000
      },
      confirm: {
        closeOnClickOutside: false // Configurações específicas têm prioridade sobre a configuração "all"
      },
      my_custom: { // Você pode configurar seus próprios popups
        requireAction: true
      }
    }
  }}
>
```

### Configurações Base (Settings)

Aplicáveis a **qualquer popup** (nativos ou customizados):

| Propriedade | Tipo | Padrão | Descrição |
|------------|------|--------|-----------|
| `id` | string | auto | ID único do popup (Não recomendável alterar) |
| `closeOnEscape` | boolean | true | Permite fechar com tecla ESC |
| `closeOnClickOutside` | boolean | true | Permite fechar clicando fora |
| `requireAction` | boolean | false | Exige ação interna para fechar |
| `timeout` | number | 0 | Tempo (ms) para fechar automaticamente |
| `keepLast` | boolean | false | Mantém popup anterior visível embaixo |
| `allowPageBodyScroll` | boolean | false | Permite scrollar o body da página |
| `interactiveBackdrop` | boolean | false | Permite interações no background |
| `hiddenBackdrop` | boolean | false | Oculta o backdrop |
| `hiddenHeader` | boolean | false | Oculta o cabeçalho |
| `hiddenFooter` | boolean | false | Oculta o rodapé |
| `disableOpenAnimation` | boolean | false | Desabilita animação de abertura |
| `maxWidth` | string | - | Largura máxima CSS (ex: '800px') |
| `minWidth` | string | - | Largura mínima CSS (ex: '800px') |
| `onOpen` | Function | - | Callback ao abrir: `(id) => {}` |
| `onClose` | Function | - | Callback ao fechar: `(hasAction, id) => {}` |

**Exemplo com configurações:**

```jsx
openPopup('generic', {
  closeOnEscape: false,
  closeOnClickOutside: false,
  requireAction: true,
  timeout: 5000,
  keepLast: true,
  allowPageBodyScroll: true,
  interactiveBackdrop: true,
  hiddenBackdrop: true,
  hiddenHeader: true,
  hiddenFooter: true,
  disableOpenAnimation: true,
  maxWidth: '400px',
  minWidth: '200px',
  onOpen: (id) => console.log('Popup aberto:', id),
  onClose: (hasAction, id) => {
    console.log('Fechado com ação?', hasAction);
  },
  data: {
    message: 'Este popup fecha sozinho em 5 segundos!'
  }
});
```

---

## 🎭 API do Hook

```typescript
const {
  openPopup,       // (type, settings) => string|null
  closePopup,      // (id?, hasAction?) => void
  closeAllPopups,  // () => void
  isPopupOpen,     // (id) => boolean
  getPopup,        // (id) => PopupData|null
  popups,          // Array de popups ativos
  language         // Idioma ativo ('en' | 'ptbr')
} = useNtPopups();
```

### `openPopup(type, settings)`
Abre um popup e retorna seu ID único.

```jsx
const popupId = openPopup('confirm', {
  data: { message: 'Deseja continuar?' }
});
```

### `closePopup(id?, hasAction?)`
Fecha um popup específico ou o último aberto.

```jsx
// Fecha o último popup sem ação
closePopup();

// Fecha popup específico com ação
closePopup('popup_123', true);

// Fecha o último popup com ação
closePopup(true);
```

### `closeAllPopups()`
Fecha todos os popups abertos.

```jsx
closeAllPopups();
```

### `isPopupOpen(id)`
Verifica se um popup está aberto.

```jsx
if (isPopupOpen('meu_popup')) {
  console.log('Popup ainda está aberto!');
}
```

### `getPopup(id)`
Retorna os dados de um popup aberto.

```jsx
const popup = getPopup('popup_123');
console.log(popup?.settings);
```

---

## 🎨 Personalização Visual

### Variáveis CSS Disponíveis

A biblioteca oferece **mais de 100 variáveis CSS** para personalização total. Todas seguem o padrão `--ntpopups-*`.

#### 🎯 Tipografia

```css
--ntpopups-font-family: "Segoe UI", Arial, sans-serif;
--ntpopups-font-size-base: 18px;
--ntpopups-font-size-header: 24px;
--ntpopups-font-size-button: 14px;
--ntpopups-font-weight-header: 400;
--ntpopups-font-weight-normal: 400;
--ntpopups-font-weight-semibold: 500;
--ntpopups-font-weight-bold: 700;
--ntpopups-line-height-base: 1.5;
--ntpopups-line-height-header: 1.3;
```

#### 🎨 Cores Primárias

```css
--ntpopups-color-primary: #5f54f0;
--ntpopups-color-primary-hover: #4f43f5;
--ntpopups-color-primary-active: #3f33e5;
--ntpopups-color-primary-disabled: #a39fd8;
--ntpopups-color-primary-light: #e8e6fc;
```

#### 🎨 Cores Secundárias

```css
--ntpopups-color-secondary: #2a2a2a;
--ntpopups-color-secondary-hover: #363636;
--ntpopups-color-secondary-active: #4e555b;
--ntpopups-color-secondary-disabled: #b8bfc6;
--ntpopups-color-secondary-light: #e9ecef;
```

#### 🎨 Cores Semânticas

```css
--ntpopups-color-success: #28a745;
--ntpopups-color-success-hover: #218838;
--ntpopups-color-danger: #dc3545;
--ntpopups-color-danger-hover: #c82333;
--ntpopups-color-warning: #ffc107;
--ntpopups-color-info: #17a2b8;
```

#### 🎨 Cores de Texto

```css
--ntpopups-color-text: rgba(64, 64, 64, .95);
--ntpopups-color-text-secondary: rgba(14, 14, 14, 0.6);
--ntpopups-color-text-muted: rgba(14, 14, 14, 0.4);
--ntpopups-color-text-light: #f8f9fa;
--ntpopups-color-text-on-primary: #ffffff;
```

#### 🎨 Backgrounds

```css
--ntpopups-bg-default: linear-gradient(...);
--ntpopups-bg-overlay: rgba(0, 0, 0, 0.459);
--ntpopups-bg-footer: #f0f0f0;
--ntpopups-bg-header: linear-gradient(...);
--ntpopups-bg-body: linear-gradient(...);
--ntpopups-bg-button-primary: var(--ntpopups-color-primary);
--ntpopups-bg-button-secondary: var(--ntpopups-color-secondary);
```

#### 📏 Bordas

```css
--ntpopups-border-width: 1px;
--ntpopups-border-width-thick: 2px;
--ntpopups-border-style: solid;
--ntpopups-border-color: rgba(0, 0, 0, 0.07);
--ntpopups-border-radius: 10px;
--ntpopups-border-radius-sm: 5px;
--ntpopups-border-radius-lg: 15px;
--ntpopups-border-radius-xl: 20px;
--ntpopups-border-radius-button: 5px;
```

#### 🌑 Sombras

```css
--ntpopups-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
--ntpopups-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.2);
--ntpopups-shadow-button: 0 2px 4px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
```

#### 📐 Espaçamentos

```css
--ntpopups-spacing-xs: 5px;
--ntpopups-spacing-sm: 10px;
--ntpopups-spacing-md: 15px;
--ntpopups-spacing-lg: 20px;
--ntpopups-spacing-xl: 30px;
--ntpopups-spacing-2xl: 40px;

--ntpopups-padding-header: var(--ntpopups-spacing-lg);
--ntpopups-padding-body: var(--ntpopups-spacing-lg);
--ntpopups-padding-footer: var(--ntpopups-spacing-sm);
--ntpopups-padding-button: var(--ntpopups-spacing-md) var(--ntpopups-spacing-lg);

--ntpopups-gap-buttons: var(--ntpopups-spacing-sm);
--ntpopups-gap-header-icon: 8px;
```

#### 📝 Form Inputs

```css
--ntpopups-input-bg: #ffffff;
--ntpopups-input-border: var(--ntpopups-border-color);
--ntpopups-input-border-focus: var(--ntpopups-color-primary);
--ntpopups-input-text-color: var(--ntpopups-color-text);
--ntpopups-input-placeholder-color: var(--ntpopups-color-text-muted);
--ntpopups-input-padding: var(--ntpopups-spacing-sm) var(--ntpopups-spacing-md);
--ntpopups-input-border-radius: var(--ntpopups-border-radius-sm);
```

#### 📏 Dimensões

```css
--ntpopups-width-min: 300px;
--ntpopups-width-max: 1000px;
--ntpopups-width-default: fit-content;
--ntpopups-height-max: 90dvh;
--ntpopups-button-min-width: 80px;
--ntpopups-button-height: auto;
```

#### ⚡ Transições

```css
--ntpopups-transition-duration: 0.2s;
--ntpopups-transition-duration-fast: 0.1s;
--ntpopups-transition-duration-slow: 0.3s;
--ntpopups-transition-easing: ease-in-out;
--ntpopups-transition-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### 📱 Responsividade

```css
--ntpopups-mobile-padding: 15px;
--ntpopups-mobile-font-size: 14px;
```

### Como Personalizar

Crie um arquivo CSS global e sobrescreva as variáveis:

```css
/* styles/custom-ntpopups.css */

.ntpopups-overlay{
  /* Cores personalizadas */
  --ntpopups-color-primary: #ff6b6b;
  --ntpopups-color-primary-hover: #ff5252;
  
  /* Tipografia */
  --ntpopups-font-family: 'Poppins', sans-serif;
  --ntpopups-font-size-base: 16px;
  
  /* Bordas arredondadas */
  --ntpopups-border-radius: 20px;
  --ntpopups-border-radius-button: 10px;
  
  /* Sombras mais suaves */
  --ntpopups-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Espaçamentos maiores */
  --ntpopups-padding-body: 30px;
  
  /* Background customizado */
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.7);
}

/* Modo escuro personalizado */
.ntpopups-dark-theme {
  --ntpopups-color-primary: #bb86fc;
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.9);
}
```

Importe no seu app:

```jsx
import 'ntpopups/dist/style.css';
import './styles/custom-popups.css'; // Suas personalizações
```

---

## 🎯 Classes CSS Globais

Todas as classes seguem o padrão `.ntpopups-*` e podem ser usadas para estilização adicional:

### Estrutura Principal

```css
.ntpopups-overlay         /* Container backdrop externo */
.ntpopups-container       /* Container do popup */
.ntpopups-header          /* Cabeçalho */
.ntpopups-icon            /* Ícone do cabeçalho */
.ntpopups-body            /* Corpo/conteúdo */
.ntpopups-footer          /* Rodapé */
.ntpopups-basebutton      /* Botão padrão */
```

### Botões

```css
.ntpopups-basebutton              /* Botão base */
.ntpopups-confirm-button          /* Botão de confirmação (popup confirm) */
```

### Form

```css
.ntpopups-form-body               /* Corpo do formulário */
.ntpopups-form-row                /* Linha de componentes */
.ntpopups-form-componentcontainer /* Container de cada campo */
.ntpopups-form-message            /* Mensagem do formulário */
```

### Crop Image

```css
.ntpopups-cropimage-header           /* Cabeçalho do crop */
.ntpopups-cropimage-main             /* Container principal */
.ntpopups-cropimage-container        /* Área de visualização */
.ntpopups-cropimage-container-grab   /* Cursor de arrastar */
.ntpopups-cropimage-container-grabbing /* Cursor arrastando */
.ntpopups-cropimage-full-canvas      /* Canvas completo */
.ntpopups-cropimage-canvas           /* Canvas de recorte */
.ntpopups-cropimage-canvas-circle    /* Canvas circular */
.ntpopups-cropimage-hidden-image     /* Imagem oculta */
.ntpopups-cropimage-zoom-section     /* Seção de zoom */
.ntpopups-cropimage-zoom-controls    /* Controles de zoom */
.ntpopups-cropimage-zoom-slider      /* Slider de zoom */
.ntpopups-cropimage-zoom-icon        /* Ícone de zoom */
.ntpopups-cropimage-zoom-icon-small  /* Ícone pequeno */
.ntpopups-cropimage-zoom-icon-large  /* Ícone grande */
.ntpopups-cropimage-resetbutton      /* Botão de reset */
```

### Exemplo de Uso

```css
/* Customizar botões globalmente */
.ntpopups-basebutton {
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Customizar header específico */
.ntpopups-header {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Customizar corpo do form */
.ntpopups-form-body {
  gap: 20px;
}
```

---

## 📱 Design Responsivo e Acessível

### ✅ Responsividade

- **Mobile-First**: Adaptação automática para telas pequenas
- **Touch-Friendly**: Suporte completo a gestos de toque (drag, pinch)
- **Redimensionamento Inteligente**: Componentes se adaptam automaticamente

**Em dispositivos móveis:**
- Padding reduzido automaticamente
- Fonte ajustada para legibilidade
- Botões com tamanho mínimo de toque (44px)
- Scrollbars otimizadas

### ♿ Acessibilidade

- **Navegação por Teclado**: Suporte completo a teclas (ESC, Tab, Enter)
- **Contraste**: Cores seguem WCAG 2.1 (mínimo AA)
- **Foco Visível**: Indicadores claros de foco nos elementos interativos
- **Semântica HTML**: Estrutura acessível para leitores de tela
- **ARIA Labels**: Atributos apropriados para tecnologias assistivas
- **Sem Dependência de Cor**: Informações não dependem apenas de cor
- **Zoom**: Suporta até 200% de zoom sem quebrar layout

---

## 💡 Ideias de Uso

### 1. Confirmação de Exclusão

```jsx
const confirmarExclusao = (itemId) => {
  openPopup('confirm', {
    data: {
      title: 'Excluir Item',
      message: 'Esta ação não pode ser desfeita. Deseja continuar?',
      icon: '🗑️',
      confirmLabel: 'Sim, excluir',
      confirmStyle: 'Danger',
      cancelLabel: 'Cancelar',
      onChoose: async (confirmado) => {
        if (confirmado) {
          await deletarItem(itemId);
          openPopup('generic', { data: { message: "Item excluído!" } });
        }
      }
    },
    closeOnClickOutside: false,
    closeOnEscape: true
  });
};
```

### 2. Upload e Edição de Avatar

```jsx
const handleAvatarUpload = (arquivo) => {
  openPopup('crop_image', {
    data: {
      image: arquivo,
      format: 'circle',
      onCrop: async (resultado) => {
        // Enviar para o servidor
        const formData = new FormData();
        formData.append('avatar', resultado.file);
        
        await api.post('/usuarios/avatar', formData);
        
        // Atualizar preview local
        setAvatarUrl(resultado.base64);
        
        openPopup('generic', {
          data: {
            title: 'Sucesso!',
            message: 'Avatar atualizado com sucesso.',
            icon: '✅'
          },
          timeout: 3000
        });
      }
    },
    requireAction: true
  });
};
```

### 3. Formulário de Feedback

```jsx
const abrirFormularioFeedback = () => {
  openPopup('form', {
    data: {
      title: 'Envie seu Feedback',
      message: 'Sua opinião é muito importante para nós!',
      icon: '💬',
      doneLabel: 'Enviar Feedback',
      components: [
        {
          id: 'nome',
          type: 'text',
          label: 'Nome',
          placeholder: 'Seu nome',
          required: true,
          minLength: 2
        },
        {
          id: 'email',
          type: 'text',
          label: 'E-mail',
          placeholder: 'seu@email.com',
          required: true,
          matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
        },
        {
          id: 'tipo',
          type: 'text',
          label: 'Tipo de Feedback',
          placeholder: 'Sugestão, Bug, Elogio...',
          required: true
        },
        {
          id: 'mensagem',
          type: 'textarea',
          label: 'Mensagem',
          placeholder: 'Descreva seu feedback aqui...',
          required: true,
          minLength: 10,
          maxLength: 500
        },
        {
          id: 'contato',
          type: 'checkbox',
          label: 'Pode entrar em contato comigo sobre este feedback',
          defaultValue: true
        }
      ],
      onSubmit: async (dados) => {
        await api.post('/feedback', dados);
        
        openPopup('generic', {
          data: {
            title: 'Obrigado!',
            message: 'Seu feedback foi enviado com sucesso.',
            icon: '🎉'
          },
          timeout: 4000
        });
      }
    },
    maxWidth: '600px'
  });
};
```

### 4. Wizard Multi-Step

```jsx
const wizardCadastro = () => {
  const etapas = ['pessoal', 'endereco', 'preferencias'];
  let etapaAtual = 0;
  let dados = {};
  
  const abrirEtapa = (etapa) => {
    const configs = {
      pessoal: {
        title: 'Dados Pessoais (1/3)',
        components: [
          {
            id: 'nome',
            type: 'text',
            label: 'Nome Completo',
            required: true,
            minLength: 3
          },
          [
            {
              id: 'cpf',
              type: 'text',
              label: 'CPF',
              required: true,
              matchRegex: '^\\d{11}$'
            },
            {
              id: 'telefone',
              type: 'text',
              label: 'Telefone',
              required: true
            }
          ]
        ]
      },
      endereco: {
        title: 'Endereço (2/3)',
        components: [
          {
            id: 'cep',
            type: 'text',
            label: 'CEP',
            required: true,
            matchRegex: '^\\d{8}$'
          },
          {
            id: 'rua',
            type: 'text',
            label: 'Rua',
            required: true
          },
          [
            {
              id: 'numero',
              type: 'text',
              label: 'Número',
              required: true
            },
            {
              id: 'complemento',
              type: 'text',
              label: 'Complemento'
            }
          ]
        ]
      },
      preferencias: {
        title: 'Preferências (3/3)',
        components: [
          {
            id: 'newsletter',
            type: 'checkbox',
            label: 'Quero receber newsletter',
            defaultValue: true
          },
          {
            id: 'notificacoes',
            type: 'checkbox',
            label: 'Quero receber notificações',
            defaultValue: true
          },
          {
            id: 'observacoes',
            type: 'textarea',
            label: 'Observações',
            placeholder: 'Algo mais que queira nos contar...',
            maxLength: 200
          }
        ]
      }
    };
    
    const config = configs[etapa];
    
    openPopup('form', {
      id: `wizard_${etapa}`,
      data: {
        ...config,
        icon: '📝',
        doneLabel: etapa === 'preferencias' ? 'Finalizar' : 'Próximo',
        onSubmit: (valores) => {
          dados = { ...dados, ...valores };
          
          if (etapa === 'preferencias') {
            // Última etapa - finalizar
            finalizarCadastro(dados);
          } else {
            // Próxima etapa
            etapaAtual++;
            abrirEtapa(etapas[etapaAtual]);
          }
        }
      }
    });
  };
  
  const finalizarCadastro = async (dadosCompletos) => {
    await api.post('/cadastro', dadosCompletos);
    
    openPopup('generic', {
      data: {
        title: 'Cadastro Concluído!',
        message: 'Bem-vindo! Seu cadastro foi realizado com sucesso.',
        icon: '🎊'
      },
      timeout: 5000
    });
  };
  
  abrirEtapa(etapas[0]);
};
```

### 5. Modal de Carregamento

```jsx
const executarAcaoLonga = async () => {
  const loadingId = openPopup('generic', {
    id: 'loading_popup',
    data: {
      title: 'Processando...',
      message: 'Por favor, aguarde enquanto processamos sua solicitação.',
      icon: '⏳'
    },
    closeOnEscape: false,
    closeOnClickOutside: false,
    hiddenFooter: true
  });
  
  try {
    await realizarOperacaoLonga();
    
    closePopup(loadingId, true);
    
    openPopup('generic', {
      data: {
        title: 'Concluído!',
        message: 'Operação realizada com sucesso.',
        icon: '✅'
      },
      timeout: 3000
    });
  } catch (erro) {
    closePopup(loadingId, true);
    
    openPopup('generic', {
      data: {
        title: 'Erro',
        message: `Ocorreu um erro: ${erro.message}`,
        icon: '❌',
        closeLabel: 'Entendi'
      }
    });
  }
};
```

### 6. Tour Guiado (Onboarding)

```jsx
const iniciarTour = () => {
  const passos = [
    {
      title: 'Bem-vindo! 👋',
      message: 'Vamos fazer um tour rápido pelas funcionalidades principais.',
      icone: '🚀'
    },
    {
      title: 'Dashboard',
      message: 'Aqui você visualiza todas as suas métricas em tempo real.',
      icone: '📊'
    },
    {
      title: 'Configurações',
      message: 'Personalize sua experiência nas configurações.',
      icone: '⚙️'
    },
    {
      title: 'Pronto!',
      message: 'Você está pronto para começar. Boa sorte!',
      icone: '🎉'
    }
  ];
  
  let passoAtual = 0;
  
  const mostrarPasso = () => {
    const passo = passos[passoAtual];
    const ehUltimo = passoAtual === passos.length - 1;
    
    openPopup('generic', {
      id: 'tour_step',
      data: {
        title: passo.title,
        message: passo.message,
        icon: passo.icone,
        closeLabel: ehUltimo ? 'Começar' : 'Próximo'
      },
      onClose: (hasAction) => {
        if (hasAction && !ehUltimo) {
          passoAtual++;
          setTimeout(mostrarPasso, 300);
        } else if (hasAction && ehUltimo) {
          localStorage.setItem('tour_completo', 'true');
        }
      }
    });
  };
  
  mostrarPasso();
};
```

### 7. Popup de Notificação com Ações

```jsx
// Popup customizado para notificações
const NotificationPopup = ({ closePopup, popupstyles, data }) => {
  const { tipo, titulo, mensagem, acoes = [] } = data;
  
  const icones = {
    sucesso: '✅',
    erro: '❌',
    aviso: '⚠️',
    info: 'ℹ️'
  };
  
  return (
    <>
      <div className={popupstyles.header}>
        <div className={popupstyles.icon}>{icones[tipo]}</div>
        {titulo}
      </div>
      
      <div className={popupstyles.body}>
        <p>{mensagem}</p>
      </div>
      
      <div className={popupstyles.footer}>
        {acoes.map((acao, index) => (
          <button
            key={index}
            className={popupstyles.baseButton}
            base-button-style={acao.estilo || "0"}
            onClick={() => {
              acao.callback?.();
              closePopup(true);
            }}
          >
            {acao.label}
          </button>
        ))}
      </div>
    </>
  );
};

// Uso
openPopup('notification', {
  data: {
    tipo: 'aviso',
    titulo: 'Nova Mensagem',
    mensagem: 'Você tem uma nova mensagem de João Silva.',
    acoes: [
      {
        label: 'Ignorar',
        estilo: '1',
        callback: () => console.log('Ignorado')
      },
      {
        label: 'Ver Agora',
        callback: () => navegarPara('/mensagens/123')
      }
    ]
  },
  timeout: 8000
});
```

### 8. Validação Complexa com Feedback Visual

```jsx
const formularioAvancado = () => {
  openPopup('form', {
    data: {
      title: 'Criar Nova Conta',
      icon: '🔐',
      components: [
        {
          id: 'usuario',
          type: 'text',
          label: 'Nome de Usuário',
          placeholder: 'mínimo 3 caracteres',
          required: true,
          minLength: 3,
          maxLength: 20,
          matchRegex: '^[a-zA-Z0-9_]+$'
        },
        {
          id: 'email',
          type: 'text',
          label: 'E-mail',
          placeholder: 'seu@email.com',
          required: true,
          matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,}$'
        },
        {
          id: 'senha',
          type: 'text',
          label: 'Senha',
          placeholder: 'mínimo 8 caracteres',
          required: true,
          minLength: 8,
          matchRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
        },
        {
          id: 'bio',
          type: 'textarea',
          label: 'Biografia',
          placeholder: 'Conte um pouco sobre você (opcional)',
          maxLength: 150,
          disableResize: true
        },
        [
          {
            id: 'termos',
            type: 'checkbox',
            label: 'Aceito os Termos de Uso',
            required: true
          },
          {
            id: 'privacidade',
            type: 'checkbox',
            label: 'Aceito a Política de Privacidade',
            required: true
          }
        ]
      ],
      onSubmit: async (dados) => {
        try {
          await api.post('/criar-conta', dados);
          
          openPopup('generic', {
            data: {
              title: 'Conta Criada!',
              message: 'Verifique seu e-mail para ativar sua conta.',
              icon: '📧'
            }
          });
        } catch (erro) {
          openPopup('generic', {
            data: {
              title: 'Erro',
              message: erro.response?.data?.message || 'Erro ao criar conta.',
              icon: '❌'
            }
          });
        }
      }
    },
    maxWidth: '550px'
  });
};
```

---

## 🎓 Dicas e Boas Práticas

### ✅ Recomendações


1. **Callbacks Assíncronos**: Sempre trate erros em operações assíncronas
   ```jsx
   onSubmit: async (dados) => {
     try {
       await salvarDados(dados);
     } catch (erro) {
       console.error(erro);
     }
   }
   ```

2. **Validação Externa**: Valide dados críticos no servidor também
   ```jsx
   // Validação no form + validação no backend
   ```

3. **Timeout Apropriado**: Use timeouts apenas para mensagens informativas
   ```jsx
   // ✅ Bom - notificação de sucesso
   timeout: 3000
   
   // ❌ Ruim - formulário importante
   timeout: 5000
   ```

4. **RequireAction**: Use para ações críticas
   ```jsx
   // ✅ Bom - confirmação de exclusão
   requireAction: true
   
   // ❌ Ruim - mensagem informativa
   requireAction: true
   ```

5. **Cleanup**: Feche popups ao desmontar componentes
   ```jsx
   useEffect(() => {
     return () => closeAllPopups();
   }, []);
   ```

### ⚠️ Evite

1. **Múltiplos Popups Simultâneos**: Confunde o usuário
   ```jsx
   // ❌ Evite
   openPopup('generic', { keepLast: true });
   openPopup('confirm', { keepLast: true });
   ```

2. **Popups Muito Longos**: Quebre em múltiplas etapas
   ```jsx
   // ❌ Form com 20 campos
   // ✅ Wizard de 3 etapas com 6-7 campos cada
   ```

3. **Timeout em Ações Importantes**: Usuário pode perder o popup
   ```jsx
   // ❌ Confirmação com timeout
   openPopup('confirm', { timeout: 5000 });
   ```

---

## 🔧 Troubleshooting

### Popup não abre

**Problema**: `openPopup` retorna `null`

**Soluções**:
- Verifique se o tipo está registrado no `customPopups`
- Verifique se há erros no console
- Confirme que o `NtPopupProvider` está envolvendo o componente

### Estilos não aplicados

**Problema**: Popup aparece sem estilos

**Soluções**:
- Importe o CSS: `import 'ntpopups/dist/style.css'`
- Verifique a ordem de importação (estilos da lib primeiro)
- Em Next.js App Router, importe no componente Client

### Form não valida

**Problema**: Botão fica sempre desabilitado

**Soluções**:
- Verifique se `required: true` está correto
- Verifique regex com `matchRegex`
- Teste minLength/maxLength
- Campos `disabled` não são validados

### Popup não fecha

**Problema**: ESC ou clique fora não funciona

**Soluções**:
- Verifique `closeOnEscape` e `closeOnClickOutside`
- Verifique se `requireAction: true`
- Use `closePopup(id, true)` dentro do componente

### Next.js: Erro de Hidratação

**Problema**: Warning de hydration mismatch

**Solução**:
```jsx
// ✅ Marque o provider como 'use client'
'use client';
import { NtPopupProvider } from 'ntpopups';
```

### TypeScript: Erros de Tipo

**Problema**: Tipos não reconhecidos

**Solução**:
```typescript
// Instale os tipos (se disponíveis)
// ou use type assertions
const popup = openPopup('custom', settings) as string;
```

---

## 📄 Licença

MIT License - Sinta-se livre para usar em projetos pessoais e comerciais.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrou um bug ou tem uma sugestão:

1. Abra uma issue no repositório
2. Envie um pull request com melhorias
3. Compartilhe casos de uso interessantes

---

## 📚 Recursos Adicionais

- **Exemplos demonstração**: [https://ntpopups.nemtudo.me/demo]
- **Documentação Completa**: [https://ntpopups.nemtudo.me]
- **Repositório GitHub**: [https://github.com/Nem-Tudo/ntPopups]

---

## ⭐ Agradecimentos

Obrigado por usar **ntPopups**! Se esta biblioteca foi útil para você, considere dar uma ⭐ no GitHub.

**Desenvolvido com ❤️ por [Nem Tudo](https://nemtudo.me/)**

---

<div align="center">

### 🚀 ntPopups - Ease and powerful popup library for React

**[Documentação](https://ntpopups.nemtudo.me) • [Exemplos](https://ntpopups.nemtudo.me/demo) • [GitHub](https://github.com/Nem-Tudo/ntPopups)**

</div>