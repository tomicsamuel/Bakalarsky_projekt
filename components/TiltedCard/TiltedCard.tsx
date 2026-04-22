'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

import './tilted-card.css';

type TiltedCardProps = {
  children: React.ReactNode;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  className?: string;
  disabled?: boolean;
};

export default function TiltedCard({
  children,
  rotateAmplitude = 12,
  scaleOnHover = 1.02,
  className = '',
  disabled = false,
}: TiltedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  // Gyroscope tilt on touch/mobile devices
  useEffect(() => {
    if (!isTouchDevice || disabled) return;

    let removeListener: (() => void) | null = null;

    const startGyro = () => {
      const handler = (e: DeviceOrientationEvent) => {
        const ry = Math.max(
          -rotateAmplitude,
          Math.min(rotateAmplitude, (e.gamma ?? 0) * (rotateAmplitude / 30))
        );
        const rx = Math.max(
          -rotateAmplitude,
          Math.min(rotateAmplitude, ((e.beta ?? 45) - 45) * (rotateAmplitude / 20))
        );
        setTransform({ rotateX: rx, rotateY: ry });
      };
      window.addEventListener('deviceorientation', handler);
      removeListener = () => window.removeEventListener('deviceorientation', handler);
    };

    // iOS 13+ requires explicit permission triggered by a user gesture
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      const card = cardRef.current;
      const onTap = () => {
        (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
          .requestPermission()
          .then((res) => { if (res === 'granted') startGyro(); })
          .catch(() => {/* permission denied – tilt stays flat */});
      };
      card?.addEventListener('touchstart', onTap, { once: true });
      return () => {
        card?.removeEventListener('touchstart', onTap);
        removeListener?.();
      };
    } else {
      startGyro();
      return () => removeListener?.();
    }
  }, [isTouchDevice, disabled, rotateAmplitude]);

  // isDisabled only when explicitly disabled — touch devices still get gyroscope
  const isDisabled = disabled;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 2 * rotateAmplitude;
      const rotateX = (y - 0.5) * -2 * rotateAmplitude;

      setTransform({ rotateX, rotateY });
      setShinePos({ x: x * 100, y: y * 100 });
    },
    [rotateAmplitude, scaleOnHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform({ rotateX: 0, rotateY: 0 });
    setShinePos({ x: 50, y: 50 });
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilted-card ${isDisabled ? 'tilted-card--disabled' : ''} ${className}`}
      onMouseMove={isDisabled || isTouchDevice ? undefined : handleMouseMove}
      onMouseLeave={isDisabled || isTouchDevice ? undefined : handleMouseLeave}
      onMouseEnter={isDisabled || isTouchDevice ? undefined : handleMouseEnter}
      style={
        isDisabled
          ? {}
          : isTouchDevice
          ? {
              // No perspective() on mobile – perspective causes GPU sub-pixel blur on touch devices.
              // rotateX/Y still gives a subtle tilt without 3D projection distortion.
              transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
            }
          : {
              transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${isHovering ? scaleOnHover : 1})`,
            }
      }
    >
      <div className="tilted-card__inner">
        {children}
        {/* Shine only on hover-capable (desktop) devices */}
        {!isDisabled && !isTouchDevice && isHovering && (
          <div
            className="tilted-card__shine"
            style={{
              background: `radial-gradient(circle 80px at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.4) 0%, transparent 100%)`,
            }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
