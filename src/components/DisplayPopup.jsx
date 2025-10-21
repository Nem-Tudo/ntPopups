import React from "react";

// Import all default CSS modules internally
import styles from "../styles/DisplayPopup.module.css";
import cropImageStyles from "../styles/CropImage.module.css";
import formStyles from "../styles/Form.module.css";
// ... other specific styles (e.g., genericStyles, cropImageStyles)

// Internal map to link popup types to their specific CSS modules
const defaultCssModules = {
    "crop_image": cropImageStyles,
    "form": formStyles,
};

/**
 * Component responsible for rendering all active popups.
 * @param {Object} properties
 * @param {import('../utils/types').PopupData[]} properties.popups - Array of active (visible) popups.
 * @param {Function} properties.closePopup - Function to close a specific popup.
 * @param {Object.<string, import("react").ComponentType<any>>} properties.popupComponents - Map of all registered components.
 * @param {(key: string) => string} properties.translate - Function to translate strings (passada do Provider).
 * @param {String} properties.theme - Theme
 */
export default function DisplayPopup({
    popups,
    closePopup,
    popupComponents,
    translate,
    theme
}) {

    /**
     * Maps the popup type string to its corresponding React component.
     * @param {import('../utils/types').PopupData} popup - Popup object from context state.
     * @returns {React.ReactNode | null}
     */
    const getPopupComponent = (popup) => {
        const { popupType, settings, id } = popup;

        // Retrieve the component from the merged map
        const Component = popupComponents[popupType];

        if (!Component) {
            console.log(`ntPopups Error: Unknown popup type: ${popupType}`);
            return (
                <dialog open style={{ padding: '20px', color: 'red' }}> {/* Semântico: Usa <dialog> para o erro */}
                    <h3>{translate('internalError.title')}</h3>
                    <p>{translate('internalError.message')} {popupType}</p>
                    <button type="button" onClick={() => closePopup(id, false)}>
                        {translate('util.closeLabel')}
                    </button>
                </dialog>
            );
        }

        // Prepare base props
        const componentProps = {
            closePopup: (hasAction = false) => closePopup(id, hasAction),
            ...settings,
            translate,
        };

        // Inject the main styles for common elements (header, body, footer)
        componentProps.popupstyles = {
            ...styles,
            ...(defaultCssModules[popupType] || {}),
        };

        // Return the component with prepared props
        return <Component {...componentProps} />;
    };

    return (
        // Semântico: Usa <main> ou <div> com role="region" para o contêiner principal de um aplicativo
        <main className={`${styles.ntPopups} ntpopups-main ${styles[`${theme}Theme`]} ntpopups-${theme}-theme`}>
            {popups.map((popup) => (
                // OVERLAY/BACKDROP LAYER
                <div
                    key={popup.id}
                    // Apply default CSS class or custom fallback class
                    className={`${styles.popupsOverlay} ntpopups-overlay`}
                    style={{ zIndex: popup.zIndex }}
                    // Semântico: Adiciona role="dialog" para o contexto de um modal, se a tag <dialog> não for o container direto.
                    role="presentation" // 'presentation' é mais seguro para o overlay, que apenas envolve o <dialog> real.
                >
                    {/* POPUP CONTAINER */}
                    {/* Semântico: Substitui o <div> do container principal do popup por <dialog> */}
                    <dialog
                        open // O atributo 'open' garante que o browser trate como um modal visível.
                        data-popup-id={popup.id}
                        // Apply default CSS class or custom fallback class
                        className={`${styles.popup} ntpopups-container${popup.settings.hiddenHeader ? ` ${styles.hiddenHeader} ` : " "}${popup.settings.hiddenFooter ? ` ${styles.hiddenFooter} ` : " "}${popup.settings.disableOpenAnimation ? ` ${styles.disableOpenAnimation} ` : " "}`}
                        style={popup.settings.maxWidth ? { maxWidth: popup.settings.maxWidth } : {}}
                    >
                        {/* SPECIFIC POPUP CONTENT */}
                        {getPopupComponent(popup)}
                    </dialog>
                </div>
            ))}
        </main>
    );
}