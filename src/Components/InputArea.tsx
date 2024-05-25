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
  SquareTerminal,
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
} from "@/components/ui/tooltip"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Aside from './Aside';
import Navbar from "./Navbar"

const InputArea = () => {
  const [messages, setMessages] = useState([]); // State to hold all messages
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add the new message to the beginning of the list of messages
    setMessages([{ text: message, sender: 'user' }, ...messages]);
    // Clear the input field after submitting
    setMessage('');

    // Define the chatbot responses
    const botResponses = {
      'hello': ["Hello!", "Hi there!", "Hey! How can I assist you today?"],
      'sell': [
        <div key="sell">
          Sure, I can help you with that. Please click on the button below to proceed.
          <Button onClick={() => navigate('/escrow')} size="sm" className="items-center">
            Sell
            <CornerDownLeft className="size-3.5 " />
          </Button>
        </div>
      ],
      'buy': [
        <div key="buy">
          Absolutely! Let me assist you with that. Click the button below to get started.
          <Button onClick={() => navigate('/escrow')} size="sm" className="ml-2">
            Buy
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      ],
      'help': ["I'm here to help! What do you need assistance with?"],
      // Add more triggers and responses as needed
    };

    // Check if the message triggers a response
    for (const trigger in botResponses) {
      if (message.toLowerCase().includes(trigger)) {
        // If the message triggers a response, add it to the chat
        const response = botResponses[trigger];
        setMessages([{ text: response, sender: 'bot' }, ...messages]);
        break; // Exit loop after finding the first match
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex-1">
      <Aside />
      <Navbar/>
      <div className="mt-4 w-[20rem] mx-auto">
        {/* Display all messages */}
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}>
            <div className={`bg-gray-100 text-black p-2 rounded-md ${msg.sender === 'bot' ? 'ml-2' : 'mr-2'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 mb-[1rem] text-center p-4 overflow-hidden rounded-lg mx-auto w-[80%] border bg-background focus-within:ring-1 focus-within:ring-ring">
        <Label htmlFor="message" className="sr-only">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={handleChange}
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;