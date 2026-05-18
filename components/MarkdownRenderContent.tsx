"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type MarkdownRenderContentProps = {
  content?: string | null;
  variant?: "default" | "compact";
};

type ListBlock = {
  items: string[];
  type: "ordered" | "unordered";
};

export function MarkdownRenderContent({
  content,
  variant = "default",
}: MarkdownRenderContentProps) {
  const blocks = parseMarkdownBlocks(content ?? "");

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div
      className={
        variant === "compact"
          ? "space-y-4 text-sm leading-7 text-white/72"
          : "space-y-7 text-sm font-medium leading-8 text-white/75 sm:text-base"
      }
    >
      {blocks.map((block, index) => renderBlock(block, index, variant))}
    </div>
  );
}

function parseMarkdownBlocks(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Array<string | ListBlock> = [];
  let paragraph: string[] = [];
  let listBlock: ListBlock | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push(paragraph.join(" ").trim());
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listBlock) {
      blocks.push(listBlock);
      listBlock = null;
    }
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    const unorderedMatch = trimmedLine.match(/^[-*]\s+(.+)/);
    const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)/);

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      return;
    }

    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const type = orderedMatch ? "ordered" : "unordered";
      const value = (orderedMatch?.[1] ?? unorderedMatch?.[1] ?? "").trim();

      if (!listBlock || listBlock.type !== type) {
        flushList();
        listBlock = { items: [], type };
      }

      listBlock.items.push(value);
      return;
    }

    flushList();

    if (isStandaloneMarkdownBlock(trimmedLine)) {
      flushParagraph();
      blocks.push(trimmedLine);
      return;
    }

    paragraph.push(trimmedLine);
  });

  flushParagraph();
  flushList();

  return blocks;
}

function isStandaloneMarkdownBlock(value: string) {
  return /^(#{1,4}\s+|>\s+)/.test(value);
}

function renderBlock(
  block: string | ListBlock,
  index: number,
  variant: MarkdownRenderContentProps["variant"],
) {
  if (typeof block !== "string") {
    const ListTag = block.type === "ordered" ? "ol" : "ul";

    return (
      <ListTag
        key={`list-${index}`}
        className={`${
          block.type === "ordered" ? "list-decimal" : "list-disc"
        } space-y-3 pl-6 text-white/72 marker:text-gold-500`}
      >
        {block.items.map((item, itemIndex) => (
          <li key={`${item}-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ListTag>
    );
  }

  if (block.startsWith("#### ")) {
    return (
      <h4
        key={`h4-${index}`}
        className="font-display text-2xl font-bold leading-tight text-white"
      >
        {renderInlineMarkdown(block.slice(5))}
      </h4>
    );
  }

  if (block.startsWith("### ")) {
    return (
      <h3
        key={`h3-${index}`}
        className="font-display text-3xl font-bold leading-tight text-white"
      >
        {renderInlineMarkdown(block.slice(4))}
      </h3>
    );
  }

  if (block.startsWith("## ")) {
    return (
      <h2
        key={`h2-${index}`}
        className="font-display text-4xl font-bold leading-tight text-white"
      >
        {renderInlineMarkdown(block.slice(3))}
      </h2>
    );
  }

  if (block.startsWith("# ")) {
    return (
      <h2
        key={`h1-${index}`}
        className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
      >
        {renderInlineMarkdown(block.slice(2))}
      </h2>
    );
  }

  if (block.startsWith("> ")) {
    return (
      <blockquote
        key={`quote-${index}`}
        className="border-l-4 border-gold-500 bg-white/[0.055] px-5 py-4 font-display text-2xl font-bold leading-snug text-white"
      >
        {renderInlineMarkdown(block.slice(2))}
      </blockquote>
    );
  }

  return (
    <p
      key={`p-${index}`}
      className={
        variant === "compact"
          ? "text-sm leading-7 text-white/70"
          : "max-w-full text-base leading-8 text-white/75"
      }
    >
      {renderInlineMarkdown(block)}
    </p>
  );
}

function renderInlineMarkdown(value: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${token}-${match.index}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-black text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em key={key} className="italic text-white/85">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-white/10 px-1.5 py-0.5 text-sm font-bold text-gold-300"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const label = linkMatch?.[1] ?? token;
      const href = linkMatch?.[2] ?? "#";
      const isExternal = /^https?:\/\//.test(href);

      nodes.push(
        isExternal ? (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-gold-500 underline underline-offset-4 transition-colors duration-200 hover:text-green-500"
          >
            {label}
          </a>
        ) : (
          <Link
            key={key}
            href={href}
            className="font-bold text-gold-500 underline underline-offset-4 transition-colors duration-200 hover:text-green-500"
          >
            {label}
          </Link>
        ),
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
}
