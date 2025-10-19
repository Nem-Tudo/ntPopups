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
export default function Confirm({ closePopup, popupstyles, translate, data: { message, title, cancelLabel, confirmLabel, icon, onChoose }, }: {
    closePopup: (hasAction: boolean) => void;
    translate: (key: string) => string;
    data?: {
        message?: string;
        title?: string;
        cancelLabel?: string;
        confirmLabel?: string;
        icon?: string | React.ReactElement;
        onChoose?: (choice: boolean) => void;
    };
    popupstyles?: any;
}): React.JSX.Element;
import React from "react";
