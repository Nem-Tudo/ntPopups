# ntPopups 🚀

> **Easy and powerful popup library for React**

A modern, fully customizable and responsive popup library for React. Create elegant popups with theme support, internationalization, and custom components in a simple and powerful way.

[![npm version](https://img.shields.io/npm/v/ntpopups.svg)](https://www.npmjs.com/package/ntpopups)
[![License](https://img.shields.io/npm/l/ntpopups.svg)](https://github.com/Nem-Tudo/ntpopups/blob/main/LICENSE)

> <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f1e7-1f1f7.png" width="20" alt="pt-br" style="vertical-align: middle;" /> [Leia isto em português](https://github.com/Nem-Tudo/ntPopups/blob/main/README.pt-BR.md)

## ✨ Features

- 🎨 **Themes**: Support for light and dark themes
- 🌍 **Internationalization**: Support for multiple languages (EN, PTBR)
- 📱 **Responsive**: Works perfectly on mobile and desktop
- 🎭 **Ready-to-Use Popups**: Various popups ready to use
- 🔧 **Customizable**: Create your own custom popups
- ⚡ **Lightweight and Fast**: Optimized performance. No extra dependencies


## 📦 Installation

```bash
npm install ntpopups
```

or

```bash
yarn add ntpopups
```


## 🎯 Initial Setup

### React

Wrap your application with `NtPopupProvider`:

```jsx
// App.jsx
import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css'; // Import styles

function App() {
  return (
    <NtPopupProvider language="en" theme="white">
      {/* Your app here */}
    </NtPopupProvider>
  );
}

export default App;
```

### Next.js (App Router)

Create a separate Providers component as a Client Component:

```jsx
// components/Providers.jsx
'use client';

import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';

export default function Providers({ children }) {
  return (
    <NtPopupProvider language="en" theme="white">
      {children}
    </NtPopupProvider>
  );
}
```

And use it in the main layout:

```jsx
// app/layout.jsx
import Providers from '@/components/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
    <NtPopupProvider language="en" theme="white">
      <Component {...pageProps} />
    </NtPopupProvider>
  );
}

export default MyApp;
```

---

## 🎨 Basic Usage

### Main Hook

```jsx
import useNtPopups from 'ntpopups';

function MyComponent() {
  const { openPopup, closePopup } = useNtPopups();

  const handleClick = () => {
    openPopup('generic', {
      data: {
        title: 'Hello!',
        message: 'This is a simple popup.',
      }
    });
  };

  return <button onClick={handleClick}>Open Popup</button>;
}
```

---

## 🧩 Native Popups

### 1. **Generic** - Simple Message Popup

```jsx
openPopup('generic', {
  data: {
    title: 'Warning',
    message: 'This is an informative message.',
    closeLabel: 'Got it',
    icon: '⚠️'
  }
});
```

**Available props:**
- `title` (ReactNode): Popup title
- `message` (ReactNode): Main message
- `closeLabel` (ReactNode): Close button text
- `icon` (ReactNode): Icon next to title (default: "ⓘ")

---

### 2. **Confirm** - Confirmation Popup

```jsx
openPopup('confirm', {
  data: {
    title: 'Confirmation',
    message: 'Are you sure you want to continue?',
    cancelLabel: 'Cancel',
    confirmLabel: 'Yes, continue',
    confirmStyle: 'Danger',
    icon: '❓',
    onChoose: (confirmed) => {
      if (confirmed) {
        console.log('User confirmed!');
      } else {
        console.log('User cancelled.');
      }
    }
  }
});
```

**Available props:**
- `title` (ReactNode): Popup title
- `message` (ReactNode): Confirmation message
- `cancelLabel` (ReactNode): Cancel button text
- `confirmLabel` (ReactNode): Confirm button text
- `confirmStyle` ('default'|'Secondary'|'Success'|'Danger'): Confirmation button style
- `icon` (ReactNode): Icon next to title
- `onChoose` (Function): Callback that receives `true` (confirm) or `false` (cancel)

---

### 3. **Crop Image** - Image Editor with Cropping

```jsx
openPopup('crop_image', {
  requireAction: false,
  data: {
    image: fileOrUrl, // File or string (base64/URL)
    format: 'circle', // 'circle' or 'square'
    onCrop: (result) => {
      console.log('Blob:', result.blob);
      console.log('Base64:', result.base64);
      console.log('File:', result.file);
    }
  }
});
```

**Available props:**
- `image` (File | string): Image file or URL/base64
- `format` ('circle' | 'square'): Crop format (default: 'circle')
- `onCrop` (Function): Callback with result `{ blob, base64, file }`

**💡 Tip:**
- When `requireAction = true`, the "Cancel" button is removed
---

### 4. **Form** - Dynamic Form

```jsx
openPopup('form', {
  data: {
    title: 'Registration',
    message: 'Fill in the fields below:',
    doneLabel: 'Submit',
    icon: '📝',
    components: [
      {
        id: 'name', // key that will be used in the final result object
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
        minLength: 3,
        maxLength: 50
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        placeholder: 'your@email.com',
        required: true,
        matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
      },
      {
        id: 'bio',
        type: 'textarea',
        label: 'Biography',
        placeholder: 'Tell us about yourself...',
        maxLength: 200,
        disableResize: true
      },
      {
        id: 'accept',
        type: 'checkbox',
        label: 'I accept the terms',
        defaultValue: false
      },
      // Inline fields (array within array)
      [
        {
          id: 'city',
          type: 'text',
          label: 'City',
          placeholder: 'New York'
        },
        {
          id: 'state',
          type: 'text',
          label: 'State',
          placeholder: 'NY',
          maxLength: 2
        }
      ]
    ],
    onResponse: (values) => {
      console.log('Form data:', values);
      // { name: "...", email: "...", bio: "...", accept: true, city: "...", state: "..." }
    }
  }
});
```

**Form Props:**
- `title` (ReactNode): Form title
- `message` (ReactNode): Optional explanatory message
- `doneLabel` (ReactNode): Submit button text
- `icon` (ReactNode): Header icon
- `components` (Array): List of form components
- `onResponse` (Function): Callback with object containing all values `{ id: value }`

**Component Types:**

#### Text Input
```javascript
{
  id: 'unique_field',       // string (required)
  type: 'text',            // 'text'
  label: 'Label',          // string (required)
  placeholder: 'Type...',  // string (optional)
  defaultValue: '',        // string (optional)
  required: false,         // boolean (optional)
  disabled: false,         // boolean (optional)
  minLength: 3,            // number (optional)
  maxLength: 50,           // number (optional)
  matchRegex: '^[A-Z].*'   // string regex (optional)
}
```

#### Textarea
```javascript
{
  id: 'text_field',
  type: 'textarea',
  label: 'Description',
  placeholder: 'Enter a description...',
  defaultValue: '',
  required: false,
  disabled: false,
  disableResize: false,    // boolean (optional) - disables user resizing
  minLength: 10,
  maxLength: 500,
  matchRegex: '.*'
}
```

#### Checkbox
```javascript
{
  id: 'accept_terms',
  type: 'checkbox',
  label: 'I accept the terms of use',
  defaultValue: false,     // boolean (optional)
  disabled: false,
  required: false          // If true, must be checked
}
```

**💡 Tips:**
- When `requireAction = true`, the "Cancel" button is removed
- The submit button is disabled until all fields are valid
- Invalid fields automatically receive a red border
- Applied validations: `required`, `minLength`, `maxLength`, `matchRegex`

---

## 🎨 Creating Custom Popups

### 1. Basic Structure
```jsx
export default function MyCustomPopup({
  // ⚙️ LIBRARY PROPS (automatic)
  closePopup,      // Function to close the popup
  popupstyles,     // Predefined CSS classes from the library
  requireAction,   // Boolean - if popup requires action to close
  
  // 📦 CUSTOM PROPS (defined by you!)
  data = {}
}) {
  
  return (
    <>
      {/* HEADER */}
      <div className={popupstyles.header}> 
        <div className={popupstyles.icon}>ⓘ</div>
        Title
      </div>

      {/* BODY */}
      <div className={popupstyles.body}>
        <p>Body</p>
      </div>

      {/* FOOTER */}
      <div className={popupstyles.footer}>        
        <button
          className={popupstyles.baseButton}
          base-button-style="0" // default: 0 | Available: "0", "1", "2"
          base-button-no-flex={"false"} // default: false
          onClick={() => closePopup(true)}
        >Ok</button>
      </div>
    </>
  );
}
```

### 2. Create the Component

```jsx
// components/popups/MyCustomPopup.jsx
import styles from './mystyles.module.css';

export default function MyCustomPopup({
  closePopup,
  popupstyles,
  requireAction,
  
  // 📦 CUSTOM PROPS (defined by you!)
  data: {
    message = 'Default message',
    myProp1,
    myProp2 = 'This is an amazing lib! :D',
    myProp3,
    myCallback = () => {}
  } = {}
}) {
  
  // Custom logic
  const handleReady = () => {
    myCallback(myProp1 + myProp2);
    closePopup(true); // true = intentional user action
  };

  return (
    <>
      {/* HEADER */}
      <div className={popupstyles.header}> 
        <div className={popupstyles.icon}>💡</div>
        Custom Popup
      </div>

      {/* BODY */}
      <div className={popupstyles.body}>
        <p>{message}</p>
        <h3>Property 1: {myProp1}</h3>
        
        {/* Using your own styles */}
        <button 
          className={styles.myCustomButton}
          onClick={() => alert(myProp3)}
        >
          {myProp2}
        </button>
      </div>

      {/* FOOTER */}
      <div className={popupstyles.footer}>
        {/* Conditional button - only appears if action not required */}
        {!requireAction && (
          <button 
            className={popupstyles.baseButton}
            base-button-style="1"
            onClick={() => closePopup()} // false implicit - No effect when requireAction=true
          >
            Cancel
          </button>
        )}
        
        <button 
          className={popupstyles.baseButton}
          onClick={handleReady}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
```
**💡 Tip:**
When `requireAction = true`, the `closePopup()` function will only take effect if there's an action. (`closePopup(true)`)

### 3. Register in Provider

```jsx
import { NtPopupProvider } from 'ntpopups';
import MyCustomPopup from './components/MyCustomPopup';

function App() {
  return (
    <NtPopupProvider
      language="en"
      theme="white"
      customPopups={{
        'my_custom': MyCustomPopup, 
        'another_custom': AnotherPopup // Add as many as you want! :D
      }}
    >
      {/* Your app */}
    </NtPopupProvider>
  );
}
```

### 4. Use the Custom Popup

```jsx
const { openPopup } = useNtPopups();

openPopup('my_custom', {
  data: {
    message: 'Hello from custom popup!',
    myProp1: 'Value 1',
    myProp2: 'Value 2',
    myProp3: 'Secret revealed!',
    myCallback: (result) => {
      console.log('Callback executed:', result);
    }
  },
  requireAction: true,
  maxWidth: '600px'
});
```

---

## ⚙️ Global Settings

### Provider Props

```jsx
<NtPopupProvider
  language="en"             // 'en' or 'ptbr'
  theme="white"             // 'white' or 'dark'
  customPopups={{}}         // Object with custom popups
  config={{
    defaultSettings: {
      all: { // All popups
        closeOnEscape: true,
        closeOnClickOutside: true,
      },
      generic: { // You can configure library popups
        closeOnClickOutside: false,
        timeout: 20 * 1000
      },
      confirm: {
        closeOnClickOutside: false // Specific settings take priority over "all" setting
      },
      my_custom: { // You can configure your own popups
        requireAction: true
      }
    }
  }}
>
```

### Base Settings

Applicable to **any popup** (native or custom):

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | auto | Unique popup ID (Not recommended to change) |
| `closeOnEscape` | boolean | true | Allows closing with ESC key |
| `closeOnClickOutside` | boolean | true | Allows closing by clicking outside |
| `requireAction` | boolean | false | Requires internal action to close |
| `timeout` | number | 0 | Time (ms) to auto-close |
| `keepLast` | boolean | false | Keeps previous popup visible underneath |
| `hiddenHeader` | boolean | false | Hides the header |
| `hiddenFooter` | boolean | false | Hides the footer |
| `disableOpenAnimation` | boolean | false | Disables opening animation |
| `maxWidth` | string | - | CSS max width (e.g., '800px') |
| `onOpen` | Function | - | Callback on open: `(id) => {}` |
| `onClose` | Function | - | Callback on close: `(hasAction, id) => {}` |

**Example with settings:**

```jsx
openPopup('generic', {
  closeOnEscape: false,
  closeOnClickOutside: false,
  requireAction: true,
  timeout: 5000,
  keepLast: true,
  hiddenHeader: true,
  hiddenFooter: true,
  disableOpenAnimation: true,
  maxWidth: '400px',
  onOpen: (id) => console.log('Popup opened:', id),
  onClose: (hasAction, id) => {
    console.log('Closed with action?', hasAction);
  },
  data: {
    message: 'This popup closes itself in 5 seconds!'
  }
});
```

---

## 🎭 Hook API

```typescript
const {
  openPopup,       // (type, settings) => string|null
  closePopup,      // (id?, hasAction?) => void
  closeAllPopups,  // () => void
  isPopupOpen,     // (id) => boolean
  getPopup,        // (id) => PopupData|null
  popups,          // Array of active popups
  language         // Active language ('en' | 'ptbr')
} = useNtPopups();
```

### `openPopup(type, settings)`
Opens a popup and returns its unique ID.

```jsx
const popupId = openPopup('confirm', {
  data: { message: 'Do you want to continue?' }
});
```

### `closePopup(id?, hasAction?)`
Closes a specific popup or the last opened one.

```jsx
// Close last popup without action
closePopup();

// Close specific popup with action
closePopup('popup_123', true);

// Close last popup with action
closePopup(true);
```

### `closeAllPopups()`
Closes all open popups.

```jsx
closeAllPopups();
```

### `isPopupOpen(id)`
Checks if a popup is open.

```jsx
if (isPopupOpen('my_popup')) {
  console.log('Popup is still open!');
}
```

### `getPopup(id)`
Returns the data of an open popup.

```jsx
const popup = getPopup('popup_123');
console.log(popup?.settings);
```

---

## 🎨 Visual Customization

### Available CSS Variables

The library offers **over 100 CSS variables** for complete customization. All follow the `--ntpopups-*` pattern.

#### 🎯 Typography

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

#### 🎨 Primary Colors

```css
--ntpopups-color-primary: #5f54f0;
--ntpopups-color-primary-hover: #4f43f5;
--ntpopups-color-primary-active: #3f33e5;
--ntpopups-color-primary-disabled: #a39fd8;
--ntpopups-color-primary-light: #e8e6fc;
```

#### 🎨 Secondary Colors

```css
--ntpopups-color-secondary: #2a2a2a;
--ntpopups-color-secondary-hover: #363636;
--ntpopups-color-secondary-active: #4e555b;
--ntpopups-color-secondary-disabled: #b8bfc6;
--ntpopups-color-secondary-light: #e9ecef;
```

#### 🎨 Semantic Colors

```css
--ntpopups-color-success: #28a745;
--ntpopups-color-success-hover: #218838;
--ntpopups-color-danger: #dc3545;
--ntpopups-color-danger-hover: #c82333;
--ntpopups-color-warning: #ffc107;
--ntpopups-color-info: #17a2b8;
```

#### 🎨 Text Colors

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

#### 📏 Borders

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

#### 🌑 Shadows

```css
--ntpopups-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
--ntpopups-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.2);
--ntpopups-shadow-button: 0 2px 4px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
```

#### 📐 Spacing

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

#### 📏 Dimensions

```css
--ntpopups-width-min: 300px;
--ntpopups-width-max: 1000px;
--ntpopups-width-default: fit-content;
--ntpopups-height-max: 90dvh;
--ntpopups-button-min-width: 80px;
--ntpopups-button-height: auto;
```

#### ⚡ Transitions

```css
--ntpopups-transition-duration: 0.2s;
--ntpopups-transition-duration-fast: 0.1s;
--ntpopups-transition-duration-slow: 0.3s;
--ntpopups-transition-easing: ease-in-out;
--ntpopups-transition-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### 📱 Responsiveness

```css
--ntpopups-mobile-padding: 15px;
--ntpopups-mobile-font-size: 14px;
```

### How to Customize

Create a global CSS file and override the variables:

```css
/* styles/custom-ntpopups.css */

:root {
  /* Custom colors */
  --ntpopups-color-primary: #ff6b6b;
  --ntpopups-color-primary-hover: #ff5252;
  
  /* Typography */
  --ntpopups-font-family: 'Poppins', sans-serif;
  --ntpopups-font-size-base: 16px;
  
  /* Rounded borders */
  --ntpopups-border-radius: 20px;
  --ntpopups-border-radius-button: 10px;
  
  /* Softer shadows */
  --ntpopups-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Larger spacing */
  --ntpopups-padding-body: 30px;
  
  /* Custom background */
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.7);
}

/* Custom dark mode */
.nt-popups-dark-theme {
  --ntpopups-color-primary: #bb86fc;
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.9);
}
```

Import in your app:

```jsx
import 'ntpopups/dist/style.css';
import './styles/custom-popups.css'; // Your customizations
```

---

## 🎯 Global CSS Classes

All classes follow the `.ntpopups-*` pattern and can be used for additional styling:

### Main Structure

```css
.ntpopups-overlay         /* External backdrop container */
.ntpopups-container       /* Popup container */
.ntpopups-header          /* Header */
.ntpopups-icon            /* Header icon */
.ntpopups-body            /* Body/content */
.ntpopups-footer          /* Footer */
.ntpopups-basebutton      /* Default button */
```

### Buttons

```css
.ntpopups-basebutton              /* Base button */
.ntpopups-confirm-button          /* Confirmation button (confirm popup) */
```

### Form

```css
.ntpopups-form-body               /* Form body */
.ntpopups-form-row                /* Component row */
.ntpopups-form-componentcontainer /* Each field container */
.ntpopups-form-message            /* Form message */
```

### Crop Image

```css
.ntpopups-cropimage-header           /* Crop header */
.ntpopups-cropimage-main             /* Main container */
.ntpopups-cropimage-container        /* View area */
.ntpopups-cropimage-container-grab   /* Drag cursor */
.ntpopups-cropimage-container-grabbing /* Dragging cursor */
.ntpopups-cropimage-full-canvas      /* Full canvas */
.ntpopups-cropimage-canvas           /* Crop canvas */
.ntpopups-cropimage-canvas-circle    /* Circular canvas */
.ntpopups-cropimage-hidden-image     /* Hidden image */
.ntpopups-cropimage-zoom-section     /* Zoom section */
.ntpopups-cropimage-zoom-controls    /* Zoom controls */
.ntpopups-cropimage-zoom-slider      /* Zoom slider */
.ntpopups-cropimage-zoom-icon        /* Zoom icon */
.ntpopups-cropimage-zoom-icon-small  /* Small icon */
.ntpopups-cropimage-zoom-icon-large  /* Large icon */
.ntpopups-cropimage-resetbutton      /* Reset button */
```

### Usage Example

```css
/* Customize buttons globally */
.ntpopups-basebutton {
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Customize specific header */
.ntpopups-header {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Customize form body */
.ntpopups-form-body {
  gap: 20px;
}
```

---

## 📱 Responsive and Accessible Design

### ✅ Responsiveness

- **Mobile-First**: Automatic adaptation for small screens
- **Touch-Friendly**: Full support for touch gestures (drag, pinch)
- **Smart Resizing**: Components automatically adapt

**On mobile devices:**
- Padding automatically reduced
- Font adjusted for readability
- Buttons with minimum touch size (44px)
- Optimized scrollbars

### ♿ Accessibility

- **Keyboard Navigation**: Full support for keys (ESC, Tab, Enter)
- **Contrast**: Colors follow WCAG 2.1 (minimum AA)
- **Visible Focus**: Clear focus indicators on interactive elements
- **HTML Semantics**: Accessible structure for screen readers
- **ARIA Labels**: Appropriate attributes for assistive technologies
- **No Color Dependence**: Information doesn't rely solely on color
- **Zoom**: Supports up to 200% zoom without breaking layout

---

## 💡 Usage Ideas

### 1. Delete Confirmation

```jsx
const confirmDeletion = (itemId) => {
  openPopup('confirm', {
    data: {
      title: 'Delete Item',
      message: 'This action cannot be undone. Do you want to continue?',
      icon: '🗑️',
      confirmLabel: 'Yes, delete',
      confirmStyle: 'Danger',
      cancelLabel: 'Cancel',
      onChoose: async (confirmed) => {
        if (confirmed) {
          await deleteItem(itemId);
          openPopup('generic', { data: { message: "Item deleted!" } });
        }
      }
    },
    closeOnClickOutside: false,
    closeOnEscape: true
  });
};
```

### 2. Avatar Upload and Edit

```jsx
const handleAvatarUpload = (file) => {
  openPopup('crop_image', {
    data: {
      image: file,
      format: 'circle',
      onCrop: async (result) => {
        // Send to server
        const formData = new FormData();
        formData.append('avatar', result.file);
        
        await api.post('/users/avatar', formData);
        
        // Update local preview
        setAvatarUrl(result.base64);
        
        openPopup('generic', {
          data: {
            title: 'Success!',
            message: 'Avatar updated successfully.',
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

### 3. Feedback Form

```jsx
const openFeedbackForm = () => {
  openPopup('form', {
    data: {
      title: 'Send Your Feedback',
      message: 'Your opinion is very important to us!',
      icon: '💬',
      doneLabel: 'Send Feedback',
      components: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          placeholder: 'Your name',
          required: true,
          minLength: 2
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'your@email.com',
          required: true,
          matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}
        },
        {
          id: 'type',
          type: 'text',
          label: 'Feedback Type',
          placeholder: 'Suggestion, Bug, Compliment...',
          required: true
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Describe your feedback here...',
          required: true,
          minLength: 10,
          maxLength: 500
        },
        {
          id: 'contact',
          type: 'checkbox',
          label: 'You may contact me about this feedback',
          defaultValue: true
        }
      ],
      onResponse: async (data) => {
        await api.post('/feedback', data);
        
        openPopup('generic', {
          data: {
            title: 'Thank you!',
            message: 'Your feedback has been sent successfully.',
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

### 4. Multi-Step Wizard

```jsx
const registrationWizard = () => {
  const steps = ['personal', 'address', 'preferences'];
  let currentStep = 0;
  let data = {};
  
  const openStep = (step) => {
    const configs = {
      personal: {
        title: 'Personal Information (1/3)',
        components: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
            minLength: 3
          },
          [
            {
              id: 'ssn',
              type: 'text',
              label: 'SSN',
              required: true,
              matchRegex: '^\\d{9}
            },
            {
              id: 'phone',
              type: 'text',
              label: 'Phone',
              required: true
            }
          ]
        ]
      },
      address: {
        title: 'Address (2/3)',
        components: [
          {
            id: 'zipcode',
            type: 'text',
            label: 'Zip Code',
            required: true,
            matchRegex: '^\\d{5}
          },
          {
            id: 'street',
            type: 'text',
            label: 'Street',
            required: true
          },
          [
            {
              id: 'number',
              type: 'text',
              label: 'Number',
              required: true
            },
            {
              id: 'complement',
              type: 'text',
              label: 'Complement'
            }
          ]
        ]
      },
      preferences: {
        title: 'Preferences (3/3)',
        components: [
          {
            id: 'newsletter',
            type: 'checkbox',
            label: 'I want to receive newsletter',
            defaultValue: true
          },
          {
            id: 'notifications',
            type: 'checkbox',
            label: 'I want to receive notifications',
            defaultValue: true
          },
          {
            id: 'notes',
            type: 'textarea',
            label: 'Notes',
            placeholder: 'Anything else you want to tell us...',
            maxLength: 200
          }
        ]
      }
    };
    
    const config = configs[step];
    
    openPopup('form', {
      id: `wizard_${step}`,
      data: {
        ...config,
        icon: '📝',
        doneLabel: step === 'preferences' ? 'Finish' : 'Next',
        onResponse: (values) => {
          data = { ...data, ...values };
          
          if (step === 'preferences') {
            // Last step - finish
            finishRegistration(data);
          } else {
            // Next step
            currentStep++;
            openStep(steps[currentStep]);
          }
        }
      }
    });
  };
  
  const finishRegistration = async (completeData) => {
    await api.post('/registration', completeData);
    
    openPopup('generic', {
      data: {
        title: 'Registration Complete!',
        message: 'Welcome! Your registration was successful.',
        icon: '🎊'
      },
      timeout: 5000
    });
  };
  
  openStep(steps[0]);
};
```

### 5. Loading Modal

```jsx
const executeLongAction = async () => {
  const loadingId = openPopup('generic', {
    id: 'loading_popup',
    data: {
      title: 'Processing...',
      message: 'Please wait while we process your request.',
      icon: '⏳'
    },
    closeOnEscape: false,
    closeOnClickOutside: false,
    hiddenFooter: true
  });
  
  try {
    await performLongOperation();
    
    closePopup(loadingId, true);
    
    openPopup('generic', {
      data: {
        title: 'Complete!',
        message: 'Operation completed successfully.',
        icon: '✅'
      },
      timeout: 3000
    });
  } catch (error) {
    closePopup(loadingId, true);
    
    openPopup('generic', {
      data: {
        title: 'Error',
        message: `An error occurred: ${error.message}`,
        icon: '❌',
        closeLabel: 'Got it'
      }
    });
  }
};
```

### 6. Guided Tour (Onboarding)

```jsx
const startTour = () => {
  const steps = [
    {
      title: 'Welcome! 👋',
      message: "Let's take a quick tour of the main features.",
      icon: '🚀'
    },
    {
      title: 'Dashboard',
      message: 'Here you can view all your metrics in real-time.',
      icon: '📊'
    },
    {
      title: 'Settings',
      message: 'Customize your experience in the settings.',
      icon: '⚙️'
    },
    {
      title: 'Ready!',
      message: "You're all set to begin. Good luck!",
      icon: '🎉'
    }
  ];
  
  let currentStep = 0;
  
  const showStep = () => {
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    
    openPopup('generic', {
      id: 'tour_step',
      data: {
        title: step.title,
        message: step.message,
        icon: step.icon,
        closeLabel: isLast ? 'Start' : 'Next'
      },
      onClose: (hasAction) => {
        if (hasAction && !isLast) {
          currentStep++;
          setTimeout(showStep, 300);
        } else if (hasAction && isLast) {
          localStorage.setItem('tour_complete', 'true');
        }
      }
    });
  };
  
  showStep();
};
```

### 7. Notification Popup with Actions

```jsx
// Custom popup for notifications
const NotificationPopup = ({ closePopup, popupstyles, data }) => {
  const { type, title, message, actions = [] } = data;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  return (
    <>
      <div className={popupstyles.header}>
        <div className={popupstyles.icon}>{icons[type]}</div>
        {title}
      </div>
      
      <div className={popupstyles.body}>
        <p>{message}</p>
      </div>
      
      <div className={popupstyles.footer}>
        {actions.map((action, index) => (
          <button
            key={index}
            className={popupstyles.baseButton}
            base-button-style={action.style || "0"}
            onClick={() => {
              action.callback?.();
              closePopup(true);
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </>
  );
};

// Usage
openPopup('notification', {
  data: {
    type: 'warning',
    title: 'New Message',
    message: 'You have a new message from John Smith.',
    actions: [
      {
        label: 'Dismiss',
        style: '1',
        callback: () => console.log('Dismissed')
      },
      {
        label: 'View Now',
        callback: () => navigateTo('/messages/123')
      }
    ]
  },
  timeout: 8000
});
```

### 8. Complex Validation with Visual Feedback

```jsx
const advancedForm = () => {
  openPopup('form', {
    data: {
      title: 'Create New Account',
      icon: '🔐',
      components: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          placeholder: 'minimum 3 characters',
          required: true,
          minLength: 3,
          maxLength: 20,
          matchRegex: '^[a-zA-Z0-9_]+
        },
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          placeholder: 'your@email.com',
          required: true,
          matchRegex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,}
        },
        {
          id: 'password',
          type: 'text',
          label: 'Password',
          placeholder: 'minimum 8 characters',
          required: true,
          minLength: 8,
          matchRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+
        },
        {
          id: 'bio',
          type: 'textarea',
          label: 'Biography',
          placeholder: 'Tell us a bit about yourself (optional)',
          maxLength: 150,
          disableResize: true
        },
        [
          {
            id: 'terms',
            type: 'checkbox',
            label: 'I accept the Terms of Use',
            required: true
          },
          {
            id: 'privacy',
            type: 'checkbox',
            label: 'I accept the Privacy Policy',
            required: true
          }
        ]
      ],
      onResponse: async (data) => {
        try {
          await api.post('/create-account', data);
          
          openPopup('generic', {
            data: {
              title: 'Account Created!',
              message: 'Check your email to activate your account.',
              icon: '📧'
            }
          });
        } catch (error) {
          openPopup('generic', {
            data: {
              title: 'Error',
              message: error.response?.data?.message || 'Error creating account.',
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

## 🎓 Tips and Best Practices

### ✅ Recommendations

1. **Async Callbacks**: Always handle errors in async operations
   ```jsx
   onResponse: async (data) => {
     try {
       await saveData(data);
     } catch (error) {
       console.error(error);
     }
   }
   ```

2. **External Validation**: Validate critical data on the server too
   ```jsx
   // Form validation + backend validation
   ```

3. **Appropriate Timeout**: Use timeouts only for informative messages
   ```jsx
   // ✅ Good - success notification
   timeout: 3000
   
   // ❌ Bad - important form
   timeout: 5000
   ```

4. **RequireAction**: Use for critical actions
   ```jsx
   // ✅ Good - delete confirmation
   requireAction: true
   
   // ❌ Bad - informative message
   requireAction: true
   ```

5. **Cleanup**: Close popups when unmounting components
   ```jsx
   useEffect(() => {
     return () => closeAllPopups();
   }, []);
   ```

### ⚠️ Avoid

1. **Multiple Simultaneous Popups**: Confuses the user
   ```jsx
   // ❌ Avoid
   openPopup('generic', { keepLast: true });
   openPopup('confirm', { keepLast: true });
   ```

2. **Very Long Popups**: Break into multiple steps
   ```jsx
   // ❌ Form with 20 fields
   // ✅ Wizard with 3 steps of 6-7 fields each
   ```

3. **Timeout on Important Actions**: User might lose the popup
   ```jsx
   // ❌ Confirmation with timeout
   openPopup('confirm', { timeout: 5000 });
   ```

---

## 🔧 Troubleshooting

### Popup doesn't open

**Problem**: `openPopup` returns `null`

**Solutions**:
- Check if the type is registered in `customPopups`
- Check for errors in the console
- Confirm that `NtPopupProvider` is wrapping the component

### Styles not applied

**Problem**: Popup appears without styles

**Solutions**:
- Import the CSS: `import 'ntpopups/dist/style.css'`
- Check import order (library styles first)
- In Next.js App Router, import in Client component

### Form doesn't validate

**Problem**: Button stays disabled

**Solutions**:
- Check if `required: true` is correct
- Check regex with `matchRegex`
- Test minLength/maxLength
- `disabled` fields are not validated

### Popup won't close

**Problem**: ESC or click outside doesn't work

**Solutions**:
- Check `closeOnEscape` and `closeOnClickOutside`
- Check if `requireAction: true`
- Use `closePopup(id, true)` inside the component

### Next.js: Hydration Error

**Problem**: Hydration mismatch warning

**Solution**:
```jsx
// ✅ Mark the provider as 'use client'
'use client';
import { NtPopupProvider } from 'ntpopups';
```

### TypeScript: Type Errors

**Problem**: Types not recognized

**Solution**:
```typescript
// Install types (if available)
// or use type assertions
const popup = openPopup('custom', settings) as string;
```

---

## 📄 License

MIT License - Feel free to use in personal and commercial projects.

---

## 🤝 Contributing

Contributions are welcome! If you found a bug or have a suggestion:

1. Open an issue in the repository
2. Submit a pull request with improvements
3. Share interesting use cases

---

## 📚 Additional Resources

- **Live Examples**: [https://ntpopups.nemtudo.me]
- **Full Documentation**: [https://ntpopups.nemtudo.me/docs]
- **GitHub Repository**: [https://github.com/Nem-Tudo/ntPopups]

---

## ⭐ Acknowledgments

Thank you for using **ntPopups**! If this library was helpful to you, consider giving it a ⭐ on GitHub.

**Developed with ❤️ by [Nem Tudo](https://nemtudo.me/)**

---

<div align="center">

### 🚀 ntPopups - Easy and powerful popup library for React

**[Documentation](https://ntpopups.nemtudo.me/docs) • [Examples](https://ntpopups.nemtudo.me/docs) • [GitHub](https://github.com/Nem-Tudo/ntPopups)**

</div>