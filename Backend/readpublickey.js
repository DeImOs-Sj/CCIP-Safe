// readPublicKey.js
const { Console } = require('console');
const fs = require('fs');

function readPublicKey() {
  const publicKey = fs.readFileSync('public.pem', 'utf8');
    return publicKey;
    
}

const publicKey=readPublicKey()
console.log(publicKey)

module.exports = readPublicKey;
