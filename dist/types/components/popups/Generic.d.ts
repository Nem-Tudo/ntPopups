/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.message
 * @param {string} [properties.title="Message"]
 * @param {string} [properties.closeLabel="Cancel"]
 * @param {Object} [properties.popupstyles]
 */
export default function Generic({ closePopup, message, title, closeLabel, popupstyles }: {
    closePopup: (status: boolean) => void;
    message: string;
    title?: string;
    closeLabel?: string;
    popupstyles?: any;
}): React.JSX.Element;
import React from "react";
