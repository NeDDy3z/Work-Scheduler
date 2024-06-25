const crypto = require('crypto');

// Define the constant secret key and IV
const secretKey = Buffer.from('5ed0eb6ac24a5eb2a2f908ae8797c130f36812a2dae28b9440ca24345ccbab0c', 'hex');
const iv = Buffer.from('76dc246948e2de90ab7def42e50a90fe', 'hex');



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
//console.log(encrypt("Password"));



module.exports = encrypt
