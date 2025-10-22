import React from "react";

/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {React.ReactNode} [properties.data.message="Message"]
 * @param {React.ReactNode} [properties.data.title="Title"]
 * @param {React.ReactNode} [properties.data.closeLabel="Close"]
 * @param {React.ReactNode} [properties.data.icon="ⓘ"]
 */
export default function Generic({
    closePopup,
    popupstyles = {},
    translate,
    data: {
        message,
        title,
        closeLabel,
        icon = "ⓘ",
    } = {}
}) {

    const finalTitle = title ?? translate('generic.title');
    const finalMessage = message ?? translate('generic.message');
    const finalCloseLabel = closeLabel ?? translate('util.ok');

    const classes = {
        header: `${popupstyles.header} ntpopups-header`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        body: `${popupstyles.body} ntpopups-body`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        closeButton: `${popupstyles.baseButton} ntpopups-basebutton`,
    };

    return (
        <>
            <header className={classes.header}>
                <div className={classes.icon}>
                    {icon}
                </div>
                {finalTitle}
            </header>

            <section className={classes.body}>
                <p>{finalMessage}</p>
            </section>

            <footer className={classes.footer}>
                <button
                    autoFocus={true}
                    className={classes.closeButton}
                    onClick={() => closePopup(true)}
                >
                    {finalCloseLabel}
                </button>
            </footer>
        </>
    );
}