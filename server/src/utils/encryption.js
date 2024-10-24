import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = 'aes-256-ctr';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

export function encrypt(text) {
  let iv = crypto.randomBytes(16);

  let cipher = crypto.createCipheriv(algorithm, key, iv);

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex'); // Finalize the encryption

  // Return the IV and encrypted text combined
  return Buffer.from(iv).toString('hex') + '|' + encrypted;
}

export function decrypt(text) {
  let textParts = text.split('|');
  let iv = Buffer.from(textParts.shift(), 'hex'); // Extract the iv from the string
  let encryptedText = Buffer.from(textParts.join('|'), 'hex');

  try {
    let decipher = crypto.createDecipheriv(algorithm, key, iv);

    // decrypt the text
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8'); // Finalize the decryption process
    return decrypted; // Return the decrypted text
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Or handle the error as needed
  }
  //   let decipher = crypto.createDecipheriv(algorithm, key, iv);
  //   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  //   decrypted += decipher.final('utf8'); // Finalize the decryption process
  //   return decrypted.toString();
}
