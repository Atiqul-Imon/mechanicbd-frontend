'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { get, post } from '../../../utils/api';
import { useAuth } from '../../../contexts/AuthContext';
import Link from 'next/link';
import PageLoader from '../../../components/PageLoader';
import ErrorMessage from '../../../components/ErrorMessage';
import { Star, StarBorder } from '@mui/icons-material';

interface Service {
  _id: string;
  title: string;
  description: string;
  basePrice: number;
  category: string;
  serviceArea: string;
  mechanic: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
    averageRating?: number;
    totalReviews?: number;
  };
}

interface Review {
  _id: string;
  customer: { fullName: string; profilePhoto?: string };
  rating: number;
  comment: string;
  createdAt: string;
  booking?: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  // Eligibility state
  const [eligible, setEligible] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [eligibilityMsg, setEligibilityMsg] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      if (!params.id) return;
      setLoading(true);
      setError('');
      try {
        const response = await get(`/services/${params.id}`);
        setService(response.data.data.service);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    setReviewLoading(true);
    setReviewError('');
    get(`/reviews/service/${params.id}`)
      .then(res => setReviews(res.data.data.reviews))
      .catch(() => setReviewError('Failed to load reviews'))
      .finally(() => setReviewLoading(false));
  }, [params.id]);

  // Eligibility logic
  useEffect(() => {
    const checkEligibility = async () => {
      setEligibilityChecked(false);
      setEligible(false);
      setEligibilityMsg('');
      if (!isAuthenticated || !user) {
        setEligibilityMsg('You must be logged in as a customer to write a review.');
        setEligibilityChecked(true);
        return;
      }
      if (user.role !== 'customer') {
        setEligibilityMsg('Only customers can write reviews.');
        setEligibilityChecked(true);
        return;
      }
      try {
        // Fetch user's completed bookings for this service
        const res = await get(`/bookings?status=completed&service=${params.id}`);
        const bookings = res.data.data.bookings || [];
        // Find bookings by this user
        const myBookings = bookings.filter((b: any) => b.customer && (b.customer._id === user._id));
        if (myBookings.length === 0) {
          setEligibilityMsg('You must complete a booking for this service to write a review.');
          setEligibilityChecked(true);
          return;
        }
        // Check if any of these bookings have not been reviewed by this user
        const reviewedBookingIds = reviews.map(r => r.booking).filter(Boolean);
        const unreviewed = myBookings.find((b: any) => !reviewedBookingIds.includes(b._id));
        if (unreviewed) {
          setEligible(true);
          setEligibilityMsg('');
        } else {
          setEligibilityMsg('You have already reviewed your completed booking(s) for this service.');
        }
      } catch (err) {
        setEligibilityMsg('Could not verify review eligibility.');
      } finally {
        setEligibilityChecked(true);
      }
    };
    checkEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, params.id, reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');
    try {
      await post('/reviews', {
        service: params.id,
        rating,
        comment,
      });
      setSubmitMsg('Review submitted!');
      setRating(0);
      setComment('');
      setShowForm(false);
      const res = await get(`/reviews/service/${params.id}`);
      setReviews(res.data.data.reviews);
    } catch (err: any) {
      setSubmitMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading service details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Service"
        message={error}
        icon="❌"
        backUrl="/services"
        backText="Back to Services"
      />
    );
  }

  if (!service) {
    return (
      <ErrorMessage
        title="Service Not Found"
        message="The service you're looking for doesn't exist."
        icon="🔍"
        backUrl="/services"
        backText="Back to Services"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-[var(--color-text-muted)]">
            <li><Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/services" className="hover:text-[var(--color-primary)] transition-colors">Services</Link></li>
            <li>/</li>
            <li className="text-[var(--color-text-main)]">{service.title}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="h-64 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🔧</div>
              <h1 className="text-3xl font-bold text-[var(--color-text-main)]">{service.title}</h1>
            </div>
          </div>

          <div className="p-8">
            {/* Service Info */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-full">
                    {service.category}
                  </span>
                  <span className="flex items-center text-[var(--color-text-secondary)]">
                    📍 {service.serviceArea}
                  </span>
                </div>
                
                <h2 className="text-2xl font-semibold text-[var(--color-text-main)] mb-4">Service Description</h2>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">{service.description}</p>
                
                <div className="bg-[var(--color-bg-surface)] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-text-main)] mb-4">Service Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--color-text-muted)]">Category:</span>
                      <p className="font-medium text-[var(--color-text-main)]">{service.category}</p>
                    </div>
                    <div>
                      <span className="text-[var(--color-text-muted)]">Service Area:</span>
                      <p className="font-medium text-[var(--color-text-main)]">{service.serviceArea}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-[var(--color-bg-surface)] rounded-lg p-6 h-fit">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">৳{service.basePrice}</div>
                  <div className="text-[var(--color-text-secondary)]">Base Price</div>
                </div>
                
                {isAuthenticated ? (
                  <Link
                    href={`/book/${service._id}`}
                    className="block w-full bg-[var(--color-primary)] text-white text-center py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 font-medium mb-4 transform hover:scale-105"
                  >
                    Book Now
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-[var(--color-primary)] text-white text-center py-3 rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-200 font-medium mb-4 transform hover:scale-105"
                  >
                    Login to Book
                  </Link>
                )}
                
                <div className="text-center text-sm text-[var(--color-text-muted)]">
                  Free consultation included
                </div>
              </div>
            </div>

            {/* Mechanic Info */}
            {service.mechanic && (
              <div className="border-t border-gray-200 pt-8 mb-8">
                <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-6">About the Mechanic</h3>
                <div className="bg-[var(--color-bg-surface)] rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                      <span className="text-[var(--color-primary)] font-semibold text-xl">
                        {service.mechanic.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[var(--color-text-main)]">{service.mechanic.fullName}</h4>
                      {service.mechanic.averageRating && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 font-medium">{service.mechanic.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-[var(--color-text-muted)]">({service.mechanic.totalReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-6">Customer Reviews</h3>
              {/* Average rating */}
              {service.mechanic?.averageRating && (
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map(i => i <= Math.round(service.mechanic.averageRating!) ? (
                    <Star key={i} className="text-yellow-400" />
                  ) : (
                    <StarBorder key={i} className="text-yellow-400" />
                  ))}
                  <span className="font-medium text-[var(--color-text-main)]">{service.mechanic.averageRating.toFixed(1)}</span>
                  <span className="text-[var(--color-text-muted)]">({service.mechanic.totalReviews} reviews)</span>
                </div>
              )}
              {/* Review eligibility and form */}
              {eligibilityChecked && (
                <div className="mb-6">
                  {eligible ? (
                    !showForm ? (
                      <button
                        className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-[var(--color-primary-dark)] transition mb-2"
                        onClick={() => setShowForm(true)}
                      >
                        Write a Review
                      </button>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="mb-8 bg-[var(--color-bg-surface)] rounded-lg p-6 shadow">
                        <div className="mb-4">
                          <label className="block mb-1 font-medium">Your Rating</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                              <button type="button" key={i} onClick={() => setRating(i)}>
                                {i <= rating ? <Star className="text-yellow-400" /> : <StarBorder className="text-yellow-400" />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-1 font-medium">Comment</label>
                          <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} maxLength={1000} required />
                        </div>
                        {submitMsg && <div className="mb-2 text-sm text-red-500">{submitMsg}</div>}
                        <button type="submit" className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-semibold" disabled={submitting}>
                          {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button type="button" className="ml-4 text-[var(--color-primary)] underline" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</button>
                      </form>
                    )
                  ) : (
                    <div className="text-[var(--color-text-muted)] italic">{eligibilityMsg}</div>
                  )}
                </div>
              )}
              {/* Reviews list */}
              {reviewLoading ? (
                <div>Loading reviews...</div>
              ) : reviewError ? (
                <div className="text-red-500">{reviewError}</div>
              ) : reviews.length === 0 ? (
                <div className="text-[var(--color-text-muted)]">No reviews yet. Be the first to review this service!</div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-[var(--color-bg-surface)] rounded-lg p-4 shadow-sm flex gap-4 items-start">
                      <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-xl font-bold text-[var(--color-primary)]">
                        {r.customer.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[var(--color-text-main)]">{r.customer.fullName}</span>
                          <span className="text-xs text-[var(--color-text-muted)]">{new Date(r.createdAt).toISOString().slice(0, 10)}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          {[1,2,3,4,5].map(i => i <= r.rating ? (
                            <Star key={i} className="text-yellow-400 text-sm" fontSize="small" />
                          ) : (
                            <StarBorder key={i} className="text-yellow-400 text-sm" fontSize="small" />
                          ))}
                        </div>
                        <div className="text-[var(--color-text-secondary)]">{r.comment}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* End Reviews Section */}
          </div>
        </div>
      </div>
    </div>
  );
} 