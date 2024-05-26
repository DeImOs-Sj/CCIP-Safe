// generateKeys.js
const forge = require('node-forge');
const fs = require('fs');

function generateKeys() {
  const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);

  const publicPem = forge.pki.publicKeyToPem(publicKey);
  const privatePem = forge.pki.privateKeyToPem(privateKey);

  fs.writeFileSync('public.pem', publicPem);
  fs.writeFileSync('private.pem', privatePem);

  console.log('Keys generated and saved to files.');
}

generateKeys();
