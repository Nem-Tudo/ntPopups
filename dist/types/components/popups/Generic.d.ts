/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {string} [properties.data.message="Message"]
 * @param {string} [properties.data.title="Title"]
 * @param {string} [properties.data.closeLabel="Close"]
 * @param {string|React.ReactElement} [properties.data.icon="ⓘ"]
 */
export default function Generic({ closePopup, popupstyles, translate, data: { message, title, closeLabel, icon } }: {
    closePopup: (hasAction: boolean) => void;
    popupstyles?: any;
    translate: (key: string) => string;
    data?: {
        message?: string;
        title?: string;
        closeLabel?: string;
        icon?: string | React.ReactElement;
    };
}): React.JSX.Element;
import React from "react";
