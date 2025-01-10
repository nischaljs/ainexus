import { useChatContext } from "@/context/chat/context";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

export const ChatInput = () => {

    const { sessionId } = useParams();

    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { runModel } = useChatContext();


    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isSubmitting && inputValue.trim()) {
            setIsSubmitting(true);
            await runModel(
                {
                    role: RoleType.assistant,
                    type: PromptType.ask,
                    query: inputValue.trim(),
                },
                sessionId!.toString()
            );
            setInputValue("");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-8 flex flex-row bg-gray-100">
            <Input
                placeholder="Ask ainexus anything you want to..."
                onChange={(e) => setInputValue(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
            />
        </div>
    );

}
