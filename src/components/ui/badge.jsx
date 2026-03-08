import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20",
                secondary:
                    "border-border/50 bg-secondary text-secondary-foreground hover:bg-secondary/70",
                destructive:
                    "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20",
                outline:
                    "border-border/50 text-foreground bg-transparent hover:bg-secondary/40",
                success:
                    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
                warning:
                    "border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
