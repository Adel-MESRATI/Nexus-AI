import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface FakeCursorProps {
  opacity: number;
  typingProgress: number;
  typingStartFrame: number;
  frame: number;
}

export const FakeCursor: React.FC<FakeCursorProps> = ({
  opacity,
  typingProgress,
  typingStartFrame,
  frame,
}) => {
  const { width, height } = useVideoConfig();

  // Sample text to type
  const sampleText = 'A futuristic cityscape at sunset with neon lights and flying cars';

  // Calculate cursor position (center of textarea, accounting for padding)
  const inputBoxX = width * 0.5; // Center horizontally
  const inputBoxY = height * 0.25 + 140; // Top + header + label + padding

  // Animate cursor moving to input box
  const moveProgress = spring({
    frame: frame - 30, // Start moving after cursor appears
    fps: 30,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.5,
    },
    durationInFrames: 60,
  });

  const cursorX = interpolate(
    moveProgress,
    [0, 1],
    [width * 0.1, inputBoxX - 40] // Start from left, move to input
  );
  const cursorY = interpolate(
    moveProgress,
    [0, 1],
    [height * 0.3, inputBoxY] // Start from middle, move to input
  );

  // Show blinking cursor after typing starts
  const cursorBlink = Math.sin((frame - typingStartFrame) * 0.5) > 0 ? 1 : 0;

  // Get text to display based on typing progress
  const textToShow = sampleText.slice(0, Math.floor(sampleText.length * typingProgress));

  return (
    <div
      style={{
        position: 'absolute',
        opacity,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {/* Cursor */}
      <div
        style={{
          position: 'absolute',
          left: cursorX,
          top: cursorY,
          width: '2px',
          height: frame >= typingStartFrame ? '20px' : '24px',
          backgroundColor: frame >= typingStartFrame ? 
            (cursorBlink > 0.5 ? '#ffffff' : 'transparent') : '#ffffff',
          borderRadius: '1px',
          transform: 'translateY(2px)',
          transition: 'all 0.1s',
        }}
      />

      {/* Display typed text in the input box */}
      {frame >= typingStartFrame && (
        <div
          style={{
            position: 'absolute',
            left: inputBoxX - width * 0.45,
            top: inputBoxY - 2,
            color: '#ffffff',
            fontSize: '16px',
            fontFamily: 'system-ui, sans-serif',
            maxWidth: width * 0.8,
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {textToShow}
        </div>
      )}
    </div>
  );
};
