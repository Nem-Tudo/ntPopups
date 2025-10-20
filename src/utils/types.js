// /src/utils/types.js (Conteúdo Editado)

/**
 * @typedef {Object} PopupData
 * @property {string} id - Unique identifier for the popup.
 * @property {string} popupType - The type string used to map to a component.
 * @property {Object} settings - All configuration passed to openPopup.
 * @property {number} zIndex - CSS Z-index for layering.
 * @property {boolean} hidden - True if the popup is temporarily hidden (replaced).
 * @property {string | null} replacedPopupId - ID of the popup that was replaced.
 */

// ------------------------------------------------------------------
// TIPOS BASE
// ------------------------------------------------------------------

/**
 * @typedef {Object} PopupContextValue
 * @property {PopupData[]} popups - Array of currently active (visible) popups.
 * @property {(popupType: 'generic'|'confirm'|'crop_image'|'form'|string, settings?: {
 * id?: string,
 * keepLast?: boolean,
 * onClose?: Function,
 * onOpen?: Function,
 * closeOnEscape?: boolean,
 * closeOnClickOutside?: boolean,
 * requireAction?: boolean,
 * hiddenTitle?: boolean,
 * hiddenFooter?: boolean,
 * disableOpenAnimation?: boolean,
 * timeout?: number,
 * data?: Object
 * }) => Promise<string | null> | string | null} openPopup - Function to open a new popup. Returns the popup ID.
 * @property {(popupIdOrHasAction?: string | boolean, hasActionParam?: boolean) => void} closePopup - Function to close a specific or the topmost popup.
 * @property {() => void} closeAllPopups - Function to close all popups.
 * @property {(popupId: string) => boolean} isPopupOpen - Checks if a specific popup is open and visible.
 * @property {(popupId: string) => PopupData | null} getPopup - Retrieves data for an active popup.
 * * // PROPRIEDADES DE INTERNACIONALIZAÇÃO
 * @property {string} language - Idioma ativo configurado no Provider (ex: "en", "pt").
 * @property {(key: string) => string} translate - Função para traduzir strings (key: 'popup.string').
 */


/**
 * @typedef {Object} NtPopupConfig
 * @property {Object} [defaultSettings] - Global and type-specific default settings.
 * @property {Object} [defaultSettings.all] - Settings applied to all popup types.
 * @property {Object.<string, Object>} [defaultSettings] - Settings applied to specific popup types (e.g., { confirm: { timeout: 5000 } }).
 */

export { };