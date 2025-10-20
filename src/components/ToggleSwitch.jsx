import React from "react";
import styles from "../styles/ToggleSwitch.module.css";

/**
 * Toggle switch com a exata mesma funcionalidade de um input checkbox
 * @param {Object} props - Passagem de propriedades pro componente
 */
export default function ToggleSwitch(props) {
    return <input {...props} type="checkbox" className={styles.toggleSwitch} />
}