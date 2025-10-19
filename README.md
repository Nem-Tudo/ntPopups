# 🎯 NtPopups

<div align="center">

**Professional Pop-up Management for React**

[![npm version](https://img.shields.io/npm/v/ntpopups.svg?style=flat-square)](https://www.npmjs.com/package/ntpopups)
[![License](https://img.shields.io/npm/l/ntpopups.svg?style=flat-square)](https://github.com/yourusername/ntpopups/blob/main/LICENSE)

*A modern and robust solution for modal windows in React*

[Installation](#-installation) • [Setup](#️-setup) • [Usage](#-usage) • [Customization](#-customization) • [Examples](#-examples)

</div>

---

## ✨ Features

- 🎨 **Fully Customizable** - Theming via CSS Variables
- 🪝 **Modern Hooks** - Simple API with Context API
- ⚡ **Performance** - Zero extra dependencies
- 🎭 **TypeScript Ready** - Full typing (coming soon)
- 🌙 **Dark Mode** - Native theme support
- 📱 **Responsive** - Works on all devices
- ♿ **Accessible** - Following best practices
- 🔧 **Extensible** - Create your own pop-ups easily

---

## 🚀 Installation

```bash
# npm
npm install ntpopups

# yarn
yarn add ntpopups

# pnpm
pnpm add ntpopups
```

### 📋 Dependencies

This library requires the following peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `react-icons`

---

## ⚙️ Setup

### Next.js (App Router)

#### 1️⃣ Import Styles Globally

```javascript
// src/app/layout.js or src/index.js
import 'ntpopups/styles.css';
```

#### 2️⃣ Create Provider Component

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

#### 3️⃣ Add to Main Layout

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

## 💡 Usage

### Main Hook

```javascript
import { usePopup } from 'ntpopups';

function MyComponent() {
  const { openPopup, closePopup, closeAllPopups } = usePopup();
  
  // Your code here
}
```

### 📦 Built-in Pop-ups

| Type | Description | Use Case |
|------|-------------|----------|
| `generic` | Simple message (replaces `alert()`) | Notifications, warnings |
| `confirm` | Confirmation with buttons (replaces `confirm()`) | Important actions |
| `crop_image` | Image cropping (in development) | Photo uploads |

---

## 🎯 Examples

### Simple Alert

```javascript
import { usePopup } from 'ntpopups';

function MyComponent() {
  const { openPopup } = usePopup();

  const showAlert = () => {
    openPopup("generic", {
      title: "Welcome!",
      message: "Your account has been created successfully."
    });
  };

  return <button onClick={showAlert}>Create Account</button>;
}
```

### Confirmation with Timeout

```javascript
const { openPopup } = usePopup();

const confirmPayment = () => {
  openPopup("confirm", {
    title: "Order Confirmation",
    message: "Total amount is $150.00. Do you want to proceed with payment?",
    timeout: 10000, // 10 seconds
    
    onChoose: (confirmed) => {
      if (confirmed) {
        processPayment();
      } else {
        cancelOrder();
      }
    }
  });
};
```

---

## 🎨 Customization

### CSS Variables

Customize the theme by overriding CSS variables in your global file:

```css
/* globals.css */
:root {
  /* Colors */
  --ntpopup-color-primary: #8b5cf6;
  --ntpopup-color-secondary: #6c757d;
  --ntpopup-color-text: #212529;
  
  /* Backgrounds */
  --ntpopup-bg-default: #ffffff;
  --ntpopup-bg-overlay: rgba(0, 0, 0, 0.459);
  
  /* Layout */
  --ntpopup-border-radius: 10px;
  --ntpopup-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

### 🌙 Dark Theme

```css
:root {
  --ntpopup-bg-default: #1f2937;
  --ntpopup-color-text: #f3f4f6;
  --ntpopup-bg-overlay: rgba(0, 0, 0, 0.85);
  --ntpopup-color-primary: #8b5cf6;
}
```

### 🎭 Disable Default CSS

For completely custom styling:

```jsx
<NtPopupProvider config={{ useDefaultCss: false }}>
  {children}
</NtPopupProvider>
```

---

## 🔧 Custom Pop-ups

### 1. Create Component

```jsx
// src/components/CustomWarning.jsx
'use client';
import React from 'react';

export default function CustomWarning({ closePopup, name, priority }) {
  const handleClose = () => closePopup(true);

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h3>⚠️ Attention, {name}!</h3>
      <p>Your task <strong>({priority})</strong> requires immediate attention.</p>
      <button onClick={handleClose}>Got it</button>
    </div>
  );
}
```

### 2. Register in Provider

```jsx
// src/components/Providers.jsx
import { NtPopupProvider } from 'ntpopups';
import CustomWarning from './CustomWarning';

const customPopups = {
  "custom_warning": CustomWarning
};

export default function Providers({ children }) {
  return (
    <NtPopupProvider customPopups={customPopups}>
      {children}
    </NtPopupProvider>
  );
}
```

### 3. Use It

```javascript
const { openPopup } = usePopup();

openPopup("custom_warning", {
  name: "John Doe",
  priority: "High"
});
```

---

## 📚 Complete API

### `usePopup()`

Returns an object with the following methods:

| Method | Parameters | Description |
|--------|------------|-------------|
| `openPopup` | `(type, props)` | Opens a pop-up of the specified type |
| `closePopup` | `(result)` | Closes the current pop-up with a result |
| `closeAllPopups` | `()` | Closes all open pop-ups |

### Common Props

All available props for built-in pop-ups:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Pop-up title |
| `message` | `string` | - | Main message |
| `timeout` | `number` | - | Time in ms to auto-close |
| `onChoose` | `function` | - | Callback for confirmation (`true`/`false`) |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

1. Fork the project
2. Create your branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Made with ❤️ for the React community

---

<div align="center">

**[⬆ Back to top](#-ntpopups)**

If this project helped you, consider giving it a ⭐!

</div>