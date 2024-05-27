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
} from "@/components/ui/dialog";
import Aside from "@/Components/Aside";
import Navbar from '@/Components/Navbar';
import { chainData } from "../utils/chainData";
import WalletButton from '../Components/WalletConnet'; 
import TokenAbi from "../Abis/Erc20.json";
// import { tokens } from "./utils/Tokens";

import SourceMinterABI from '../Abis/source.json'; 

const SourceMinterPage = ({ chainData, tokens }) => {
  const [destinationChainSelector, setDestinationChainSelector] = useState("");
  const [receiver, setReceiver] = useState("");
  const [payFeesIn, setPayFeesIn] = useState("Native");
  const [messageId, setMessageId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");
  const [chainDetails, setChainDetails] = useState(null);
  const [selectedToken, setSelectedToken] = useState("");

  const handleChainChange = (chainKey) => {
    const chain = chainData[chainKey];
    setSelectedChain(chainKey);
    setChainDetails(chain);
  };

  const sourceMinterAddress = "0x11388fD30bc92b4bDCaaC06cDac102cca9B80D53"; // Replace with your contract address

  const mint = async () => {
  if (!window.ethereum) {
    alert("MetaMask is required!");
    return;
  }

  try {
    setIsSending(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request user's wallet

    const signer = provider.getSigner();
    const sourceMinterContract = new ethers.Contract(
      sourceMinterAddress,
      SourceMinterABI,
      signer
    );

    // Parse the large chain value as a BigNumber
    const destinationChainSelectorParsed = ethers.BigNumber.from(chainDetails.value);
    const payFeesInEnum = payFeesIn === "LINK" ? 1 : 0;

    console.log(destinationChainSelectorParsed);
    console.log(receiver);
    console.log(payFeesInEnum);

    // Check if the function accepts value before including it in the transaction
    const overrides = {};
    if (sourceMinterContract.interface.getFunction("mint").payable) {
      // Example of handling a large number, adjust according to your needs
      const feeAmount = payFeesInEnum === 0 ? ethers.utils.parseEther("0.01") : ethers.constants.Zero;
      overrides.value = feeAmount;
    }

    const tx = await sourceMinterContract.mint(
      destinationChainSelectorParsed,
      receiver,
      payFeesInEnum,
      overrides
    );

    const receipt = await tx.wait();
    const event = receipt.events.find((event) => event.event === "MessageSent");
    setMessageId(event.args.messageId);

    alert(`Transaction successful with Message ID: ${event.args.messageId}`);
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error sending message: " + error.message);
  } finally {
    setIsSending(false);
  }
};

  return (
    <>
      <div>
        <Navbar />
        <Aside />
        <div className="grid h-screen w-full pl-[56px]">
          <div className="flex flex-col">
            <main className="flex-1 flex justify-center items-center mx-auto gap-4 overflow-auto p-4">
              <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
                <form className="grid w-[24rem] items-start gap-6">
                  <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">NFT MINTER</legend>
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
                      <Label htmlFor="receiver">Receiver Address</Label>
                      <Input id="receiver" type="text" placeholder="0x.." value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                    </div>
                    <div className="mt-[26px]">
                      <Label htmlFor="token">Select a Token</Label>
                      <Select value={payFeesIn} onValueChange={(value) => setPayFeesIn(value)}>
                        <SelectTrigger id="token" className="items-start [&_[data-description]]:hidden">
                          <SelectValue placeholder="Select a Token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Native"> NATIVE</SelectItem>
                          <SelectItem value="LINK"> LINK </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="mt-[26px]">
                        <Button type="button" onClick={mint} disabled={isSending}>{isSending ? 'Minting...' : 'Mint'}</Button>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default SourceMinterPage;