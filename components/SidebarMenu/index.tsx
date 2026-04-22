'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  User,
  School,
  MapPin,
  Info,
  Target,
  Briefcase,
  Sparkles,
  ArrowLeft,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import './sidebar-menu.css';

const STEP_ICON_SIZE = 20;

const STEPS = [
  { number: 0, label: 'Súhlas', Icon: Check },
  { number: 1, label: 'Meno', Icon: User },
  { number: 2, label: 'Škola', Icon: School },
  { number: 3, label: 'O vás', Icon: MapPin },
  { number: 4, label: 'Info', Icon: Info },
  { number: 5, label: 'Záujmy', Icon: Target },
  { number: 6, label: 'Prax / skúsenosti', Icon: Briefcase },
  { number: 7, label: 'Výsledky', Icon: Sparkles },
];

export interface SidebarMenuProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export default function SidebarMenu({ currentStep, totalSteps, onStepClick }: SidebarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const sidebarWidth = isCollapsed ? 56 : 320;

  return (
    <>
      {/* Hamburger – len na mobile, otvára overlay */}
      <button
        type="button"
        className="sidebar-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
      >
        <span className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Overlay na mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* Spacer – zaberá miesto v layoute, aby main nebol pod sidebarom */}
      <div
        className="sidebar-spacer"
        style={{ width: sidebarWidth }}
        aria-hidden
      />

      {/* Sidebar – na desktop vždy viditeľný, na mobile ako overlay */}
      <aside
        className={`sidebar-wrap ${isCollapsed ? 'sidebar-wrap--collapsed' : ''} ${isOpen ? 'sidebar-wrap--open' : ''}`}
        style={{ width: sidebarWidth }}
      >
        <nav className="sidebar-menu">
          <div className="sidebar-header">
            <Link href="/" className="sidebar-logo" onClick={() => setIsOpen(false)}>
              <span className="sidebar-logo-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 50 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" fill="currentColor" />
                  <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" fill="currentColor" />
                </svg>
              </span>
              {!isCollapsed && <span className="sidebar-logo-text">FEI Finder</span>}
            </Link>
            {!isCollapsed && (
              <button
                type="button"
                className="sidebar-close"
                onClick={() => setIsOpen(false)}
                aria-label="Zavrieť"
              >
                <X size={24} strokeWidth={2} />
              </button>
            )}
          </div>

          {!isCollapsed && (
            <div className="sidebar-progress">
              <div className="progress-info">
                <span className="progress-text">Progress</span>
                <span className="progress-percent">
                  {Math.round((currentStep / totalSteps) * 100)}%
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          <ul className="sidebar-steps">
            {STEPS.map((step) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              const isUpcoming = step.number > currentStep;
              const StepIcon = step.Icon;

              return (
                <li key={step.number}>
                  <button
                    type="button"
                    className={`sidebar-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}
                    onClick={() => {
                      if (onStepClick && (isCompleted || isActive)) {
                        onStepClick(step.number);
                      }
                      setIsOpen(false);
                    }}
                    disabled={isUpcoming}
                    title={isCollapsed ? step.label : undefined}
                  >
                    <span className="step-icon">
                      <StepIcon size={STEP_ICON_SIZE} strokeWidth={2} />
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="step-content">
                          <span className="step-number">{step.number}</span>
                          <span className="step-label">{step.label}</span>
                        </span>
                        {isCompleted && (
                          <span className="step-check">
                            <Check size={18} strokeWidth={2.5} />
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sidebar-footer">
            {!isCollapsed ? (
              <Link href="/" className="sidebar-link" onClick={() => setIsOpen(false)}>
                <ArrowLeft size={18} strokeWidth={2} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Domov
              </Link>
            ) : (
              <Link
                href="/"
                className="sidebar-link sidebar-link--icon"
                onClick={() => setIsOpen(false)}
                title="Domov"
                aria-label="Domov"
              >
                <ArrowLeft size={20} strokeWidth={2} />
              </Link>
            )}
          </div>

          <button
            type="button"
            className="sidebar-fold-btn"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Rozbaliť menu' : 'Zbaliť menu'}
            title={isCollapsed ? 'Rozbaliť' : 'Zbaliť'}
          >
            {isCollapsed ? (
              <ChevronsRight size={20} strokeWidth={2} />
            ) : (
              <>
                <ChevronsLeft size={20} strokeWidth={2} />
                <span className="sidebar-fold-label">Zbaliť</span>
              </>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
}
