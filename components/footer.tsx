import { Heart } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-t bg-background mt-auto">
            <div className="container mx-auto py-5 px-4">
                
                <div className="flex flex-row md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>
                            Made with
                        </span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>by Ruthik</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>© {currentYear} Feedback Fusion. All rights reserved.</span>
                    </div>
                </div>
                
            </div>
        </footer>
    );
}