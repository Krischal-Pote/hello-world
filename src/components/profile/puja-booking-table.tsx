import { Calendar, Video } from "lucide-react";
import { useState } from "react";

export type Booking = {
	id: string | number;
	name: string;
	recurring?: boolean;
	date: string;
	status: "upcoming" | "completed" | "cancelled";
	videoLink?: "view" | "pending" | string;
	videoCount?: number;
	contribution: string | number;
};

interface PujaBookingsTableProps {
	bookings: Booking[];
	onViewDetails: (booking: Booking) => void;
}

export function PujaBookingsTable({
	bookings,
	onViewDetails,
}: PujaBookingsTableProps) {
	const [activeTab, setActiveTab] = useState("all");

	const tabs = [
		{ key: "all", label: "All" },
		{ key: "upcoming", label: "Upcoming" },
		{ key: "completed", label: "Completed" },
	];

	const counts = {
		all: bookings.length,
		upcoming: bookings.filter((b) => b.status === "upcoming").length || 0,
		completed: bookings.filter((b) => b.status === "completed").length || 0,
	};

	const filteredBookings = bookings.filter((booking) => {
		if (activeTab === "all") return true;
		return booking.status === activeTab;
	});

	const getStatusColor = (status: "upcoming" | "completed" | "cancelled") => {
		switch (status) {
			case "upcoming":
				return "text-blue-400 bg-blue-400/10";
			case "completed":
				return "text-green-400 bg-green-400/10";
			default:
				return "text-gray-400 bg-gray-400/10";
		}
	};

	const formatContribution = (value: string | number): string => {
		if (!value && value !== 0) return "N/A";
		const num = Number(value);
		if (isNaN(num)) return String(value);
		return `₹${num.toLocaleString("en-IN")}`;
	};

	const handleViewDetailsClick = (booking: Booking) => {
		onViewDetails(booking);
	};

	return (
		<div className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg mt-8">
			<div className="p-6 sm:p-8">
				<h2 className="text-xl sm:text-2xl font-bold mb-6">My Puja Bookings</h2>

				<div className="flex flex-wrap gap-2 mb-6">
					{tabs.map((tab) => (
						<button
							type="button"
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
								? "bg-primary text-white"
								: "border border-gray-200 text-gray-600 hover:border-gray-300"
								}`}
						>
							{tab.label} ({counts[tab.key as keyof typeof counts]})
						</button>
					))}
				</div>

				{filteredBookings.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500">No bookings found for this filter.</p>
					</div>
				) : (
					<>
						<div className="hidden lg:grid lg:grid-cols-12 gap-4 text-xs uppercase font-semibold mb-4 pb-3 tracking-wide text-gray-600">
							<div className="col-span-3">Puja Details</div>
							<div className="col-span-2">Date & Status</div>
							<div className="col-span-2">Video Link</div>
							<div className="col-span-2">Contribution</div>
							<div className="col-span-3">Actions</div>
						</div>

						<div className="space-y-4">
							{filteredBookings.map((booking) => (
								<div
									key={booking.id}
									className="rounded-xl p-4 sm:p-6 bg-gray-50 hover:shadow-md transition-all border border-gray-200"
								>
									<div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center space-y-4 lg:space-y-0">
										<div className="lg:col-span-3">
											<h3 className="font-semibold text-gray-900 mb-1">
												{booking.name}
											</h3>
											{booking.recurring && (
												<p className="text-xs text-gray-500">
													Recurring booking
												</p>
											)}
										</div>

										<div className="lg:col-span-2 flex lg:flex-col items-start gap-2">
											<div className="flex items-center gap-2 text-sm text-gray-700">
												<Calendar className="w-4 h-4" />
												{booking.date}
											</div>
											<span
												className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase border ${getStatusColor(booking.status)}`}
											>
												<span className="w-1.5 h-1.5 rounded-full bg-current" />
												{booking.status}
											</span>
										</div>

										<div className="lg:col-span-2">
											{booking.videoLink === "view" ? (
												<button
													type="button"
													className="flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
												>
													<Video className="w-4 h-4" />
													View ({booking.videoCount})
												</button>
											) : booking.videoLink === "pending" ? (
												<span className="text-sm text-gray-500 flex items-center gap-2">
													<Video className="w-4 h-4" />
													Pending
												</span>
											) : (
												<span className="text-sm text-gray-400">N/A</span>
											)}
										</div>

										<div className="lg:col-span-2">
											<span
												className={`text-lg font-bold ${booking.status === "cancelled"
													? "text-gray-400 line-through"
													: "text-gray-900"
													}`}
											>
												{formatContribution(booking.contribution)}
											</span>
										</div>

										<div className="lg:col-span-3 flex gap-2">
											<button
												onClick={() => handleViewDetailsClick(booking)}
												className="flex-1 lg:flex-none"
											>
												View Details
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{bookings.length > 0 && (
					<div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-gray-600">
							Showing {filteredBookings.length} of {bookings.length} bookings
							registered to this account
						</p>
						<div className="flex gap-2">
							<button
								type="button"
								className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition-colors font-bold hover:bg-gray-100"
							>
								‹
							</button>
							<button
								type="button"
								className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition-colors font-bold hover:bg-gray-100"
							>
								›
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
