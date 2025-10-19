import React from "react";

/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.message
 * @param {string} [properties.title="Message"]
 * @param {string} [properties.closeLabel="Cancel"]
 * @param {Object} [properties.popupstyles]
 */
export default function Generic({ closePopup, message = "Message", title = "Title", closeLabel = "Close", popupstyles = {} }) {

    const classes = {
        title: popupstyles.title || "nt-popup-title",
        scrollable: popupstyles.scrollable || "nt-popup-scrollable",
        footer: popupstyles.footer || "nt-popup-footer",
        closeButton: popupstyles.closeButton || "nt-close-button",
    };

    return (
        <>
            <div className={classes.title}>
                {title}
            </div>

            <div className={classes.scrollable}>
                <p>{message}</p>
            </div>

            <div className={classes.footer}>
                <button
                    className={classes.closeButton}
                    onClick={() => closePopup(true)}
                >
                    {closeLabel}
                </button>
            </div>
        </>
    );
}