'use client';

import Logo from '@/components/Logo';

/**
 * Dvojica lôg FEI TUKE + KPS vedľa seba – použité na všetkých stránkach.
 * Dedí z `.landing-logos` štýlov (transparentné pozadie, žiadny čierny wrapper).
 */
export type LogosProps = {
  /** Voliteľný href na oboch logách (default "/") */
  href?: string | null;
  /** Prídavná trieda na wrapper */
  className?: string;
  /** Veľkosť FEI loga */
  feiWidth?: number;
  feiHeight?: number;
  /** Veľkosť KPS loga */
  kpsWidth?: number;
  kpsHeight?: number;
};

export default function Logos({
  href = '/',
  className = '',
  feiWidth = 180,
  feiHeight = 52,
  kpsWidth = 120,
  kpsHeight = 52,
}: LogosProps) {
  const wrapperClass = ['landing-logos', className].filter(Boolean).join(' ');
  return (
    <div className={wrapperClass}>
      <Logo variant="fei" href={href} className="logo" width={feiWidth} height={feiHeight} />
      <Logo variant="kps" href={href} className="logo" width={kpsWidth} height={kpsHeight} />
    </div>
  );
}
