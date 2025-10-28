# ntPopups 🚀

> **Modern, powerful, and easy-to-use popup library for React**

Create elegant, fully customizable, and responsive popups with theme support, internationalization, and custom components—all in a simple yet powerful way.

[![npm version](https://img.shields.io/npm/v/ntpopups.svg)](https://www.npmjs.com/package/ntpopups)
[![License](https://img.shields.io/npm/l/ntpopups.svg)](https://github.com/Nem-Tudo/ntpopups/blob/main/LICENSE)

**[Live Demo](https://ntpopups.nemtudo.me/demo) • [Full Documentation](https://ntpopups.nemtudo.me) • [GitHub](https://github.com/Nem-Tudo/ntPopups)**

---

## ✨ Features

- 🎨 **Theme Support** - Built-in light and dark themes
- 🌍 **Internationalization** - Multi-language support (EN, PT-BR)
- 📱 **Fully Responsive** - Perfect on mobile and desktop
- 🎭 **Ready-to-Use Popups** - Generic alerts, confirmations, forms, image cropper, and more
- 🔧 **Highly Customizable** - Create your own popup components
- ⚡ **Lightweight & Fast** - Optimized with zero extra dependencies
- ♿ **Accessible** - WCAG 2.1 compliant with keyboard navigation

---

## 📦 Installation

```bash
npm install ntpopups
```

Or with Yarn:

```bash
yarn add ntpopups
```

---

## 🚀 Quick Start

### React Setup

Wrap your application with `NtPopupProvider`:

```jsx
// App.jsx
import { NtPopupProvider } from 'ntpopups';
import 'ntpopups/dist/styles.css';

function App() {
  return (
    <NtPopupProvider language="en" theme="white">
      {/* Your app content */}
    </NtPopupProvider>
  );
}

export default App;
```

### Next.js Setup

#### App Router

Create a Client Component for the provider:

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

Use it in your root layout:

```jsx
// app/layout.jsx
import Providers from '@/components/Providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Pages Router

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

## 🎯 Basic Usage

Import the hook and start creating popups:

```jsx
import useNtPopups from 'ntpopups';

function MyComponent() {
  const { openPopup } = useNtPopups();

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

## 🧩 Built-in Popups

### Generic - Simple Message

Display informational messages, warnings, or notifications.

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

**Props:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | ReactNode | Popup title |
| `message` | ReactNode | Main message content |
| `closeLabel` | ReactNode | Close button text |
| `icon` | ReactNode | Icon next to title (default: "ⓘ") |

---

### Confirm - User Confirmation

Get user confirmation before critical actions.

```jsx
openPopup('confirm', {
  data: {
    title: 'Delete Item?',
    message: 'This action cannot be undone. Continue?',
    cancelLabel: 'Cancel',
    confirmLabel: 'Yes, delete',
    confirmStyle: 'Danger',
    icon: '❓',
    onChoose: (confirmed) => {
      if (confirmed) {
        console.log('User confirmed!');
      }
    }
  }
});
```

**Props:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | ReactNode | Popup title |
| `message` | ReactNode | Confirmation message |
| `cancelLabel` | ReactNode | Cancel button text |
| `confirmLabel` | ReactNode | Confirm button text |
| `confirmStyle` | `'default'` \| `'Secondary'` \| `'Success'` \| `'Danger'` | Confirm button style |
| `icon` | ReactNode | Header icon |
| `onChoose` | `(confirmed: boolean) => void` | Callback receiving true (confirm) or false (cancel) |

---

### Crop Image - Image Editor

Built-in image cropping with zoom, rotation, and format options.

```jsx
openPopup('crop_image', {
  requireAction: false,
  data: {
    image: fileOrUrl, // File object or URL/base64 string
    format: 'circle', // 'circle' or 'square'
    aspectRatio: '1:1', // Format: "width:height"
    onCrop: (result) => {
      console.log('Blob:', result.blob);
      console.log('Base64:', result.base64);
      console.log('File:', result.file);
    }
  }
});
```

**Props:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `image` | File \| string | - | Image file or URL/base64 |
| `format` | `'circle'` \| `'square'` | `'circle'` | Crop format |
| `aspectRatio` | string | `"1:1"` | Aspect ratio (e.g., "16:9", "4:3") |
| `minZoom` | number | 1 | Minimum zoom level |
| `maxZoom` | number | 4 | Maximum zoom level |
| `onCrop` | Function | - | Callback with `{ blob, base64, file }` |

💡 **Tip:** Set `requireAction: true` to remove the cancel button and make cropping mandatory.

---

### Form - Dynamic Forms

Create powerful, validated forms with multiple input types.

```jsx
openPopup('form', {
  data: {
    title: 'User Registration',
    message: 'Fill in the fields below:',
    doneLabel: 'Submit',
    icon: '📝',
    components: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
        minLength: 3,
        maxLength: 50
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'your@email.com',
        required: true,
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
      // Inline fields (side-by-side)
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
    onSubmit: (values) => {
      console.log('Form data:', values);
      // { name: "...", email: "...", bio: "...", accept: true, city: "...", state: "..." }
    },
    onChange: ({ changedComponentState, formState }) => {
      const { id, value, isValid } = changedComponentState;
      const { values, isValid: formValid } = formState;
      
      console.log(`Field "${id}" changed to:`, value);
      console.log('Is valid:', isValid);
      console.log('All form values:', values);
      console.log('Form is valid:', formValid);
    }
  }
});
```

**Main Props:**
| Property | Type | Description |
|----------|------|-------------|
| `title` | ReactNode | Form title |
| `message` | ReactNode | Optional description |
| `doneLabel` | ReactNode | Submit button text |
| `icon` | ReactNode | Header icon |
| `components` | Array | List of form fields (see below) |
| `onSubmit` | `(values: object) => void` | Callback with all form values |
| `onChange` | `(event: object) => void` | Fired when any field changes |

#### Available Field Types

<details>
<summary><strong>Text Input</strong></summary>

```javascript
{
  id: 'username',
  type: 'text',
  label: 'Username',
  placeholder: 'Enter username...',
  defaultValue: '',
  required: false,
  disabled: false,
  minLength: 3,
  maxLength: 50,
  matchRegex: '^[A-Z].*' // Regex pattern
}
```
</details>

<details>
<summary><strong>Textarea</strong></summary>

```javascript
{
  id: 'description',
  type: 'textarea',
  label: 'Description',
  placeholder: 'Enter description...',
  defaultValue: '',
  required: false,
  disabled: false,
  disableResize: false, // Prevent user resizing
  minLength: 10,
  maxLength: 500,
  matchRegex: '.*'
}
```
</details>

<details>
<summary><strong>Email Input</strong></summary>

```javascript
{
  id: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'your@email.com',
  defaultValue: '',
  required: true,
  disabled: false
}
```
</details>

<details>
<summary><strong>Number Input</strong></summary>

```javascript
{
  id: 'age',
  type: 'number',
  label: 'Age',
  placeholder: 'Enter your age...',
  defaultValue: 18,
  required: false,
  disabled: false,
  min: 0,
  max: 120
}
```
</details>

<details>
<summary><strong>Password Input</strong></summary>

```javascript
{
  id: 'password',
  type: 'password',
  label: 'Password',
  placeholder: 'Enter password...',
  defaultValue: '',
  required: true,
  minLength: 8,
  maxLength: 100
}
```
</details>

<details>
<summary><strong>Checkbox</strong></summary>

```javascript
{
  id: 'accept_terms',
  type: 'checkbox',
  label: 'I accept the terms of use',
  defaultValue: false,
  disabled: false,
  required: true // Must be checked if required
}
```
</details>

<details>
<summary><strong>Radio Button</strong></summary>

```javascript
{
  id: 'gender',
  type: 'radio',
  label: 'Gender',
  options: ['Male', 'Female', { label: 'Other', value: 'other' }],
  required: true,
  defaultValue: ''
}
```
</details>

<details>
<summary><strong>Select Dropdown</strong></summary>

```javascript
{
  id: 'country',
  type: 'select',
  label: 'Country',
  options: ['USA', 'Canada', { label: 'Other', value: 'world' }],
  required: true,
  defaultValue: ''
}
```
</details>

<details>
<summary><strong>Date Input</strong></summary>

```javascript
{
  id: 'birthdate',
  type: 'date',
  label: 'Birthdate',
  minDate: new Date('1900-01-01'),
  maxDate: new Date('2024-12-31'),
  required: true,
  defaultValue: new Date('2000-01-01')
}
```
</details>

<details>
<summary><strong>Time Input</strong></summary>

```javascript
{
  id: 'appointment_time',
  type: 'time',
  label: 'Appointment Time',
  required: false
}
```
</details>

<details>
<summary><strong>File Upload</strong></summary>

```javascript
{
  id: 'file_upload',
  type: 'file',
  label: 'Upload File',
  accept: '.jpg,.png,.pdf', // Accepted file types
  multiple: false, // Allow multiple files
  required: false
}
```
</details>

💡 **Tips:**
- Set `requireAction: true` to hide the cancel button
- Submit button is disabled until all fields are valid
- Invalid fields automatically show a red border
- Supports inline fields by nesting arrays

---

### Custom Form Components

Extend forms with your own specialized input types while maintaining full validation and state management.

#### Why Use Custom Components?

Perfect for:
- **Specialized inputs** (color picker, rich text editor, autocomplete)
- **Complex UI patterns** (multi-step inputs, dynamic lists)
- **External library integration** (date pickers, file uploaders)
- **API inputs** (product selectors, user pickers)

#### Creating a Custom Component

**1. Define the Component Type**

```javascript
customComponents: {
  "color": {
    // Empty value for validation
    emptyValue: null,
    
    // Optional custom validator
    validator: (value, componentData) => {
      if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
        return "Invalid hex color format";
      }
      return null; // Valid
    },
    
    // Your React component
    render: (props) => <ColorPicker {...props} />
  }
}
```

**2. Component Props**

Your component receives:

```typescript
{
  id: string,              // Unique field ID
  value: any,              // Current value
  disabled: boolean,       // Disabled state
  required: boolean,       // Required field
  placeholder: string,     // Placeholder text
  changeValue: (val) => void,  // Update form value
  valid: boolean,          // Validation state
  autoFocus: boolean,      // Auto-focus flag
  data: object            // All field config (including custom props)
}
```

**3. Implementation Example**

```javascript
function ColorPickerComponent(props) {
  const [preview, setPreview] = useState(props.value || '#000000');
  
  // Sync with form value
  useEffect(() => {
    setPreview(props.value || '#000000');
  }, [props.value]);

  const handleChange = (e) => {
    const newColor = e.target.value;
    setPreview(newColor);
    props.changeValue(newColor); // Update form
  };

  return (
    <div style={{ display: 'flex', gap: '10px', opacity: props.disabled ? 0.5 : 1 }}>
      <input
        type="color"
        value={preview}
        onChange={handleChange}
        disabled={props.disabled}
        style={{ border: props.valid ? '2px solid #ccc' : '2px solid red' }}
      />
      <input
        type="text"
        value={preview}
        onChange={handleChange}
        disabled={props.disabled}
        placeholder={props.placeholder}
        style={{ border: props.valid ? '1px solid #ccc' : '1px solid red' }}
      />
    </div>
  );
}

// Usage in form
openPopup('form', {
  data: {
    title: 'Theme Settings',
    customComponents: {
      'color': {
        emptyValue: null,
        validator: (value) => {
          if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
            return 'Invalid hex color';
          }
          return null;
        },
        render: (props) => <ColorPickerComponent {...props} />
      }
    },
    components: [
      {
        id: 'primary_color',
        type: 'color',
        label: 'Primary Color',
        placeholder: '#3B82F6',
        required: true,
        defaultValue: '#3B82F6'
      }
    ],
    onSubmit: (values) => {
      console.log('Selected color:', values.primary_color);
    }
  }
});
```

#### Best Practices

**✅ DO:**
- Always use `props.changeValue()` to update values
- Sync local UI state with `props.value` using `useEffect`
- Use `props.valid` for visual feedback
- Access custom props from `props.data`

**❌ DON'T:**
- Don't manage the value in local state only
- Don't forget to handle `disabled` and `required` props
- Don't mutate `props.value` directly

#### Validation

**Built-in Required Check:** If `required: true`, the form checks if value equals `emptyValue`.

**Custom Validator:** Add additional validation rules:

```javascript
validator: (value, componentData) => {
  const { maxItems } = componentData;
  
  if (value && value.length > maxItems) {
    return `Maximum ${maxItems} items allowed`;
  }
  
  return null; // Valid
}
```

**Note:** Custom validators run after the required check.

---

### HTML - Custom Content

Render custom HTML or React components in a popup.

```jsx
openPopup('html', {
  data: {
    html: <h1>Hello World!</h1>
  }
});
```

Or with access to `closePopup`:

```jsx
openPopup('html', {
  data: {
    html: ({ closePopup }) => (
      <div>
        <h1>Custom Content</h1>
        <button onClick={() => closePopup()}>Close</button>
      </div>
    )
  }
});
```

**Props:**
| Property | Type | Description |
|----------|------|-------------|
| `html` | ReactNode \| Function | Custom content or render function |

---

## 🎨 Creating Custom Popups

Build your own popup components with full control over UI and behavior.

### 1. Basic Structure

```jsx
export default function MyCustomPopup({
  // Provided by library
  closePopup,      // Function to close popup
  popupstyles,     // Predefined CSS classes
  requireAction,   // Boolean - requires user action to close
  
  // Your custom props
  data = {}
}) {
  return (
    <>
      {/* Header */}
      <div className={popupstyles.header}>
        <div className={popupstyles.icon}>ⓘ</div>
        <span>Custom Popup Title</span>
      </div>

      {/* Body */}
      <div className={popupstyles.body}>
        <p>Your custom content here</p>
      </div>

      {/* Footer */}
      <div className={popupstyles.footer}>
        <button
          className={popupstyles.baseButton}
          base-button-style="0"
          onClick={() => closePopup(true)}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
```

### 2. Styling System

#### Button Styles

Use `className={popupstyles.baseButton}` with these attributes:

**`base-button-style`** (string):
- `"0"` - Primary (default)
- `"1"` - Secondary
- `"2"` - Text only
- `"3"` - Success (green)
- `"4"` - Danger (red)

**`base-button-no-flex`** (string): `"true"` | `"false"` (default)

**Example:**
```jsx
<button 
  className={popupstyles.baseButton}
  base-button-style="4"
  base-button-no-flex="true"
>
  Delete
</button>
```

#### Form Elements with `ntpopups-css="true"`

Apply ntPopups styling to native form elements:

**Supported elements:**
- `<input>` (text, email, password, number, date, time, radio)
- `<textarea>`
- `<select>`
- `<a>`

**Additional attributes:**
- `valid="false"` - Show error state (red border)
- `noresize="true"` - Disable textarea resizing (textarea only)

**Examples:**
```jsx
<input type="text" ntpopups-css="true" placeholder="Username" />
<input type="email" ntpopups-css="true" valid="false" />
<textarea ntpopups-css="true" noresize="true" />
<select ntpopups-css="true">
  <option>Option 1</option>
</select>
<a href="#" ntpopups-css="true">Link</a>
```

### 3. Complete Example

```jsx
// components/popups/MyCustomPopup.jsx
import styles from './mystyles.module.css';

export default function MyCustomPopup({
  closePopup,
  popupstyles,
  requireAction,
  data: {
    message = 'Default message',
    customProp1,
    customProp2 = 'Amazing library!',
    onConfirm = () => {}
  } = {}
}) {
  const handleConfirm = () => {
    onConfirm(customProp1 + customProp2);
    closePopup(true); // true = user action
  };

  return (
    <>
      <div className={popupstyles.header}>
        <div className={popupstyles.icon}>💡</div>
        <span>Custom Popup</span>
      </div>

      <div className={popupstyles.body}>
        <p>{message}</p>
        <h3>Property 1: {customProp1}</h3>
        
        <button 
          className={styles.myCustomButton}
          onClick={() => alert(customProp2)}
        >
          {customProp2}
        </button>
      </div>

      <div className={popupstyles.footer}>
        {!requireAction && (
          <button 
            className={popupstyles.baseButton}
            base-button-style="1"
            onClick={() => closePopup()}
          >
            Cancel
          </button>
        )}
        
        <button 
          className={popupstyles.baseButton}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
```

💡 **Tip:** When `requireAction = true`, `closePopup()` only works with `closePopup(true)`.

### 4. Register the Component

```jsx
import { NtPopupProvider } from 'ntpopups';
import MyCustomPopup from './components/MyCustomPopup';
import AnotherCustomPopup from './components/AnotherPopup';

function App() {
  return (
    <NtPopupProvider
      language="en"
      theme="white"
      customPopups={{
        'my_custom': MyCustomPopup,
        'another_custom': AnotherCustomPopup
      }}
    >
      {/* Your app */}
    </NtPopupProvider>
  );
}
```

### 5. Use Your Custom Popup

```jsx
const { openPopup } = useNtPopups();

openPopup('my_custom', {
  data: {
    message: 'Hello from custom popup!',
    customProp1: 'Value 1',
    customProp2: 'Value 2',
    onConfirm: (result) => {
      console.log('Confirmed:', result);
    }
  },
  requireAction: true,
  maxWidth: '600px'
});
```

---

## ⚙️ Configuration

### Provider Props

```jsx
<NtPopupProvider
  language="en"             // 'en' | 'ptbr'
  theme="white"             // 'white' | 'dark'
  customPopups={{}}         // Your custom popup components
  config={{
    defaultSettings: {
      all: {                // Applied to all popups
        closeOnEscape: true,
        closeOnClickOutside: true,
      },
      generic: {            // Specific to generic popup
        closeOnClickOutside: false,
        timeout: 20000
      },
      confirm: {            // Override for confirm popup
        closeOnClickOutside: false
      },
      my_custom: {          // Your custom popup defaults
        requireAction: true
      }
    }
  }}
>
```

### Popup Settings

Settings applicable to **any popup** (built-in or custom):

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | auto | Unique popup ID |
| `closeOnEscape` | boolean | true | Close on ESC key |
| `closeOnClickOutside` | boolean | true | Close on backdrop click |
| `requireAction` | boolean | false | Requires internal action to close |
| `timeout` | number | 0 | Auto-close after milliseconds |
| `keepLast` | boolean | false | Keep previous popup visible |
| `allowPageBodyScroll` | boolean | false | Allow page scrolling |
| `interactiveBackdrop` | boolean | false | Allow backdrop interactions |
| `hiddenBackdrop` | boolean | false | Hide backdrop |
| `hiddenHeader` | boolean | false | Hide header |
| `hiddenFooter` | boolean | false | Hide footer |
| `disableAnimation` | boolean | false | Disable open/close animation |
| `width` | string | - | CSS width (e.g., '400px') |
| `maxWidth` | string | - | CSS max-width (e.g., '800px') |
| `minWidth` | string | - | CSS min-width (e.g., '200px') |
| `height` | string | - | CSS height (e.g., '50dvh') |
| `maxHeight` | string | - | CSS max-height (e.g., '80dvh') |
| `minHeight` | string | - | CSS min-height (e.g., '20dvh') |
| `onOpen` | `(id: string) => void` | - | Callback on open |
| `onClose` | `(hasAction: boolean, id: string) => void` | - | Callback on close |

**Example:**

```jsx
openPopup('generic', {
  closeOnEscape: false,
  requireAction: true,
  timeout: 5000,
  maxWidth: '400px',
  onOpen: (id) => console.log('Opened:', id),
  onClose: (hasAction, id) => {
    console.log('Closed with action?', hasAction);
  },
  data: {
    message: 'Auto-closes in 5 seconds'
  }
});
```

---

## 🎭 Hook API

```typescript
const {
  openPopup,       // (type, settings) => PopupData | null
  closePopup,      // (id?, hasAction?) => void
  updatePopup,     // (id, settings) => PopupData | null
  closeAllPopups,  // () => void
  isPopupOpen,     // (id) => boolean
  getPopup,        // (id) => PopupData | null
  popups,          // PopupData[] - Array of active popups
  language         // 'en' | 'ptbr'
} = useNtPopups();
```

### Methods

#### `openPopup(type, settings)`
Opens a popup and returns its data (including unique ID).

```jsx
const popup = openPopup('confirm', {
  data: { message: 'Continue?' }
});
console.log(popup.id); // "popup_abc123"
```

#### `closePopup(id?, hasAction?)`
Closes a specific popup or the last opened one.

```jsx
closePopup();                    // Close last popup, no action
closePopup(true);               // Close last popup, with action
closePopup('popup_123', true);  // Close specific popup, with action
```

#### `updatePopup(id, newSettings)`
Updates settings of an open popup.

```jsx
const popup = openPopup('generic', {
  data: { message: 'Loading...' }
});

updatePopup(popup.id, {
  data: { message: 'Complete!' }
});
```

#### `closeAllPopups()`
Closes all open popups immediately.

```jsx
closeAllPopups();
```

#### `isPopupOpen(id)`
Checks if a popup is currently open.

```jsx
if (isPopupOpen('my_popup')) {
  console.log('Still open!');
}
```

#### `getPopup(id)`
Retrieves data for an open popup.

```jsx
const popup = getPopup('popup_123');
console.log(popup?.settings);
```

---

## 💡 Usage Examples

### Delete Confirmation

```jsx
const confirmDelete = (itemId) => {
  openPopup('confirm', {
    data: {
      title: 'Delete Item',
      message: 'This action cannot be undone. Continue?',
      icon: '🗑️',
      confirmLabel: 'Delete',
      confirmStyle: 'Danger',
      onChoose: async (confirmed) => {
        if (confirmed) {
          await deleteItem(itemId);
          openPopup('generic', {
            data: { message: 'Item deleted!' },
            timeout: 3000
          });
        }
      }
    },
    closeOnClickOutside: false
  });
};
```

### Avatar Upload & Crop

```jsx
const handleAvatarUpload = (file) => {
  openPopup('crop_image', {
    data: {
      image: file,
      format: 'circle',
      onCrop: async (result) => {
        const formData = new FormData();
        formData.append('avatar', result.file);
        
        await api.post('/users/avatar', formData);
        setAvatarUrl(result.base64);
        
        openPopup('generic', {
          data: {
            title: 'Success!',
            message: 'Avatar updated.',
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

### Feedback Form

```jsx
const openFeedbackForm = () => {
  openPopup('form', {
    data: {
      title: 'Send Feedback',
      message: 'Your opinion matters!',
      icon: '💬',
      components: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          minLength: 2
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: true
        },
        {
          id: 'message',
          type: 'textarea',
          label: 'Message',
          required: true,
          minLength: 10,
          maxLength: 500
        },
        {
          id: 'contact',
          type: 'checkbox',label: 'You may contact me about this',
          defaultValue: true
        }
      ],
      onSubmit: async (data) => {
        await api.post('/feedback', data);
        
        openPopup('generic', {
          data: {
            title: 'Thank you!',
            message: 'Feedback sent successfully.',
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

### Multi-Step Wizard

```jsx
const registrationWizard = () => {
  const steps = ['personal', 'address', 'preferences'];
  let currentStep = 0;
  let formData = {};
  
  const stepConfigs = {
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
            matchRegex: '^\\d{9}$'
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
          matchRegex: '^\\d{5}$'
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
          label: 'Receive newsletter',
          defaultValue: true
        },
        {
          id: 'notifications',
          type: 'checkbox',
          label: 'Receive notifications',
          defaultValue: true
        },
        {
          id: 'notes',
          type: 'textarea',
          label: 'Additional Notes',
          placeholder: 'Anything else...',
          maxLength: 200
        }
      ]
    }
  };
  
  const openStep = (step) => {
    const config = stepConfigs[step];
    const isLastStep = step === 'preferences';
    
    openPopup('form', {
      id: `wizard_${step}`,
      data: {
        ...config,
        icon: '📝',
        doneLabel: isLastStep ? 'Finish' : 'Next',
        onSubmit: (values) => {
          formData = { ...formData, ...values };
          
          if (isLastStep) {
            finishRegistration(formData);
          } else {
            currentStep++;
            openStep(steps[currentStep]);
          }
        }
      }
    });
  };
  
  const finishRegistration = async (data) => {
    await api.post('/registration', data);
    
    openPopup('generic', {
      data: {
        title: 'Registration Complete!',
        message: 'Welcome! Your account is ready.',
        icon: '🎊'
      },
      timeout: 5000
    });
  };
  
  openStep(steps[0]);
};
```

### Loading Indicator

```jsx
const performLongAction = async () => {
  const loading = openPopup('generic', {
    id: 'loading_popup',
    data: {
      title: 'Processing...',
      message: 'Please wait while we complete your request.',
      icon: '⏳'
    },
    requireAction: true,
    hiddenFooter: true
  });
  
  try {
    await performOperation();
    
    closePopup(loading.id, true);
    
    openPopup('generic', {
      data: {
        title: 'Success!',
        message: 'Operation completed.',
        icon: '✅'
      },
      timeout: 3000
    });
  } catch (error) {
    closePopup(loading.id, true);
    
    openPopup('generic', {
      data: {
        title: 'Error',
        message: `An error occurred: ${error.message}`,
        icon: '❌'
      }
    });
  }
};
```

### Onboarding Tour

```jsx
const startOnboardingTour = () => {
  const steps = [
    {
      title: 'Welcome! 👋',
      message: "Let's take a quick tour of the main features.",
      icon: '🚀'
    },
    {
      title: 'Dashboard',
      message: 'View all your metrics in real-time here.',
      icon: '📊'
    },
    {
      title: 'Settings',
      message: 'Customize your experience in settings.',
      icon: '⚙️'
    },
    {
      title: 'Ready to Go!',
      message: "You're all set. Enjoy!",
      icon: '🎉'
    }
  ];
  
  let currentStep = 0;
  
  const showStep = () => {
    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    
    openPopup('generic', {
      id: 'tour_step',
      data: {
        title: step.title,
        message: step.message,
        icon: step.icon,
        closeLabel: isLastStep ? 'Get Started' : 'Next'
      },
      onClose: (hasAction) => {
        if (hasAction && !isLastStep) {
          currentStep++;
          setTimeout(showStep, 300);
        } else if (hasAction && isLastStep) {
          localStorage.setItem('tour_complete', 'true');
        }
      }
    });
  };
  
  showStep();
};
```

### Notification with Actions

```jsx
// Custom notification popup component
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
        <span>{title}</span>
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

// Register in provider
<NtPopupProvider customPopups={{ notification: NotificationPopup }}>
  {/* ... */}
</NtPopupProvider>

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

### Advanced Form Validation

```jsx
const createAccountForm = () => {
  openPopup('form', {
    data: {
      title: 'Create Account',
      icon: '🔐',
      components: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          placeholder: 'Minimum 3 characters',
          required: true,
          minLength: 3,
          maxLength: 20,
          matchRegex: '^[a-zA-Z0-9_]+$'
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'your@email.com',
          required: true
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Min 8 chars, 1 uppercase, 1 number',
          required: true,
          minLength: 8,
          matchRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
        },
        {
          id: 'bio',
          type: 'textarea',
          label: 'Bio (Optional)',
          placeholder: 'Tell us about yourself...',
          maxLength: 150,
          disableResize: true
        },
        [
          {
            id: 'terms',
            type: 'checkbox',
            label: 'I accept the Terms of Service',
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
      onSubmit: async (data) => {
        try {
          await api.post('/auth/register', data);
          
          openPopup('generic', {
            data: {
              title: 'Account Created!',
              message: 'Check your email to verify your account.',
              icon: '📧'
            }
          });
        } catch (error) {
          openPopup('generic', {
            data: {
              title: 'Error',
              message: error.response?.data?.message || 'Failed to create account.',
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

## 🎨 Visual Customization

### CSS Variables

ntPopups provides **100+ CSS variables** for complete visual control. All variables use the `--ntpopups-*` prefix.

#### Typography

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

#### Colors

**Primary:**
```css
--ntpopups-color-primary: #5f54f0;
--ntpopups-color-primary-hover: #4f43f5;
--ntpopups-color-primary-active: #3f33e5;
--ntpopups-color-primary-disabled: #a39fd8;
--ntpopups-color-primary-light: #e8e6fc;
```

**Secondary:**
```css
--ntpopups-color-secondary: #2a2a2a;
--ntpopups-color-secondary-hover: #363636;
--ntpopups-color-secondary-active: #4e555b;
--ntpopups-color-secondary-disabled: #b8bfc6;
--ntpopups-color-secondary-light: #e9ecef;
```

**Semantic:**
```css
--ntpopups-color-success: #28a745;
--ntpopups-color-success-hover: #218838;
--ntpopups-color-danger: #dc3545;
--ntpopups-color-danger-hover: #c82333;
--ntpopups-color-warning: #ffc107;
--ntpopups-color-info: #17a2b8;
```

**Text:**
```css
--ntpopups-color-text: rgba(64, 64, 64, 0.95);
--ntpopups-color-text-secondary: rgba(14, 14, 14, 0.6);
--ntpopups-color-text-muted: rgba(14, 14, 14, 0.4);
--ntpopups-color-text-light: #f8f9fa;
--ntpopups-color-text-on-primary: #ffffff;
```

#### Backgrounds

```css
--ntpopups-bg-default: linear-gradient(...);
--ntpopups-bg-overlay: rgba(0, 0, 0, 0.459);
--ntpopups-bg-footer: #f0f0f0;
--ntpopups-bg-header: linear-gradient(...);
--ntpopups-bg-body: linear-gradient(...);
--ntpopups-bg-button-primary: var(--ntpopups-color-primary);
--ntpopups-bg-button-secondary: var(--ntpopups-color-secondary);
```

#### Borders & Radius

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

#### Shadows

```css
--ntpopups-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
--ntpopups-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.2);
--ntpopups-shadow-button: 0 2px 4px rgba(0, 0, 0, 0.1);
--ntpopups-shadow-button-hover: 0 4px 8px rgba(0, 0, 0, 0.15);
```

#### Spacing

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

#### Form Inputs

```css
--ntpopups-input-bg: #ffffff;
--ntpopups-input-border: var(--ntpopups-border-color);
--ntpopups-input-border-focus: var(--ntpopups-color-primary);
--ntpopups-input-text-color: var(--ntpopups-color-text);
--ntpopups-input-placeholder-color: var(--ntpopups-color-text-muted);
--ntpopups-input-padding: var(--ntpopups-spacing-sm) var(--ntpopups-spacing-md);
--ntpopups-input-border-radius: var(--ntpopups-border-radius-sm);
```

#### Dimensions

```css
--ntpopups-width-min: 300px;
--ntpopups-width-max: 1000px;
--ntpopups-width-default: fit-content;
--ntpopups-height-max: 90dvh;
--ntpopups-button-min-width: 80px;
--ntpopups-button-height: auto;
```

#### Transitions

```css
--ntpopups-transition-duration: 0.2s;
--ntpopups-transition-duration-fast: 0.1s;
--ntpopups-transition-duration-slow: 0.3s;
--ntpopups-transition-easing: ease-in-out;
--ntpopups-transition-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### Responsive

```css
--ntpopups-mobile-padding: 15px;
--ntpopups-mobile-font-size: 14px;
```

### How to Customize

Create a CSS file and override the variables:

```css
/* styles/custom-ntpopups.css */

.ntpopups-overlay {
  /* Brand colors */
  --ntpopups-color-primary: #ff6b6b;
  --ntpopups-color-primary-hover: #ff5252;
  
  /* Typography */
  --ntpopups-font-family: 'Poppins', sans-serif;
  --ntpopups-font-size-base: 16px;
  
  /* Rounded design */
  --ntpopups-border-radius: 20px;
  --ntpopups-border-radius-button: 10px;
  
  /* Softer shadows */
  --ntpopups-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  /* Generous spacing */
  --ntpopups-padding-body: 30px;
  
  /* Darker backdrop */
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.7);
}

/* Dark theme customization */
.ntpopups-dark-theme {
  --ntpopups-color-primary: #bb86fc;
  --ntpopups-bg-overlay: rgba(0, 0, 0, 0.9);
  --ntpopups-bg-body: #1e1e1e;
}
```

Import in your app:

```jsx
import 'ntpopups/dist/styles.css';
import './styles/custom-ntpopups.css';
```

---

## 🎯 CSS Classes

All classes use the `.ntpopups-*` prefix for easy styling.

### Structure Classes

```css
.ntpopups-main                    /* Root container */
.ntpopups-[theme]-theme           /* Theme-specific (e.g., .ntpopups-dark-theme) */
.ntpopups-overlay                 /* Backdrop container */
.ntpopups-container               /* Popup container */
.ntpopups-header                  /* Header section */
.ntpopups-icon                    /* Header icon */
.ntpopups-body                    /* Body/content section */
.ntpopups-footer                  /* Footer section */
.ntpopups-basebutton              /* Base button style */
```

### Component-Specific Classes

**Buttons:**
```css
.ntpopups-basebutton              /* Base button */
.ntpopups-confirm-button          /* Confirm popup button */
```

**Form:**
```css
.ntpopups-form-body               /* Form container */
.ntpopups-form-row                /* Field row */
.ntpopups-form-component-container /* Individual field wrapper */
.ntpopups-form-message            /* Form message */
```

**Image Cropper:**
```css
.ntpopups-cropimage-header        /* Crop header */
.ntpopups-cropimage-main          /* Main container */
.ntpopups-cropimage-container     /* Canvas container */
.ntpopups-cropimage-container-grab     /* Grab cursor state */
.ntpopups-cropimage-container-grabbing /* Grabbing cursor state */
.ntpopups-cropimage-full-canvas   /* Full canvas */
.ntpopups-cropimage-canvas        /* Crop canvas */
.ntpopups-cropimage-canvas-circle /* Circle crop canvas */
.ntpopups-cropimage-hidden-image  /* Hidden image element */
.ntpopups-cropimage-zoom-section  /* Zoom controls section */
.ntpopups-cropimage-zoom-controls /* Zoom controls wrapper */
.ntpopups-cropimage-zoom-slider   /* Zoom slider */
.ntpopups-cropimage-zoom-icon     /* Zoom icon */
.ntpopups-cropimage-zoom-icon-small  /* Small zoom icon */
.ntpopups-cropimage-zoom-icon-large  /* Large zoom icon */
.ntpopups-cropimage-resetbutton   /* Reset button */
```

### Usage Example

```css
/* Customize all buttons */
.ntpopups-basebutton {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

/* Custom header gradient */
.ntpopups-header {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Increase form spacing */
.ntpopups-form-body {
  gap: 25px;
}

/* Style specific popup type */
.ntpopups-overlay[data-popup-type="confirm"] .ntpopups-body {
  font-size: 18px;
  text-align: center;
}
```

---

## 📱 Responsive & Accessible

### Responsive Design

- **Mobile-First Approach** - Optimized for small screens first
- **Touch-Friendly** - Full gesture support (drag, pinch, zoom)
- **Adaptive Components** - Elements resize intelligently

**Mobile Optimizations:**
- Reduced padding for better space usage
- Adjusted font sizes for readability
- Minimum 44px touch targets
- Optimized scrolling behavior

### Accessibility

- **Keyboard Navigation** - Full support (ESC, Tab, Enter, Space)
- **WCAG 2.1 Compliant** - Minimum AA contrast ratios
- **Focus Management** - Clear focus indicators
- **Semantic HTML** - Proper heading hierarchy
- **ARIA Labels** - Screen reader friendly
- **No Color-Only Information** - Multiple visual cues
- **Zoom Support** - Works up to 200% zoom

**Keyboard Shortcuts:**
- `ESC` - Close popup (if `closeOnEscape` is enabled)
- `Tab` / `Shift+Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate buttons
- Focus automatically trapped within popup

---

## 🎓 Best Practices

### ✅ Recommended

**1. Handle Async Operations**
```jsx
onSubmit: async (data) => {
  try {
    await api.post('/save', data);
    // Success handling
  } catch (error) {
    // Error handling
    console.error('Save failed:', error);
  }
}
```

**2. Validate on Server**
Never trust client-side validation alone.

**3. Use Timeouts Wisely**
```jsx
// ✅ Good - Success notification
openPopup('generic', {
  data: { message: 'Saved!' },
  timeout: 3000
});

// ❌ Bad - Critical action
openPopup('confirm', {
  data: { message: 'Delete everything?' },
  timeout: 5000  // User might miss it!
});
```

**4. RequireAction for Critical Actions**
```jsx
// ✅ Good - Delete confirmation
openPopup('confirm', {
  requireAction: true,
  data: { message: 'Delete account?' }
});

// ❌ Bad - Simple notification
openPopup('generic', {
  requireAction: true,  // Unnecessary friction
  data: { message: 'Welcome!' }
});
```

**5. Cleanup on Unmount**
```jsx
useEffect(() => {
  return () => {
    closeAllPopups(); // Clean up when component unmounts
  };
}, []);
```

**6. Provide Clear Feedback**
```jsx
// Show loading state
const loading = openPopup('generic', {
  data: { title: 'Saving...', message: 'Please wait' },
  requireAction: true,
  hiddenFooter: true
});

await saveData();

closePopup(loading.id, true);

// Show success
openPopup('generic', {
  data: { title: 'Saved!', icon: '✅' },
  timeout: 3000
});
```

### ⚠️ Avoid

**1. Multiple Simultaneous Popups**
```jsx
// ❌ Confusing for users
openPopup('generic', { keepLast: true });
openPopup('confirm', { keepLast: true });
openPopup('form', { keepLast: true });

// ✅ Use sequential flow instead
openPopup('confirm', {
  data: {
    onChoose: (confirmed) => {
      if (confirmed) {
        openPopup('form', { /* ... */ });
      }
    }
  }
});
```

**2. Overly Long Forms**
```jsx
// ❌ 20 fields in one popup
// ✅ Split into multi-step wizard

// ❌ Very large forms
components: [/* 25 fields */]

// ✅ Multi-step approach
const wizard = ['step1', 'step2', 'step3'];
```

**3. Timeout on Important Actions**
```jsx
// ❌ User might lose important popup
openPopup('confirm', {
  timeout: 5000,
  data: { message: 'Confirm deletion?' }
});

// ✅ No timeout for critical actions
openPopup('confirm', {
  data: { message: 'Confirm deletion?' }
});
```

**4. Missing Error Handling**
```jsx
// ❌ No error handling
onSubmit: async (data) => {
  await api.post('/save', data);
}

// ✅ Proper error handling
onSubmit: async (data) => {
  try {
    await api.post('/save', data);
  } catch (error) {
    openPopup('generic', {
      data: {
        title: 'Error',
        message: error.message,
        icon: '❌'
      }
    });
  }
}
```

---

## 🔧 Troubleshooting

### Popup Doesn't Open

**Symptom:** `openPopup()` returns `null`

**Solutions:**
- ✓ Verify popup type is registered in `customPopups`
- ✓ Check browser console for errors
- ✓ Ensure `NtPopupProvider` wraps your component
- ✓ Confirm you're calling `openPopup` inside a component (not at module level)

### Styles Not Applied

**Symptom:** Popup appears unstyled

**Solutions:**
- ✓ Import CSS: `import 'ntpopups/dist/styles.css'`
- ✓ Check import order (library CSS before custom CSS)
- ✓ In Next.js App Router, import in Client Component with `'use client'`
- ✓ Clear build cache and restart dev server

### Form Doesn't Validate

**Symptom:** Submit button stays disabled

**Solutions:**
- ✓ Verify `required` fields have values
- ✓ Check `matchRegex` patterns are correct
- ✓ Ensure `minLength`/`maxLength` constraints are met
- ✓ Remember: `disabled` fields are not validated
- ✓ Use `onChange` to debug validation state

### Popup Won't Close

**Symptom:** ESC key or backdrop click doesn't work

**Solutions:**
- ✓ Check `closeOnEscape` setting (default: `true`)
- ✓ Check `closeOnClickOutside` setting (default: `true`)
- ✓ If `requireAction: true`, use `closePopup(id, true)` with action
- ✓ Verify no JavaScript errors preventing event handlers

### Next.js Hydration Error

**Symptom:** "Hydration mismatch" warning in console

**Solution:**
```jsx
// ✅ Mark provider component as Client Component
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

### TypeScript Errors

**Symptom:** Type errors with custom popups

**Solution:**
```typescript
// Define types for your custom popup data
interface MyCustomData {
  message: string;
  onConfirm?: () => void;
}

openPopup('my_custom', {
  data: {
    message: 'Hello',
    onConfirm: () => console.log('Confirmed')
  } as MyCustomData
});
```

---

## 📚 Additional Resources

- **Live Demo** - [https://ntpopups.nemtudo.me/demo](https://ntpopups.nemtudo.me/demo)
- **Full Documentation** - [https://ntpopups.nemtudo.me](https://ntpopups.nemtudo.me)
- **GitHub Repository** - [https://github.com/Nem-Tudo/ntPopups](https://github.com/Nem-Tudo/ntPopups)
- **npm Package** - [https://www.npmjs.com/package/ntpopups](https://www.npmjs.com/package/ntpopups)

---

## 📄 License

MIT License - Free to use in personal and commercial projects.

See the [LICENSE](https://github.com/Nem-Tudo/ntpopups/blob/main/LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Issues** - Found a bug? [Open an issue](https://github.com/Nem-Tudo/ntPopups/issues)
2. **Suggest Features** - Have an idea? Share it in issues
3. **Submit PRs** - Improvements and fixes are appreciated
4. **Share Examples** - Show off your creative use cases

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Nem-Tudo/ntPopups.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build
```

---

## ⭐ Show Your Support

If ntPopups helped you build better user experiences, please:

- ⭐ **Star the repo** on [GitHub](https://github.com/Nem-Tudo/ntPopups)
- 📢 **Share it** with other developers
- 💬 **Provide feedback** tohelp improve the library
- 🐛 **Report issues** you encounter
- 💡 **Suggest features** you'd like to see

---

## 🙏 Acknowledgments

Special thanks to:

- The React community for inspiration and feedback
- All contributors who helped improve this library
- Users who reported bugs and suggested features
- Everyone who starred the project and spread the word

---

## 📞 Support & Community

- **Questions?** Open a [GitHub Discussion](https://github.com/Nem-Tudo/ntPopups/discussions)
- **Bug Reports** [GitHub Issues](https://github.com/Nem-Tudo/ntPopups/issues)
- **Feature Requests** [GitHub Issues](https://github.com/Nem-Tudo/ntPopups/issues)

---

## 🎯 Common Patterns

### Global Error Handler

```jsx
// utils/errorHandler.js
import useNtPopups from 'ntpopups'

export function useErrorHandler() {
  const { openPopup } = useNtPopups()
  
  const handleError = (error) => {
    openPopup('generic', {
      data: {
        title: 'Error',
        message: error.message || 'An unexpected error occurred',
        icon: '❌',
        closeLabel: 'OK'
      }
    })
  }
  
  return { handleError }
}

// Usage in components
const { handleError } = useErrorHandler()

try {
  await riskyOperation()
} catch (error) {
  handleError(error)
}
```

### Confirmation Hook

```jsx
// hooks/useConfirm.js
import { useCallback } from 'react'
import useNtPopups from 'ntpopups'

export function useConfirm() {
  const { openPopup } = useNtPopups()
  
  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      openPopup('confirm', {
        data: {
          title: options.title || 'Confirm',
          message: options.message,
          confirmLabel: options.confirmLabel || 'Confirm',
          cancelLabel: options.cancelLabel || 'Cancel',
          confirmStyle: options.style || 'default',
          icon: options.icon || '❓',
          onChoose: (confirmed) => resolve(confirmed)
        },
        closeOnClickOutside: false
      })
    })
  }, [openPopup])
  
  return confirm
}

// Usage
const confirm = useConfirm()

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete Item',
    message: 'This action cannot be undone',
    confirmLabel: 'Delete',
    style: 'Danger'
  })
  
  if (confirmed) {
    await deleteItem()
  }
}
```

### Toast Notifications

```jsx
// utils/toast.js
import useNtPopups from 'ntpopups'

export function useToast() {
  const { openPopup } = useNtPopups()
  
  const toast = {
    success: (message) => {
      openPopup('generic', {
        data: {
          message,
          icon: '✅',
          closeLabel: 'OK'
        },
        timeout: 3000,
        hiddenHeader: true
      })
    },
    error: (message) => {
      openPopup('generic', {
        data: {
          message,
          icon: '❌',
          closeLabel: 'OK'
        },
        timeout: 5000,
        hiddenHeader: true
      })
    },
    info: (message) => {
      openPopup('generic', {
        data: {
          message,
          icon: 'ℹ️',
          closeLabel: 'OK'
        },
        timeout: 3000,
        hiddenHeader: true
      })
    },
    warning: (message) => {
      openPopup('generic', {
        data: {
          message,
          icon: '⚠️',
          closeLabel: 'OK'
        },
        timeout: 4000,
        hiddenHeader: true
      })
    }
  }
  
  return toast
}

// Usage
const toast = useToast()

toast.success('Profile updated successfully!')
toast.error('Failed to save changes')
toast.info('You have 3 new messages')
toast.warning('Your session will expire soon')
```

---

## 📖 FAQ

### Can I use ntPopups with TypeScript?

Yes! ntPopups is built with TypeScript support. All types are exported and you can use them in your project:

```typescript
import useNtPopups, { PopupSettings } from 'ntpopups'

const settings: PopupSettings = {
  data: {
    title: 'Hello',
    message: 'World'
  }
}
```

### How do I change the language dynamically?

The language prop on `NtPopupProvider` can be changed dynamically:

```jsx
const [language, setLanguage] = useState('en')

<NtPopupProvider language={language} theme="white">
  <button onClick={() => setLanguage('ptbr')}>
    Switch to Portuguese
  </button>
</NtPopupProvider>
```

### Can I use custom fonts?

Yes! Simply override the font CSS variable:

```css
.ntpopups-overlay {
  --ntpopups-font-family: 'Your Custom Font', sans-serif;
}
```

### How do I make a popup fullscreen on mobile?

Use CSS to customize the container:

```css
@media (max-width: 768px) {
  .ntpopups-container {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
  }
}
```

### Can I nest popups?

While technically possible with `keepLast: true`, it's not recommended for UX reasons. Instead, close the first popup and open the second:

```jsx
openPopup('confirm', {
  data: {
    onChoose: (confirmed) => {
      if (confirmed) {
        openPopup('form', { /* ... */ })
      }
    }
  }
})
```

### How do I prevent closing a popup?

Set both `closeOnEscape` and `closeOnClickOutside` to `false`, and use `requireAction: true`:

```jsx
openPopup('generic', {
  closeOnEscape: false,
  closeOnClickOutside: false,
  requireAction: true,
  data: { /* ... */ }
})
```

---

## 🌟 Showcase

Built something amazing with ntPopups? We'd love to feature it! Share your project:

- Create a pull request to add it to this section
- Tweet it with #ntPopups
- Open an issue with your project link

---

<div align="center">

## 🚀 ntPopups

**Easy and powerful popup library for React**

Made with ❤️ by [Nem Tudo](https://nemtudo.me)

**[Get Started](https://ntpopups.nemtudo.me) • [Live Demo](https://ntpopups.nemtudo.me/demo) • [GitHub](https://github.com/Nem-Tudo/ntPopups)**

---

If this library helped you, please consider:

⭐ **Starring the repo** • 🐛 **Reporting issues** • 💡 **Suggesting features** • 🤝 **Contributing**

---

© 2024 Nem Tudo. Licensed under MIT.

</div>