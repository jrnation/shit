// Base URL - Change this when you go live!
const BASE_URL = "https://nippu.jrnation.cc"; 
let currentVictimName = "";

// --- AUDIO HIJACK VARIABLES ---
let audioCtx;
let sourceNode;
let destNode;

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
const MAX_PLAYS = 1;

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
            document.body.classList.remove('shake-chaos');
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
    try {
        // 1. UI Update
        const downloadBtn = document.getElementById('downloadBtn');
        const originalText = downloadBtn.innerText;
        downloadBtn.innerText = "⏳ Compiling Chaos... Wait 12s";
        downloadBtn.disabled = true;

        // 2. Setup Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        const canvasStream = canvas.captureStream(30);

        // 3. 🚨 BULLETPROOF AUDIO HIJACK 🚨
        const audioElement = document.getElementById('hypeAudio');
        
        // We only create the audio context ONCE to avoid "InvalidStateError" crashes
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            sourceNode = audioCtx.createMediaElementSource(audioElement);
            destNode = audioCtx.createMediaStreamDestination();
            
            // Route audio to the video recorder
            sourceNode.connect(destNode);
            // Route audio to the computer speakers
            sourceNode.connect(audioCtx.destination);
        }

        // Browsers sometimes put the audio engine to sleep; this wakes it up
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        // Combine video and audio tracks flawlessly
        const combinedStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...destNode.stream.getAudioTracks()
        ]);

        // 4. Setup Recorder 
        const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
        const chunks = [];

        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentVictimName}_STATUS.webm`;
            document.body.appendChild(a);
            a.click();
            
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            downloadBtn.innerText = originalText;
            downloadBtn.disabled = false;
        };

        // 5. Start Drawing
        let frameIndex = 0;
        const drawInterval = setInterval(() => {
            const img = preloadedImages[frameIndex];

            // Prevent crash if image isn't loaded yet
            if (!img || img.width === 0 || img.height === 0) {
                frameIndex = (frameIndex + 1) % preloadedImages.length;
                return; 
            }

            // Clear the canvas
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // "Object-Fit: Cover" Math
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const drawWidth = img.width * scale;
            const drawHeight = img.height * scale;
            const x = (canvas.width / 2) - (drawWidth / 2);
            const y = (canvas.height / 2) - (drawHeight / 2);
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            
            // Text Math
            let text = `${currentVictimName} NIPPU RA!!!`;
            let fontSize = 150; 
            ctx.font = `${fontSize}px 'Anton', sans-serif`;
            
            // Auto-shrink text
            while (ctx.measureText(text).width > (canvas.width - 100) && fontSize > 40) {
                fontSize -= 5;
                ctx.font = `${fontSize}px 'Anton', sans-serif`;
            }

            // Draw Text
            ctx.fillStyle = "#ffcc00";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"; 
            ctx.shadowColor = "red";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 6;
            ctx.shadowOffsetY = 6;
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            
            // Draw Stroke
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.lineWidth = Math.max(3, fontSize / 25); 
            ctx.strokeStyle = "#8b0000";
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);

            frameIndex = (frameIndex + 1) % preloadedImages.length;
        }, 120);

        // 6. Start Playing Audio & Recording
        audioElement.currentTime = 0;
        audioElement.play();
        recorder.start();

        // 7. Stop exactly at 12 seconds
        setTimeout(() => {
            clearInterval(drawInterval);
            recorder.stop();
        }, 12000);

    } catch (error) {
        console.error("CRITICAL ERROR RECORDING VIDEO:", error);
        alert("Recording failed! Check the developer console (F12) for the exact error.");
        
        document.getElementById('downloadBtn').innerText = "💾 Download Status Video";
        document.getElementById('downloadBtn').disabled = false;
    }
}