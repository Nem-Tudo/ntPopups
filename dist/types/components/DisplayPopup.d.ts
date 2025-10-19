/**
 * Component responsible for rendering all active popups.
 * @param {Object} properties
 * @param {import('../utils/types').PopupData[]} properties.popups - Array of active (visible) popups.
 * @param {Function} properties.closePopup - Function to close a specific popup.
 * @param {Object.<string, import("react").ComponentType<any>>} properties.popupComponents - Map of all registered components.
 * @param {boolean} properties.useDefaultCss - Flag to use default CSS.
 */
export default function DisplayPopup({ popups, closePopup, popupComponents, useDefaultCss }: {
    popups: import("../utils/types").PopupData[];
    closePopup: Function;
    popupComponents: {
        [x: string]: import("react").ComponentType<any>;
    };
    useDefaultCss: boolean;
}): React.JSX.Element;
import React from "react";
