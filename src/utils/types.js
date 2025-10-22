import React from "react";
/**
 * ==============================================================================
 * NTPOPUPS CORE TYPES
 * ==============================================================================
 */

/**
 * @typedef {'confirm'|'generic'|'crop_image'|'form'|(string & {})} NtPopupType
 * A string literal representing the type of popup. Includes built-in types and custom types.
 */

/**
 * @typedef {(key: string) => string} TranslateFunction
 * Function signature for the i18n translation utility provided by the Provider.
 */

/**
 * @typedef {object} PopupLifeCycleCallbacks
 * @property {(id: string) => void} [onOpen] - Callback function executed when the popup is opened. Receives the popup's unique ID.
 * @property {(hasAction: boolean, id: string) => void} [onClose] - Callback function executed when the popup is closed.
 * - `hasAction`: True if closed by a deliberate user action (e.g., confirm button), false otherwise (e.g., escape key, timeout).
 * - `id`: The popup's unique ID.
 */

/**
 * @typedef {object} NtPopupBaseSettings
 * Base settings applicable to any popup type.
 * @property {string} [id] - Custom unique ID for the popup instance. If not provided, one will be generated.
 * @property {object} [popupstyles={}] - Popup Styles
 * @property {boolean} [closeOnEscape=true] - Allows closing with the ESC key. Can be overridden by global config.
 * @property {boolean} [closeOnClickOutside=true] - Allows closing by clicking the backdrop. Can be overridden by global config.
 * @property {boolean} [requireAction=false] - If true, the popup can only be closed via an internal component action (i.e., calling `closePopup(true)`).
 * @property {number} [timeout=0] - Time in milliseconds before the popup auto-closes. Disabled if 0 or undefined.
 * @property {boolean} [keepLast=false] - If true, the previously visible popup remains visible (underneath) when this new one opens.
 * @property {boolean} [hiddenHeader=false] - CSS utility: Hides the default popup header area.
 * @property {boolean} [hiddenFooter=false] - CSS utility: Hides the default popup footer area.
 * @property {boolean} [disableOpenAnimation=false] - CSS utility: Disables the opening transition.
 * @property {string} [maxWidth] - CSS utility: Max popup width
 * @property {string} [minWidth] - CSS utility: Max popup width
 */

/**
 * ==============================================================================
 * BUILT-IN POPUP DATA TYPES
 * ==============================================================================
 */

/**
 * @typedef {object} GenericPopupData
 * Data specific to the 'generic' popup type.
 * @property {React.ReactNode} [message] - [generic] The main message content. Defaults to i18n key 'generic.message'.
 * @property {React.ReactNode} [title] - [generic] The header title. Defaults to i18n key 'generic.title'.
 * @property {React.ReactNode} [closeLabel] - [generic] Text for the closing button. Defaults to i18n key 'util.ok'.
 * @property {React.ReactNode} [icon="ⓘ"] - [generic] Icon displayed next to the title.
 */

/**
 * @typedef {object} ConfirmPopupData
 * Data specific to the 'confirm' popup type.
 * @property {React.ReactNode} [message] - [confirm] The main confirmation message. Defaults to i18n key 'confirm.message'.
 * @property {React.ReactNode} [title] - [confirm] The header title. Defaults to i18n key 'confirm.title'.
 * @property {React.ReactNode} [cancelLabel] - [confirm] Text for the cancel button. Defaults to i18n key 'util.cancelLabel'.
 * @property {React.ReactNode} [confirmLabel] - [confirm] Text for the confirmation button. Defaults to i18n key 'util.confirmLabel'.
 * @property {'default'|'Secondary'|'Success'|'Danger'} [confirmStyle] - [confirm] The confirm button css style.
 * @property {React.ReactNode} [icon="ⓘ"] - [confirm] Icon displayed next to the title.
 * @property {(choice: boolean) => void} [onChoose] - [confirm] Callback executed when the user clicks Confirm (true) or Cancel (false).
 */

/**
 * @typedef {object} CropImageResult
 * The object returned by the onCrop callback.
 * @property {Blob} blob - The cropped image as a Blob object.
 * @property {string} base64 - The cropped image as a Base64 data URL.
 * @property {File} file - The cropped image as a File object (with a generated filename).
 */

/**
 * @typedef {object} CropImagePopupData
 * Data specific to the 'crop_image' popup type.
 * @property {File|string} [image] - [crop_image] The source image (File object or Base64/URL string).
 * @property {'square'|'circle'} [format='circle'] - [crop_image] The shape of the crop area.
 * @property {(result: CropImageResult) => void} [onCrop] - [crop_image] Callback executed upon successful crop.
 */

/**
 * ------------------- Form Components -------------------
 *
 * @typedef {object} FormComponentBase
 * @property {string} id - Unique identifier for the field (used as the key in the response object).
 * @property {'text'|'textarea'|'checkbox'} type - Input type
 * @property {string} label - Field label displayed to the user.
 * @property {boolean} [disabled=false] - If true, the field is disabled and not validated.
 */

/**
 * @typedef {object} FormTextProps
 * @property {string} [defaultValue=""] - [text] Default value
 * @property {boolean} [required=false] - [text] If true, value must not be empty (after trim).
 * @property {string} [placeholder=""] - [text] Placeholder
 * @property {number} [minLength] - [text] Minimum string length.
 * @property {number} [maxLength] - [text] Maximum string length.
 * @property {string} [matchRegex] - [text] A regular expression string to validate the value against.
 */

