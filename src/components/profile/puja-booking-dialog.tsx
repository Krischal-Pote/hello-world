import { Calendar, Package, QrCode, Video } from "lucide-react";
import { GenericDialog } from "../generic-dialog";
import { Button } from "@/components/ui/button";
import SafeHtml from "../safe-html";

export interface BookingDetailsType {
	id: string;
	packageName: string;
	packageDescription: string;
	status: "upcoming" | "completed";
	date: string;
	frequency: string;
	contribution: string | number;
	qrToken: string | null;
	startDate: string | null;
	endDate: string | null;
	items: Array<{
		id: string;
		name: string;
		quantity: number;
		price: number;
		description: string;
	}>;
	videoLink: "view" | "pending" | null;
	videoCount?: number;
}

interface BookingDetailsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	booking: BookingDetailsType | null;
}

export function BookingDetailsModal({
	open,
	onOpenChange,
	booking,
}: BookingDetailsModalProps) {
	if (!booking) return null;

	const getStatusColor = (status: "upcoming" | "completed") => {
		switch (status) {
			case "upcoming":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";

			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatCurrency = (value: string | number): string => {
		if (!value && value !== 0) return "N/A";
		const num = Number(value);
		if (isNaN(num)) return String(value);
		return `₹${num.toLocaleString("en-IN")}`;
	};

	const totalAmount = booking.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<GenericDialog
			open={open}
			onOpenChange={onOpenChange}
			title={booking.packageName}
			description={`Booking ID: ${booking.id.substring(0, 8).toUpperCase()}`}
			maxWidth="2xl"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
						<h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">
							Status
						</h3>
						<span
							className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}
						>
							<span className="w-2 h-2 rounded-full bg-current" />
							{booking.status}
						</span>
					</div>

					<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
						<h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">
							Frequency
						</h3>
						<p className="text-sm capitalize text-slate-900 dark:text-white">
							{booking.frequency.replace("-", " ")}
						</p>
					</div>

					<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
						<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-1">
							<Calendar className="w-4 h-4" />
							Booking Date
						</div>
						<p className="text-sm font-medium text-slate-900 dark:text-white">
							{booking.date}
						</p>
					</div>

					<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
						<h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">
							Contribution
						</h3>
						<p className="text-lg font-bold text-slate-900 dark:text-white">
							{formatCurrency(booking.contribution)}
						</p>
					</div>
				</div>

				{(booking.startDate || booking.endDate) && (
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
						<h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-3">
							Schedule
						</h3>
						<div className="grid grid-cols-2 gap-4">
							{booking.startDate && (
								<div>
									<p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
										Start Date
									</p>
									<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
										{booking.startDate}
									</p>
								</div>
							)}
							{booking.endDate && (
								<div>
									<p className="text-xs text-blue-700 dark:text-blue-300 mb-1">
										End Date
									</p>
									<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
										{booking.endDate}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{booking.packageDescription && (
					<div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
						<h3 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">
							Description
						</h3>
						<p className="text-sm text-slate-600 dark:text-slate-400">
							<SafeHtml html={booking.packageDescription} />
						</p>
					</div>
				)}

				{booking.items && booking.items.length > 0 && (
					<div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
						<div className="bg-slate-50 dark:bg-slate-800 px-4 py-3">
							<div className="flex items-center gap-2">
								<Package className="w-5 h-5 text-slate-600 dark:text-slate-300" />
								<h3 className="font-semibold text-slate-900 dark:text-white">
									Included Items ({booking.items.length})
								</h3>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
									<tr>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">
											Item Name
										</th>
										<th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-white">
											Quantity
										</th>
										<th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
											Price
										</th>
										<th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
											Subtotal
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 dark:divide-slate-700">
									{booking.items.map((item) => (
										<tr
											key={item.id}
											className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
										>
											<td className="px-4 py-3">
												<div>
													<p className="font-medium text-slate-900 dark:text-white">
														{item.name}
													</p>
													{item.description && (
														<SafeHtml
															html={item.description}
															className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2"
														/>
													)}
												</div>
											</td>
											<td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
												{item.quantity}
											</td>
											<td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
												{formatCurrency(item.price)}
											</td>
											<td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">
												{formatCurrency(item.price * item.quantity)}
											</td>
										</tr>
									))}
									<tr className="bg-slate-50 dark:bg-slate-800 font-bold">
										<td
											colSpan={3}
											className="px-4 py-3 text-right text-slate-900 dark:text-white"
										>
											Total
										</td>
										<td className="px-4 py-3 text-right text-slate-900 dark:text-white">
											{formatCurrency(totalAmount)}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}

				{booking.videoLink && (
					<div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
						<div className="flex items-center gap-2 text-amber-900 dark:text-amber-100 mb-3">
							<Video className="w-5 h-5" />
							<span className="font-semibold">Video Recording</span>
						</div>
						{booking.videoLink === "view" ? (
							<Button variant="outline" className="w-full">
								View Video Recording ({booking.videoCount || 1})
							</Button>
						) : (
							<p className="text-sm text-amber-700 dark:text-amber-300">
								Video will be available after the puja is completed.
							</p>
						)}
					</div>
				)}

				{/* <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
					<Button variant="secondary" className="flex-1">
						Close
					</Button>
					<Button className="flex-1">Download Receipt</Button>
				</div> */}
			</div>
		</GenericDialog>
	);
}
