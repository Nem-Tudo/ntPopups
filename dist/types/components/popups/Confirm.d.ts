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
export default function Confirm({ closePopup, message, title, cancelLabel, confirmLabel, onChoose, popupstyles }: {
    closePopup: (status: boolean) => void;
    message: string;
    title?: string;
    cancelLabel?: string;
    confirmLabel?: string;
    onChoose?: (choice: boolean) => void;
    popupstyles?: any;
}): React.JSX.Element;
import React from "react";