/**
 * @typedef {object} FormTextAreaProps
 * @property {string} [defaultValue=""] - [textarea] Default value
 * @property {boolean} [required=false] - [textarea] If true, value must not be empty (after trim).
 * @property {string} [placeholder=""] - [textarea] Placeholder
 * @property {boolean} [disableResize=false] - [textarea] Disable textarea resize
 * @property {number} [minLength] - [textarea] Minimum string length.
 * @property {number} [maxLength] - [textarea] Maximum string length.
 * @property {string} [matchRegex] - [textarea] A regular expression string to validate the value against.
 */

/**
 * @typedef {object} FormCheckboxProps
 * @property {boolean} [defaultValue=false]
 */

/**
 * @typedef {FormComponentBase & FormTextProps} FormTextComponent
 * Componente de entrada de texto (text ou textarea).
 */

/**
 * @typedef {FormComponentBase & FormTextAreaProps} FormTextAreaComponent
 * Componente de entrada de texto (text ou textarea).
 */

/**
 * @typedef {FormComponentBase & FormCheckboxProps} FormCheckboxComponent
 * Componente de caixa de seleção (checkbox).
 */

/**
 * @typedef {FormTextComponent | FormTextAreaComponent | FormCheckboxComponent} FormComponent
 * A single component (input field) definition for the 'form' popup.
 */

/**
 * @typedef {FormComponent | FormComponent[]} FormComponentOrRow
 * A single component, or an array of components to be placed in an inline row.
 */

/**
 * @typedef {object} FormPopupData
 * Data specific to the 'form' popup type.
 * @property {React.ReactNode} [title] - [form] The header title. Defaults to i18n key 'form.title'.
 * @property {React.ReactNode} [doneLabel] - [form] Text for the confirmation button. Defaults to i18n key 'util.done'.
 * @property {React.ReactNode} [icon="ⓘ"] - [form] Icon displayed next to the title.
 * @property {FormComponentOrRow[]} [components] - [form] Array defining the fields/layout of the form.
 * @property {(values: Object.<string, any>) => void} [onSubmit] - [form] Callback executed upon form submission with all field values.
 * @property {(params: { changedComponentState: { id: string, value: any, isValid: boolean }, formState: { values: Object.<string, any>, isValid: boolean }}) => void} [onChange] - [form] Callback executed whenever any form field changes.
 */

/**
 * @typedef {NtPopupBaseSettings & PopupLifeCycleCallbacks & {
 * data?: GenericPopupData | ConfirmPopupData | CropImagePopupData | FormPopupData | object
 * }} PopupSettings
 */

/**
 * @typedef {Object.<string, string>} PopupStyles
 * A map of CSS module classes injected into the popup component (e.g., popupstyles.title, popupstyles.baseButton).
 */

/**
 * @typedef {object} BasePopupProps
 * The common props passed to all internal and custom popup components.
 * @property {(hasAction?: boolean) => void} closePopup - Function to close the current popup instance.
 * @property {TranslateFunction} translate - Function to translate strings.
 * @property {PopupStyles} popupstyles - The merged CSS module classes for styling.
 */

/**
 * ==============================================================================
 * CONTEXT AND PROVIDER TYPES
 * ==============================================================================
 */

/**
 * @typedef {object} PopupData
 * Internal structure representing an active popup in the context state.
 * @property {string} id - The unique ID of the popup.
 * @property {NtPopupType} popupType - The registered type of the popup.
 * @property {PopupSettings & NtPopupBaseSettings & {id: string}} settings - The merged settings for this instance, including resolved base settings.
 * @property {number} zIndex - The current z-index for stacking.
 * @property {string|null} replacedPopupId - If this popup replaced a previous one, its ID is stored here.
 * @property {boolean} hidden - True if the popup is temporarily hidden (replaced by another).
 */

/**
 * @typedef {object} GlobalDefaultSettings
 * Structure for defining settings overrides in the Provider's `config`.
 * @property {NtPopupBaseSettings} [all] - Defaults applied to ALL popup types.
 * @property {NtPopupBaseSettings} [generic] - Defaults applied to the 'generic' type only.
 * @property {NtPopupBaseSettings} [confirm] - Defaults applied to the 'confirm' type only.
 * @property {NtPopupBaseSettings} [crop_image] - Defaults applied to the 'crop_image' type only.
 * @property {NtPopupBaseSettings} [form] - Defaults applied to the 'form' type only.
 * @property {NtPopupBaseSettings} [customType] - Defaults applied to any registered custom type.
 */

/**
 * @typedef {object} NtPopupConfig
 * The configuration object for the NtPopupProvider.
 * @property {GlobalDefaultSettings} [defaultSettings] - Definitions for overriding default behavior.
 */

/**
 * @typedef {object} PopupContextValue
 * The object returned by the `useNtPopups` hook.
 * @property {PopupData[]} popups - An array of all currently active (visible) popups.
 * @property {(popupType: NtPopupType, settings?: PopupSettings) => string|null|Promise<string|null>} openPopup - Function to open a popup. Returns the new popup's ID.
 * @property {(popupIdOrHasAction?: string|boolean, hasActionParam?: boolean) => void} closePopup - Function to close a popup by ID or the top one.
 * @property {() => void} closeAllPopups - Function to close all open popups.
 * @property {(popupId: string) => boolean} isPopupOpen - Checks if a popup with the given ID is currently open and visible.
 * @property {(popupId: string) => PopupData|null} getPopup - Gets the configuration object for an open and visible popup.
 * @property {TranslateFunction} translate - Function to translate strings based on the active language.
 * @property {'en'|'ptbr'} language - The active language code.
 */

export { };