import hljs from "highlight.js";
import { useEffect, useRef } from "react";

import { useClipboard } from "@/hooks/use-clipboard";
import { Copy01Icon, Tick01Icon } from "hugeicons-react";
import { Button } from "./ui/button";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"; // Correct import for Shadcn UI Tooltip
import { TooltipProvider } from "./ui/tooltip"; // Ensure this is the correct import path

export type codeBlockProps = {
    lang?: string;
    code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
    const ref = useRef<HTMLElement>(null);
    const { copy, showCopied } = useClipboard();
    const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";

    useEffect(() => {
        if (ref?.current && code) {
            const highlightedCode = hljs.highlight(language, code).value;
            ref.current.innerHTML = highlightedCode;
        }
    }, [code, language]);

    return (
        <div className="not-prose bg-zinc-50/30 border overflow-hidden border-zinc-50 dark:border-white/5 text-zinc-600 dark:text-white dark:bg-black/20 rounded-xl w-full flex-shrink-0">
            <div className="p-1 w-full flex justify-between items-center border-b border-zinc-50 dark:border-white/5">
                <p className="text-xs px-2 text-zinc-500">{language}</p>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="!text-xs"
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    copy(code || "code was not copied");
                                }}
                            >
                                {showCopied ? (
                                    <Tick01Icon
                                        size={14}
                                        fontVariant={"stroke"}
                                        strokeWidth="2"
                                    />
                                ) : (
                                    <Copy01Icon
                                        size={14}
                                        fontVariant={"stroke"}
                                        strokeWidth="2"
                                    />
                                )}{" "}
                                {showCopied ? "Copied!" : "Copy"}
                            </Button>
                        </TooltipTrigger>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <pre className="w-full px-6 py-2">
                <code
                    className={`hljs language-${language} tracking-wide whitespace-pre-wrap break-words overflow-x-auto w-full inline-block pr-[100%] text-xs md:text-sm`}
                    ref={ref}
                ></code>
            </pre>
        </div>
    );
};
