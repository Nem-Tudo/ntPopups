import React, { useRef, useState } from 'react';
import styles from "../../../../styles/FileInput.module.css";


export default function FileInput(props) {
    // Desestrutura props para separar o que é do componente do que vai para o <input>
    const {
        translate,
        placeholder = props.translate('file.fileSelect'),
        onChange,
        ...inputProps // Tudo o que sobrar (incluindo 'multiple', 'disabled', 'accept', etc.)
    } = props;

    // 1. Criar uma referência para o input file nativo
    const fileInputRef = useRef(null);
    // 2. Estado para armazenar o nome/informação dos arquivos selecionados
    const [fileInfo, setFileInfo] = useState(null);

    // 3. Função para simular o clique no input file nativo
    const handleContainerClick = () => {
        // Verifica se o input não está desabilitado antes de clicar
        if (!inputProps.disabled) {
            fileInputRef.current.click();
        }
    };

    // 4. Função para capturar a seleção dos arquivos
    const handleFileChange = (event) => {
        const files = event.target.files;
        let newFileInfo = null;

        if (files && files.length > 0) {
            if (files.length === 1) {
                // Apenas um arquivo: exibe o nome
                newFileInfo = files[0].name;
            } else {
                newFileInfo = translate('file.selectedFiles')(files.length);

            }
        } else {
            newFileInfo = null;
        }

        setFileInfo(newFileInfo);

        // Chamar a função onChange original, se existir
        if (onChange) {
            onChange(event);
        }
    };

    // Determina o texto a ser exibido
    const displayText = fileInfo || placeholder;

    return (
        <div
            className={styles.container}
            onClick={handleContainerClick}
        >
            {/* Texto centralizado: informação dos arquivos ou placeholder */}
            <p className={styles.placeholder}>
                {displayText}
            </p>

            {/* Input file nativo, escondido, mas referenciado */}
            <input
                type="file"
                ref={fileInputRef}
                // Repassa as props restantes (agora SÓ as que são válidas para o input)
                {...inputProps}
                // Sobrescreve o onChange para usar o nosso handler
                onChange={handleFileChange}
                className={styles.hidden}
            />
        </div>
    );
}