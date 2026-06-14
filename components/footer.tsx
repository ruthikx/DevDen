import { HeartPulse } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="mt-auto border-t border-white/10 bg-[#131313]/80">
            <div className="container mx-auto px-4 py-5">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Code meets craft on</span>
                        <HeartPulse className="h-4 w-4 text-[#ff007a]" />
                        <span>DevPulse</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Copyright {currentYear} DevPulse. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
