import DOMPurify from "dompurify";
import { useMemo } from "react";

interface SafeHtmlProps {
	html: string;
	className?: string;
}

export default function SafeHtml({ html, className = "" }: SafeHtmlProps) {
	const sanitizedHtml = useMemo(() => {
		return DOMPurify.sanitize(html);
	}, [html]);

	if (!html) return null;

	return (
		<div
			className={`rendered-html ${className}`}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
		/>
	);
}
