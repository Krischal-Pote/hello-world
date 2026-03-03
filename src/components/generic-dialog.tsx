import { ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface GenericDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: ReactNode;
	maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export function GenericDialog({
	open,
	onOpenChange,
	title,
	description,
	children,
	maxWidth = "md",
}: GenericDialogProps) {
	const maxWidthClasses = {
		sm: "max-w-sm",
		md: "sm:max-w-md",
		lg: "sm:max-w-lg",
		xl: "sm:max-w-xl",
		"2xl": "sm:max-w-2xl",
		"3xl": "sm:max-w-3xl",
		"4xl": "sm:max-w-4xl",
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={`${maxWidthClasses[maxWidth]} w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800`}
			>
				<DialogHeader>
					<DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
						{title}
					</DialogTitle>
					{description && (
						<DialogDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
							{description}
						</DialogDescription>
					)}
				</DialogHeader>
				<div className="text-slate-900 dark:text-slate-100">{children}</div>
			</DialogContent>
		</Dialog>
	);
}
