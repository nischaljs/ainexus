import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { get, set } from "idb-keyval";



export enum ModelType {
    GPT3 = 'gpt-3',
    GPT4 = 'gpt-4',
    CLAUDE2 = 'claude-2',
    CLAUDE3 = 'claude-3'
}


export enum PromptType {
    ask = 'ask',
    answer = 'answer',
    explain = 'explain',
    summarize = 'summarize',
    improve = 'improve',
    fix_grammar = 'fix_grammar',
    reply = 'reply',
    short_reply = 'shprt-reply'

}

export enum RoleType {
    assistant = 'assistant',
    content_writer = 'content-writer'
}

export type PromptProps = {
    type: PromptType;
    context?: string;
    RoleType: RoleType;
    query?: string;
    regenerate?: boolean
}

export type TChatMessage = {
    id: string;
    model: ModelType;
    human: HumanMessage;
    ai: AIMessage;
    rawHuman: string;
    rawAI?:string;
    props?: PromptProps;
    createdAt?: string
}


export type TChatSession = {
    messages: TChatMessage[];
    title?: string;
    id: string;
    createdAt: string
}

export const useChatSession = () => {
    const getSessions = async ():Promise<TChatSession[]> => {
        return (await get('chat-sessions') || []);
    };

    const setSession = async (chatSession: TChatSession) => {
        const sessions = await getSessions()
        const newSessions = [...sessions, chatSession];
        await set('chat-sessions', newSessions);
    };

    const getSessionById = async (id: string) => {
        const sessions = await getSessions();
        return sessions.find((session: TChatSession) => session.id === id)
    }

    const removeSessionById = async (id: string) => {
        const sessions = await getSessions();
        const newSessions = sessions.filter(
            (session: TChatSession) => session.id !== id
        );
        await set("chat-sessions", newSessions);

    }

    const addMessageToSession = async(sessionId:string, chatMessage:TChatMessage) =>{
        const sessions = await getSessions();
        const newSessions = sessions.map((session:TChatSession) =>{
            if(sessionStorage.id === sessionId){
                return { ...session, messages:[...session.messages,chatMessage]};
            }
            return session;
        });
        await set("chat-sessions",newSessions);
    }


    const updateSession = async (sessionId:string, newSession:Omit<TChatSession,"id">)=>{
        const sessions = await getSessions();
        const newSessions = sessions.map((session:TChatSession)=>{
            if(session.id ===sessionId){
                return{
                    ...session,
                    ...newSession
                };
            }
            return session;
        })
        await set("chat-sessions",newSessions);
    }

    return {
        getSessions,
        setSession,
        getSessionById,
        removeSessionById,
        addMessageToSession,
        updateSession
    }
}