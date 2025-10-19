// /src/components/popups/Confirm.jsx

import React from "react";
import { useNtPopups } from "../../contexts/PopupContext.jsx"; // <-- NOVO IMPORT para o hook

/**
 * Default Confirmation Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {string} [properties.data.message] // Remove default string here
 * @param {string} [properties.data.title] // Remove default string here
 * @param {string} [properties.data.cancelLabel] // Remove default string here
 * @param {string} [properties.data.confirmLabel] // Remove default string here
 * @param {string|React.ReactElement} [properties.data.icon="ⓘ"]
 * @param {(choice: boolean) => void} [properties.data.onChoose=() => {}]
 * @param {Object} [properties.popupstyles]
 */
export default function Confirm({
    closePopup,
    popupstyles = {},
    translate,
    data: {
        message,
        title,
        cancelLabel,
        confirmLabel,
        icon = "ⓘ",
        onChoose = () => { }
    } = {},
}) {
    const finalTitle = title ?? translate('confirm.title');
    const finalMessage = message ?? translate('confirm.message');
    const finalCancelLabel = cancelLabel ?? translate('util.cancelLabel');
    const finalConfirmLabel = confirmLabel ?? translate('util.confirmLabel');


    // Use generic or injected classes
    const classes = {
        // ... (classes permanecem as mesmas)
        title: `${popupstyles.title} ntpopups-title`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        scrollable: `${popupstyles.scrollable} ntpopups-scrollable`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        cancelButton: `${popupstyles.baseButton} ${popupstyles.cancelButton} ntpopups-basebutton ntpopups-cancel-button`,
        confirmButton: `${popupstyles.baseButton} ${popupstyles.confirmButton} ntpopups-basebutton ntpopups-confirm-button`,
    };

    return (
        <>
            <div className={classes.title}>
                <div className={classes.icon}>
                    {icon}
                </div>
                {finalTitle} {/* <-- USAR VALOR FINAL */}
            </div>

            <div className={classes.scrollable}>
                <p>{finalMessage}</p> {/* <-- USAR VALOR FINAL */}
            </div>

            <div className={classes.footer}>
                <button
                    className={classes.cancelButton}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(false); // User chose Cancel
                    }}
                >
                    {finalCancelLabel} {/* <-- USAR VALOR FINAL */}
                </button>
                <button
                    className={classes.confirmButton}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(true); // User chose Confirm
                    }}
                >
                    {finalConfirmLabel} {/* <-- USAR VALOR FINAL */}
                </button>
            </div>
        </>
    );
}