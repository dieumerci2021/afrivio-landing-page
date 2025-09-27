import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-white bg-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-bold">Afrivio</h1>
        <nav className="space-x-4">
          <Link href="/offers" className="hover:text-indigo-300">
            Découvrir les offres
          </Link>
          <Link href="/login" className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700">
            Connexion
          </Link>
          <Link href="/signup" className="bg-transparent border border-white px-4 py-2 rounded-md hover:bg-white hover:text-gray-900">
            Inscription
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center text-center relative">
        {/* Background Image/Video - Placeholder */}
        <div className="absolute inset-0 bg-black opacity-50">
          {/* Idéalement, remplacer par une vidéo ou une belle image de l'Afrique */}
        </div>
        <div className="z-10 p-8">
          <h2 className="text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
            L'Afrique, comme vous ne l'avez jamais vue.
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
            Connectez-vous à des expériences authentiques. Réservez votre prochaine aventure avec Afrivio.
          </p>
          <div className="space-x-4 animate-fade-in-up">
            <Link href="/offers" className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105">
              Explorer les expériences
            </Link>
            <Link href="/signup" className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-transform transform hover:scale-105">
              Créer un compte
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-gray-400 z-10">
        <p>&copy; {new Date().getFullYear()} Afrivio. Tous droits réservés.</p>
      </footer>

      {/* CSS pour les animations simples */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.4s forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>
    </div>
  );
}