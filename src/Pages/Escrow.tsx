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
import WalletButton from '../Components/WalletConnet'; // Import the new component
const DialogDemo = ({ show, onClose }) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
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
      const amountSentBySenderWei = web3.utils.toWei(amountSentBySender, 'ether');
      const amountSentByReceiverWei = web3.utils.toWei(amountSentByReceiver, 'ether');

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
                   <div className="mt-[26px] ">
                    <Button type="button" onClick={openFundEscrowDialog}>Fund Escrow</Button>
                    </div>
                    </div>
                </fieldset>
              </form>
            </div>
          </main>
        </div>
      </div>
      <DialogDemo show={showFundEscrowDialog} onClose={() => setShowFundEscrowDialog(false)} />
    </div>
  );
}

export default Escrow;