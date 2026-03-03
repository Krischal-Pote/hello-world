import { type ReactNode, useEffect, useState } from "react";

interface CarouselProps {
	images: string[];
	interval?: number;
	className?: string;
	children?: ReactNode;
}

export function Carousel({
	images,
	interval = 5000,
	className = "",
	children,
}: CarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, interval);

		return () => clearInterval(timer);
	}, [images.length, interval]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	return (
		<div className={`relative w-full h-full overflow-hidden ${className}`}>
			{images.map((image, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 ${
						index === currentIndex ? "opacity-100" : "opacity-0"
					}`}
					style={{
						backgroundImage: `url(${image})`,
						borderRadius: "1.5rem",
					}}
				/>
			))}

			<div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60 z-10 rounded-[1.5rem]" />

			<div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
				{images.map((_, index) => (
					<button
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						type="button"
						onClick={() => goToSlide(index)}
						className={`h-2 rounded-full transition-all duration-300 ${
							index === currentIndex
								? "bg-orange-500 w-8"
								: "bg-white/50 hover:bg-white/80 w-2"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>

			{children && (
				<div className="absolute inset-0 z-20 pointer-events-none">
					<div className="pointer-events-auto h-full">{children}</div>
				</div>
			)}

			<button
				type="button"
				onClick={() =>
					setCurrentIndex((currentIndex - 1 + images.length) % images.length)
				}
				className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
				aria-label="Previous slide"
			>
				<svg
					className="w-6 h-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Previous</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			{/* Next button */}
			<button
				type="button"
				onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
				className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
				aria-label="Next slide"
			>
				<svg
					className="w-6 h-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Next</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
}
