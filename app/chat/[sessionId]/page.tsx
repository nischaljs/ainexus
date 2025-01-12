"use client";


import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { useParams } from "next/navigation";

const ChatSessionPage = () => {
  const { sessionId } = useParams();

  return (
    <div className="w-full h-screen flex flex-col">
      <ChatMessages />
      <ChatInput />
    </div>
  )
}


export default ChatSessionPage;
