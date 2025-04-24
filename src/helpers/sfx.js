import zzfx from "../lib/zzfx";;

import { getGameState } from "../store";

const data = {
  jump: [,,472,.01,.02,.06,1,.4,,67,,,,.1,,,,.68,.06],
  collect: [,,621,.01,.01,.18,,2.1,,,113,.06,.02,,.1,.1,,.6,.03,,998],
  crash: [,,380,,.05,.15,1,2.1,,,,,.05,.8,40,.1,,.9,.09,.24,-2493],
  hurt: [1.1,,448,.08,.21,.24,1,3.5,1,-2,,,.08,,,,,.65,.12,.19],
};

window.data = data;

const sfx = (name) => {

  const { mute } = getGameState();
  
  if (mute || !name in data) return;
  zzfx(...data[name]);
}

export default sfx;
