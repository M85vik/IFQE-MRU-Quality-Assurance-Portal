const fs = require('fs');

// Try to find the chrome cookie file and delete it
const cookiePath = 'C:\\Users\\vishw\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Network\\Cookies';

// Run this function in your terminal to clear browser cookies
// (You can close Chrome completely before running this)
try {
    if (fs.existsSync(cookiePath)) {
        const data = fs.readFileSync(cookiePath, 'utf8');
        // Simple text find to remove old jwt lines
        const newData = data.split('\n').filter(line => !line.includes('localhost_5173'));

        fs.writeFileSync(cookiePath, newData, 'utf8');
        console.log('✅ Cookies wiped successfully.');
    }
} catch (err) {
    console.log('⚠️ Could not wipe cookies (Chrome might be open).');
}