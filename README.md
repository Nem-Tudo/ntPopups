# ntPopups

**Ease and powerful popup library for React**

A modern, flexible, and feature-rich popup/modal library for React applications. Built with internationalization, extensive customization options, and beautiful default styles.

[![npm version](https://img.shields.io/npm/v/ntpopups.svg)](https://www.npmjs.com/package/ntpopups)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎯 **Easy to Use** - Simple API with powerful capabilities
- 🎨 **Built-in Popups** - Confirm, Generic, Form, and CropImage components
- 🔧 **Fully Customizable** - Create your own popup components
- 🌍 **Internationalization** - Built-in i18n support (English and Brazilian Portuguese)
- 🎭 **Multiple Themes** - White and dark themes included
- ⚡ **Queue Management** - Smart popup stacking and replacement
- 📱 **Responsive** - Mobile-friendly design
- ♿ **Accessible** - Keyboard navigation (ESC to close)
- 🎬 **Animations** - Smooth open/close transitions
- 🎨 **CSS Variables** - Easy theming with CSS custom properties

---

## 📦 Installation

```bash
npm install ntpopups
```

or

```bash
yarn add ntpopups
```

---

## 🚀 Quick Start

### 1. Create a Providers Component (Required for App Router)

If you're using Next.js App Router or need client-side providers, create a `Providers.jsx` component:

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

### 2. Wrap Your App

```jsx
// app/layout.jsx (Next.js App Router)
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

Or for standard React apps:

```jsx
// App.jsx
import Providers from './components/Providers';

function App() {
  return (
    <Providers>
      {/* Your app content */}
    </Providers>
  );
}
```

### 3. Use Popups

Import the `useNtPopups` hook in any component:

```jsx
'use client'; // If using Next.js App Router

import useNtPopups from 'ntpopups';

function MyComponent() {
  const { openPopup } = useNtPopups();

  const handleClick = () => {
    openPopup('generic', {
      data: {
        title: 'Hello World',
        message: 'Welcome to ntPopups!',
      }
    });
  };

  return (
    <button onClick={handleClick}>
      Open Popup
    </button>
  );
}
```

---

## 🎯 Built-in Popup Types

### 1. Generic Popup

Simple message display popup.

```jsx
const { openPopup } = useNtPopups();

openPopup('generic', {
  data: {
    title: 'Success',           // Default: 'Message'
    message: 'Operation completed!', // Default: 'This is a message'
    icon: '✅',                  // Default: 'ⓘ'
    closeLabel: 'Got it'         // Default: 'OK'
  }
});
```

**Data Properties:**
- `title` (string) - Popup title (default: `'Message'`)
- `message` (string) - Message content (default: `'This is a message'`)
- `icon` (string | ReactElement) - Icon to display (default: `'ⓘ'`)
- `closeLabel` (string) - Close button text (default: `'OK'`)

---

### 2. Confirm Popup

Confirmation dialog with cancel/confirm options.

```jsx
const { openPopup } = useNtPopups();

openPopup('confirm', {
  data: {
    title: 'Delete Item',        // Default: 'Confirm'
    message: 'Are you sure?',    // Default: 'Are you sure you want to proceed?'
    icon: '⚠️',                  // Default: 'ⓘ'
    cancelLabel: 'No',           // Default: 'Cancel'
    confirmLabel: 'Yes, Delete', // Default: 'Confirm'
    onChoose: (confirmed) => {
      if (confirmed) {
        console.log('User confirmed');
      } else {
        console.log('User cancelled');
      }
    }
  }
});
```

**Data Properties:**
- `title` (string) - Popup title (default: `'Confirm'`)
- `message` (string) - Confirmation message (default: `'Are you sure you want to proceed?'`)
- `icon` (string | ReactElement) - Icon to display (default: `'ⓘ'`)
- `cancelLabel` (string) - Cancel button text (default: `'Cancel'`)
- `confirmLabel` (string) - Confirm button text (default: `'Confirm'`)
- `onChoose` (function) - Callback with boolean parameter

---

### 3. Form Popup

Dynamic form with validation support.

```jsx
const { openPopup } = useNtPopups();

openPopup('form', {
  data: {
    title: 'User Information',   // Default: 'Form'
    icon: '📝',                   // Default: 'ⓘ'
    doneLabel: 'Submit',          // Default: 'Done'
    components: [
      {
        id: 'username',
        type: 'text',
        label: 'Username',
        defaultValue: '',
        disabled: false,
        required: true,
        minLength: 3,
        maxLength: 20
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        defaultValue: '',
        required: true,
        matchRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      },
      {
        id: 'bio',
        type: 'textarea',
        label: 'Bio',
        defaultValue: '',
        required: false,
        minLength: 10,
        maxLength: 500
      },
      {
        id: 'subscribe',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
        defaultValue: false
      }
    ],
    onResponse: (values) => {
      console.log('Form submitted:', values);
      // values = { username: '...', email: '...', bio: '...', subscribe: true/false }
    }
  }
});
```

**Data Properties:**
- `title` (string) - Form title (default: `'Form'`)
- `icon` (string | ReactElement) - Icon to display (default: `'ⓘ'`)
- `doneLabel` (string) - Submit button text (default: `'Done'`)
- `components` (array) - Array of form components
- `onResponse` (function) - Callback with form values

**Component Types:**

**Text Input:**
```javascript
{
  id: 'field_id',          // Required: unique identifier
  type: 'text',            // Required
  label: 'Field Label',    // Required
  defaultValue: '',        // Optional: default ''
  disabled: false,         // Optional: default false
  required: true,          // Optional: field is required
  minLength: 3,           // Optional: minimum length
  maxLength: 50,          // Optional: maximum length
  matchRegex: '^[a-z]+$'  // Optional: regex pattern
}
```

**Textarea:**
```javascript
{
  id: 'description',
  type: 'textarea',
  label: 'Description',
  defaultValue: '',
  disabled: false,
  required: false,
  minLength: 10,
  maxLength: 500,
  matchRegex: '^[a-z]+$'
}
```

**Checkbox:**
```javascript
{
  id: 'agree',
  type: 'checkbox',
  label: 'I agree to terms',
  defaultValue: false,
  disabled: false
}
```

**Row Layout:**
You can group components in rows by wrapping them in arrays:

```javascript
components: [
  // Single component (full width)
  { id: 'name', type: 'text', label: 'Name' },
  
  // Row with two components (side by side)
  [
    { id: 'firstName', type: 'text', label: 'First Name' },
    { id: 'lastName', type: 'text', label: 'Last Name' }
  ],
  
  // Another single component
  { id: 'email', type: 'text', label: 'Email' }
]
```

---

### 4. CropImage Popup

Image cropping with zoom and pan controls.

```jsx
const { openPopup } = useNtPopups();

// From File input
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  
  openPopup('crop_image', {
    data: {
      image: file,              // Required: File or URL string
      format: 'circle',         // Default: 'circle' (or 'square')
      onCrop: (result) => {
        console.log('Cropped blob:', result.blob);
        console.log('Cropped base64:', result.base64);
        console.log('Cropped file:', result.file);
        
        // Upload or use the cropped image
        uploadImage(result.file);
      }
    }
  });
};

// From URL
openPopup('crop_image', {
  data: {
    image: 'https://example.com/image.jpg',
    format: 'square',
    onCrop: (result) => {
      // Handle cropped result
    }
  }
});
```

**Data Properties:**
- `image` (File | string) - Image file or URL (required)
- `format` ('circle' | 'square') - Crop shape (default: `'circle'`)
- `onCrop` (function) - Callback with `{ blob, base64, file }`

---

## ⚙️ Popup Settings

Common settings available for all popup types:

```jsx
openPopup('generic', {
  // Behavior
  closeOnEscape: true,        // Close on ESC key (default: true)
  closeOnClickOutside: true,  // Close on backdrop click (default: true)
  requireAction: false,       // Require user action to close (default: false)
  keepLast: false,           // Keep previous popup visible (default: false)
  
  // Auto-close
  timeout: 5000,             // Auto-close after ms (default: undefined)
  
  // Lifecycle callbacks
  onOpen: (popupId) => {
    console.log('Popup opened:', popupId);
  },
  onClose: (hasAction, popupId) => {
    console.log('Popup closed:', popupId, 'with action:', hasAction);
  },
  
  // Visual customization
  hiddenHeader: false,        // Hide title bar (default: false)
  hiddenFooter: false,       // Hide footer (default: false)
  disableOpenAnimation: false, // Disable entrance animation (default: false)
  
  // Data for specific popup type
  data: {
    // Type-specific properties
  }
});
```

> **Note:** While you can manually set an `id` in the settings, it's not recommended. Let ntPopups generate IDs automatically to avoid conflicts.

---

## 🎨 Global Configuration

Configure default settings for all popups or specific types:

```jsx
<NtPopupProvider
  config={{
    defaultSettings: {
      // Global defaults for ALL popups
      all: {
        closeOnEscape: true,
        closeOnClickOutside: false,
        timeout: 3000
      },
      
      // Type-specific defaults
      confirm: {
        requireAction: true,
        closeOnClickOutside: false
      },
      
      generic: {
        timeout: 5000
      },
      
      form: {
        requireAction: true
      }
    }
  }}
  language="en"
  theme="white"
>
  <App />
</NtPopupProvider>
```

**Priority Order:**
1. User-provided settings (highest)
2. Type-specific defaults
3. Global defaults
4. Library defaults (lowest)

---

## 🎭 Themes

ntPopups includes two built-in themes:

```jsx
// White theme (default)
<NtPopupProvider theme="white">
  <App />
</NtPopupProvider>

// Dark theme
<NtPopupProvider theme="dark">
  <App />
</NtPopupProvider>
```

### Custom Theming with CSS Variables

ntPopups uses CSS custom properties (variables) for easy theming. You can override any of these variables in your own CSS:

```css
/* Example: Custom purple theme */
.ntpopups-overlay {
  --ntpopups-color-primary: #9333ea;
  --ntpopups-color-primary-hover: #a855f7;
  --ntpopups-bg-body: #faf5ff;
  --ntpopups-border-radius: 20px;
}
```

**Available CSS Variables:**

<details>
<summary><strong>Typography Variables</strong></summary>

```css
--ntpopups-font-family: "Segoe UI", Arial, sans-serif;
--ntpopups-font-size-base: 18px;
--ntpopups-font-size-title: 24px;
--ntpopups-font-size-button: 14px;
--ntpopups-font-weight-title: 400;
--ntpopups-font-weight-normal: 400;
--ntpopups-font-weight-semibold: 500;
--ntpopups-font-weight-bold: 700;
--ntpopups-line-height-base: 1.5;
--ntpopups-line-height-title: 1.3;
```
</details>

<details>
<summary><strong>Color Variables - Primary</strong></summary>

```css
--ntpopups-color-primary: #5f54f0;
--ntpopups-color-primary-hover: #4f43f5;
--ntpopups-color-primary-active: #3f33e5;
--ntpopups-color-primary-disabled: #a39fd8;
--ntpopups-color-primary-light: #e8e6fc;
```
</details>

<details>
<summary><strong>Color Variables - Secondary</strong></summary>

```css
--ntpopups-color-secondary: #2a2a2a;
--ntpopups-color-secondary-hover: #363636;
--ntpopups-color-secondary-active: #4e555b;
--ntpopups-color-secondary-disabled: #b8bfc6;
--ntpopups-color-secondary-light: #e9ecef;
```
</details>

<details>
<summary><strong>Color Variables - Semantic</strong></summary>

```css
--ntpopups-color-success: #28a745;
--ntpopups-color-success-hover: #218838;
--ntpopups-color-danger: #dc3545;
--ntpopups-color-danger-hover: #c82333;
--ntpopups-color-warning: #ffc107;
--ntpopups-color-warning-hover: #e0a800;
--ntpopups-color-info: #17a2b8;
--ntpopups-color-info-hover: #138496;
--ntpopups-color-input-invalid: var(--ntpopups-color-danger);
```
</details>

<details>
<summary><strong>Color Variables - Text</strong></summary>

```css
--ntpopups-color-text: rgba(64, 64, 64, .95);
--ntpopups-color-text-secondary: rgba(14, 14, 14, 0.6);
--ntpopups-color-text-muted: rgba(14, 14, 14, 0.4);
--ntpopups-color-text-light: #f8f9fa;
--ntpopups-color-text-on-primary: #ffffff;
```
</details>

<details>
<summary><strong>Background Variables</strong></summary>

```css
--ntpopups-bg-overlay: rgba(0, 0, 0, 0.459);
--ntpopups-bg-footer: #f0f0f0;
--ntpopups-bg-header: #ffffff;
--ntpopups-bg-body: #ffffff;
--ntpopups-bg-button-primary: var(--ntpopups-color-primary);
--ntpopups-bg-button-secondary: var(--ntpopups-color-secondary);
```
</details>

<details>
<summary><strong>Border Variables</strong></summary>

```css
--ntpopups-border-width: 1px;
--ntpopups-border-width-thick: 2px;
--ntpopups-border-style: solid;
--ntpopups-border-color: rgba(0, 0, 0, 0.07);
--ntpopups-border-color-dark: rgba(0, 0, 0, 0.15);
--ntpopups-border-color-light: rgba(0, 0, 0, 0.03);
--ntpopups-title-border: var(--ntpopups-border-width) var(--ntpopups-border-style) var(--ntpopups-border-color);
--ntpopups-footer-border: var(--ntpopups-border-width) var(--ntpopups-border-style) var(--ntpopups-border-color);
```
</details>

<details>
<summary><strong>Border Radius Variables</strong></summary>

```css
--ntpopups-border-radius: 10px;
--ntpopups-border-radius-sm: 5px;
--ntpopups-border-radius-lg: 15px;
--ntpopups-border-radius-xl: 20px;
--ntpopups-border-radius-button: 5px;
```
</details>

<details>
<summary><strong>Shadow Variables</strong></summary>

```css
--ntpopups-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
--ntpopups-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.2);
--ntpopups-shadow-button: 0 2px 4px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
```
</details>

<details>
<summary><strong>Spacing Variables</strong></summary>

```css
--ntpopups-spacing-xs: 5px;
--ntpopups-spacing-sm: 10px;
--ntpopups-spacing-md: 15px;
--ntpopups-spacing-lg: 20px;
--ntpopups-spacing-xl: 30px;
--ntpopups-spacing-2xl: 40px;
--ntpopups-padding-title: var(--ntpopups-spacing-lg);
--ntpopups-padding-body: var(--ntpopups-spacing-lg);
--ntpopups-padding-footer: var(--ntpopups-spacing-sm);
--ntpopups-padding-button: var(--ntpopups-spacing-md) var(--ntpopups-spacing-lg);
--ntpopups-gap-buttons: var(--ntpopups-spacing-sm);
--ntpopups-gap-title-icon: 8px;
```
</details>

<details>
<summary><strong>Form Input Variables</strong></summary>

```css
--ntpopups-input-bg: #ffffff;
--ntpopups-input-border: var(--ntpopups-border-color);
--ntpopups-input-border-focus: var(--ntpopups-color-primary);
--ntpopups-input-text-color: var(--ntpopups-color-text);
--ntpopups-input-placeholder-color: var(--ntpopups-color-text-muted);
--ntpopups-input-padding: var(--ntpopups-spacing-sm) var(--ntpopups-spacing-md);
--ntpopups-input-border-radius: var(--ntpopups-border-radius-sm);
```
</details>

<details>
<summary><strong>Sizing Variables</strong></summary>

```css
--ntpopups-width-min: 300px;
--ntpopups-width-max: 90dvw;
--ntpopups-width-default: fit-content;
--ntpopups-height-max: 90dvh;
--ntpopups-button-min-width: 80px;
--ntpopups-button-height: auto;
```
</details>

<details>
<summary><strong>Z-Index Variables</strong></summary>

```css
--ntpopups-z-index: 15;
--ntpopups-z-index-overlay: 14;
```
</details>

<details>
<summary><strong>Transition Variables</strong></summary>

```css
--ntpopups-transition-duration: 0.2s;
--ntpopups-transition-duration-fast: 0.1s;
--ntpopups-transition-duration-slow: 0.3s;
--ntpopups-transition-easing: ease-in-out;
--ntpopups-transition-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```
</details>

<details>
<summary><strong>Animation Variables</strong></summary>

```css
--ntpopups-animation-scale-start: 0.95;
--ntpopups-animation-opacity-start: 0.8;
```
</details>

<details>
<summary><strong>Scrollbar Variables</strong></summary>

```css
--ntpopups-scrollbar-width: 8px;
--ntpopups-scrollbar-bg: #f1f1f1;
--ntpopups-scrollbar-thumb: #c1c1c1;
--ntpopups-scrollbar-thumb-hover: #a1a1a1;
--ntpopups-scrollbar-border-radius: 10px;
```
</details>

<details>
<summary><strong>Close Button Variables</strong></summary>

```css
--ntpopups-close-color: var(--ntpopups-color-secondary);
--ntpopups-close-color-hover: var(--ntpopups-color-text);
--ntpopups-close-bg: transparent;
--ntpopups-close-bg-hover: rgba(0, 0, 0, 0.05);
--ntpopups-close-size: 32px;
```
</details>

<details>
<summary><strong>Backdrop Variables</strong></summary>

```css
--ntpopups-backdrop-blur: 0px;
--ntpopups-backdrop-filter: none;
```
</details>

<details>
<summary><strong>Responsive Variables</strong></summary>

```css
--ntpopups-mobile-padding: 15px;
--ntpopups-mobile-font-size: 14px;
```
</details>

---

## 🌍 Internationalization

ntPopups includes built-in translations for English and Brazilian Portuguese:

```jsx
// English (default)
<NtPopupProvider language="en">
  <App />
