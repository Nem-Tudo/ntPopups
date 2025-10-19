/**
 * Placeholder for Crop Image Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {string} properties.title
 * @param {Object} [properties.popupstyles]
 */
export default function CropImage({ closePopup, title, popupstyles }: {
    closePopup: (hasAction: boolean) => void;
    title: string;
    popupstyles?: any;
}): React.JSX.Element;
import React from 'react';
