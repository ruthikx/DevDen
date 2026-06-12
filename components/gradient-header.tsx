interface GradientHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}
export function GradientHeader({title,subtitle,children}: GradientHeaderProps) {
    return(
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-900 to-pink-500 p-8">
            <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white">{title}</h1>
                {subtitle && <p className="mt-2 text-lime-100 max-w-2xl">{subtitle}</p>}
                {children}
            </div>
            <div className="absolute right-0 top-0 h-full w-64 bg-gradient-to-l from-white/10 to-transparent">
            </div>
        </div>
    )
}