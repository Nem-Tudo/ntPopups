import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Utility: Converte o aspect ratio (W:H) para dimensões reais limitadas.
 * @param {number} containerSize - O tamanho do container principal (quadrado).
 * @param {string} aspectRatioString - A proporção 'W:H' (ex: '16:9').
 * @param {number} maxRatio - A proporção máxima que o crop pode ocupar no container (ex: 0.8).
 * @returns {{aspectW: number, aspectH: number, cropWidth: number, cropHeight: number}}
 */
const getCropDimensions = (containerSize, aspectRatioString, maxRatio = 0.8) => {
    const parts = aspectRatioString.split(':').map(Number);
    const [w, h] = parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[0] > 0 && parts[1] > 0 ? parts : [1, 1];
    
    if (containerSize === 0) return { aspectW: w, aspectH: h, cropWidth: 0, cropHeight: 0 };

    const maxDim = containerSize * maxRatio;
    
    let cropWidth = maxDim;
    let cropHeight = (maxDim * h) / w;

    // Se a altura calculada for maior que o limite máximo, escala para baixo
    if (cropHeight > maxDim) {
        cropHeight = maxDim;
        cropWidth = (maxDim * w) / h;
    }

    return { aspectW: w, aspectH: h, cropWidth, cropHeight };
};

