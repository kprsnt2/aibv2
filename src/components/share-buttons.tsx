"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== "undefined"
        ? `${window.location.origin}/blog/${slug}`
        : `/blog/${slug}`;

    const shareOnTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const shareOnLinkedIn = () => {
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-1">Share:</span>
            <Button variant="ghost" size="icon-sm" onClick={shareOnTwitter} aria-label="Share on Twitter">
                <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={shareOnLinkedIn} aria-label="Share on LinkedIn">
                <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={copyLink} aria-label="Copy link">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
            </Button>
        </div>
    );
}
