"use client";

import { useEffect, useState } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ htmlContent }: { htmlContent: string }) {
    const [items, setItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const headings = doc.querySelectorAll("h2, h3");
        const tocItems: TocItem[] = [];

        headings.forEach((heading) => {
            const text = heading.textContent || "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            tocItems.push({
                id,
                text,
                level: parseInt(heading.tagName.replace("H", "")),
            });
        });

        setItems(tocItems);
    }, [htmlContent]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -80% 0px" }
        );

        items.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length < 2) return null;

    return (
        <nav className="hidden xl:block fixed right-8 top-24 w-56 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">On this page</h4>
            <ul className="space-y-1.5 text-sm">
                {items.map((item) => (
                    <li
                        key={item.id}
                        style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
                    >
                        <a
                            href={`#${item.id}`}
                            className={`block py-0.5 transition-colors hover:text-foreground ${activeId === item.id ? "text-foreground font-medium" : "text-muted-foreground"
                                }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
