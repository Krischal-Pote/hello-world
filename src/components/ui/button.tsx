import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-primary text-on-primary shadow-md hover:bg-gradient-primary transition-all duration-300 hover:shadow-orange",
				destructive: "bg-[var(--error)] text-white hover:opacity-90 shadow-md",
				outline:
					"border-2 border-white text-white bg-white/20 hover:bg-white/40 backdrop-blur-sm shadow-sm transition-all duration-300",
				secondary:
					"bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--border)] transition-all duration-200",
				ghost:
					"hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] transition-all duration-200",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-base",
				xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-lg",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
