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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
    TooltipTrigger,
    TooltipProvider,
  
} from "@/components/ui/tooltip"
import Aside from "@/Components/Aside"
import Navbar from '@/Components/Navbar';
import { useState } from "react"
import {chainData} from "../utils/chainData"

export function Escrow({ chainData:any,tokens }) {
  const [selectedChain, setSelectedChain] = useState('');
  const [chainDetails, setChainDetails] = useState(null);
   const [selectedToken, setSelectedToken] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  console.log(chainData)

console.log(tokens)

  const handleChange = (event: any) => {
    console.log("this is the testnet ",event)
    const chain = event;
    console.log("hello this is the chain ",chain)
    setSelectedChain(chain);
    setChainDetails(chainData[chain]);
  };
    
 
    const TokenChange:any = (token) => {
   console.log(token)
    setSelectedToken(token);
    setTokenAddress(tokens[token]);

    console.log(tokenAddress)
    console.log(selectedChain)

  };
  return (
    <div>
            <Navbar/>

      <Aside/>
    <div className="grid h-screen w-full pl-[56px]">
     
      <div className="flex flex-col">
       
        <main className="flex-1 flex justify-center items-center mx-auto gap-4 overflow-auto p-4 ">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
          >
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
                  <Label htmlFor="temperature">Escorw Name</Label>
                  <Input id="temperature" type="text" placeholder="Sample" />
                  </div>
                  
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Senders Address</Label>
                    <Input id="top-p" type="text" placeholder="0x.." />
                    </div>

                    <div className="grid gap-3">
                    <Label htmlFor="top-p">Amount</Label>
                    <Input id="top-p" type="number" placeholder="1" />
                    </div>

 <div className="mt-[26px]">
      <Label htmlFor="token">Select a Token</Label>
      <Select onValueChange={TokenChange}>
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
              
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Details
                  </legend>
                  
                     <div className="grid gap-3">
                  <Label htmlFor="model">Select the chain </Label>
                  <Select>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a chain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Rabbit className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Genesis
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Our fastest model for general use cases.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Bird className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Explorer
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Performance and speed for efficiency.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Turtle className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Quantum
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              The most powerful model for complex computations.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

                               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Recievers Address</Label>
                    <Input id="top-p" type="text" placeholder="0x.." />
                    </div>

                     <div className="grid gap-3">
                    <Label htmlFor="top-p"> Amount</Label>
                    <Input id="top-p" type="number" placeholder="1" />
                    </div>

<div  className="mt-[26px]">
                      <Select>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Select a Token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Rabbit className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Genesis
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Our fastest model for general use cases.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Bird className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Explorer
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Performance and speed for efficiency.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Turtle className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Neural{" "}
                              <span className="font-medium text-foreground">
                                Quantum
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              The most powerful model for complex computations.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                    </div>
                    
                  </div>
              </fieldset>
            </form>
          </div>
          
        </main>
      </div>
      </div>
      </div>
  )
}
