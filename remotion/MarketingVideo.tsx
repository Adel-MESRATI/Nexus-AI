import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
} from 'remotion';
import { FakeCursor } from './FakeCursor';
import { AppPreview } from './AppPreview';

interface MarketingVideoProps {
  voiceoverText?: string;
}

export const MarketingVideo: React.FC<MarketingVideoProps> = ({
  voiceoverText = 'Welcome to Flux Gen AI',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate cursor appearing
  const cursorOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Cursor movement animation
  const cursorMoveIn = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 200,
      mass: 0.5,
    },
    durationInFrames: 60,
  });

  // Text typing animation
  const typingStartFrame = 90;
  const typingDuration = 120; // 4 seconds
  const typingProgress = interpolate(
    frame,
    [typingStartFrame, typingStartFrame + typingDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* App Preview */}
      <AppPreview />

      {/* Fake Cursor */}
      <FakeCursor
        opacity={cursorOpacity}
        typingProgress={typingProgress}
        typingStartFrame={typingStartFrame}
        frame={frame}
      />
    </AbsoluteFill>
  );
};
