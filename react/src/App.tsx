import { useCallback, useState } from 'react';

import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Download } from './components/sections/Download';
import { Faq } from './components/sections/Faq';
import { FeatureTabs } from './components/sections/FeatureTabs';
import { Features } from './components/sections/Features';
import { Hero } from './components/sections/Hero';
import { Newsletter } from './components/sections/Newsletter';
import { Modal } from './components/ui/Modal';
import { useDelayedTrigger } from './hooks/useDelayedTrigger';
import { useExitIntent } from './hooks/useExitIntent';

const MODAL_DELAY_MS = 30_000;
const MODAL_TAB_ID = 'searching';

export const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalShown, setModalShown] = useState(false);

  const showModal = useCallback(() => {
    if (modalShown) return;
    setModalShown(true);
    setModalOpen(true);
  }, [modalShown]);

  useDelayedTrigger(showModal, MODAL_DELAY_MS);
  useExitIntent(showModal, !modalShown);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header onHover={showModal} />
      <main id="main">
        <Hero />
        <Features />
        <Download />
        <Faq />
        <Newsletter />
      </main>
      <Footer />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} label="Feature highlight">
        <FeatureTabs initialTabId={MODAL_TAB_ID} />
      </Modal>
    </>
  );
};
