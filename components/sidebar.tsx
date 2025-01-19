"use client";

import { useChatContext } from "@/context/chat/context";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const Sidebar: React.FC = () => {
  const { sessions, createSession } = useChatContext();
  const { push } = useRouter();

  const handleCreateSession = async () => {
    try {
      await createSession();
      push(`/chat/${sessions[sessions?.length-1].id}`);
    } catch (error) {
      console.error("Failed to create sessions:", error);
    }
  };

  return (
    <div className="w-[250px] flex flex-col h-screen">
      <Button onClick={handleCreateSession}>New Session</Button>
      {sessions?.length > 0 ? (
        sessions.map((session) => (
          <div
            className="p-2 cursor-pointer"
            onClick={() => push(`/chat/${session.id}`)}
            key={session.id}
          >
            {session.title}
          </div>
        ))
      ) : (
        <div>No sessions found</div>
      )}
    </div>
  );
};