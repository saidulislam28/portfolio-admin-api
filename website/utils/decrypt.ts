import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = 'mysecretkey';
const iv = Buffer.alloc(16, 0); // Initialization vector

export function decrypt(encryptedText:any) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
