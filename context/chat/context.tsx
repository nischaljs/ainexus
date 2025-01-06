"use client";


import { PromptProps, TChatSession } from "@/hooks/use-chat-session"
import { createContext, useContext } from "react";


export type TChatContext = {
    sessions :TChatSession[];
    refetchSessions: () =>void;
    inSessingLoading :boolean;
    createSession : () => void;
    lastStream?:TStreamProps;
    runModel:(props:PromptProps,sessionId:string) => Promise<void>;
    
}

 const ChatContext = createContext<TChatContext | undefined> (undefined);


export const useChatContext  = () =>{
    const context = useContext(ChatContext)

    if(!context){
        throw  new Error ("useChatContext must be used within the cotnext provider");
    }
    return context;
}

export default ChatContext;