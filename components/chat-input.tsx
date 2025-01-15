import { useChatContext } from "@/context/chat/context";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

export const ChatInput = () => {
    const params = useParams();
    const sessionId = params.sessionId as string; // Ensure sessionId is a string

    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { runModel, currentSession } = useChatContext();
    const isNewSession = !currentSession?.messages?.length;

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isSubmitting && inputValue.trim()) {
            setIsSubmitting(true);
            try {
                runModel(
                    {
                        role: RoleType.assistant,
                        type: PromptType.ask,
                        query: inputValue.trim(),
                    },
                    sessionId,
                );
                setInputValue("");
            } catch (error) {
                console.error("Failed to run model:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const examples = [
        "what is computational mathematics?",
        "what is the capital of Nepal?",
        "What is the total area of Nepal?",
        "What is the population of Owls?",
    ];

    return (
        <div className="w-full h-8 flex flex-col items-center justify-between bg-gray-100 absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70%  to-white/10 left-0 right-0">
            {isNewSession && <div></div>}
            <Input
                placeholder="Ask ainexus anything you want to..."
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
            />
        </div>
    );
};
