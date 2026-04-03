// Base URL - Change this when you go live!
const BASE_URL = "https://nippu.jrnation.cc"; 
let currentVictimName = "";

// Array of your 9 uploaded images
const hypeImages = [
    "1.png", "2.png", "3.png", "4.png", "5.png", 
    "6.png", "7.png", "8.png", "9.png"
];

// 🚨 CRITICAL MOBILE FIX: Preload images into the phone's memory instantly
const preloadedImages = [];
for (let i = 0; i < hypeImages.length; i++) {
    let img = new Image();
    img.src = hypeImages[i];
    preloadedImages.push(img);
}

let slideInterval;

// --- AUDIO REPEAT VARIABLES ---
let currentPlayCount = 0;
const MAX_PLAYS = 3;

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const nameFromUrl = urlParams.get('name');

    if (nameFromUrl) {
        currentVictimName = nameFromUrl.toUpperCase();
        document.getElementById('setup-container').style.display = 'none';
        document.getElementById('trap-container').style.display = 'block';
    }

    // Set up the Audio Looper when the page loads
    const audio = document.getElementById('hypeAudio');
    audio.addEventListener('ended', function() {
        currentPlayCount++; // Add 1 to the count when the track finishes
        
        if (currentPlayCount < MAX_PLAYS) {
            audio.currentTime = 0; // Rewind to start
            audio.play(); // Play it again
        } else {
            // Once it hits 3 plays, stop the chaos to give it a dramatic ending
            document.body.classList.remove('shake-chaos', 'slideshow-active');
            clearInterval(slideInterval);
        }
    });
};

document.getElementById("targetName").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        triggerHype();
    }
});

function triggerHype() {
    const nameInput = document.getElementById('targetName').value.trim();
    // Kept your custom default text!
    currentVictimName = nameInput === "" ? "NEE KOOTHURU" : nameInput.toUpperCase();
    executeChaos();
}

function springTheTrap() {
    executeChaos();
}

function executeChaos() {
    // Hide UI
    document.getElementById('setup-container').style.display = 'none';
    document.getElementById('trap-container').style.display = 'none';

    // Set Text
    document.getElementById('finalText').innerText = `${currentVictimName} NIPPU RA!!!`;
    document.getElementById('meme-container').style.display = 'block';

    // Trigger Shake and reveal Slideshow Image
    document.body.classList.add('shake-chaos', 'slideshow-active');

    // Start the rapid slideshow
    const bgImage = document.getElementById('hype-bg-slider');
    let imageIndex = 0;
    
    if (slideInterval) clearInterval(slideInterval);
    
    slideInterval = setInterval(() => {
        imageIndex = (imageIndex + 1) % hypeImages.length;
        bgImage.src = hypeImages[imageIndex];
    }, 120); 

    // Reset loop counter and Play Audio
    currentPlayCount = 0; 
    const audio = document.getElementById('hypeAudio');
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play error:", e));
}

function shareCustomLink() {
    const customLink = `${BASE_URL}/?name=${encodeURIComponent(currentVictimName)}`;
    const message = `I just ran a background status check on you... you need to see this immediately: ${customLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}