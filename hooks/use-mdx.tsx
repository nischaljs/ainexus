import Markdown from "marked-react";
import { ReactNode } from "react";

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

            return <h1 className="font-medium text-md">{children}</h1>;
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
                {children}
              </List>
            );
          },
          listItem: (children: ReactNode) => (
            <li className="my-4">
              <p className="leading-7 text-sm">{children}</p>
            </li>
          ),
          code: (code: string, lang: string) => (
            <div className="my-8">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          ),
          codespan: (code: string) => (
            <span className="px-2 py-1 text-xs rounded text-[#41e696] bg-[#41e696]/10">
              {code}
            </span>
          ),
        }}
      >
        {message}
      </Markdown>
    );
  };

  return {
    renderMarkdown,
  };
};