</NtPopupProvider>

// Brazilian Portuguese
<NtPopupProvider language="ptbr">
  <App />
</NtPopupProvider>
```

---

## 🔧 Creating Custom Popups

You can create your own popup components and register them with ntPopups.

### Step 1: Create Your Component

```jsx
// CustomPopup.jsx
import React from 'react';

export default function CustomPopup({ closePopup, data }) {
  const { title, content, onSave } = data || {};
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>{title || 'Custom Popup'}</h2>
      <div style={{ margin: '20px 0' }}>
        {content}
      </div>
      <button 
        onClick={() => {
          onSave?.();
          closePopup(true);
        }}
      >
        Save
      </button>
    </div>
  );
}
```

### Using CSS Modules (Optional)

If you want to use CSS modules like the built-in popups:

```jsx
// CustomPopup.jsx
import React from 'react';
import styles from './CustomPopup.module.css';

export default function CustomPopup({ closePopup, popupstyles, data }) {
  const { title, content, onSave } = data || {};
  
  // Option 1: Use the built-in styles from popupstyles
  const classes = {
    title: popupstyles?.title || '',
    scrollable: popupstyles?.scrollable || '',
    footer: popupstyles?.footer || ''
  };
  
  // Option 2: Use your own CSS module
  return (
    <>
      <div className={styles.customTitle}>
        {title || 'Custom Popup'}
      </div>
      
      <div className={styles.customContent}>
        {content}
      </div>
      
      <div className={styles.customFooter}>
        <button 
          className={styles.customButton}
          onClick={() => {
            onSave?.();
            closePopup(true);
          }}
        >
          Save
        </button>
      </div>
    </>
  );
}
```

```css
/* CustomPopup.module.css */
.customTitle {
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.customContent {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.customFooter {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.customButton {
  padding: 10px 20px;
  background: #5f54f0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
```

### Step 2: Register Your Component

```jsx
// Providers.jsx
'use client';

import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';
import CustomPopup from './CustomPopup';

export default function Providers({ children }) {
  return (
    <NtPopupProvider
      customPopups={{
        'my_custom_popup': CustomPopup
      }}
    >
      {children}
    </NtPopupProvider>
  );
}
```

### Step 3: Use Your Custom Popup

```jsx
import useNtPopups from 'ntpopups';

function MyComponent() {
  const { openPopup } = useNtPopups();
  
  const handleClick = () => {
    openPopup('my_custom_popup', {
      data: {
        title: 'My Custom Popup',
        content: 'Custom content here',
        onSave: () => {
          console.log('Saved!');
        }
      }
    });
  };
  
  return <button onClick={handleClick}>Open Custom</button>;
}
```

### Custom Popup Props

Your custom popup component receives these props:

- `closePopup(hasAction)` - Function to close the popup
- `popupstyles` - CSS module styles object (optional, for using built-in styles)
- `requireAction` - Boolean indicating if action is required
- `data` - Custom data object you passed
- All other settings you passed to `openPopup()`

---

## 💡 Best Practices

### 1. Always Handle Callbacks

```jsx
openPopup('confirm', {
  data: {
    message: 'Delete this item?',
    onChoose: (confirmed) => {
      if (confirmed) {
        deleteItem();
      }
    }
  }
});
```

### 2. Set requireAction for Important Decisions

```jsx
openPopup('confirm', {
  requireAction: true,  // User must click a button
  closeOnEscape: false,
  closeOnClickOutside: false,
  data: {
    message: 'This action cannot be undone',
    onChoose: handleChoice
  }
});
```

### 3. Validate Form Data

```jsx
openPopup('form', {
  data: {
    components: [
      {
        id: 'email',
        type: 'text',
        label: 'Email',
        required: true,
        matchRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      }
    ],
    onResponse: (values) => {
      if (values.email) {
        submitForm(values);
      }
    }
  }
});
```

### 4. Handle Errors Gracefully

```jsx
const handleOpenPopup = async () => {
  try {
    const data = await fetchData();
    openPopup('generic', {
      data: { 
        title: 'Success',
        message: 'Data loaded successfully' 
      }
    });
  } catch (error) {
    openPopup('generic', {
      data: {
        title: 'Error',
        icon: '❌',
        message: error.message
      }
    });
  }
};
```

---

## 🔍 Advanced Usage

### Popup Queue Management

Popups are automatically queued to prevent race conditions:

```jsx
// These will be processed in order
openPopup('generic', { data: { message: 'First' } });
openPopup('generic', { data: { message: 'Second' } });
openPopup('generic', { data: { message: 'Third' } });
```

### Replace vs Stack

```jsx
// Replace previous popup (default)
openPopup('generic', {
  keepLast: false,  // Previous popup is hidden
  data: { message: 'New popup' }
});

// Stack on previous popup
openPopup('generic', {
  keepLast: true,  // Previous popup stays visible
  data: { message: 'Stacked popup' }
});
```

### Programmatic Control

```jsx
const { openPopup, closePopup, closeAllPopups, isPopupOpen } = useNtPopups();

// Open and store ID
const popupId = openPopup('generic', {
  data: { message: 'Loading...' }
});

// Check if still open
if (isPopupOpen(popupId)) {
  console.log('Popup is open');
}

// Close specific popup
closePopup(popupId, false);  // false = no action taken

// Close all popups
closeAllPopups();
```

### Dynamic Content Updates

You can close a popup and open a new one to show updated content:

```jsx
const { openPopup, closePopup } = useNtPopups();

const showLoading = () => {
  return openPopup('generic', {
    requireAction: true,
    closeOnEscape: false,
    closeOnClickOutside: false,
    data: {
      title: 'Loading',
      message: 'Please wait...',
    }
  });
};

const showSuccess = (loadingId) => {
  closePopup(loadingId, true);
  openPopup('generic', {
    timeout: 3000,
    data: {
      title: 'Success',
      icon: '✅',
      message: 'Operation completed!'
    }
  });
};

// Usage
const loadingId = showLoading();
await performOperation();
showSuccess(loadingId);
```

---

## 📱 Responsive Design

ntPopups is fully responsive and works great on mobile devices:

- Touch-friendly controls
- Mobile-optimized CropImage component with touch gestures
- Responsive form layouts (components automatically stack on mobile)
- Proper viewport handling
- Gesture support (pinch, drag, swipe)

---

## ♿ Accessibility

- **Keyboard navigation** - Press ESC to close popups
- **Focus management** - Focus is trapped within the popup
- **Semantic HTML** - Uses proper HTML structure
- **Screen reader friendly** - Can be enhanced with ARIA labels in custom popups

---

## 🎨 Styling Best Practices

### Using Built-in Styles

The library provides `popupstyles` prop with pre-configured classes:

```jsx
export default function CustomPopup({ popupstyles, closePopup }) {
  return (
    <>
      <div className={popupstyles.title}>
        My Title
      </div>
      <div className={popupstyles.scrollable}>
        My content
      </div>
      <div className={popupstyles.footer}>
        <button className={popupstyles.baseButton}>
          OK
        </button>
      </div>
    </>
  );
}
```

### Using Your Own Styles

```jsx
import styles from './MyPopup.module.css';

export default function CustomPopup({ closePopup }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Title</h2>
      <p className={styles.content}>My content</p>
      <button className={styles.button} onClick={() => closePopup(true)}>
        OK
      </button>
    </div>
  );
}
```

### Combining Approaches

```jsx
import styles from './MyPopup.module.css';

export default function CustomPopup({ popupstyles, closePopup }) {
  return (
    <>
      {/* Use built-in styles for structure */}
      <div className={popupstyles.title}>
        My Title
      </div>
      
      {/* Use custom styles for content */}
      <div className={popupstyles.scrollable}>
        <div className={styles.customContent}>
          <img src="..." className={styles.image} />
          <p>Custom styled content</p>
        </div>
      </div>
      
      {/* Mix both */}
      <div className={popupstyles.footer}>
        <button className={`${popupstyles.baseButton} ${styles.myButton}`}>
          OK
        </button>
      </div>
    </>
  );
}
```

---

## 🐛 Troubleshooting

### Popup not appearing?

1. Ensure `NtPopupProvider` wraps your app
2. Check that you've imported the CSS: `import 'ntpopups/dist/styles.css'`
3. Check console for errors
4. Verify popup type is registered (for custom popups)

### Styles not working?

1. Make sure CSS is imported in your Providers component
2. Check for CSS conflicts with your global styles
3. Use browser DevTools to inspect elements
4. Verify CSS variable overrides are in the correct scope

### "useNtPopups must be used within NtPopupProvider" error?

Make sure:
1. `NtPopupProvider` is wrapping your component
2. The component using `useNtPopups` is a child of the provider
3. You're using `'use client'` directive if using Next.js App Router

### Callback not firing?

1. Verify callback function is passed correctly in `data` object
2. Check if popup was closed with action: `closePopup(true)`
3. Ensure proper function syntax

### Form validation not working?

1. Check that component IDs are unique
2. Verify validation rules are correctly formatted
3. For regex, use escaped strings: `matchRegex: '^[a-z]+$'`
4. Check console for validation errors

### CropImage not responsive?

1. Ensure the image prop is valid (File or URL string)
2. Check that the popup container has proper width
3. Verify CSS is imported correctly

---

## 🎯 Common Use Cases

### Confirmation Before Delete

```jsx
const handleDelete = (itemId) => {
  openPopup('confirm', {
    requireAction: true,
    data: {
      title: 'Delete Item',
      message: 'This action cannot be undone. Are you sure?',
      icon: '⚠️',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onChoose: (confirmed) => {
        if (confirmed) {
          deleteItem(itemId);
        }
      }
    }
  });
};
```

### User Registration Form

```jsx
const handleRegister = () => {
  openPopup('form', {
    requireAction: true,
    data: {
      title: 'Create Account',
      icon: '👤',
      components: [
        [
          {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            required: true,
            minLength: 2
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Last Name',
            required: true,
            minLength: 2
          }
        ],
        {
          id: 'email',
          type: 'text',
          label: 'Email',
          required: true,
          matchRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
        },
        {
          id: 'password',
          type: 'text',
          label: 'Password',
          required: true,
          minLength: 8
        },
        {
          id: 'terms',
          type: 'checkbox',
          label: 'I agree to the terms and conditions',
          defaultValue: false
        }
      ],
      onResponse: (values) => {
        if (values.terms) {
          registerUser(values);
        } else {
          alert('Please agree to the terms');
        }
      }
    }
  });
};
```

### Profile Picture Upload

```jsx
const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  openPopup('crop_image', {
    data: {
      image: file,
      format: 'circle',
      onCrop: async (result) => {
        try {
          await uploadAvatar(result.file);
          openPopup('generic', {
            timeout: 3000,
            data: {
              title: 'Success',
              icon: '✅',
              message: 'Profile picture updated!'
            }
          });
        } catch (error) {
          openPopup('generic', {
            data: {
              title: 'Error',
              icon: '❌',
              message: 'Failed to upload image'
            }
          });
        }
      }
    }
  });
};
```

### Async Operation with Loading

```jsx
const handleSubmit = async () => {
  const loadingId = openPopup('generic', {
    requireAction: true,
    closeOnEscape: false,
    closeOnClickOutside: false,
    data: {
      title: 'Processing',
      message: 'Please wait while we process your request...',
      icon: '⏳'
    }
  });
  
  try {
    await performAsyncOperation();
    closePopup(loadingId, true);
    
    openPopup('generic', {
      timeout: 3000,
      data: {
        title: 'Success',
        icon: '✅',
        message: 'Operation completed successfully!'
      }
    });
  } catch (error) {
    closePopup(loadingId, true);
    
    openPopup('generic', {
      data: {
        title: 'Error',
        icon: '❌',
        message: error.message
      }
    });
  }
};
```

### Multi-Step Process

```jsx
const handleMultiStep = () => {
  // Step 1: Get user info
  openPopup('form', {
    data: {
      title: 'Step 1: Personal Info',
      components: [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'text', label: 'Email', required: true }
      ],
      onResponse: (step1Data) => {
        // Step 2: Get preferences
        openPopup('form', {
          keepLast: false,
          data: {
            title: 'Step 2: Preferences',
            components: [
              { id: 'newsletter', type: 'checkbox', label: 'Subscribe to newsletter' },
              { id: 'notifications', type: 'checkbox', label: 'Enable notifications' }
            ],
            onResponse: (step2Data) => {
              // Combine and submit
              const finalData = { ...step1Data, ...step2Data };
              submitData(finalData);
              
              openPopup('generic', {
                timeout: 3000,
                data: {
                  title: 'Complete!',
                  icon: '🎉',
                  message: 'Your account has been created!'
                }
              });
            }
          }
        });
      }
    }
  });
};
```

---

## 📚 API Reference

### NtPopupProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Your application components |
| `config` | `Object` | `{}` | Global configuration for popups |
| `customPopups` | `Object` | `{}` | Map of custom popup components |
| `language` | `'en' \| 'ptbr'` | `'en'` | Language for built-in popups |
| `theme` | `'white' \| 'dark'` | `'white'` | Visual theme |

### useNtPopups Hook

Returns an object with the following methods and properties:

```javascript
{
  openPopup: (popupType, settings) => popupId,
  closePopup: (popupId, hasAction) => void,
  closeAllPopups: () => void,
  isPopupOpen: (popupId) => boolean,
  getPopup: (popupId) => PopupData | null,
  popups: PopupData[],
  language: string,
  translate: (key) => string
}
```

---

## 📊 Performance Tips

1. **Avoid opening too many popups simultaneously** - Use `closeAllPopups()` before opening a new one if needed
2. **Use `timeout` for auto-dismissible notifications** - Prevents popup accumulation
3. **Lazy load custom popup components** - Use dynamic imports for large custom popups
4. **Clean up on unmount** - Close popups when navigating away from a page

```jsx
// Example: Clean up on navigation
useEffect(() => {
  return () => {
    closeAllPopups();
  };
}, []);
```

---

## 🔒 Security Considerations

1. **Validate user input** - Always validate form data on the server side
2. **Sanitize content** - Be careful with user-generated content in popups
3. **Avoid sensitive data in callbacks** - Don't pass sensitive information through popup callbacks
4. **Use HTTPS for image URLs** - When using CropImage with URLs

---

## 📦 Bundle Size

ntPopups is designed to be lightweight:

- Core library: ~15KB (gzipped)
- CSS: ~8KB (gzipped)
- No external dependencies (except React)

---

## 🔄 Migration Guide

If you're upgrading from an older version or migrating from another popup library:

### From other libraries

ntPopups provides a simpler API compared to most popup libraries:

```jsx
// Other libraries
modal.show({
  component: MyComponent,
  props: { ... }
});

// ntPopups
openPopup('my_component', {
  data: { ... }
});
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT © ntPopups

---

## 📧 Support

- **NPM Package**: [https://www.npmjs.com/package/ntpopups](https://www.npmjs.com/package/ntpopups)
- **Issues**: Report bugs and request features on GitHub
- **Documentation**: This README contains comprehensive documentation

---

## 🎉 Examples Repository

Check out our examples repository for more use cases and implementation patterns:

- Next.js App Router integration
- React SPA examples
- Custom popup templates
- Advanced form validations
- Real-world use cases

---

## 📝 Changelog

### Version 1.0.0
- Initial release
- Built-in popups: Generic, Confirm, Form, CropImage
- Internationalization support (EN, PT-BR)
- Dark theme support
- CSS variable customization
- Queue management system
- Full responsive design

---

**Made with ❤️ by the ntPopups team**

Happy coding! 🚀