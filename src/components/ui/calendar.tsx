import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarProps {
	mode: "single";
	selected?: Date;
	onSelect?: (date: Date | undefined) => void;
	disabled?: (date: Date) => boolean;
	className?: string;
}

export const Calendar = ({
	selected,
	onSelect,
	disabled,
	className = "",
}: CalendarProps) => {
	const [currentMonth, setCurrentMonth] = useState(
		selected
			? new Date(selected.getFullYear(), selected.getMonth(), 1)
			: new Date(),
	);

	const daysInMonth = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth() + 1,
		0,
	).getDate();

	const firstDayOfMonth = new Date(
		currentMonth.getFullYear(),
		currentMonth.getMonth(),
		1,
	).getDay();

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const previousMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
		);
	};

	const nextMonth = () => {
		setCurrentMonth(
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
		);
	};

	const handleDateClick = (day: number) => {
		const clickedDate = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			day,
		);

		if (disabled && disabled(clickedDate)) {
			return;
		}

		onSelect?.(clickedDate);
	};

	const isSelected = (day: number) => {
		if (!selected) return false;
		return (
			selected.getDate() === day &&
			selected.getMonth() === currentMonth.getMonth() &&
			selected.getFullYear() === currentMonth.getFullYear()
		);
	};

	const isDisabled = (day: number) => {
		if (!disabled) return false;
		const date = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			day,
		);
		return disabled(date);
	};

	const renderDays = () => {
		const days = [];

		// Empty cells for days before month starts
		for (let i = 0; i < firstDayOfMonth; i++) {
			days.push(<div key={`empty-${i}`} className="p-2" />);
		}

		// Days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const selected = isSelected(day);
			const isDisabledDay = isDisabled(day);

			days.push(
				<button
					key={day}
					type="button"
					onClick={() => handleDateClick(day)}
					disabled={isDisabledDay}
					className={`
            p-2 text-sm rounded-lg transition-all
            ${selected ? "bg-primary text-white font-semibold" : "hover:bg-gray-100"}
            ${isDisabledDay ? "text-gray-300 cursor-not-allowed hover:bg-transparent" : "cursor-pointer"}
          `}
				>
					{day}
				</button>,
			);
		}

		return days;
	};

	return (
		<div className={`bg-white p-4 ${className}`}>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<button
					type="button"
					onClick={previousMonth}
					className="p-1 hover:bg-gray-100 rounded transition-colors"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>

				<h3 className="font-semibold text-lg">
					{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
				</h3>

				<button
					type="button"
					onClick={nextMonth}
					className="p-1 hover:bg-gray-100 rounded transition-colors"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			</div>

			{/* Day names */}
			<div className="grid grid-cols-7 gap-1 mb-2">
				{dayNames.map((day) => (
					<div
						key={day}
						className="text-center text-xs font-medium text-gray-500 p-2"
					>
						{day}
					</div>
				))}
			</div>

			{/* Calendar days */}
			<div className="grid grid-cols-7 gap-1">{renderDays()}</div>
		</div>
	);
};
