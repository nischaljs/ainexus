"use client";


import { ChatInput } from "@/components/chat-input";
import { useParams } from "next/navigation";

  const ChatSessionPage = ()=>{
    const{sessionId} = useParams();

    return(
        <div>
            <ChatInput/>
        </div>
    )
}


export default ChatSessionPage;