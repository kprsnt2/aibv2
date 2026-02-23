import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import profile from "../../content/profile.json";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex h-14 items-center justify-between px-6">
                <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
                    {profile.name}
                </Link>
                <nav className="flex items-center gap-4">
                    <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Blog
                    </Link>
                    <Link href="/tags" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Tags
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
