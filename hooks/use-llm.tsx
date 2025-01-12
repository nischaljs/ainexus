import { ModelType, PromptProps, TChatMessage, useChatSession } from "./use-chat-session";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { v4 } from "uuid";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getInstruction, getRole } from "@/lib/prompts";

export type TStreamProps = {
    props: PromptProps;
    sessionId: string;
    message: string;
};

export type TUseLLM = {
    onStreamStart: () => void;
    onStream: (props: TStreamProps) => Promise<void>;
    onStreamEnd: () => void;
};

const MAX_CONCURRENT_REQUESTS = 5;
let activeRequests = 0;
const requestQueue: (() => Promise<void>)[] = [];

const enqueueRequest = async (fn: () => Promise<void>) => {
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
        activeRequests++;
        await fn();
        activeRequests--;
        if (requestQueue.length > 0) {
            const nextFn = requestQueue.shift();
            if (nextFn) enqueueRequest(nextFn);
        }
    } else {
        requestQueue.push(fn);
    }
};

export const useLLM = ({ onStream, onStreamEnd, onStreamStart }: TUseLLM) => {
    const { getSessionById, addMessageToSession } = useChatSession();

    const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
        const messageHistory = history.slice(-6); // Use only the last 6 messages for history
        const prompt = ChatPromptTemplate.fromMessages(
            messageHistory.length > 0
                ? [
                      ["system", "You are {role}. Answer user's question based on the following context:"],
                      new MessagesPlaceholder("chat_history"),
                      ["user", "{input}"],
                  ]
                : props?.context
                ? [
                      ["system", "You are {role}. Answer user's questions based on the following context: {context}"],
                      ["user", "{input}"],
                  ]
                : [["system", "You are {role}. {type}"], ["user", "{input}"]]
        );

        const previousMessageHistory = messageHistory.reduce(
            (acc: (HumanMessage | AIMessage)[], { rawAi, rawHuman }) => [
                ...acc,
                new HumanMessage(rawHuman),
                new AIMessage(rawAi || ""),
            ],
            []
        );

        return await prompt.formatMessages(
            messageHistory.length > 0
                ? {
                      role: getRole(props.role),
                      chat_history: previousMessageHistory,
                      input: props.query,
                  }
                : {
                      role: getRole(props.role),
                      type: getInstruction(props.type),
                      context: props.context,
                      input: props.query,
                  }
        );
    };

    const runModel = async (props: PromptProps, sessionId: string) => {
        const currentSession = await getSessionById(sessionId);

        if (!props?.query) {
            return;
        }

        const apiKey = "";
        console.log("called openai");
        const model = new  ChatGoogleGenerativeAI({
            modelName: "gemini-1.5-flash",
            apiKey :  process.env.NEXT_PUBLIC_GEMINI_API_KEY || apiKey,
            streaming : true
        });

        const newMessageId = v4();

        const formattedChatPrompt = await preparePrompt(
            props,
            currentSession?.messages || []
        );

        const stream = await model.stream(formattedChatPrompt);
        console.log(stream, 'streamed message looks like this ');

        let streamedMessage = "";

        onStreamStart();

        for await (const chunk of stream) {
            console.log(stream);
            streamedMessage += chunk.content;
            await onStream({ props, sessionId, message: streamedMessage });
        }
        console.log("streamed message",streamedMessage);

        const chatMessage = {
            id: newMessageId,
            model: ModelType.GEMINIFLASH,
            human: new HumanMessage(props.query),
            ai: new AIMessage(streamedMessage),
            rawHuman: props.query,
            rawAi: streamedMessage,
            props,
        };

        console.log("chat message" , chatMessage);
        addMessageToSession(sessionId, chatMessage).then(() => {
            console.log('added message to session');
            onStreamEnd();
        });
    };

    const rateLimitedRunModel = (props: PromptProps, sessionId: string) => {
        enqueueRequest(() => runModel(props, sessionId));
    };

    return {
        runModel: rateLimitedRunModel,
    };
};
