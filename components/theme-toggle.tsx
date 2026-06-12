"use client";

import { Sun,Moon } from "lucide-react";
import {useTheme} from "next-themes";
import { Button } from "./ui/button";
export default function ThemeToggle() {
    const {theme, setTheme} = useTheme();
    return(
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all ease-in-out dark:-rotate-90 dark:scale-0 "/>
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all ease-in-out dark:rotate-0 dark:scale-100 "/>
            <span className="sr-only">Toggle Theme</span>
        </Button>
    )
}