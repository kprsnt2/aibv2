"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusProps {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
}

export function GiscusComments({ repo, repoId, category, categoryId }: GiscusProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        if (!ref.current) return;

        // Only load if configured (non-placeholder values)
        if (!repo || repo === "your-username/your-repo") return;

        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", repo);
        script.setAttribute("data-repo-id", repoId);
        script.setAttribute("data-category", category);
        script.setAttribute("data-category-id", categoryId);
        script.setAttribute("data-mapping", "pathname");
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "top");
        script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light");
        script.setAttribute("data-lang", "en");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        ref.current.innerHTML = "";
        ref.current.appendChild(script);
    }, [repo, repoId, category, categoryId, resolvedTheme]);

    if (!repo || repo === "your-username/your-repo") {
        return null;
    }

    return <div ref={ref} className="mt-12 pt-8 border-t border-border" />;
}
