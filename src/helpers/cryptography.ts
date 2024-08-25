import { createCipheriv, createDecipheriv } from 'node:crypto';

const { ENC_KEY, IV } = process.env;

if (!ENC_KEY || !IV) {
  throw new Error('Encryption key or IV is not defined in environment variables.');
}

if (ENC_KEY.length !== 32 || IV.length !== 16) {
  throw new Error('Encryption key must be 32 bytes and IV must be 16 bytes.');
}

const encrypt = (data: string) => {
  try {
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENC_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);

    throw new Error('Encryption failed.');
  }
};

const decrypt = (encrypted: string) => {
  try {
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENC_KEY, 'utf8'), Buffer.from(IV, 'utf8'));
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);

    throw new Error('Decryption failed.');
  }
};

const encryptArray = (array: string[]) => {
  return array.map(item => encrypt(item));
};

const decryptArray = (arrayEncrypted: string[]) => {
  return arrayEncrypted.map(item => decrypt(item));
};

export { encrypt, decrypt, encryptArray, decryptArray };
