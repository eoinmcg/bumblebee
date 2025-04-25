/**
 * 🐝 Might of the BUMBLEBEE 🐝
 * A buzzy little R3F game where physics and pollination collide!
 * https://github.com/eoinmcg/bumblebee
 * 
 * PROJECT STRUCTURE:
 * src/
 * ├─ components/    - All the juicy React components
 * ├─ models/        - hand made 3D assets (pre-made .glbs in ./public)
 * ├─ store.js       - Global state management (bee-cause we need it)
 * ├─ utils/         - Helper functions doing the heavy pollen lifting
 * ├─ scenes/        - Play for gameplay, Splash for intro screen and Loading
 * 
 * WANT TO CONTRIBUTE?
 * This hive welcomes new worker bees! Fork the repo, make your changes,
 * and submit a PR. Just remember: with great flower comes great responsibility.
 * 
 * "To bee or not to bee, that is the question." - William Shakespear(e)
 * 
 * Now go forth and pollinate some code! 🌻
 */

import { version, name } from '../package.json';
import './style.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import Game from './Game';

const root = ReactDOM.createRoot(document.querySelector('#root'))

console.log(`%c ${name} V:${version} ${window.location.port.length ? '[DEV]' : ''}`, 'background: #222; color: gold');
console.log(`%c source code: https://github.com/eoinmcg/bumblebee`, 'background: #222; color: gold');

root.render(
  <StrictMode>
    <Game />
  </StrictMode>
);
