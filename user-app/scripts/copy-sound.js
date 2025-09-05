// scripts/copy-sound.js
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '../assets/ringtone.mp3');
const dest = path.resolve(__dirname, '../android/app/src/main/res/raw/ringtone.mp3');

const rawDir = path.dirname(dest);
if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('✅ Copied ringtone.mp3 to android/app/src/main/res/raw/');
