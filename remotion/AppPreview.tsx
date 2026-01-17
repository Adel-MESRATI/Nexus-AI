import React from 'react';
import { AbsoluteFill } from 'remotion';

export const AppPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '80px',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Mock App UI - Simplified version */}
      <div
        style={{
          width: '90%',
          maxWidth: '800px',
          backgroundColor: '#1a1a1a',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #2a2a2a',
        }}
      >
        {/* Logo/Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            }}
          />
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}
          >
            Flux Gen AI
          </h1>
        </div>

        {/* Prompt Input Box */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              color: '#a0a0a0',
              fontSize: '14px',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            Prompt
          </label>
          <textarea
            id="prompt-input"
            placeholder="Describe the image you want to generate..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '16px',
              backgroundColor: '#0a0a0a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '16px',
              fontFamily: 'system-ui, sans-serif',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          Generate Image
        </button>
      </div>
    </AbsoluteFill>
  );
};
