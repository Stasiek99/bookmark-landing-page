import { createRoot } from 'react-dom/client';

import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import './styles/global.scss';
import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found in index.html');

createRoot(container).render(<App />);
