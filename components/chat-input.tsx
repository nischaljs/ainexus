import { useChatContext } from "@/context/chat/context";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";

export const ChatInput = () => {

    const { sessionId } = useParams();

    const [inputValue, setInputValue] = useState("");

    const { runModel } = useChatContext();

    return (
        <div>
            <Input placeholder="Ask ainexus anything you want to ....."/>
        </div>
    )
}
