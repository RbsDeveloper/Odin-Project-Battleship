import cannonShot from '../assets/sounds/cannonShot.mp3';
import waterHit from '../assets/sounds/waterHit.mp3';
import shipHit from '../assets/sounds/shipHit.mp3';

const sounds = {
    fire: new Audio(cannonShot),
    miss: new Audio(waterHit),
    hit: new Audio(shipHit),
    sunk: new Audio(shipHit),
};

Object.values(sounds).forEach(audio => {
    audio.load(); 
});

export function playSound(situation) {
    if(sounds[situation]){
        sounds[situation].currentTime = 0;
        sounds[situation].play()
    }
}