/**
 * Component responsible for rendering all active popups.
 * @param {Object} properties
 * @param {import('../utils/types').PopupData[]} properties.popups - Array of active (visible) popups.
 * @param {Function} properties.closePopup - Function to close a specific popup.
 * @param {Object.<string, import("react").ComponentType<any>>} properties.popupComponents - Map of all registered components.
 * @param {(key: string) => string} properties.translate - Function to translate strings (passada do Provider). <-- NOVA PROP
 * @param {String} properties.theme - Theme
 */
export default function DisplayPopup({ popups, closePopup, popupComponents, translate, theme }: {
    popups: import("../utils/types").PopupData[];
    closePopup: Function;
    popupComponents: {
        [x: string]: import("react").ComponentType<any>;
    };
    translate: (key: string) => string;
    theme: string;
}): React.JSX.Element;
import React from "react";
