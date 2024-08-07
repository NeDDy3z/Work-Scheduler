const crypto = require('crypto');
const config = require(process.env.CONFIG_PATH || '../config');

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
// crypto.randomBytes(32).toString('hex');
//console.log(encrypt("Password"));



module.exports = encrypt
