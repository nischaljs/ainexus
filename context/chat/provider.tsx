
"use client"

import React, { useEffect, useState } from "react";
import ChatContext from "./context";
import { TChatSession, useChatSession } from "@/hooks/use-chat-session";
import { TStreamProps, useLLM } from "@/hooks/use-llm";

export type TChatProvider = {
  children: React.ReactNode
}



const ChatProvider = ({ children }: TChatProvider) => {
  const { getSessions, createNewSession } = useChatSession();

  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  const [lastStream, setLastStream] = useState<TStreamProps>();

  const { runModel } = useLLM({
    onStreamStart: () => {
      setLastStream(undefined)
      refetchSessions();
    },
    onStream: async (props) => {
      setLastStream(props)
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        setLastStream(undefined);
      })
    }
  })




  const fetchSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setIsSessionLoading(false);
  }


  const createSession = async () => {
    await createNewSession();
    fetchSessions()
  }


  useEffect(() => {
    setIsSessionLoading(true);
    fetchSessions();
  }, []);



  const refetchSessions = () => {
    fetchSessions();
  }
  return (
    <ChatContext.Provider value={{ sessions, refetchSessions, isSessionLoading, createSession, runModel, lastStream }}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
