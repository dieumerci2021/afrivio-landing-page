'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { type Offer } from '@/components/OfferCard'
import type { User } from '@supabase/supabase-js'

export default function OfferDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [offer, setOffer] = useState<Offer | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingMessage, setBookingMessage] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    const fetchOfferAndUser = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      // Récupérer les détails de l'offre
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single()

      if (offerError || !offerData) {
        setError('Offre non trouvée.')
        console.error(offerError)
        setLoading(false)
        return
      }
      setOffer(offerData)

      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      setLoading(false)
    }

    fetchOfferAndUser()
  }, [id])

  const handleBooking = async () => {
    if (!user) {
      // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
      router.push('/login')
      return
    }

    if (!offer) return

    setIsBooking(true)
    setBookingMessage('Création de votre réservation...')

    // Insérer la réservation dans la base de données avec un statut "en attente"
    const { data, error: bookingError } = await supabase.from('bookings').insert({
      user_id: user.id,
      offer_id: offer.id,
      booking_date: new Date().toISOString(),
      status: 'pending',
    }).select().single()

    if (bookingError || !data) {
      setBookingMessage(`Erreur lors de la réservation : ${bookingError?.message || 'inconnue'}`)
      setError(bookingError?.message || 'Une erreur est survenue.')
      setIsBooking(false)
    } else {
      // Afficher le message avec les instructions de paiement temporaire
      setBookingMessage(
        `Votre réservation a été enregistrée (ID: ${data.id}). Pour la confirmer, veuillez effectuer un paiement par Mobile Money au numéro +225 01 02 03 04. Contactez-nous avec votre ID de réservation pour finaliser.`
      )
    }
  }

  if (loading) {
    return <div className="text-center py-10">Chargement de l'offre...</div>
  }

  if (error && !bookingMessage) {
    return <div className="text-center py-10 text-red-600">{error}</div>
  }

  if (!offer) {
    return <div className="text-center py-10">Aucune offre trouvée.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10 mx-auto max-w-4xl sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
             <span className="text-gray-500">Image de l'offre</span>
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
            <p className="text-lg text-gray-600 mt-2">{offer.location}</p>
            <p className="text-gray-800 mt-4">{offer.description}</p>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-3xl font-bold text-indigo-600">{offer.price} €</p>
              <button
                onClick={handleBooking}
                disabled={isBooking}
                className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                Réserver maintenant
              </button>
            </div>
            {bookingMessage && (
              <div className={`mt-4 p-4 rounded-md text-center ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {bookingMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}