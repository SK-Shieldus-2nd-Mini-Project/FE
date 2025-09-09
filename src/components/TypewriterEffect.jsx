// src/components/TypewriterEffect.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";

export default function TypewriterEffect({
    words = [{ word: "Hello" }, { word: "World" }],
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseDuration = 1500,
    cursorColor = "#000000",
    cursorWidth = 3,
    font = {},
    textColor = "#000000",
    style = {},
}) {
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    const timeoutRef = useRef(null);
    const blinkRef = useRef(null);

    const currentWord = useMemo(() =>
        words.length > 0 ? words[wordIndex % words.length].word : "",
        [words, wordIndex]
    );

    // Typing and Deleting Effect
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        let delay;

        if (!isDeleting && charIndex < currentWord.length) {
            // Typing
            delay = typingSpeed;
            timeoutRef.current = setTimeout(() => {
                setDisplayed(currentWord.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, delay);
        } else if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of the word
            delay = pauseDuration;
            timeoutRef.current = setTimeout(() => {
                setIsDeleting(true);
            }, delay);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            delay = deletingSpeed;
            timeoutRef.current = setTimeout(() => {
                setDisplayed(currentWord.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            }, delay);
        } else if (isDeleting && charIndex === 0) {
            // Pause before the next word
            delay = 500; // Short pause before starting new word
            timeoutRef.current = setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }, delay);
        }

        return () => clearTimeout(timeoutRef.current);
    }, [charIndex, isDeleting, wordIndex, currentWord, typingSpeed, deletingSpeed, pauseDuration, words]);

    // Blinking Cursor Effect
    useEffect(() => {
        if (blinkRef.current) clearInterval(blinkRef.current);
        blinkRef.current = setInterval(() => {
            setShowCursor((v) => !v);
        }, 500);
        return () => clearInterval(blinkRef.current);
    }, []);

    const cursorHeight = useMemo(() => {
        const fontSizeStr = font.fontSize || "32px";
        return parseFloat(fontSizeStr);
    }, [font.fontSize]);


    return (
        <span style={{ ...style, ...font, color: textColor, whiteSpace: "pre" }}>
            {displayed}
            <span style={{
                display: "inline-block",
                background: cursorColor,
                width: cursorWidth,
                height: font.fontSize ? font.fontSize : "1em",
                marginLeft: 4,
                verticalAlign: "bottom",
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.1s",
                borderRadius: 2,
            }} />
        </span>
    );
}