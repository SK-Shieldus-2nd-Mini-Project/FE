import React, { useEffect, useRef, useState } from "react";

export default function TrueFocus({
    text,
    manualMode = false, // 기본값을 false로 설정해 자동 순환되도록 함
    blurAmount,
    borderColor,
    glowColor,
    animationDuration,
    pauseBetweenAnimations,
    textColor,
    textAlign,
    font,
}) {
    const words = text.split(" ");
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const wordRefs = useRef([]);
    const [focusRect, setFocusRect] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    // 자동 모드일 때만 인터벌 실행
    useEffect(() => {
        if (!manualMode) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
            }, (animationDuration + pauseBetweenAnimations) * 1000);
            return () => clearInterval(interval);
        }
    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    // 포커스 될 단어의 위치 계산
    useEffect(() => {
        if (containerRef.current && wordRefs.current[currentIndex]) {
            const parent = containerRef.current.getBoundingClientRect();
            const active = wordRefs.current[currentIndex].getBoundingClientRect();
            const newRect = {
                x: active.left - parent.left,
                y: active.top - parent.top,
                width: active.width,
                height: active.height,
            };
            // 값이 바뀔 때만 setState
            if (
                focusRect.x !== newRect.x ||
                focusRect.y !== newRect.y ||
                focusRect.width !== newRect.width ||
                focusRect.height !== newRect.height
            ) {
                setFocusRect(newRect);
            }
        }
    }, [currentIndex, words]);

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                display: "flex",
                gap: "1.5em", // 단어 간 간격을 조금 더 넓게
                justifyContent:
                    textAlign === "left"
                        ? "flex-start"
                        : textAlign === "right"
                        ? "flex-end"
                        : "center",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                height: "200px",
                color: textColor,
                ...font,
            }}
        >
            {words.map((word, index) => {
                const isActive = index === currentIndex;
                return (
                    <span
                        key={index}
                        ref={(el) => (wordRefs.current[index] = el)}
                        style={{
                            position: "relative",
                            filter: `blur(${isActive ? 0 : blurAmount}px)`,
                            transition: `filter ${animationDuration}s ease`,
                        }}
                    >
                        {word}
                    </span>
                );
            })}

            <motion.div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    boxSizing: "content-box",
                }}
                animate={{
                    x: focusRect.x,
                    y: focusRect.y,
                    width: focusRect.width,
                    height: focusRect.height,
                    opacity: words.length > 0 ? 1 : 0,
                }}
                transition={{ duration: animationDuration }}
            >
                {["top-left", "top-right", "bottom-left", "bottom-right"].map(
                    (corner) => {
                         const baseStyle = {
                            position: "absolute",
                            width: "1rem",
                            height: "1rem",
                            border: `3px solid ${borderColor}`,
                            filter: `drop-shadow(0px 0px 4px ${glowColor})`,
                            borderRadius: 3,
                            transition: "none",
                        };

                        const cornerStyles = {
                            "top-left": { top: "-10px", left: "-10px", borderRight: "none", borderBottom: "none" },
                            "top-right": { top: "-10px", right: "-10px", borderLeft: "none", borderBottom: "none" },
                            "bottom-left": { bottom: "-10px", left: "-10px", borderRight: "none", borderTop: "none" },
                            "bottom-right": { bottom: "-10px", right: "-10px", borderLeft: "none", borderTop: "none" },
                        };
                        return <span key={corner} style={{ ...baseStyle, ...cornerStyles[corner] }} />;
                    }
                )}
            </motion.div>
        </div>
    );
}