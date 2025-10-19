# 🎯 NtPopups

<div align="center">

**Gerenciamento Profissional de Pop-ups para React**

[![npm version](https://img.shields.io/npm/v/ntpopups.svg?style=flat-square)](https://www.npmjs.com/package/ntpopups)
[![License](https://img.shields.io/npm/l/ntpopups.svg?style=flat-square)](https://github.com/yourusername/ntpopups/blob/main/LICENSE)

*Uma solução moderna e robusta para janelas modais em React*

[Instalação](#-instalação) • [Configuração](#️-configuração) • [Uso](#-uso) • [Customização](#-customização) • [Exemplos](#-exemplos)

</div>

---

## ✨ Características

- 🎨 **Totalmente Customizável** - Temas via CSS Variables
- 🪝 **Hooks Modernos** - API simples com Context API
- ⚡ **Performance** - Zero dependências extras
- 🎭 **TypeScript Ready** - Tipagem completa (em breve)
- 🌙 **Dark Mode** - Suporte nativo a temas
- 📱 **Responsivo** - Funciona em todos os dispositivos
- ♿ **Acessível** - Seguindo as melhores práticas
- 🔧 **Extensível** - Crie seus próprios pop-ups facilmente

---

## 🚀 Instalação

```bash
# npm
npm install ntpopups

# yarn
yarn add ntpopups

# pnpm
pnpm add ntpopups
```

### 📋 Dependências

Esta biblioteca requer as seguintes peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `react-icons`

---

## ⚙️ Configuração

### Next.js (App Router)

#### 1️⃣ Importar Estilos Globalmente

```javascript
// src/app/layout.js ou src/index.js
import 'ntpopups/styles.css';
```

#### 2️⃣ Criar Componente Provider

```jsx
// src/components/Providers.jsx
'use client';

import { NtPopupProvider } from 'ntpopups';
import React from 'react';

export default function Providers({ children }) {
  return (
    <NtPopupProvider>
      {children}
    </NtPopupProvider>
  );
}
```

#### 3️⃣ Adicionar ao Layout Principal

```jsx
// src/app/layout.js
import Providers from '../components/Providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

## 💡 Uso

### Hook Principal

```javascript
import { usePopup } from 'ntpopups';

function MeuComponente() {
  const { openPopup, closePopup, closeAllPopups } = usePopup();
  
  // Seu código aqui
}
```

### 📦 Pop-ups Incluídos

| Tipo | Descrição | Uso |
|------|-----------|-----|
| `generic` | Mensagem simples (substitui `alert()`) | Notificações, avisos |
| `confirm` | Confirmação com botões (substitui `confirm()`) | Ações importantes |
| `crop_image` | Corte de imagens (em desenvolvimento) | Upload de fotos |

---

## 🎯 Exemplos

### Alerta Simples

```javascript
import { usePopup } from 'ntpopups';

function MeuComponente() {
  const { openPopup } = usePopup();

  const mostrarAlerta = () => {
    openPopup("generic", {
      title: "Bem-vindo!",
      message: "Sua conta foi criada com sucesso."
    });
  };

  return <button onClick={mostrarAlerta}>Criar Conta</button>;
}
```

### Confirmação com Timeout

```javascript
const { openPopup } = usePopup();

const confirmarPagamento = () => {
  openPopup("confirm", {
    title: "Confirmação de Pedido",
    message: "O valor total é R$ 150,00. Deseja finalizar o pagamento?",
    timeout: 10000, // 10 segundos
    
    onChoose: (confirmado) => {
      if (confirmado) {
        processarPagamento();
      } else {
        cancelarPedido();
      }
    }
  });
};
```

---

## 🎨 Customização

### Variáveis CSS

Personalize o tema sobrescrevendo as variáveis CSS no seu arquivo global:

```css
/* globals.css */
:root {
  /* Cores */
  --ntpopup-color-primary: #8b5cf6;
  --ntpopup-color-secondary: #6c757d;
  --ntpopup-color-text: #212529;
  
  /* Fundos */
  --ntpopup-bg-default: #ffffff;
  --ntpopup-bg-overlay: rgba(0, 0, 0, 0.459);
  
  /* Layout */
  --ntpopup-border-radius: 10px;
  --ntpopup-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

### 🌙 Tema Escuro

```css
:root {
  --ntpopup-bg-default: #1f2937;
  --ntpopup-color-text: #f3f4f6;
  --ntpopup-bg-overlay: rgba(0, 0, 0, 0.85);
  --ntpopup-color-primary: #8b5cf6;
}
```

### 🎭 Desabilitar CSS Padrão

Para estilização completamente customizada:

```jsx
<NtPopupProvider config={{ useDefaultCss: false }}>
  {children}
</NtPopupProvider>
```

---

## 🔧 Pop-ups Customizados

### 1. Criar Componente

```jsx
// src/components/AvisoPersonalizado.jsx
'use client';
import React from 'react';

export default function AvisoPersonalizado({ closePopup, nome, prioridade }) {
  const handleClose = () => closePopup(true);

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h3>⚠️ Atenção, {nome}!</h3>
      <p>Sua tarefa <strong>({prioridade})</strong> exige atenção imediata.</p>
      <button onClick={handleClose}>Entendi</button>
    </div>
  );
}
```

### 2. Registrar no Provider

```jsx
// src/components/Providers.jsx
import { NtPopupProvider } from 'ntpopups';
import AvisoPersonalizado from './AvisoPersonalizado';

const customPopups = {
  "aviso_personalizado": AvisoPersonalizado
};

export default function Providers({ children }) {
  return (
    <NtPopupProvider customPopups={customPopups}>
      {children}
    </NtPopupProvider>
  );
}
```

### 3. Utilizar

```javascript
const { openPopup } = usePopup();

openPopup("aviso_personalizado", {
  nome: "João Silva",
  prioridade: "Alta"
});
```

---

## 📚 API Completa

### `usePopup()`

Retorna um objeto com os seguintes métodos:

| Método | Parâmetros | Descrição |
|--------|------------|-----------|
| `openPopup` | `(type, props)` | Abre um pop-up do tipo especificado |
| `closePopup` | `(result)` | Fecha o pop-up atual com um resultado |
| `closeAllPopups` | `()` | Fecha todos os pop-ups abertos |

### Props Comuns

Todas as props disponíveis para os pop-ups padrão:

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | `string` | - | Título do pop-up |
| `message` | `string` | - | Mensagem principal |
| `timeout` | `number` | - | Tempo em ms para fechar automaticamente |
| `onChoose` | `function` | - | Callback para confirmação (`true`/`false`) |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Feito com ❤️ para a comunidade React

---

<div align="center">

**[⬆ Voltar ao topo](#-ntpopups)**

Se este projeto te ajudou, considere dar uma ⭐!

</div>