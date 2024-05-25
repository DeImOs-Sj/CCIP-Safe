import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Rabbit,
  Settings,
  Settings2,
  Share,
  SquareUser,
  Triangle,
  Turtle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Aside from "@/Components/Aside";
import Navbar from '@/Components/Navbar';
import { chainData } from "../utils/chainData";
import WalletButton from '../Components/WalletConnet'; 
import TokenAbi from "../Abis/Erc20.json"



const DialogDemo = ({ show, onClose,  receiverAddress, amount, escrowIdBytes32 }) => {
  const senderAddress ="0x4CCCED009AAE31054dAd2BC6cD9B81306D87282e"
  const EscrowContractAddress = "0xe4dB10384821b7cAF702bb4c2eF8a7F99d979fEe";
  const escrowParams = {
    // Assuming other parameters are here
    amount: amount.toString(), // Convert BigInt to string
    // Other parameters...
  };
  // const amountBytes32 = web3.utils.utf8ToHex(amount.toString());

  const depositTokensToEscrow = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];



      const escrowContract = new web3.eth.Contract(EscrowAbi, EscrowContractAddress);

      // Fetch the escrow details
      const escrow = await escrowContract.methods.escrows(escrowIdBytes32).call();

      // Check if the user is the sender or receiver
      const isSender = escrow.sender.toLowerCase() === account.toLowerCase();
      const isReceiver = escrow.receiver.toLowerCase() === account.toLowerCase();

      if (!isSender && !isReceiver) {
        console.error('You are not a participant in this escrow transaction');
        return;
      }

      const tokenAddress = isSender ? escrow.tokenSentBySender : escrow.tokenSentByReceiver;
      const tokenContract = new web3.eth.Contract(TokenAbi, tokenAddress);

      // Approve the contract to spend the tokens on behalf of the user
      await tokenContract.methods.approve(EscrowContractAddress, amount).send({ from: senderAddress });

      // Call the depositTokensToEscrow function
      await escrowContract.methods.depositTokensToEscrow(escrowIdBytes32, amountBytes32).send({ from: account });

      console.log('Tokens deposited to escrow successfully');
    } catch (error) {
      console.error('Error depositing tokens to escrow:', error.message);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund Escrow</DialogTitle>
          <DialogDescription>
            Fund the Tokens into Escrow For Successful Transaction
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receiver-address" className="text-right">
              Receiver's Address
            </Label>
            <Input
              id="receiver-address"
              value={receiverAddress}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              readOnly
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={depositTokensToEscrow}>Fund Escrow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Import the contract ABI
import EscrowAbi from "../Abis/escrow.json"; // Update with the actual path to your ABI file
import Web3 from "web3";

export function Escrow({ chainData, tokens }) {
  const [selectedChain, setSelectedChain] = useState('');
  const [chainDetails, setChainDetails] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [escrowId, setEscrowId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amountSentBySender, setAmountSentBySender] = useState('');
  const [amountSentByReceiver, setAmountSentByReceiver] = useState('');
  const [account, setAccount] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showFundEscrowDialog, setShowFundEscrowDialog] = useState(false);
  const [escrowIdBytes32, setEscrowIdBytes32] = useState('');

  const openFundEscrowDialog = () => {
    setShowFundEscrowDialog(true);
  };

  const EscrowContractAddress = "0xe4dB10384821b7cAF702bb4c2eF8a7F99d979fEe";

  const handleChainChange = (chainKey) => {
    const chain = chainData[chainKey];
    setSelectedChain(chainKey);
    setChainDetails(chain);
    handleAllowListChange(chain.value); // Pass the chain value to the allowlist function
  };

  const handleTokenChange = (token) => {
    const Token = tokens[token];
    setTokenAddress(Token.value);
  };

  const handleAllowListChange = async (destinationAddress) => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
      return;
    }
    const web3 = window.web3;

    const contract = new web3.eth.Contract(EscrowAbi, EscrowContractAddress);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await contract.methods.allowlistDestinationChain(parseInt(destinationAddress), true).send({ from: account });
      console.log("Chain allowlisted successfully");
    } catch (error) {
      console.error("Error allowlisting chain:", error);
    }
  };

  const initiateEscrow = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
      return;
    }
    const web3 = window.web3;

    const escrowContract = new web3.eth.Contract(EscrowAbi, EscrowContractAddress);

    try {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Convert escrow ID to bytes using sha3
const escrowIdBytes32 = web3.utils.sha3(escrowId);
      setEscrowIdBytes32(escrowIdBytes32);

 

      const amountSentBySenderWei = web3.utils.toWei(amountSentBySender, 'ether').toString();
const amountSentByReceiverWei = web3.utils.toWei(amountSentByReceiver, 'ether').toString();


      await escrowContract.methods.initiateEscrow(
        escrowIdBytes32,
        receiver,
        tokenAddress,
        amountSentBySenderWei,
        tokenAddress,
        amountSentByReceiverWei
      ).send({ from: account });

      console.log('Escrow initiated successfully');

      // Show the dialog immediately after initiating the escrow
      setShowDialog(true);
    } catch (error) {
      console.error('Error initiating escrow:', error);
    }
  };


 

  return (
    <div>
      <Navbar />
      <Aside />
      <div className="grid h-screen w-full pl-[56px]">
        <div className="flex flex-col">
          <main className="flex-1 flex justify-center items-center mx-auto gap-4 overflow-auto p-4">
            <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
              <form className="grid w-full items-start gap-6">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                  <legend className="-ml-1 px-1 text-sm font-medium">Escrow</legend>
                  <div className="grid gap-3">
                    <Label htmlFor="chain">Select the chain</Label>
                    <Select onValueChange={handleChainChange}>
                      <SelectTrigger id="chain" className="items-start [&_[data-description]]:hidden">
                        <SelectValue placeholder="Select a chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(chainData).map((chain) => (
                          <SelectItem key={chain} value={chain}>
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <div className="grid gap-0.5">
                                <p>Chain <span className="font-medium text-foreground">{chainData[chain].name}</span></p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="escrow-id">Escrow ID</Label>
                    <Input id="escrow-id" type="text" placeholder="Escrow ID" value={escrowId} onChange={(e) => setEscrowId(e.target.value)} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="receiver">Receiver Address</Label>
                    <Input id="receiver" type="text" placeholder="0x.." value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="amount-sender">Amount Sent by Sender</Label>
                      <Input id="amount-sender" type="number" placeholder="1" value={amountSentBySender} onChange={(e) => setAmountSentBySender(e.target.value)} />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="amount-receiver">Amount Sent by Receiver</Label>
                      <Input id="amount-receiver" type="number" placeholder="1" value={amountSentByReceiver} onChange={(e) => setAmountSentByReceiver(e.target.value)} />
                    </div>
                    <div className="mt-[26px]">
                      <Label htmlFor="token">Select a Token</Label>
                      <Select onValueChange={handleTokenChange}>
                        <SelectTrigger id="token" className="items-start [&_[data-description]]:hidden">
                          <SelectValue placeholder="Select a Token" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(tokens).map((token) => (
                            <SelectItem key={token} value={token}>
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>Token <span className="font-medium text-foreground">{token}</span></p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-row gap-[15rem]">
                    <div className="mt-[26px]">
                      <Button type="button" onClick={initiateEscrow}>Initiate Escrow</Button>
                    </div>
                    <div className="mt-[26px]">
                      <Button type="button" onClick={openFundEscrowDialog}>Fund Escrow</Button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </main>
        </div>
      </div>
      <DialogDemo
        senderAddress={account}
        receiverAddress={receiver}
        amount={amountSentBySender}
        show={showFundEscrowDialog}
        escrowId={escrowId}
                escrowIdBytes32={escrowIdBytes32}

        onClose={() => setShowFundEscrowDialog(false)}
      />
    </div>
  );
}

export default Escrow;
