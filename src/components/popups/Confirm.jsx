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
 * @param {'default'|'Secondary'|'Success'|'Danger'} [properties.data.confirmStyle='default']
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
        confirmStyle,
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

    const nameToStyle = {
        "default": "0",
        "Secondary": "1",
        "Success": "3",
        "Danger": "4",
    }

    return (
        <>
            <header className={classes.header}>
                <div className={classes.icon} aria-hidden="true">
                    {icon}
                </div>
                {finalTitle} {/* Semântico: Usa h2 para o título do popup */}
            </header>

            <section className={classes.body}> {/* Semântico: Usa section para o corpo principal */}
                <p>{finalMessage}</p>
            </section>

            <footer className={classes.footer}> {/* Semântico: Usa footer para a área de botões */}
                <button
                    className={classes.baseButton}
                    base-button-style={"1"}
                    type="button"
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(false); // User chose Cancel
                    }}
                >
                    {finalCancelLabel}
                </button>
                <button
                    autoFocus={true}
                    className={classes.confirmButton}
                    base-button-style={nameToStyle[confirmStyle]}
                    type="button"
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(true); // User chose Confirm
                    }}
                >
                    {finalConfirmLabel}
                </button>
            </footer>
        </>
    );
}