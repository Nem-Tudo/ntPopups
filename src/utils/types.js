// /src/utils/types.js

/**
 * ==============================================================================
 * NTPOPUPS CORE TYPES
 * ==============================================================================
 */

/**
 * @typedef {'confirm'|'generic'|'crop_image'|'form'|string} NtPopupType
 * A string literal representing the type of popup. Includes built-in types and custom types.
 */

/**
 * @typedef {(key: string) => string} TranslateFunction
 * Function signature for the i18n translation utility provided by the Provider.
 */

/**
 * @typedef {Object} PopupLifeCycleCallbacks
 * @property {(id: string) => void} [onOpen] - Callback function executed when the popup is opened. Receives the popup's unique ID.
 * @property {(hasAction: boolean, id: string) => void} [onClose] - Callback function executed when the popup is closed.
 * - `hasAction`: True if closed by a deliberate user action (e.g., confirm button), false otherwise (e.g., escape key, timeout).
 * - `id`: The popup's unique ID.
 */

/**
 * @typedef {Object} NtPopupBaseSettings
 * Base settings applicable to any popup type.
 * @property {string} [id] - Custom unique ID for the popup instance. If not provided, one will be generated.
 * @property {boolean} [closeOnEscape=true] - Allows closing with the ESC key. Can be overridden by global config.
 * @property {boolean} [closeOnClickOutside=true] - Allows closing by clicking the backdrop. Can be overridden by global config.
 * @property {boolean} [requireAction=false] - If true, the popup can only be closed via an internal component action (i.e., calling `closePopup(true)`).
 * @property {number} [timeout=0] - Time in milliseconds before the popup auto-closes. Disabled if 0 or undefined.
 * @property {boolean} [keepLast=false] - If true, the previously visible popup remains visible (underneath) when this new one opens.
 * @property {boolean} [hiddenTitle=false] - CSS utility: Hides the default popup title/header area.
 * @property {boolean} [hiddenFooter=false] - CSS utility: Hides the default popup footer area.
 * @property {boolean} [disableOpenAnimation=false] - CSS utility: Disables the opening transition.
 */

/**
 * ==============================================================================
 * BUILT-IN POPUP DATA TYPES
 * ==============================================================================
 */

/**
 * @typedef {Object} GenericPopupData
 * Data specific to the 'generic' popup type.
 * @property {string} [message] - The main message content. Defaults to i18n key 'generic.message'.
 * @property {string} [title] - The header title. Defaults to i18n key 'generic.title'.
 * @property {string} [closeLabel] - Text for the closing button. Defaults to i18n key 'util.ok'.
 * @property {string|React.ReactElement} [icon="ⓘ"] - Icon displayed next to the title.
 */

/**
 * @typedef {Object} ConfirmPopupData
 * Data specific to the 'confirm' popup type.
 * @property {string} [message] - The main confirmation message. Defaults to i18n key 'confirm.message'.
 * @property {string} [title] - The header title. Defaults to i18n key 'confirm.title'.
 * @property {string} [cancelLabel] - Text for the cancel button. Defaults to i18n key 'util.cancelLabel'.
 * @property {string} [confirmLabel] - Text for the confirmation button. Defaults to i18n key 'util.confirmLabel'.
 * @property {string|React.ReactElement} [icon="ⓘ"] - Icon displayed next to the title.
 * @property {(choice: boolean) => void} [onChoose] - Callback executed when the user clicks Confirm (true) or Cancel (false).
 */

/**
 * @typedef {Object} CropImageResult
 * The object returned by the onCrop callback.
 * @property {Blob} blob - The cropped image as a Blob object.
 * @property {string} base64 - The cropped image as a Base64 data URL.
 * @property {File} file - The cropped image as a File object (with a generated filename).
 */

/**
 * @typedef {Object} CropImagePopupData
 * Data specific to the 'crop_image' popup type.
 * @property {File|string} [image] - The source image (File object or Base64/URL string).
 * @property {'square'|'circle'} [format='circle'] - The shape of the crop area.
 * @property {(result: CropImageResult) => void} [onCrop] - Callback executed upon successful crop.
 */

