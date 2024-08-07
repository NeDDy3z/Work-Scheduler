const crypto = require('crypto');
const config = require('../config_secret');


// Define the constant secret key and IV
const secretKey = Buffer.from(config.secret_key, 'hex');
const iv = Buffer.from(config.iv, 'hex');


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
//console.log(crypto.randomBytes(32).toString('hex'), crypto.randomBytes(16).toString('hex'));
//console.log(encrypt("Password"));


module.exports = encrypt
