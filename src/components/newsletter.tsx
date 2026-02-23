"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // You can integrate with Buttondown, Resend, ConvertKit, etc.
        // For now, this is a placeholder that simulates success
        if (email) {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    return (
        <section className="rounded-lg border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Subscribe to the newsletter</h3>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
                Get notified when new posts are published. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                />
                <Button type="submit" size="sm">
                    Subscribe
                </Button>
            </form>
            {status === "success" && (
                <p className="text-green-500 text-sm mt-2">Thanks for subscribing! 🎉</p>
            )}
        </section>
    );
}
