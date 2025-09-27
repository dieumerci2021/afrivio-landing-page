'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

// Définir un type pour le profil utilisateur incluant le rôle
type Profile = {
  id: string;
  role: 'admin' | 'user';
}

// Définir un type pour les réservations avec plus de détails
type Booking = {
  id: number;
  created_at: string;
  status: string;
  user_id: string;
  offers: {
    title: string;
  } | null;
  profiles: {
    email: string;
  } | null;
};


export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAccess = async () => {
      // 1. Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 2. Récupérer le profil de l'utilisateur pour vérifier son rôle
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData || profileData.role !== 'admin') {
        // Si l'utilisateur n'est pas admin, rediriger
        router.push('/dashboard')
        return
      }
      setProfile(profileData as Profile)

      // 3. Si l'utilisateur est admin, récupérer toutes les réservations
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          status,
          user_id,
          offers (title),
          profiles (email: users(email))
        `)
        .order('created_at', { ascending: false });


      if (bookingsError) {
        console.error("Erreur lors de la récupération des réservations:", bookingsError)
      } else {
        // @ts-ignore
        setBookings(bookingsData)
      }

      setLoading(false)
    }

    checkAdminAccess()
  }, [router])

  if (loading) {
    return <div className="text-center py-10">Vérification de l'accès...</div>
  }

  if (!profile || profile.role !== 'admin') {
    return <div className="text-center py-10 text-red-600">Accès refusé.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de bord Administrateur</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Dernières réservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.offers?.title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.profiles?.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}