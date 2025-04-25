import './style.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Game from './Game';

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
  <StrictMode>
    <Game />
  </StrictMode>
);
