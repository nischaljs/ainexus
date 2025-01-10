import { ModelType, PromptProps, TChatMessage, useChatSession } from "./use-chat-session"
import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { v4 } from "uuid"
import { AIMessage, HumanMessage } from "@langchain/core/messages"
import { getInstruction, getRole } from "@/lib/prompts"



export type TStreamProps = {
    props:PromptProps;
    sessionId:string;
    message:string ;
}


export type TUseLLM = {
    onStreamStart : () =>void;
    onStream : (props:TStreamProps) => Promise<void> ;
    onStreamEnd: () => void
}


export const useLLM = ({onStream,onStreamEnd,onStreamStart}:TUseLLM) => {

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
            new AIMessage(rawAI || ""),
        ],
    []


);

    return await prompt.formatMessages(
        messageHistory?.length>0  ? {
            role:getRole(props.role),
            chat_history :previousMessageHistory,
            input:props.query
        }:{
            role:getRole(props.role),
            type:getInstruction(props.type),
            Context:props.context,
            input:props.query
        }
    ) 
    }
    const runModel = async (props: PromptProps, sessionId: string) => {
        const currentSession = await getSessionById(sessionId);

        if (!props?.query) {
            return;
        }
        const apiKey = "";
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            openAIApiKey: apiKey || process.env.PUBLIC_OPENAI_API_KEY
        })

        const newMessageId = v4();


        const formattedChatPrompt = await preparePrompt(
            props,
            currentSession?.messages || []
        );

        const stream = await model.stream(formattedChatPrompt)

        let streamedMessage = ""


        onStreamStart();

        for await(const chunk of stream){
            streamedMessage += chunk.content;
            onStream({props,sessionId,message:streamedMessage});
        }


        const chatMessage = {
            id:newMessageId,
            model:ModelType.GPT3,
            human: new HumanMessage(props.query),
            ai : new AIMessage(streamedMessage),
            rawHuman:props.query,
            rawAi:streamedMessage,
            props,
        };


        addMessageToSession(sessionId,chatMessage).then(()=>{
            onStreamEnd();
        });



    }
    return {
        runModel
    }
}