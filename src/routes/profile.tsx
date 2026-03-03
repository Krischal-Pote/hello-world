import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProfileCard } from "@/components/profile/profile-card";
import {
    BookingDetailsModal,
    type BookingDetailsType,
} from "@/components/profile/puja-booking-dialog";
import type { Booking } from "@/components/profile/puja-booking-table";
import {
    getBookingDetails,
    getProfile,
    getUserBookings,
} from "@/lib/queries/profile";
import { PujaBookingsTable } from "#/components/profile/puja-booking-table";

export const Route = createFileRoute("/profile")({
    loader: async () => {
        try {
            const [profile, bookings] = await Promise.all([
                getProfile(),
                getUserBookings(),
            ]);

            console.log(`[Profile loader] Profile data:`, profile);
            console.log(`[Profile loader] Bookings data:`, bookings);

            return { profile, bookings: bookings || [] };
        } catch (error) {
            console.error("[Profile loader] Error loading data:", error);
            throw error;
        }
    },
    component: ProfilePage,
});

function ProfilePage() {
    const { profile, bookings } = Route.useLoaderData();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedBookingDetails, setSelectedBookingDetails] =
        useState<BookingDetailsType | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
    };

    const handleViewDetails = async (booking: Booking) => {
        console.log("View details:", booking);

        try {
            setIsLoadingDetails(true);
            const details = await getBookingDetails({
                data: { orderId: String(booking.id) },
            });
            setSelectedBookingDetails(details);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error("Error loading booking details:", error);
            alert("Failed to load booking details. Please try again.");
        } finally {
            setIsLoadingDetails(false);
        }
    };

    return (
        <div className="bg-linear-to-br from-amber-50 via-white to-amber-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <ProfileCard profile={profile} onEditProfile={handleEditProfile} />

                <PujaBookingsTable
                    bookings={bookings}
                    onViewDetails={handleViewDetails}
                />

                <BookingDetailsModal
                    open={isDetailsModalOpen}
                    onOpenChange={setIsDetailsModalOpen}
                    booking={selectedBookingDetails}
                />
            </div>
        </div>
    );
}
