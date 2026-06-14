interface GradientHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}
export function GradientHeader({title,subtitle,children}: GradientHeaderProps) {
    return(
        <div className="neon-panel relative overflow-hidden rounded-lg p-8">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,0,122,0.22),transparent_42%,rgba(0,229,255,0.14))]" />
            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-[#ff007a] via-cyan-300 to-transparent" />
            <div className="relative z-10">
                <h1 className="neon-text text-4xl font-bold tracking-tight">{title}</h1>
                {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-base">{subtitle}</p>}
                {children}
            </div>
            <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-white/10 to-transparent">
            </div>
        </div>
    )
}
