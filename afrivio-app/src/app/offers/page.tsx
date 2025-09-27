'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import OfferCard, { type Offer } from '@/components/OfferCard'
import Filters from '@/components/Filters'

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('offers')
        .select('id, title, description, price, location, type')

      // Appliquer le filtre de recherche par titre ou description
      if (searchTerm) {
        // 'ilike' est insensible à la casse
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      // Appliquer le filtre par type d'offre
      if (filterType) {
        query = query.eq('type', filterType)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
        console.error("Erreur lors de la récupération des offres:", error)
      } else {
        setOffers(data || [])
      }
      setLoading(false)
    }

    // Utiliser un délai pour éviter de lancer une requête à chaque frappe
    const debounceFetch = setTimeout(() => {
      fetchOffers()
    }, 300) // 300ms de délai

    return () => clearTimeout(debounceFetch)
  }, [searchTerm, filterType]) // Relancer la recherche quand les filtres changent

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Découvrez nos offres
          </h1>
          <p className="mt-1 text-gray-600">
            Trouvez les meilleures expériences en Afrique.
          </p>
        </div>
      </header>

      <main className="py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Intégration du composant de filtres */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {loading && (
          <div className="text-center">
            <p className="text-lg">Chargement des offres...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600">
            <p>Une erreur est survenue : {error}</p>
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="text-center text-gray-500">
            <p>Aucune offre ne correspond à votre recherche.</p>
            <p>Essayez d'autres filtres ou revenez plus tard !</p>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}