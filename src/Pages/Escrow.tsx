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
import Aside from "@/Components/Aside";
import Navbar from '@/Components/Navbar';
import { chainData } from "../utils/chainData";

// Import the contract ABI
import EscrowAbi from "../Abis/escrow.json"; // Update with the actual path to your ABI file

export function Escrow({ chainData, tokens }) {
  const [selectedChain, setSelectedChain] = useState('');
  const [chainDetails, setChainDetails] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [escrowId, setEscrowId] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amountSentBySender, setAmountSentBySender] = useState('');
  const [amountSentByReceiver, setAmountSentByReceiver] = useState('');

  const handleChange = (chain) => {
    console.log("this is the testnet ", chain);
    console.log("hello this is the chain ", chain);
    setSelectedChain(chain);
    setChainDetails(chainData[chain]);
  };

  const handleTokenChange = (token) => {
    setSelectedToken(token);
    setTokenAddress(tokens[token]);
  };

  // Function to initiate escrow
  const initiateEscrow = async () => {
    try {
      // Ensure the user has MetaMask or another web3 provider
      if (!window.ethereum) {
        alert("Please install MetaMask or another web3 provider");
        return;
      }
            // Create a new web3 provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();


    // Ensure the user is connected to the correct network
    const network = await provider.getNetwork();
    if (network.chainId !== chainDetails.chainSelector) {
      alert(`Please switch to the correct network: ${chainDetails.name}`);
      return;
    }



      const Address='0xe4dB10384821b7cAF702bb4c2eF8a7F99d979fEe'
      // Create a contract instance
      const contract = new ethers.Contract(
        Address, // The address of the deployed contract
        EscrowAbi, // The ABI of the contract
        signer
      );

      // Call the initiateEscrow function on the contract
      const tx = await contract.initiateEscrow(
        escrowId,
        receiver,
        selectedToken,
        ethers.utils.parseUnits(amountSentBySender, 18),
        selectedToken, // Assuming the same token for simplicity, update as needed
        ethers.utils.parseUnits(amountSentByReceiver, 18)
      );

      await tx.wait();
      console.log("Escrow initiated:", tx);
    } catch (error) {
    if (error.code === ethers.errors.UNSUPPORTED_OPERATION) {
      console.error("Network does not support ENS. Ensure you are on the correct network.");
    } else {
      console.error("Error initiating escrow:", error);
    }
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
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Escorw
                  </legend>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Select the chain</Label>
                    <Select onValueChange={handleChange}>
                      <SelectTrigger id="model" className="items-start [&_[data-description]]:hidden">
                        <SelectValue placeholder="Select a chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(chainData).map((chain) => (
                          <SelectItem key={chain} value={chain}>
                            <div className="flex items-start gap-3 text-muted-foreground">
                              <div className="grid gap-0.5">
                                <p>
                                  Chain{" "}
                                  <span className="font-medium text-foreground">{chain}</span>
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {chainDetails && (
                      <div className="bg-gray-800 text-white p-4 rounded">
                        <h2 className="text-lg font-bold">{selectedChain}</h2>
                        <p>
                          <strong>Router Address:</strong> {chainDetails.routerAddress}
                        </p>
                        <p>
                          <strong>Chain Selector:</strong> {chainDetails.chainSelector}
                        </p>
                        <div>
                          <strong>Fee Tokens:</strong>
                          <ul>
                            {Object.entries(chainDetails.feeTokens).map(([token, address]) => (
                              <li key={token}>
                                {token}: {address}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Destination Chains:</strong>
                          <ul>
                            {chainDetails.destinationChainAddress.map((dest, index) => (
                              <li key={index}>
                                {dest.name}: {dest.address}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
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
                                  <p>
                                    Token{" "}
                                    <span className="font-medium text-foreground">{token}</span>
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {tokenAddress && (
                        <div className="bg-gray-800 text-white p-4 rounded mt-4">
                          <h2 className="text-lg font-bold">Selected Token: {selectedToken}</h2>
                          <p>
                            <strong>Token Address:</strong> {tokenAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-[26px]">
                    <Button type="button" onClick={initiateEscrow}>
                      Initiate Escrow
                    </Button>
                  </div>
                </fieldset>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Escrow;
