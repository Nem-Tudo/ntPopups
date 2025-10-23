import React, { useRef, useState, useCallback } from 'react';
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
    // 3. Novo Estado para feedback visual de Drag over
    const [isDragging, setIsDragging] = useState(false);

    // 4. Função para processar os arquivos e atualizar o estado
    const processFiles = useCallback((files) => {
        let newFileInfo = null;
        let fileList = null; // Para guardar a lista de arquivos para o onChange

        if (files && files.length > 0) {
            fileList = files; // Mantém a lista original

            if (files.length === 1) {
                // Apenas um arquivo: exibe o nome
                newFileInfo = files[0].name;
            } else {
                newFileInfo = translate('file.selectedFiles')(files.length);
            }
        } else {
            newFileInfo = null;
            fileList = null;
        }

        setFileInfo(newFileInfo);

        // Cria um objeto de evento simulado para compatibilidade com o onChange
        if (onChange && fileList) {
            // Cria um objeto DataTransfer simulado (ou pelo menos um objeto com a propriedade files)
            const simulatedEvent = {
                target: {
                    files: fileList,
                    name: inputProps.name, // Garante que a prop name, se existir, seja passada
                },
                // Prevê outros métodos comuns em eventos, se necessário
                preventDefault: () => {},
                stopPropagation: () => {},
            };
            onChange(simulatedEvent);
        }
        
        // Se o input nativo foi usado, limpa o valor para permitir a mesma seleção novamente
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

    }, [onChange, translate, inputProps.name]);


    // 5. Função para simular o clique no input file nativo
    const handleContainerClick = () => {
        // Verifica se o input não está desabilitado antes de clicar
        if (!inputProps.disabled) {
            fileInputRef.current.click();
        }
    };

    // 6. Função para capturar a seleção dos arquivos via clique no input nativo
    const handleFileChange = (event) => {
        // O processamento e o chamado de `onChange` serão feitos por `processFiles`
        processFiles(event.target.files);
    };

    // --- Handlers de Drag and Drop ---

    // 7. Permite o drop - evita o comportamento padrão do navegador
    const handleDragOver = (event) => {
        event.preventDefault();
        // O `dropEffect` indica o tipo de operação (copiar, mover, etc.)
        event.dataTransfer.dropEffect = "copy";
    };

    // 8. Feedback visual quando o arquivo entra na área
    const handleDragEnter = (event) => {
        event.preventDefault();
        if (!inputProps.disabled) {
            setIsDragging(true);
        }
    };

    // 9. Feedback visual quando o arquivo sai da área
    const handleDragLeave = (event) => {
        // Verifica se o mouse está saindo do contêiner principal
        // Isso evita que ele perca o destaque ao passar por elementos internos
        if (event.currentTarget.contains(event.relatedTarget)) {
            return;
        }
        setIsDragging(false);
    };

    // 10. Processa os arquivos quando são soltos
    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);

        if (inputProps.disabled) {
            return;
        }

        const droppedFiles = event.dataTransfer.files;

        if (droppedFiles.length > 0) {
            // Verifica se 'multiple' está habilitado para restringir a seleção
            if (Boolean(inputProps.multiple) === false && droppedFiles.length > 1) {
                // Se 'multiple' é false e soltou mais de um, pega apenas o primeiro.
                // Você pode querer adicionar um feedback ao usuário aqui.
                processFiles([droppedFiles[0]]);
            } else {
                // Repassa o FileList para a função de processamento
                processFiles(droppedFiles);
            }
        }
    };
    // -----------------------------------


    // Determina o texto a ser exibido
    const displayText = fileInfo || placeholder;

    return (
        <div
            className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
            onClick={handleContainerClick}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Texto centralizado: informação dos arquivos ou placeholder */}
            <p className={`${styles.placeholder} ${fileInfo ? styles.fileSelected : ''}`}>
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