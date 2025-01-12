import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { get, set } from "idb-keyval";
import { v4 } from 'uuid';

export enum ModelType {
  GPT3 = 'gpt-3',
  GPT4 = 'gpt-4',
  CLAUDE2 = 'claude-2',
  CLAUDE3 = 'claude-3',
  GEMINIFLASH = 'gemini1.5-flash',
}

export enum PromptType {
  ask = 'ask',
  answer = 'answer',
  explain = 'explain',
  summarize = 'summarize',
  improve = 'improve',
  fix_grammar = 'fix_grammar',
  reply = 'reply',
  short_reply = 'short-reply',
}

export enum RoleType {
  assistant = 'assistant',
  content_writer = 'content-writer',
}

export type PromptProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  regenerate?: boolean;
};

export type TChatMessage = {
  id: string;
  model: ModelType;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAi?: string;
  props?: PromptProps;
  createdAt?: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
};

export const useChatSession = () => {
  const getSessions = async (): Promise<TChatSession[]> => {
    try {
      const sessions = await get('chat-sessions');
      return sessions || []; // Return an empty array if no sessions exist
    } catch (error) {
      console.error("Failed to get sessions:", error);
      return [];
    }
  };

  const setSession = async (chatSession: TChatSession) => {
    try {
      const sessions = await getSessions();
      const newSessions = [...sessions, chatSession];
      await set('chat-sessions', newSessions);
    } catch (error) {
      console.error("Failed to set session:", error);
    }
  };

  const getSessionById = async (id: string) => {
    try {
      const sessions = await getSessions();
      return sessions.find((session: TChatSession) => session.id === id);
    } catch (error) {
      console.error("Failed to get session by ID:", error);
      return null;
    }
  };

  const removeSessionById = async (id: string) => {
    try {
      const sessions = await getSessions();
      const newSessions = sessions.filter((session: TChatSession) => session.id !== id);
      await set("chat-sessions", newSessions);
    } catch (error) {
      console.error("Failed to remove session:", error);
    }
  };

  const addMessageToSession = async (sessionId: string, chatMessage: TChatMessage) => {
    try {
      const sessions = await getSessions();
      const newSessions = sessions.map((session: TChatSession) => {
        if (session.id === sessionId) {
          return { ...session, messages: [...session.messages, chatMessage] };
        }
        return session;
      });
      await set("chat-sessions", newSessions);
    } catch (error) {
      console.error("Failed to add message to session:", error);
    }
  };

  const createNewSession = async () => {
    try {
      const sessions = await getSessions();
      const newSession: TChatSession = {
        id: v4(),
        messages: [],
        title: "Untitled",
        createdAt: new Date().toISOString(),
      };
      const newSessions = [newSession, ...sessions]; // Add new session to the beginning of the list
      await set("chat-sessions", newSessions);
      console.log("New session created:", newSession);
      return newSession;
    } catch (error) {
      console.error("Failed to create new session:", error);
      return null;
    }
  };

  const updateSession = async (sessionId: string, newSession: Partial<TChatSession>) => {
    try {
      const sessions = await getSessions();
      const newSessions = sessions.map((session: TChatSession) => {
        if (session.id === sessionId) {
          return {
            ...session,
            ...newSession,
          };
        }
        return session;
      });
      await set("chat-sessions", newSessions);
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  return {
    getSessions,
    setSession,
    getSessionById,
    removeSessionById,
    addMessageToSession,
    updateSession,
    createNewSession,
  };
};