/**
 * Pop-up para crop de imagem.
 * @param {Object} properties
 * @param {(hasAction?: boolean) => void} properties.closePopup - Função de fechamento do pop-up.
 * @param {(key: string) => string} properties.translate - Função para tradução de textos.
 * @param {Object} [properties.data]
 * @param {File|string} [properties.data.image]
 * @param {'square'|'circle'} [properties.data.format='circle']
 * @param {string} [properties.data.aspectRatio='1:1']
 * @param {number} [properties.data.minZoom=1]
 * @param {number} [properties.data.maxZoom=4]
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
        aspectRatio = "1:1",
        minZoom = 1,
        maxZoom = 4,
        onCrop = () => { }
    } = {},
}) {
    const [imageSrc, setImageSrc] = useState(null);
    // Zoom 1 é agora o zoom mínimo necessário para cobrir a área de corte
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [originalFileName, setOriginalFileName] = useState("cropped-image.png");
    // Estado para forçar a re-renderização e medir as dimensões em redimensionamento
    const [containerSize, setContainerSize] = useState(500); // Default size for initialization

    const canvasRef = useRef(null); // Canvas oculto para output final
    const fullCanvasRef = useRef(null); // Canvas principal com imagem e máscara
    const cropCanvasRef = useRef(null); // Canvas de pré-visualização (visível)
    const imageRef = useRef(null); // Tag <img> para obter dimensões naturais
    const containerRef = useRef(null); // Container principal para medir o tamanho

    // --- CÁLCULO DE DIMENSÕES DE CROP E ASPECT RATIO (Ponto 2) ---
    const { cropWidth, cropHeight, aspectW, aspectH } = useMemo(() => {
        // O crop pode ocupar no máximo 80% do container
        return getCropDimensions(containerSize, aspectRatio, 0.8);
    }, [containerSize, aspectRatio]);

    // 1. Mapeamento de Classes
    const classes = {
        header: `${popupstyles.header} ntpopups-header ntpopups-cropimage-header`,
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

    // 3. Resize Observer para responsividade
    useEffect(() => {
        if (!containerRef.current) return;

        const updateSize = () => {
            const size = containerRef.current?.clientWidth;
            // Garante que o containerSize seja o valor medido ou um valor seguro (mínimo de 100px)
            setContainerSize(size > 100 ? size : 500);
        };

        const observer = new ResizeObserver(updateSize);
        observer.observe(containerRef.current);

        updateSize();

        return () => observer.disconnect();
    }, []);

    // 4. Lógica de Posição (Constrain)
    const constrainPosition = useCallback((newPosition, currentZoom) => {
        if (!imageRef.current || containerSize === 0 || cropWidth === 0 || cropHeight === 0) return newPosition;

        const img = imageRef.current;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        // S_min: Escala mínima para a imagem COBRIR a área de corte (cropWidth x cropHeight)
        const S_min = Math.max(cropWidth / imgWidth, cropHeight / imgHeight);
        const S_total = S_min * currentZoom;

        const scaledWidth = imgWidth * S_total;
        const scaledHeight = imgHeight * S_total;

        // As bordas (maxX, maxY) representam a distância máxima que o centro da imagem pode se mover
        // antes que a borda da área de corte encontre a borda da imagem ampliada.
        // O zoom é limitado para que a imagem ampliada seja sempre maior ou igual à área de corte.

        // Metade da "folga" do lado da imagem que fica fora do crop box
        const maxBoundX = (scaledWidth - cropWidth) / 2;
        const maxBoundY = (scaledHeight - cropHeight) / 2;

        // Define a restrição de movimento. Se a imagem for menor que o crop box (só acontece se zoom < 1), maxX/Y será 0.
        const maxX = Math.max(0, maxBoundX);
        const maxY = Math.max(0, maxBoundY);

        // Se o zoom for < 1, a imagem não pode ser arrastada (constrained to 0)
        if (currentZoom < 1) {
             return { x: 0, y: 0 };
        }

        return {
            x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
            y: Math.max(-maxY, Math.min(maxY, newPosition.y))
        };
    }, [containerSize, cropWidth, cropHeight]);


    // 5. Lógica de Desenho no Canvas
    useEffect(() => {
        // Verifica se todas as referências e dimensões críticas estão prontas
        if (!imageRef.current || !fullCanvasRef.current || !cropCanvasRef.current || containerSize === 0 || cropWidth === 0 || cropHeight === 0) return;

        const fullCanvas = fullCanvasRef.current;
        const cropCanvas = cropCanvasRef.current;
        const fullCtx = fullCanvas.getContext("2d");
        const cropCtx = cropCanvas.getContext("2d");
        const img = imageRef.current;

        const fullSize = containerSize;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        // Define o tamanho do fullCanvas para o tamanho do container
        fullCanvas.width = fullSize;
        fullCanvas.height = fullSize;
        
        // Define o tamanho do cropCanvas para as dimensões de crop calculadas
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;


        // S_min: Escala mínima para a imagem COBRIR a área de corte (Ponto 1)
        const S_min = Math.max(cropWidth / imgWidth, cropHeight / imgHeight);
        const S_total = S_min * zoom;

        const scaledWidth = imgWidth * S_total;
        const scaledHeight = imgHeight * S_total;

        // Posições de desenho no fullCanvas (centralizado no fullSize)
        // O centro da imagem está em (fullSize/2 + position.x, fullSize/2 + position.y)
        const x = (fullSize - scaledWidth) / 2 + position.x;
        const y = (fullSize - scaledHeight) / 2 + position.y;

        // --- Desenho no Full Canvas (Imagem + Máscara) ---
        fullCtx.clearRect(0, 0, fullSize, fullSize);
        fullCtx.save();
        
        // 1. Desenha a imagem na escala total
        fullCtx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // 2. Aplica a máscara para escurecer a área fora do crop
        fullCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        fullCtx.fillRect(0, 0, fullSize, fullSize);

        // 3. "Limpa" a área do crop (o "buraco")
        fullCtx.globalCompositeOperation = 'destination-out';

        const cropXStart = (fullSize - cropWidth) / 2;
        const cropYStart = (fullSize - cropHeight) / 2;

        if (format === "circle") {
            // Círculo usa o diâmetro da menor dimensão do crop
            const diameter = Math.min(cropWidth, cropHeight);
            fullCtx.beginPath();
            fullCtx.arc(fullSize / 2, fullSize / 2, diameter / 2, 0, Math.PI * 2);
            fullCtx.closePath();
            fullCtx.fill();
        } else {
            // Retângulo/Quadrado
            fullCtx.fillRect(cropXStart, cropYStart, cropWidth, cropHeight);
        }
        
        fullCtx.globalCompositeOperation = 'source-over';
        fullCtx.restore();
        
        // --- Desenho na Pré-visualização do Crop (cropCanvas) ---
        cropCtx.clearRect(0, 0, cropWidth, cropHeight);
        cropCtx.save();
        
        // Aplica o clip circular se necessário
        if (format === "circle") {
            const diameter = Math.min(cropWidth, cropHeight);
            cropCtx.beginPath();
            cropCtx.arc(cropWidth / 2, cropHeight / 2, diameter / 2, 0, Math.PI * 2);
            cropCtx.closePath();
            cropCtx.clip();
        }

        // Calcula o ponto de desenho relativo ao cropCanvas (0,0)
        // Distância do canto superior esquerdo do fullCanvas até o canto superior esquerdo do cropCanvas
        const fullCanvasToCropCanvasX = (fullSize - cropWidth) / 2;
        const fullCanvasToCropCanvasY = (fullSize - cropHeight) / 2;
        
        // O ponto de desenho inicial (x, y) no fullCanvas menos o offset para o cropCanvas (0,0)
        const drawX = x - fullCanvasToCropCanvasX;
        const drawY = y - fullCanvasToCropCanvasY;

        cropCtx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
        cropCtx.restore();

        // Atualiza a posição da pré-visualização para o círculo (para corresponder ao CSS)
        // Embora o canvas seja retangular/quadrado, o CSS o posiciona no centro.
        // O CSS agora precisa lidar com diferentes aspect ratios, o que será feito com transform: scale.
    }, [imageSrc, zoom, position, format, containerSize, cropWidth, cropHeight]); // Dependências cruciais

    // 6. Handlers de Movimento e Zoom
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
        // Apenas permite arrastar se o zoom for >= 1
        if (zoom >= 1) {
            setPosition(constrainPosition(newPosition, zoom));
        }
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
        // Apenas permite arrastar se o zoom for >= 1
        if (zoom >= 1) {
            setPosition(constrainPosition(newPosition, zoom));
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const handleZoomChange = (newZoom) => {
        const parsedZoom = parseFloat(newZoom);
        setZoom(parsedZoom);
        // Recalcula a posição para manter o centro, e re-constrain
        setPosition(oldPosition => constrainPosition(oldPosition, parsedZoom));
    };

    // 7. Lógica de Crop e Callback
    const handleCrop = () => {
        if (!cropCanvasRef.current) return;

        // O cropCanvas já tem o conteúdo recortado (preview).
        cropCanvasRef.current.toBlob((blob) => {
            const base64 = cropCanvasRef.current.toDataURL("image/png");
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
        // Garante que a posição inicial (0,0) também é restringida (o que é trivial em zoom=1)
        setPosition(constrainPosition({ x: 0, y: 0 }, 1));
    };
    
    // Calcula o estilo para posicionar e dimensionar corretamente a pré-visualização (cropCanvasRef)
    const cropCanvasStyle = {
        width: cropWidth,
        height: cropHeight,
        // Garante o posicionamento central
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // Estilos visuais dinâmicos para suportar retângulos
        borderRadius: format === 'circle' ? '50%' : 'var(--ntpopups-border-radius-sm)',
        boxShadow: format === 'circle' 
            ? '0 0 0 3px #fff, 0 0 0 4px rgba(255, 255, 255, 0.3)' 
            : '0 0 0 3px #fff, 0 0 0 4px rgba(255, 255, 255, 0.3)',
    };
    
    // 8. Renderização com Traduções e Classes da Lib
    return (
        <>
            <header className={classes.header}>
                {translate('cropImage.title')}
            </header>

            <section className={classes.body}>
                {/* Visualizador de Crop */}
                <figure
                    ref={containerRef}
                    className={`${classes.container} ${isDragging && zoom >= 1 ? classes.containerGrabbing : classes.containerGrab}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="application"
                    aria-label={translate('cropImage.viewerLabel')}
                >
                    {/* fullCanvas: Imagem e Máscara */}
                    <canvas ref={fullCanvasRef} className={classes.fullCanvas} aria-hidden="true" />

                    {/* cropCanvas: Pré-visualização (visível, estilizado dinamicamente) */}
                    <canvas
                        ref={cropCanvasRef}
                        // Remove classes que fixavam tamanho e usa inline style para as dimensões calculadas
                        className={`${classes.cropCanvas} ${format === 'circle' ? classes.cropCanvasCircle : ''}`}
                        style={cropCanvasStyle}
                        aria-hidden="true"
                    />

                    {imageSrc && (
                        /* Imagem para cálculo de dimensões */
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt=""
                            className={classes.hiddenImage}
                            onLoad={resetControls}
                        />
                    )}
                </figure>

                {/* Controles de Zoom */}
                <div className={classes.zoomSection}>
                    <label className={classes.zoomControls}>
                        {/* Ícone de zoom pequeno (mantido como SVG) */}
                        <svg className={`${classes.zoomIcon} ${classes.zoomIconSmall}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }} aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>

                        <input
                            type="range"
                            min={minZoom}
                            max={maxZoom}
                            step="0.01"
                            value={zoom}
                            onChange={(e) => handleZoomChange(e.target.value)}
                            className={classes.zoomSlider}
                            aria-label={translate('cropImage.zoomSliderLabel')}
                        />

                        {/* Ícone de zoom grande (mantido como SVG) */}
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

            <footer className={classes.footer}>
                <button onClick={resetControls} className={classes.resetButton} base-button-style={"2"} type="button">
                    {translate('util.resetLabel')}
                </button>
                {
                    !requireAction && <button onClick={() => closePopup()} className={classes.baseButton}
                        base-button-style={"1"}
                        base-button-no-flex={"true"}
                        type="button"
                    >
                        {translate('util.cancelLabel')}
                    </button>
                }
                <button onClick={handleCrop} className={classes.baseButton}
                    autoFocus={true}
                    base-button-no-flex={"true"}
                    type="submit"
                >
                    {translate('util.applyLabel')}
                </button>
            </footer>
        </>
    );
}