import React from 'react';
import Link from 'next/link';

// Définir le type pour une offre, en se basant sur le schéma de la base de données
export type Offer = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  location: string | null;
  type: string | null;
};

// Props pour le composant OfferCard
type OfferCardProps = {
  offer: Offer;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <Link href={`/offers/${offer.id}`} passHref>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer">
        {/* Emplacement pour une future image de l'offre */}
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Image à venir</span>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
          <p className="text-sm text-gray-500 mt-1 capitalize">{offer.type} - {offer.location}</p>
          <p className="text-gray-700 mt-2 h-16 overflow-hidden text-ellipsis">
            {offer.description || "Aucune description disponible."}
          </p>
          <div className="flex items-center justify-between mt-4">
            <p className="text-lg font-semibold text-indigo-600">{offer.price} €</p>
            <div className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Voir l'offre
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OfferCard;