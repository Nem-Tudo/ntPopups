/**
 * Placeholder for Crop Image Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.title
 * @param {Object} [properties.popupstyles]
 */
export default function CropImage({ closePopup, title, popupstyles }: {
    closePopup: (status: boolean) => void;
    title: string;
    popupstyles?: any;
}): React.JSX.Element;
import React from 'react';
