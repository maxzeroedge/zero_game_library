import { useState, useEffect, useCallback } from "react";
import debounce from 'lodash/debounce';
import { Footer } from "~/components/Footer";
import { Game } from "~/models/igdb";
import { config } from "~/config";
import SearchComponent from "~/components/Search";
import { fetchGames } from "~/services/gameService";

export default function Catalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow container mx-auto mt-20 p-4">
        <h1 className="text-3xl font-bold mb-6">Game Catalog</h1>
        <SearchComponent 
          apiToCall={fetchGames}
          searchName="games"
        />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};
