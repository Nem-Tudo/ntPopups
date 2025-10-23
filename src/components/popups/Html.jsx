import React from "react";

/**
 * Html custom popup
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {React.ReactNode} [properties.data.html=""]
 */
export default function HtmlPopup({
    closePopup,
    popupstyles = {},
    translate,
    data: {
        html
    } = {}
}) {


    return (
        <>
            {html}
        </>
    );
}