import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const EscrowComponent: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string>('');
    console.log(account)

  const ERC20_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
  const TokenTransferor_ABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_router",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_link",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "destinationChainSelector",
				"type": "uint64"
			}
		],
		"name": "DestinationChainNotAllowlisted",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "target",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "FailedToWithdrawEth",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidReceiverAddress",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "currentBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "calculatedFees",
				"type": "uint256"
			}
		],
		"name": "NotEnoughBalance",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NothingToWithdraw",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "escrowId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenSentBySender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountSentBySender",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "tokenSentByReceiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountSentByReceiver",
				"type": "uint256"
			}
		],
		"name": "EscrowCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "messageId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "uint64",
				"name": "destinationChainSelector",
				"type": "uint64"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "feeToken",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fees",
				"type": "uint256"
			}
		],
		"name": "TokensTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "acceptOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "_destinationChainSelector",
				"type": "uint64"
			},
			{
				"internalType": "bool",
				"name": "allowed",
				"type": "bool"
			}
		],
		"name": "allowlistDestinationChain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"name": "allowlistedChains",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_escrowId",
				"type": "bytes32"
			}
		],
		"name": "depositTokensToEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "tokenSentBySender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountSentBySender",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenSentByReceiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amountSentByReceiver",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "senderDeposited",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "receiverDeposited",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_escrowId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenSentBySender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountSentBySender",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_tokenSentByReceiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amountSentByReceiver",
				"type": "uint256"
			}
		],
		"name": "initiateEscrow",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_beneficiary",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_beneficiary",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
  ];
    
 useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).ethereum) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const web3Instance = new Web3((window as any).ethereum);
      setWeb3(web3Instance);
    } else {
      console.error('Please install MetaMask!');
    }
 }, []);
    
    const connectWallet = async () => {
    if (web3) {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    } else {
      console.error('Web3 not initialized');
    }
  };

  const handleDeposit = async () => {
    if (!web3 || !account) {
      console.error('Web3 or account not initialized');
      return;
    }

    


    const senderAddress = '0x4CCCED009AAE31054dAd2BC6cD9B81306D87282e';
	  const receiverAddress = '0x4F42a89B944138744a608660c4891803E302f043';
	  
	  const tokenTransferorAddress = '0x7D03B2a2B566542a5D250A1761092A44fa017B56';
	  
	  const tokenSentBySenderAddress = '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4';
	  const tokenSentByReceiverAddress = '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4';
	  
    const amountSentBySender = web3.utils.toWei('100', 'ether'); // Example amount
    const amountSentByReceiver = web3.utils.toWei('200', 'ether'); // Example amount
	
    const escrowId = web3.utils.sha3('escrow-1234'); // Example escrow ID

    const tokenSentBySenderContract = new web3.eth.Contract(ERC20_ABI, tokenSentBySenderAddress);
    const tokenSentByReceiverContract = new web3.eth.Contract(ERC20_ABI, tokenSentByReceiverAddress);
    const tokenTransferorContract = new web3.eth.Contract(TokenTransferor_ABI, tokenTransferorAddress);

     try {
      // Sender approves the TokenTransferor contract
      await tokenSentBySenderContract.methods
        .approve(tokenTransferorAddress, amountSentBySender)
        .send({ from: senderAddress });

      // Receiver approves the TokenTransferor contract
      await tokenSentByReceiverContract.methods
        .approve(tokenTransferorAddress, amountSentByReceiver)
        .send({ from: receiverAddress });

      // Sender deposits tokens to escrow
      await tokenTransferorContract.methods
        .depositTokensToEscrow(escrowId)
        .send({ from: senderAddress });

      // Receiver deposits tokens to escrow
      await tokenTransferorContract.methods
        .depositTokensToEscrow(escrowId)
        .send({ from: receiverAddress });

      console.log('Tokens deposited to escrow successfully');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
       <button onClick={connectWallet}>Connect Wallet</button>
      <button onClick={handleDeposit}>Deposit Tokens to Escrow</button>
    </div>
  );
};

export default EscrowComponent;
