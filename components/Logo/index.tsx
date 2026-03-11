'use client';

import Link from 'next/link';
import Image from 'next/image';

/** Logá školy: FEI TUKE (čierny podklad, oranžový text) a KPS (biely podklad). */
const FEI_TUKE_LOGO = '/FEI_TUKE_logo.png';
const KPS_LOGO = '/KPS_logo-nobg.png';

type LogoVariant = 'fei' | 'kps';

export type LogoProps = {
  /** Ktoré logo zobraziť: fakulta (FEI TUKE) alebo KPS */
  variant?: LogoVariant;
  /** Ak true, logo je odkaz na domov (/) */
  href?: string | null;
  /** Trieda na obal (napr. logo, auth-logo). Pre FEI TUKE sa pridáva tmavý wrapper. */
  className?: string;
  /** Šírka obrázka (výška sa dopočíta automaticky) */
  width?: number;
  /** Výška obrázka */
  height?: number;
  /** Alt text pre prístupnosť */
  alt?: string;
};

const defaultSizes = { fei: { w: 200, h: 56 }, kps: { w: 120, h: 48 } };

export default function Logo({
  variant = 'fei',
  href = '/',
  className = 'logo',
  width,
  height,
  alt,
}: LogoProps) {
  const src = variant === 'kps' ? KPS_LOGO : FEI_TUKE_LOGO;
  const sizes = defaultSizes[variant];
  const w = width ?? sizes.w;
  const h = height ?? sizes.h;
  const isFei = variant === 'fei';

  const content = (
    <>
      <Image
        src={src}
        alt={alt ?? (variant === 'fei' ? 'Fakulta elektrotechniky a informatiky TUKE' : 'KPS')}
        width={w}
        height={h}
        className="logo-img"
        priority
        unoptimized
      />
    </>
  );

  const wrapperClass = [
    className,
    isFei ? 'logo-wrap--fei' : 'logo-wrap--kps',
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <Link href={href} className={wrapperClass} style={{ display: 'inline-block', textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
