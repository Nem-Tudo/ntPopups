// /src/components/popups/Confirm.jsx

import React from "react";

/**
 * Default Confirmation Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {React.ReactNode} [properties.data.message]
 * @param {React.ReactNode} [properties.data.title]
 * @param {React.ReactNode} [properties.data.cancelLabel]
 * @param {React.ReactNode} [properties.data.confirmLabel]
 * @param {React.ReactNode} [properties.data.icon="ⓘ"]
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
        header: `${popupstyles.header} ntpopups-header`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        body: `${popupstyles.body} ntpopups-body`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        baseButton: `${popupstyles.baseButton} ntpopups-basebutton`,
        confirmButton: `${popupstyles.baseButton} ${popupstyles.confirmButton} ntpopups-basebutton ntpopups-confirm-button`,
    };

    return (
        <>

            <div className={classes.header}>
                <div className={classes.icon}>
                    {icon}
                </div>
                {finalTitle}
            </div>

            <div className={classes.body}>
                <p>{finalMessage}</p>
            </div>

            <div className={classes.footer}>
                <button
                    className={classes.baseButton}
                    base-button-style={"1"}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(false); // User chose Cancel
                    }}
                >
                    {finalCancelLabel}
                </button>
                <button
                    className={classes.confirmButton}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(true); // User chose Confirm
                    }}
                >
                    {finalConfirmLabel}
                </button>
            </div>
        </>
    );
}