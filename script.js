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




async function downloadChaosVideo() {
    // 1. Change the button text so they know it's working
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ Compiling Chaos... Please Wait 12s";
    downloadBtn.disabled = true;

    // 2. Set up the hidden digital whiteboard (Canvas)
    const canvas = document.createElement('canvas');
    canvas.width = 1080; // High-res vertical video
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 3. Setup the Audio Hijack (Web Audio API)
    const audioElement = document.getElementById('hypeAudio');
    // Create an audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // We grab the sound coming from the audio element
    const sourceNode = audioCtx.createMediaElementSource(audioElement);
    const destinationNode = audioCtx.createMediaStreamDestination();
    
    // Route the audio to the recorder AND to the user's speakers so they still hear it
    sourceNode.connect(destinationNode); 
    sourceNode.connect(audioCtx.destination); 

    // 4. Capture the visual stream from the canvas
    const canvasStream = canvas.captureStream(30); // 30 FPS

    // 5. Combine Audio and Visuals into one master stream!
    const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...destinationNode.stream.getAudioTracks()
    ]);

    // 6. Try to force MP4, fallback to WebM if Chrome blocks it
    let mimeType = 'video/webm; codecs=vp9,opus';
    let fileExtension = '.webm';
    
    if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
        fileExtension = '.mp4';
    }
    
    const recorder = new MediaRecorder(combinedStream, { mimeType: mimeType });
    const chunks = [];

    recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    // 7. When the recording finishes, trigger the download
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentVictimName}_STATUS${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Reset button
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    };

    // 8. Start drawing the slideshow rapidly to the canvas
    let frameIndex = 0;
    const drawInterval = setInterval(() => {
        // Draw the background image
        ctx.drawImage(preloadedImages[frameIndex], 0, 0, canvas.width, canvas.height);
        
        // Draw the massive text over it
        ctx.font = "150px Anton";
        ctx.fillStyle = "#ffcc00";
        ctx.textAlign = "center";
        
        // Recreate the text shadow from your CSS
        ctx.shadowColor = "red";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        
        ctx.fillText(`${currentVictimName} NIPPU RA!!!`, canvas.width / 2, canvas.height / 2);
        
        // Reset shadow for the stroke
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#8b0000";
        ctx.strokeText(`${currentVictimName} NIPPU RA!!!`, canvas.width / 2, canvas.height / 2);

        frameIndex = (frameIndex + 1) % preloadedImages.length;
    }, 120);

    // 9. Play the audio from the start and START RECORDING
    audioElement.currentTime = 0;
    audioElement.play();
    recorder.start();

    // 10. STOP EVERYTHING AT EXACTLY 12 SECONDS
    setTimeout(() => {
        clearInterval(drawInterval);
        recorder.stop();
        // Optional: stop the audio too, or let it finish naturally
        // audioElement.pause(); 
    }, 12000); 
}