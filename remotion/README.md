# Remotion Marketing Video

This directory contains the Remotion setup for creating a programmatic marketing video for Flux Gen AI.

## Setup

Remotion is already installed. To get started:

1. **Open Remotion Studio:**
   ```bash
   npm run remotion:studio
   ```

2. **Render the video:**
   ```bash
   npm run remotion:render MarketingVideo out/marketing-video.mp4
   ```

## Video Specifications

- **Resolution:** 1080x1920 (9:16 vertical format for TikTok)
- **Duration:** 10 seconds (300 frames at 30fps)
- **Format:** MP4

## Components

- `MarketingVideo.tsx` - Main composition with animations
- `AppPreview.tsx` - Mock UI of your app
- `FakeCursor.tsx` - Animated cursor that types text
- `Root.tsx` - Remotion root configuration

## Customization

To change the typed text, edit the `sampleText` variable in `FakeCursor.tsx`.

To add voiceover, you can:
1. Use a TTS API (like Google Cloud TTS, Azure TTS, or ElevenLabs)
2. Pre-generate audio and use Remotion's `<Audio />` component
3. Use the `remotion-tts` package (if available) or similar libraries

## Notes

The video shows a mock UI of your app with an animated cursor that types a sample prompt. You can replace `AppPreview.tsx` with an iframe pointing to your actual app if you want to show the real interface.
