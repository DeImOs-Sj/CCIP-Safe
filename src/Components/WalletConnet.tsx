import React, { useState } from 'react';
import Web3 from 'web3';
import { Button } from "@/components/ui/button"

const ConnectWalletButton = ({ onConnect }) => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        onConnect(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  return (
    <div>
      {!account ? (
        <Button type="button" className='rounded-full' onClick={connectWallet}>Wallet</Button>
      ) : (
        <Button type="button" className='rounded-full'>Connected</Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
