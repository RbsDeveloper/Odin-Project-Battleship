const sounds = {
    fire: new Audio("/assets/sounds/cannonShot.mp3"),
    miss: new Audio("/assets/sounds/waterHit.mp3"),
    hit: new Audio("/assets/sounds/shipHit.mp3"),
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