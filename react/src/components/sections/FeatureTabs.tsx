import { useId, useRef, useState, type KeyboardEvent } from 'react';

import { FEATURE_TABS } from '../../data/content';
import { BlueShape } from '../ui/BlueShape';
import { Button } from '../ui/Button';
import './FeatureTabs.scss';

interface FeatureTabsProps {
  initialTabId?: string;
  className?: string;
}

export const FeatureTabs = ({
  initialTabId = FEATURE_TABS[0].id,
  className = '',
}: FeatureTabsProps) => {
  const [activeId, setActiveId] = useState(initialTabId);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const baseId = useId();

  const activeTab = FEATURE_TABS.find((tab) => tab.id === activeId) ?? FEATURE_TABS[0];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = FEATURE_TABS.findIndex((tab) => tab.id === activeId);
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(event.key in offsets) && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    let next = (index + (offsets[event.key] ?? 0) + FEATURE_TABS.length) % FEATURE_TABS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = FEATURE_TABS.length - 1;

    const nextTab = FEATURE_TABS[next];
    setActiveId(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  };

  return (
    <div className={`feature-tabs ${className}`}>
      <div className="feature-tabs__list" role="tablist" aria-label="Features">
        {FEATURE_TABS.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`feature-tabs__tab ${selected ? 'feature-tabs__tab--active' : ''}`}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={onKeyDown}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="feature-tabs__panel"
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${activeTab.id}`}
      >
        <BlueShape side="left" className="feature-tabs__shape" />
        <div className="feature-tabs__media">
          <img
            src={activeTab.image}
            alt=""
            width={activeTab.imageWidth}
            height={activeTab.imageHeight}
            style={{ ['--scale' as string]: activeTab.imageWidth / FEATURE_TABS[0].imageWidth }}
          />
        </div>
        <div className="feature-tabs__content">
          <h3 className="feature-tabs__title">{activeTab.title}</h3>
          <p className="feature-tabs__text">{activeTab.text}</p>
          <Button href="#more-info" className="feature-tabs__cta">
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
};
