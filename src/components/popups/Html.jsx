import React from "react";

/**
 * Html custom popup
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {React.ReactNode | ((params: {closePopup: (hasAction: boolean) => void, popupstyles: object}) => React.ReactNode)} [properties.data.html=""]
 */
export default function HtmlPopup({
    closePopup,
    popupstyles = {},
    translate,
    data: {
        html
    } = {}
}) {

    const finalHtml = typeof html === "function" ? html({ closePopup, popupstyles }) : html

    return (
        <>
            {finalHtml}
        </>
    );
}