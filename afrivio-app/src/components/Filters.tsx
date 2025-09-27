'use client'

import React from 'react';

type FiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
};

const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => {
  const offerTypes = ['hotel', 'restaurant', 'event', 'activity'];

  return (
    <div className="p-4 mb-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Champ de recherche */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Rechercher une offre
          </label>
          <input
            type="text"
            id="search"
            placeholder="Ex: Hôtel de luxe, festival..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filtre par type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type d'offre
          </label>
          <select
            id="type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Tous</option>
            {offerTypes.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;