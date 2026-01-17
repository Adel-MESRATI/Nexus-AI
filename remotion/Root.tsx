import { Composition } from 'remotion';
import { MarketingVideo } from './MarketingVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MarketingVideo"
        component={MarketingVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          voiceoverText: "Introducing Flux Gen AI - the most powerful AI image generator. Transform your ideas into stunning visuals with just a few words. Experience professional-grade image generation powered by cutting-edge AI. Create unlimited masterpieces in seconds. Try it now!",
        }}
      />
    </>
  );
};
