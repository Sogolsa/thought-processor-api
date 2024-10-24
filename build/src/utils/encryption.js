"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = decrypt;
exports.encrypt = encrypt;
var _crypto = _interopRequireDefault(require("crypto"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var algorithm = 'aes-256-ctr';
var key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
function encrypt(text) {
  var iv = _crypto["default"].randomBytes(16);
  var cipher = _crypto["default"].createCipheriv(algorithm, key, iv);

  // Encrypt the text
  var encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher["final"]('hex'); // Finalize the encryption

  // Return the IV and encrypted text combined
  return Buffer.from(iv).toString('hex') + '|' + encrypted;
}
function decrypt(text) {
  var textParts = text.split('|');
  var iv = Buffer.from(textParts.shift(), 'hex'); // Extract the iv from the string
  var encryptedText = Buffer.from(textParts.join('|'), 'hex');
  try {
    var decipher = _crypto["default"].createDecipheriv(algorithm, key, iv);

    // decrypt the text
    var decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher["final"]('utf8'); // Finalize the decryption process
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
//# sourceMappingURL=encryption.js.map