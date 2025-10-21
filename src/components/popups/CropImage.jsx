import React, { useState, useRef, useEffect, useCallback } from "react";
// Assumindo que você não usará mais o styles de módulo local.
// A lógica CSS será mapeada para `popupstyles` ou classes globais.

/**
 * Pop-up para crop de imagem.
 * @param {Object} properties
 * @param {(hasAction?: boolean) => void} properties.closePopup - Função de fechamento do pop-up.
 * @param {(key: string) => string} properties.translate - Função para tradução de textos.
 * @param {Object} [properties.data]
 * @param {File|string} [properties.data.image]
 * @param {'square'|'circle'} [properties.data.format='circle']
 * @param {(result: {blob: Blob, base64: string, file: File}) => void} [properties.data.onCrop=() => {}]
 * @param {Object} [properties.popupstyles]
 * @param {Boolean} properties.requireAction Is action required?
 */
export default function CropImage({
    closePopup,
    translate,
    popupstyles = {},
    requireAction,
    data: {
        image = null,
        format = "circle",
        onCrop = () => { }
    } = {},
}) {
    const [imageSrc, setImageSrc] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [originalFileName, setOriginalFileName] = useState("cropped-image.png");
    // Estado para forçar a re-renderização e medir as dimensões em redimensionamento
    const [containerSize, setContainerSize] = useState(500);

    const canvasRef = useRef(null);
    const fullCanvasRef = useRef(null);
    const cropCanvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    // 1. Mapeamento de Classes
    const classes = {
        header: `${popupstyles.header} ${popupstyles.header} ntpopups-header ntpopups-cropimage-header`,
        body: `${popupstyles.body} ${popupstyles.cropmain} ntpopups-body ntpopups-cropimage-main`,
        container: `${popupstyles.container} ntpopups-cropimage-container`,
        containerGrab: `${popupstyles.containerGrab} ntpopups-cropimage-container-grab`,
        containerGrabbing: `${popupstyles.containerGrabbing} ntpopups-cropimage-container-grabbing`,
        fullCanvas: `${popupstyles.fullCanvas} ntpopups-cropimage-full-canvas`,
        cropCanvas: `${popupstyles.cropCanvas} ntpopups-cropimage-canvas`,
        cropCanvasCircle: `${popupstyles.cropCanvasCircle} ntpopups-cropimage-canvas-circle`,
        hiddenImage: `${popupstyles.hiddenImage} ntpopups-cropimage-hidden-image`,
        zoomSection: `${popupstyles.zoomSection} ntpopups-cropimage-zoom-section`,
        zoomControls: `${popupstyles.zoomControls} ntpopups-cropimage-zoom-controls`,
        zoomSlider: `${popupstyles.zoomSlider} ntpopups-cropimage-zoom-slider`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        footerResetButton: `${popupstyles.baseButton} ${popupstyles.footerResetButton} ntpopups-basebutton ntpopups-cropimage-footer-reset-button`,
        baseButton: `${popupstyles.baseButton} ntpopups-basebutton`,
        zoomIcon: `${popupstyles.zoomIcon} ntpopups-cropimage-zoom-icon`,
        zoomIconSmall: `${popupstyles.zoomIconSmall} ntpopups-cropimage-zoom-icon-small`,
        zoomIconLarge: `${popupstyles.zoomIconLarge} ntpopups-cropimage-zoom-icon-large`,
        hiddenCanvas: `${popupstyles.hiddenCanvas} ntpopups-hidden-canvas`,
        resetButton: `${popupstyles.baseButton} ${popupstyles.resetButton} ntpopups-cropimage-resetbutton`,
    };

    // 2. Lógica de Carregamento da Imagem
    useEffect(() => {
        if (!image) return;

        if (image instanceof File) {
            setOriginalFileName(image.name.replace(/\.[^/.]+$/, "") + "-cropped.png");
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target.result);
            reader.readAsDataURL(image);
        } else if (typeof image === "string") {
            setImageSrc(image);
        }
    }, [image]);

    // ** NOVA LÓGICA DE OBSERVER PARA RESPONSIVIDADE **
    // Atualiza o estado da largura do container sempre que o container mudar
    useEffect(() => {
        if (!containerRef.current) return;

        // Função para obter o tamanho e atualizar o estado
        const updateSize = () => {
            const size = containerRef.current?.clientWidth;
            // Se o tamanho for zero (por exemplo, durante a transição), usa o valor padrão ou o último conhecido.
            setContainerSize(size > 0 ? size : 500);
        };

        // Usa ResizeObserver para detectar mudanças de tamanho (incluindo redimensionamento e breakpoints do CSS)
        const observer = new ResizeObserver(updateSize);
        observer.observe(containerRef.current);

        // Chamada inicial
        updateSize();

        return () => observer.disconnect();
    }, [imageSrc]); // Adiciona imageSrc para garantir que a medição ocorra quando a imagem carregar

    // 3. Lógica de Posição (atualizada para usar containerSize)
    const constrainPosition = useCallback((newPosition, currentZoom) => {
        if (!imageRef.current) return newPosition;

        // Usa containerSize do estado, garantindo responsividade
        const fullSize = containerSize;

        const img = imageRef.current;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const scale = Math.max(fullSize / imgWidth, fullSize / imgHeight) * currentZoom;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const maxX = Math.max(0, (scaledWidth - fullSize) / 2);
        const maxY = Math.max(0, (scaledHeight - fullSize) / 2);

        return {
            x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
            y: Math.max(-maxY, Math.min(maxY, newPosition.y))
        };
    }, [containerSize]); // Depende de containerSize

    // 4. Lógica de Desenho no Canvas (Atualizada para usar containerSize)
    useEffect(() => {
        if (!imageRef.current || !fullCanvasRef.current || !cropCanvasRef.current || containerSize === 0) return;

        const fullCanvas = fullCanvasRef.current;
        const cropCanvas = cropCanvasRef.current;
        const fullCtx = fullCanvas.getContext("2d");
        const cropCtx = cropCanvas.getContext("2d");
        const img = imageRef.current;

        // ** CORREÇÃO AQUI: Usa containerSize do estado **
        const fullSize = containerSize;
        // 80% é a proporção definida no CSS para o .cropCanvas em mobile e desktop
        const cropSize = fullSize * 0.6; // Ajustei para 60% apenas para fins de demonstração, o ideal é que seja a mesma proporção do CSS (300/500 = 0.6)

        fullCanvas.width = fullSize;
        fullCanvas.height = fullSize;
        cropCanvas.width = cropSize;
        cropCanvas.height = cropSize;

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        // O cálculo do scale agora é baseado em fullSize
        const scale = Math.max(fullSize / imgWidth, fullSize / imgHeight) * zoom;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (fullSize - scaledWidth) / 2 + position.x;
        const y = (fullSize - scaledHeight) / 2 + position.y;

        fullCtx.clearRect(0, 0, fullSize, fullSize);
        fullCtx.save();
        fullCtx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Aplica a máscara para escurecer a área fora do crop
        fullCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        fullCtx.fillRect(0, 0, fullSize, fullSize);

        // "Limpa" a área do crop para mostrar a imagem sem máscara
        fullCtx.globalCompositeOperation = 'destination-out';
        if (format === "circle") {
            fullCtx.beginPath();
            fullCtx.arc(fullSize / 2, fullSize / 2, cropSize / 2, 0, Math.PI * 2);
            fullCtx.closePath();
            fullCtx.fill();
        } else {
            // O crop quadrado agora usa cropSize, que é proporcional ao fullSize
            fullCtx.fillRect((fullSize - cropSize) / 2, (fullSize - cropSize) / 2, cropSize, cropSize);
        }
        fullCtx.globalCompositeOperation = 'source-over';
        fullCtx.restore();

        // Desenha a pré-visualização do crop
        cropCtx.clearRect(0, 0, cropSize, cropSize);
        cropCtx.save();

        if (format === "circle") {
            cropCtx.beginPath();
            cropCtx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
            cropCtx.closePath();
            cropCtx.clip();
        }

        const cropOffsetX = (fullSize - cropSize) / 2;
        const cropOffsetY = (fullSize - cropSize) / 2;

        cropCtx.drawImage(img, x - cropOffsetX, y - cropOffsetY, scaledWidth, scaledHeight);
        cropCtx.restore();

    }, [imageSrc, zoom, position, format, containerSize]); // Adicionada dependência containerSize

    // 5. Handlers de Movimento e Zoom (mantidos)
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newPosition = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        };
        setPosition(constrainPosition(newPosition, zoom));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const newPosition = {
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y
        };
        setPosition(constrainPosition(newPosition, zoom));
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleZoomChange = (newZoom) => {
        const parsedZoom = parseFloat(newZoom);
        setZoom(parsedZoom);
        setPosition(constrainPosition(position, parsedZoom));
    };

    // 6. Lógica de Crop e Callback (Atualizada para usar containerSize)
    const handleCrop = () => {
        if (!cropCanvasRef.current || containerSize === 0) return;

        const canvas = canvasRef.current;
        const cropCanvas = cropCanvasRef.current;
        const ctx = canvas.getContext("2d");

        // O tamanho final do crop é o mesmo usado no cropCanvas (que é proporcional)
        const size = cropCanvas.width;
        canvas.width = size;
        canvas.height = size;

        ctx.clearRect(0, 0, size, size);
        ctx.save();

        if (format === "circle") {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
        }

        ctx.drawImage(cropCanvas, 0, 0); // Desenha o conteúdo do pré-visualização
        ctx.restore();

        canvas.toBlob((blob) => {
            const base64 = canvas.toDataURL("image/png");
            const file = new File([blob], originalFileName, { type: "image/png" });

            if (onCrop) {
                onCrop({
                    blob: blob,
                    base64: base64,
                    file: file
                });
            }

            closePopup(true); // Fecha o popup com ação
        }, "image/png");
    };

    const resetControls = () => {
        setZoom(1);
        setPosition(constrainPosition({ x: 0, y: 0 }, 1)); // Garante que a posição inicial também é restringida
    };

    // 7. Renderização com Traduções e Classes da Lib
    return (
        <>
            <header className={classes.header}>
                {translate('cropImage.title')} {/* Semântico: Título hierárquico (h2) */}
            </header>

            <section className={classes.body}> {/* Semântico: Usa <section> para o conteúdo principal */}
                {/* Visualizador de Crop */}
                <figure // Semântico: <figure> é apropriado para conteúdo auto-contido (como uma imagem ou canvas)
                    ref={containerRef}
                    // A classe de cursor muda dinamicamente
                    className={`${classes.container} ${isDragging ? classes.containerGrabbing : classes.containerGrab}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="application" // ARIA: Sugere uma interface interativa
                    aria-label={translate('cropImage.viewerLabel')} // ARIA: Rótulo para o leitor de tela
                >
                    {/* fullCanvas e cropCanvas continuam no DOM */}
                    <canvas ref={fullCanvasRef} className={classes.fullCanvas} aria-hidden="true" /> {/* ARIA: O canvas é visual, não precisa ser lido diretamente */}

                    <canvas
                        ref={cropCanvasRef}
                        // Classe condicional para formato circular
                        className={`${classes.cropCanvas} ${format === 'circle' ? classes.cropCanvasCircle : ''}`}
                        aria-hidden="true"
                    />

                    {imageSrc && (
                        // Imagem para cálculo de dimensões, permanece escondida
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="" // Alt vazio, pois a imagem é funcional, mas é renderizada no canvas.
                            className={classes.hiddenImage}
                            // Reseta os controles ao carregar uma nova imagem
                            onLoad={() => {
                                resetControls();
                            }}
                        />
                    )}
                </figure>

                {/* Controles de Zoom */}
                <div className={classes.zoomSection}>
                    <label className={classes.zoomControls}> {/* Semântico: Usa <label> para agrupar o controle de zoom */}
                        {/* Ícone de zoom pequeno (mantido como SVG, mas com aria-hidden) */}
                        <svg className={`${classes.zoomIcon} ${classes.zoomIconSmall}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }} aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>

                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.01"
                            value={zoom}
                            onChange={(e) => handleZoomChange(e.target.value)}
                            className={classes.zoomSlider}
                            aria-label={translate('cropImage.zoomSliderLabel')} // ARIA: Rótulo para leitores de tela
                        />

                        {/* Ícone de zoom grande (mantido como SVG, mas com aria-hidden) */}
                        <svg className={`${classes.zoomIcon} ${classes.zoomIconLarge}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }} aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </label>
                </div>

                {/* Canvas oculto para gerar a imagem final (blob/base64) */}
                <canvas ref={canvasRef} className={classes.hiddenCanvas} aria-hidden="true" />
            </section>

            <footer className={classes.footer}> {/* Semântico: Usa <footer> para o rodapé */}
                <button onClick={resetControls} className={classes.resetButton} base-button-style={"2"} type="button">
                    {translate('util.resetLabel')}
                </button>
                {
                    !requireAction && <button onClick={() => closePopup()} className={classes.baseButton}
                        base-button-style={"1"}
                        base-button-no-flex={"true"}
                        type="button" // Indica que não é o botão principal de ação
                    >
                        {translate('util.cancelLabel')}
                    </button>
                }
                <button onClick={handleCrop} className={classes.baseButton}
                    base-button-no-flex={"true"}
                    type="submit" // Indica o botão principal de ação (se estivesse dentro de um <form>, o que é recomendado para popups de ação)
                >
                    {translate('util.applyLabel')}
                </button>
            </footer>
        </>
    );
}