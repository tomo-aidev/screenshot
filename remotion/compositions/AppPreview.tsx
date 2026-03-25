'use client';

import React from 'react';

// Remotion types (will be fully implemented when remotion package is installed)
export interface AppPreviewProps {
  screenshots: {
    imageUrl: string;
    headline: string;
    subtext?: string;
  }[];
  transition: 'slide' | 'fade' | 'zoom' | 'rotate3d' | 'flip';
  textAnimation: 'typewriter' | 'fadeIn' | 'bounce' | 'slideUp';
  duration: number;
  bgColor: string;
  accentColor: string;
  fontFamily: string;
  locale: string;
  bgMusic?: string;
  deviceFrame: 'iphone' | 'android' | 'none';
  outputSize: {
    width: number;
    height: number;
  };
}

// Transition calculation helpers
function getTransitionStyle(
  type: AppPreviewProps['transition'],
  progress: number,
  direction: 'enter' | 'exit'
): React.CSSProperties {
  const t = direction === 'exit' ? progress : 1 - progress;

  switch (type) {
    case 'slide':
      return {
        transform: `translateX(${direction === 'enter' ? (1 - progress) * 100 : -progress * 100}%)`,
      };
    case 'fade':
      return {
        opacity: direction === 'enter' ? progress : 1 - progress,
      };
    case 'zoom':
      return {
        transform: `scale(${direction === 'enter' ? 0.5 + progress * 0.5 : 1 + t * 0.5})`,
        opacity: direction === 'enter' ? progress : 1 - progress,
      };
    case 'rotate3d':
      return {
        transform: `perspective(1000px) rotateY(${direction === 'enter' ? (1 - progress) * 90 : -progress * 90}deg)`,
        opacity: progress > 0.5 || direction === 'exit' ? 1 : 0,
      };
    case 'flip':
      return {
        transform: `perspective(1000px) rotateX(${direction === 'enter' ? (1 - progress) * 180 : progress * 180}deg)`,
        backfaceVisibility: 'hidden' as const,
      };
    default:
      return {};
  }
}

// Text animation helpers
function getTextAnimationStyle(
  type: AppPreviewProps['textAnimation'],
  progress: number
): React.CSSProperties {
  switch (type) {
    case 'typewriter':
      return { opacity: 1 };
    case 'fadeIn':
      return { opacity: progress };
    case 'bounce':
      const bounce = Math.abs(Math.sin(progress * Math.PI * 2)) * (1 - progress);
      return {
        transform: `translateY(${-bounce * 30}px)`,
        opacity: Math.min(progress * 2, 1),
      };
    case 'slideUp':
      return {
        transform: `translateY(${(1 - progress) * 40}px)`,
        opacity: progress,
      };
    default:
      return {};
  }
}

// Typewriter text component
function TypewriterText({ text, progress }: { text: string; progress: number }) {
  const visibleChars = Math.floor(text.length * progress);
  return <span>{text.slice(0, visibleChars)}</span>;
}

// Device frame wrapper
function DeviceFrameWrapper({
  type,
  children,
}: {
  type: AppPreviewProps['deviceFrame'];
  children: React.ReactNode;
}) {
  if (type === 'none') return <>{children}</>;

  const borderRadius = type === 'iphone' ? '3rem' : '1.5rem';
  const borderWidth = type === 'iphone' ? '8px' : '6px';

  return (
    <div
      style={{
        borderRadius,
        border: `${borderWidth} solid #333`,
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        width: '70%',
        height: '80%',
      }}
    >
      {children}
    </div>
  );
}

// Main composition component
// This is a placeholder that renders the preview structure.
// In production, this would use Remotion's useCurrentFrame() and useVideoConfig().
export function AppPreviewComposition(props: AppPreviewProps) {
  const {
    screenshots,
    transition,
    textAnimation,
    bgColor,
    accentColor,
    fontFamily,
    deviceFrame,
    outputSize,
  } = props;

  // Static preview (frame 0)
  const currentSlide = screenshots[0];

  if (!currentSlide) {
    return (
      <div
        style={{
          width: outputSize.width,
          height: outputSize.height,
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily,
        }}
      >
        <p>No screenshots provided</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: outputSize.width,
        height: outputSize.height,
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: '8%',
          width: '80%',
          textAlign: 'center',
          zIndex: 10,
          ...getTextAnimationStyle(textAnimation, 1),
        }}
      >
        <h1
          style={{
            fontSize: outputSize.width * 0.06,
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 4px 12px rgba(0,0,0,0.5)',
            margin: 0,
          }}
        >
          {textAnimation === 'typewriter' ? (
            <TypewriterText text={currentSlide.headline} progress={1} />
          ) : (
            currentSlide.headline
          )}
        </h1>
        {currentSlide.subtext && (
          <p
            style={{
              fontSize: outputSize.width * 0.03,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 12,
            }}
          >
            {currentSlide.subtext}
          </p>
        )}
      </div>

      {/* Device with screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '75%',
          marginTop: '15%',
          ...getTransitionStyle(transition, 1, 'enter'),
        }}
      >
        <DeviceFrameWrapper type={deviceFrame}>
          <img
            src={currentSlide.imageUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </DeviceFrameWrapper>
      </div>

      {/* Accent bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />
    </div>
  );
}

export default AppPreviewComposition;
