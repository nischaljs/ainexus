import { PromptProps, TChatMessage, useChatSession } from "./use-chat-session"
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { v4 } from "uuid"
import { AIMessage, HumanMessage } from "@langchain/core/messages"






export const useLLM = () => {

    const { getSessionById, addMessageToSession } = useChatSession();


    const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
        const messageHistory = history;
        const prompt = ChatPromptTemplate.fromMessages(
            messageHistory?.length > 0 ? [["system", "You are {role} Answer user's question based on the following context : "], new MessagesPlaceholder("chat_history"), ["user", "{input}"]] : [
                props?.context?[
                    "system",
                    "You are {role}. Answer user's wuestions based on the following context :  {context}"
                ] : [
                    "system" , "You are {role} . {type}"
                ],
                ["user","{input}"],
            ]
        );
        const previousMessageHistory = messageHistory.reduce(
        (acc:(HumanMessage | AIMessage) [],{rawAI,rawHuman})=>[
            ...acc,
            new HumanMessage(rawHuman),
            new AIMessage(rawAI),
        ],
    []
);

//   TODO: needed to return something 
    }
    const runModel = async (props: PromptProps, sessionId: string) => {
        const currentSession = await getSessionById(sessionId);

        if (!props?.query) {
            return;
        }
        const apiKey = "";
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            openAIApiKey: apiKey
        })

        const newMessageId = v4();



    }
}