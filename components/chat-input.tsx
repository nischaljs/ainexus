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

  const { runModel } = useChatContext();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting && inputValue.trim()) {
      setIsSubmitting(true);
      try {
        await runModel(
          {
            role: RoleType.assistant,
            type: PromptType.ask,
            query: inputValue.trim(),
          },
          sessionId
        );
        setInputValue("");
      } catch (error) {
        console.error("Failed to run model:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full h-8 flex flex-row bg-gray-100">
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