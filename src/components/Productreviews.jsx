import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'}>
          <Star
            size={size}
            className={
              star <= (hovered || value)
                ? 'text-saffron-400 fill-saffron-400'
                : 'text-cream-300 fill-cream-300'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default function ProductReviews({ productId }) {
  const { user }  = useAuth()
  const [reviews, setReviews]     = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [canReview, setCanReview] = useState(null) // null = loading
  const [orderId, setOrderId]     = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' })

  useEffect(() => {
    fetchReviews()
    if (user) checkCanReview()
  }, [productId, user])

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/product/${productId}`)
      setReviews(data.reviews || [])
      setAvgRating(data.avgRating || 0)
    } catch {}
    finally { setLoading(false) }
  }

  const checkCanReview = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/can-review/${productId}`)
      setCanReview(data.canReview)
      setOrderId(data.orderId)
    } catch {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) return toast.error('Please select a star rating')
    if (!form.comment.trim()) return toast.error('Please write a comment')
    setSubmitting(true)
    try {
      const { data } = await axios.post('/api/reviews', {
        productId,
        orderId,
        rating:  form.rating,
        title:   form.title,
        comment: form.comment,
      })
      toast.success('Review submitted! Thank you 🙏')
      setReviews(prev => [data.review, ...prev])
      setCanReview(false)
      setShowForm(false)
      setForm({ rating: 0, title: '', comment: '' })
      fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl text-devotion-brown">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating value={Math.round(avgRating)} readonly size={16} />
              <span className="font-bold text-devotion-brown">{avgRating} out of 5</span>
              <span className="text-cream-500 text-sm">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>

        {/* Write review button */}
        {user && canReview && !showForm && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm">
            ✍️ Write a Review
          </motion.button>
        )}
      </div>

      {/* Review eligibility messages */}
      {user && canReview === false && (
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 mb-6 text-sm text-cream-600 flex items-center gap-2">
          <Lock size={14} />
          {reviews.find(r => r.user?._id === user._id || r.user === user._id)
            ? 'You have already reviewed this product.'
            : 'Purchase and receive this product to leave a review.'}
        </div>
      )}
      {!user && (
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-4 mb-6 text-sm text-cream-600">
          <Link to="/login" className="text-saffron-600 font-bold hover:underline">Login</Link> and purchase this product to leave a review.
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-saffron-50 border-2 border-saffron-200 rounded-3xl p-6 mb-8 overflow-hidden">
            <h3 className="font-display text-xl text-devotion-brown mb-5">Your Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-2 uppercase tracking-wider">Rating *</label>
                <div className="flex items-center gap-4">
                  <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} size={28} />
                  {form.rating > 0 && (
                    <span className="text-saffron-600 font-bold text-sm">{RATING_LABELS[form.rating]}</span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Review Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Summarize your experience" maxLength={100}
                  className="input-field" />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-devotion-brown/70 mb-1.5 uppercase tracking-wider">Your Review *</label>
                <textarea value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience with this product..." rows={4} maxLength={1000}
                  className="input-field resize-none" />
                <p className="text-xs text-cream-400 mt-1 text-right">{form.comment.length}/1000</p>
              </div>

              <div className="flex gap-3">
                <motion.button type="submit" disabled={submitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary disabled:opacity-60 text-sm">
                  {submitting ? 'Submitting...' : '🙏 Submit Review'}
                </motion.button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-cream-50 rounded-2xl border border-cream-200">
          <p className="text-4xl mb-3">⭐</p>
          <p className="font-display text-xl text-devotion-brown mb-1">No reviews yet</p>
          <p className="text-cream-500 text-sm">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div key={review._id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-cream-100">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold font-display">
                    {review.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-devotion-brown text-sm">{review.user?.name || 'Customer'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={review.rating} readonly size={13} />
                      <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={11} /> Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-cream-400 shrink-0">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {review.title && <p className="font-bold text-devotion-brown mb-1">{review.title}</p>}
              <p className="text-devotion-brown/80 text-sm leading-relaxed">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}