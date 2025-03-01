// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyBReHMQCQsPigKfmes_b2gr1lrv4eRjkMg",
    authDomain: "nekota-team.firebaseapp.com",
    projectId: "nekota-team",
    storageBucket: "nekota-team.firebasestorage.app",
    messagingSenderId: "489407578036",
    appId: "1:489407578036:web:41b26a535e31c2ffaebce1",
    databaseURL: "https://nekota-team-default-rtdb.firebaseio.com" // Добавляем URL базы данных
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Telegram WebApp instance
const tg = window.Telegram.WebApp;
tg.expand();

// Get user info
const userId = tg.initDataUnsafe?.user?.id || 'anonymous';

// Reference to the database
const database = firebase.database();
const userRef = database.ref('users/' + userId);

let clicks = 0;
const counterElement = document.getElementById('counter');
const catImage = document.getElementById('cat-image');

// Update counter display and save to Firebase
function updateCounter() {
    counterElement.textContent = `Clicks: ${clicks}`;
    // Save to Firebase
    userRef.set({
        clicks: clicks,
        lastUpdated: new Date().toISOString()
    });
}

// Load initial clicks from Firebase
userRef.once('value', (snapshot) => {
    if (snapshot.exists()) {
        clicks = snapshot.val().clicks || 0;
        updateCounter();
    }
});

// Listen for changes in Firebase
userRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.clicks !== clicks) {
            clicks = data.clicks;
            counterElement.textContent = `Clicks: ${clicks}`;
        }
    }
});

// Handle click event
catImage.addEventListener('click', () => {
    clicks++;
    updateCounter();

    // Animate the cat
    catImage.style.transform = 'scale(0.9)';
    setTimeout(() => {
        catImage.style.transform = 'scale(1)';
    }, 100);
});
