import { slugify } from "../libs/toc";

import { HeadingAnchor } from "./copy-link";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText(
      (node as { props: { children?: React.ReactNode } }).props.children
    );
  }
  return "";
}

function createHeading(Tag: "h2" | "h3") {
  return function Heading({ children }: { children?: React.ReactNode }) {
    const id = slugify(extractText(children));
    return (
      <Tag id={id} className="scroll-mt-24">
        <HeadingAnchor id={id}>{children}</HeadingAnchor>
      </Tag>
    );
  };
}

export const MdxH2 = createHeading("h2");
export const MdxH3 = createHeading("h3");
