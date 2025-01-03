import { PromptType, RoleType } from "@/hooks/use-chat-session";


export const getRole = (type:RoleType) =>{
    switch(type){
        case RoleType.assistant:
            return "assistant";
            case RoleType.content_writer:
                return "a content writer best in writing digital contents";
    }
}


export const getInstruction = (type:PromptType) =>{
    switch(type){
        case PromptType.ask:
            return "based on {userQuery]"
        case PromptType.answer:
            return "Answer this Question"
        case PromptType.explain:
            return "Explain this"
        case PromptType.summarize:
            return "summarize this"
        case PromptType.improve:
            return "Improve this"
        case PromptType.fix_grammar:
            return "Fix the grammar and types"
        case PromptType.reply:
            return "Reply to this tweet, social media post or comment with helpful response, dont use any offensive languages and make it engaging and personalized"
        case PromptType.short_reply:
            return"Reply to this tweet, social media post, comment in short sentence (limited to 40 words)"
    }
}