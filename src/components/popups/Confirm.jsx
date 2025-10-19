import React from "react";
import { CiCircleAlert } from "react-icons/ci";

/**
 * Default Confirmation Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.message
 * @param {string} [properties.title="Message"]
 * @param {string} [properties.cancelLabel="Cancel"]
 * @param {string} [properties.confirmLabel="Confirm"]
 * @param {(choice: boolean) => void} [properties.onChoose=() => {}]
 * @param {Object} [properties.popupstyles]
 */
export default function Confirm({ closePopup, message = "Message", title = "Title", cancelLabel = "Cancel", confirmLabel = "Confirm", onChoose = () => { }, popupstyles = {} }) {

    // Use generic or injected classes
    const classes = {
        title: popupstyles.title || "nt-popup-title",
        scrollable: popupstyles.scrollable || "nt-popup-scrollable",
        footer: popupstyles.footer || "nt-popup-footer",
        cancelButton: popupstyles.cancelButton || "nt-cancel-button",
        confirmButton: popupstyles.confirmButton || "nt-confirm-button",
    };

    return (
        <>
            <div className={classes.title}>
                <CiCircleAlert />
                {title}
            </div>

            <div className={classes.scrollable}>
                <p>{message}</p>
            </div>

            <div className={classes.footer}>
                <button
                    className={classes.cancelButton}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(false); // User chose Cancel
                    }}
                >
                    {cancelLabel}
                </button>
                <button
                    className={classes.confirmButton}
                    onClick={() => {
                        closePopup(true); // Intentional close
                        onChoose(true); // User chose Confirm
                    }}
                >
                    {confirmLabel}
                </button>
            </div>
        </>
    );
}