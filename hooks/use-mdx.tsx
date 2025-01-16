import { CodeBlock } from "@/components/codeblock";
import Markdown from "marked-react";
import React, { ReactNode } from "react";

// Utility function to conditionally join class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

export const useMarkDown = () => {
  const renderMarkdown = (message: string) => {
    return (
      <Markdown
        renderer={{
          paragraph: (children: ReactNode) => (
            <p className="text-sm leading-7">{children}</p>
          ),
          heading: (children: ReactNode, level: number) => {
            const Heading = `h${level}`;
            return <Heading className="font-medium text-md">{children}</Heading>;
          },
          link: (href: string, text: string) => {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {text}
              </a>
            );
          },
          blockquote: (children: ReactNode) => (
            <div>
              <p className="text-sm leading-7">{children}</p>
            </div>
          ),
         list: (children: ReactNode, ordered: boolean) => {
  const List = ordered ? "ol" : "ul";
  return (
    <List
      className={cn(
        ordered ? "list-decimal" : "list-disc",
        "ml-8"
      )}
    >
      {React.Children.map(children, (child, index) => (
        React.isValidElement(child) ? React.cloneElement(child, { key: index }) : child
      ))}
    </List>
  );
},
listItem: (children: ReactNode[]) => (
  <>
    {children.map((child, index) => (
      <li key={index} className="my-4">
        <p className="leading-7 text-sm">{child}</p>
      </li>
    ))}
  </>
),          code: (code: string, lang: string) => (
            <div className="my-8">
              <pre>
                <CodeBlock code={code} lang={lang} /> 
              </pre>
            </div>
          ),
          codespan: (code: string) => (
            <span className="px-2 py-1 text-xs rounded text-[#41e696] bg-[#41e696]/10">
              {code}
            </span>
          ),
        }}
        key={message}
      >
        {message}
      </Markdown>
    );
  };

  return {
    renderMarkdown,
  };
};
