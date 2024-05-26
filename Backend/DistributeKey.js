// distributeKey.js
const Web3 = require('web3');
const { abi, address } = require('./CrossChainKeyDistributor.json');  // Update with actual ABI and deployed address
const readPublicKey = require('./readpublickey');

const web3 = new Web3('YOUR_INFURA_OR_ALCHEMY_URL');  // Replace with your Ethereum provider URL
const contract = new web3.eth.Contract(abi, address);

const publicKey = readPublicKey();
const destinationChainSelector = 1234;  // Update with actual destination chain ID
const receiver = 'RECEIVER_ADDRESS';
const feeToken = '0x0000000000000000000000000000000000000000';  // Native token
const fee = web3.utils.toWei('0.01', 'ether');

const account = web3.eth.accounts.privateKeyToAccount('YOUR_PRIVATE_KEY');
web3.eth.accounts.wallet.add(account);

async function distributeKey() {
  const tx = contract.methods.distributeKey(destinationChainSelector, receiver, publicKey, feeToken, fee);
  const gas = await tx.estimateGas({ from: account.address });
  const gasPrice = await web3.eth.getGasPrice();

  const txData = {
    from: account.address,
    to: contract.options.address,
    data: tx.encodeABI(),
    gas,
    gasPrice
  };

  const receipt = await web3.eth.sendTransaction(txData);
  console.log('Transaction receipt:', receipt);
}

distributeKey().catch(console.error);
