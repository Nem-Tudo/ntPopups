import React, { useRef, useState, useCallback } from 'react';
import styles from "../../../../styles/FileInput.module.css";


/**
 * Função robusta para verificar se um arquivo corresponde ao critério 'accept' do input file.
 * Lida com: MIME types exatos (application/pdf), coringas (image/*), e extensões (.jpg).
 * @param {File} file O objeto File a ser verificado.
 * @param {string | undefined} acceptString A string do atributo accept (ex: "image/*, .pdf, application/json").
 * @returns {boolean} True se o arquivo for aceito, False caso contrário.
 */
const checkFileAccept = (file, acceptString) => {
    if (!acceptString) return true; // Se não há 'accept', aceita qualquer arquivo

    // 1. Normaliza e separa os tipos aceitos.
    const acceptedTypes = acceptString
        .toLowerCase() // Normaliza para minúsculas
        .split(',')
        .map(type => type.trim())
        .filter(type => type.length > 0);

    if (acceptedTypes.length === 0) return true;

    const fileName = file.name ? file.name.toLowerCase() : '';
    const fileType = file.type ? file.type.toLowerCase() : '';
    
    // Extrai a extensão do arquivo (ex: '.jpg')
    const fileExtensionMatch = fileName.match(/\.([0-9a-z]+)$/i);
    const fileExtension = fileExtensionMatch ? `.${fileExtensionMatch[1]}` : '';

    return acceptedTypes.some(accept => {
        // 2. Coringa (ex: image/*)
        if (accept.endsWith('/*')) {
            const majorType = accept.slice(0, -2); // Ex: 'image'
            // Verifica se o tipo MIME do arquivo começa com o majorType (ex: image/png)
            return fileType.startsWith(`${majorType}/`);
        }
        
        // 3. Extensão de arquivo (ex: .png, .pdf)
        if (accept.startsWith('.')) {
            // Se o arquivo tem uma extensão, verifica a correspondência
            if (fileExtension) {
                return fileExtension === accept;
            }
            // Se o arquivo não tem extensão, não pode corresponder a uma extensão exigida
            return false;
        }
        
        // 4. Tipo MIME exato (ex: application/json, application/pdf)
        if (accept.includes('/')) {
            return fileType === accept;
        }
        
        // Se não for nenhum dos tipos acima, o accept é inválido/não reconhecido,
        // mas para evitar rejeitar um arquivo válido em um caso limite,
        // vamos considerar a string literal como um tipo MIME (embora seja raro/inválido)
        return fileType === accept;
    });
};


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
            const accept = inputProps.accept;
            
            // 1. Filtra os arquivos usando a prop 'accept'
            const filteredFiles = Array.from(droppedFiles).filter(file => 
                checkFileAccept(file, accept)
            );

            // Se nenhum arquivo passou no filtro, não faz nada
            if (filteredFiles.length === 0) {
                // Opcional: Adicionar um feedback de erro aqui (ex: console.warn)
                return;
            }

            const filesToProcess = filteredFiles;

            // 2. Verifica se 'multiple' está habilitado para restringir a seleção
            if (Boolean(inputProps.multiple) === false && filesToProcess.length > 1) {
                // Se 'multiple' é false e soltou mais de um (mesmo depois de filtrar), pega apenas o primeiro.
                processFiles([filesToProcess[0]]);
            } else {
                // Repassa a lista de arquivos filtrada para a função de processamento
                // (Note que estamos passando um Array de Files, não um FileList, mas processFiles lida com isso)
                processFiles(filesToProcess);
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