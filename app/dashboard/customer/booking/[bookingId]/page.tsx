"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "../../../../../components/LoadingSpinner";
import ErrorMessage from "../../../../../components/ErrorMessage";
import {
  getBookingById,
  cancelBooking,
  requestRefund,
  requestReschedule,
} from "../../../../../utils/api";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
  refund: "bg-pink-100 text-pink-800 border-pink-300",
  reschedule: "bg-purple-100 text-purple-800 border-purple-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

function StatusBadge({ status }: { status: string }) {
  const color =
    (status in STATUS_COLORS
      ? STATUS_COLORS[status as keyof typeof STATUS_COLORS]
      : "bg-gray-100 text-gray-800 border-gray-300");
  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${color}`}>{status.toUpperCase()}</span>
  );
}

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    getBookingById(bookingId as string)
      .then(setBooking)
      .catch(() => setError("Failed to load booking details."))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleCancel = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await cancelBooking(bookingId as string);
      setActionSuccess("Booking cancelled successfully.");
      router.refresh();
    } catch {
      setActionError("Failed to cancel booking.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await requestRefund(bookingId as string);
      setActionSuccess("Refund requested successfully.");
      router.refresh();
    } catch {
      setActionError("Failed to request refund.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReschedule = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await requestReschedule(bookingId as string);
      setActionSuccess("Reschedule requested successfully.");
      router.refresh();
    } catch {
      setActionError("Failed to request reschedule.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;
  if (!booking) return <ErrorMessage message="No booking found." />;

  const service = booking.service;
  const mechanic = booking.mechanic;
  const canCancel = ["pending", "confirmed"].includes(booking.status);
  const canRefund = booking.status === "completed" && !booking.refund?.requested;
  const canReschedule = ["pending", "confirmed"].includes(booking.status) && !booking.reschedule?.requested;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow mt-6 mb-12">
      <h1 className="text-2xl font-bold mb-2">Booking Details</h1>
      <div className="mb-4 flex items-center gap-2">
        <StatusBadge status={booking.status} />
        {booking.refund?.requested && <StatusBadge status="refund" />}
        {booking.reschedule?.requested && <StatusBadge status="reschedule" />}
      </div>
      {/* Service Info */}
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-1">Service</h2>
        {service ? (
          <div>
            <div className="font-medium">{service.title}</div>
            <div className="text-sm text-gray-500">{service.description}</div>
            <div className="text-sm text-gray-500">Price: <span className="font-semibold">৳{service.price}</span></div>
          </div>
        ) : (
          <div className="text-red-600 font-medium">Service information is missing (may have been deleted).</div>
        )}
      </div>
      {/* Mechanic Info */}
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-1">Mechanic</h2>
        {mechanic ? (
          <div>
            <div className="font-medium">{mechanic.name}</div>
            <div className="text-sm text-gray-500">{mechanic.email}</div>
          </div>
        ) : (
          <div className="text-red-600 font-medium">Mechanic information is missing (may have been deleted).</div>
        )}
      </div>
      {/* Booking Info */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div><span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleString()}</div>
        <div><span className="font-semibold">Payment:</span> {booking.paymentStatus || "N/A"}</div>
        <div><span className="font-semibold">Customer:</span> {booking.customer?.name || "N/A"}</div>
        <div><span className="font-semibold">Booking ID:</span> {booking._id}</div>
      </div>
      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        {canCancel && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={handleCancel}
            disabled={actionLoading}
          >
            Cancel Booking
          </button>
        )}
        {canRefund && (
          <button
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
            onClick={handleRefund}
            disabled={actionLoading}
          >
            Request Refund
          </button>
        )}
        {canReschedule && (
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            onClick={handleReschedule}
            disabled={actionLoading}
          >
            Request Reschedule
          </button>
        )}
      </div>
      {actionError && <ErrorMessage message={actionError} />}
      {actionSuccess && <div className="text-green-600 font-medium mb-4">{actionSuccess}</div>}
      {/* Timeline/History */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">Booking Timeline</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleString()}
          </li>
          {booking.statusHistory?.map((item: any, idx: number) => (
            <li key={idx}>
              <span className="font-medium">{item.status}:</span> {new Date(item.date).toLocaleString()} {item.by ? `by ${item.by}` : ""}
            </li>
          ))}
          {booking.reschedule?.requested && (
            <li>
              <span className="font-medium">Reschedule Requested:</span> {new Date(booking.reschedule.requestedAt).toLocaleString()}
              {booking.reschedule.status && (
                <> (<span className="font-medium">{booking.reschedule.status}</span>)</>
              )}
            </li>
          )}
          {booking.refund?.requested && (
            <li>
              <span className="font-medium">Refund Requested:</span> {new Date(booking.refund.requestedAt).toLocaleString()}
              {booking.refund.status && (
                <> (<span className="font-medium">{booking.refund.status}</span>)</>
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
} 