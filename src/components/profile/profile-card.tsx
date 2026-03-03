import { Edit2, Mail, MapPin, Phone } from "lucide-react";

interface Profile {
	id: string;
	name: string;
	devoteeSince?: string;
	email?: string;
	phone: string;
	totalBookings: number;
	avatarUrl?: string | null;
}

interface ProfileCardProps {
	profile: Profile;
	onEditProfile: () => void;
}

export function ProfileCard({ profile, onEditProfile }: ProfileCardProps) {
	return (
		<div className="mt-10 bg-white backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-6 shadow-lg">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-start sm:items-center gap-4 sm:gap-6">
					<div className="relative">
						<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-4 ring-amber-500/20 shadow-md">
							<img
								src={profile.avatarUrl || "/default-avatar.png"}
								alt="Profile Avatar"
								className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
							/>
						</div>
						<div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
					</div>

					<div>
						<h1 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">
							{profile.name}
						</h1>
						<p className="text-sm text-gray-600">
							Devotee since {profile.devoteeSince}
						</p>
					</div>
				</div>

				{/* <button
					type="button"
					onClick={onEditProfile}
					className="self-end sm:self-auto text-sm bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-sm hover:shadow-md"
				>
					<Edit2 className="w-4 h-4 text-white" /> Edit Profile
				</button> */}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t">
				<div className="flex items-center gap-3">
					<div className="bg-primary/10 rounded-3xl p-3">
						<Mail className="w-5 h-5 text-primary" />
					</div>
					<div>
						<p className="text-xs uppercase font-semibold tracking-wide text-gray-600">
							Email Address
						</p>
						<p className="text-sm text-gray-700">{profile.email}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="bg-primary/10 rounded-3xl p-3">
						<Phone className="w-5 h-5 text-primary" />
					</div>
					<div>
						<p className="text-xs uppercase font-semibold tracking-wide text-gray-600">
							Phone Number
						</p>
						<p className="text-sm text-gray-700">{profile.phone}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<div className="bg-primary/10 rounded-3xl p-3">
						<MapPin className="w-5 h-5 text-primary" />
					</div>
					<div>
						<p className="text-xs uppercase font-semibold tracking-wide text-gray-600">
							Total Bookings
						</p>
						<p className="text-sm text-gray-700">{profile.totalBookings}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