/**
 * ------------------- Form Components -------------------
 * @typedef {'text'|'textarea'|'checkbox'|string} FormComponentType
 *
 * @typedef {Object} FormComponentBase
 * @property {string} id - Unique identifier for the field (used as the key in the response object).
 * @property {string} label - Field label displayed to the user.
 * @property {boolean} [disabled=false] - If true, the field is disabled and not validated.
 *
 * @typedef {FormComponentBase} FormTextComponent
 * @property {'text'|'textarea'} type
 * @property {string} [defaultValue=""]
 * @property {boolean} [required=false] - If true, value must not be empty (after trim).
 * @property {number} [minLength] - Minimum string length.
 * @property {number} [maxLength] - Maximum string length.
 * @property {string} [matchRegex] - A regular expression string to validate the value against.
 *
 * @typedef {FormComponentBase} FormCheckboxComponent
 * @property {'checkbox'} type
 * @property {boolean} [defaultValue=false]
 *
 * @typedef {FormTextComponent | FormCheckboxComponent} FormComponent
 * A single component (input field) definition for the 'form' popup.
 *
 * @typedef {FormComponent | FormComponent[]} FormComponentOrRow
 * A single component, or an array of components to be placed in an inline row.
 *
 * @typedef {Object} FormPopupData
 * Data specific to the 'form' popup type.
 * @property {string} [title] - The header title. Defaults to i18n key 'form.title'.
 * @property {string} [doneLabel] - Text for the confirmation button. Defaults to i18n key 'util.done'.
 * @property {string|React.ReactElement} [icon="ⓘ"] - Icon displayed next to the title.
 * @property {FormComponentOrRow[]} [components] - Array defining the fields/layout of the form.
 * @property {(values: Object.<string, any>) => void} [onResponse] - Callback executed upon form submission with all field values.
 */

/**
 * @typedef {Object} PopupSettings
 * The complete structure for the settings object passed to `openPopup`.
 * @property {GenericPopupData | ConfirmPopupData | CropImagePopupData | FormPopupData | Object} [data] - Data payload specific to the popup type.
 * * @augments NtPopupBaseSettings
 * @augments PopupLifeCycleCallbacks
 */

/**
 * ==============================================================================
 * CONTEXT AND PROVIDER TYPES
 * ==============================================================================
 */

/**
 * @typedef {Object} PopupData
 * Internal structure representing an active popup in the context state.
 * @property {string} id - The unique ID of the popup.
 * @property {NtPopupType} popupType - The registered type of the popup.
 * @property {PopupSettings & {id: string}} settings - The merged settings for this instance.
 * @property {number} zIndex - The current z-index for stacking.
 * @property {string|null} replacedPopupId - If this popup replaced a previous one, its ID is stored here.
 * @property {boolean} hidden - True if the popup is temporarily hidden (replaced by another).
 */

/**
 * @typedef {Object} GlobalDefaultSettings
 * Structure for defining settings overrides in the Provider's `config`.
 * @property {NtPopupBaseSettings} [all] - Defaults applied to ALL popup types.
 * @property {NtPopupBaseSettings} [generic] - Defaults applied to the 'generic' type only.
 * @property {NtPopupBaseSettings} [confirm] - Defaults applied to the 'confirm' type only.
 * @property {NtPopupBaseSettings} [crop_image] - Defaults applied to the 'crop_image' type only.
 * @property {NtPopupBaseSettings} [form] - Defaults applied to the 'form' type only.
 * @property {NtPopupBaseSettings} [customType] - Defaults applied to any registered custom type.
 */

/**
 * @typedef {Object} NtPopupConfig
 * The configuration object for the NtPopupProvider.
 * @property {GlobalDefaultSettings} [defaultSettings] - Definitions for overriding default behavior.
 */

/**
 * @typedef {Object} PopupContextValue
 * The object returned by the `useNtPopups` hook.
 * @property {PopupData[]} popups - An array of all currently active (visible) popups.
 * @property {(popupType: NtPopupType, settings?: PopupSettings) => string|null|Promise<string|null>} openPopup - Function to open a popup. Returns the new popup's ID.
 * @property {(popupIdOrHasAction?: string|boolean, hasActionParam?: boolean) => void} closePopup - Function to close a popup by ID or the top one.
 * @property {() => void} closeAllPopups - Function to close all open popups.
 * @property {(popupId: string) => boolean} isPopupOpen - Checks if a popup with the given ID is currently open and visible.
 * @property {(popupId: string) => PopupData|null} getPopup - Gets the configuration object for an open and visible popup.
 * @property {'en'|'ptbr'|string} language - The active language code.
 * @property {TranslateFunction} translate - Function to translate strings based on the active language.
 */

export { };