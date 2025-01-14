import { useChatContext } from "@/context/chat/context";
import { TChatSession, useChatSession } from "@/hooks/use-chat-session";
import { useMarkDown } from "@/hooks/use-mdx";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";



export const ChatMessages = () => {
  const { sessionId } = useParams();
  const { lastStream } = useChatContext();
  const{renderMarkdown}  = useMarkDown();
  const [currentSession, setCurrentSession] = useState<TChatSession | undefined>();

  const { getSessionById } = useChatSession();

  const fetchSession = async () => {
    getSessionById(sessionId!.toString()).then((session) => {
      if(!session) return;
      setCurrentSession(session);
    })
  }


  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchSession();
    console.log(currentSession?.messages)

  }, [sessionId]);


  useEffect(() => {
    if (!lastStream) {
      fetchSession();
    }
  }, [lastStream])

  const isLastStreamBelongsToCurrentSession = lastStream?.sessionId === sessionId;

  return (
    <div>
      {currentSession?.messages.map((message) => (
        <div className="p-2" key={message.id}>
          {message.rawHuman}
          {renderMarkdown(message.rawAi || "AI didnot respond")}
        </div>
      ))}
      {
        isLastStreamBelongsToCurrentSession && (
          <div className="p-2">
            {lastStream?.props?.query}
            {renderMarkdown(lastStream?.message || "processing....")}
          </div>
        )
      }
    </div>
  )
}
