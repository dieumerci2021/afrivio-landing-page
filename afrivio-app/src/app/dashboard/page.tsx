'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        router.push('/login')
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    )
  }

  if (!user) {
    // Ce cas est principalement géré par la redirection, mais c'est une bonne pratique
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-6 bg-white rounded-lg shadow sm:p-6">
            <h2 className="text-xl font-semibold">
              Bienvenue sur Afrivio, {user.email}!
            </h2>
            <p className="mt-2 text-gray-600">
              C'est ici que vous pourrez gérer vos réservations, votre profil et
              vos abonnements.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}