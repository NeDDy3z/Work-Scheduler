const crypto = require('crypto');



// Define the constant secret key and IV
const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex');
const iv = Buffer.from(process.env.IV, 'hex');



// Encrypt data
function encrypt(text) {
    // Create a cipher object using the AES-256-CBC algorithm, secret key, and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return the encrypted data
    return encrypted;
}

// Test
// crypto.randomBytes(32).toString('hex');
//console.log(encrypt("MinecraftFranz99"));



module.exports = encrypt
