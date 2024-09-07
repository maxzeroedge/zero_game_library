import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';


interface Game {
  id?: number;
  name?: string;
  cover?: {
    url: string;
  };
  genres?: Array<{
    name: string;
  }>;
  rating?: number;
  summary?: string;
  first_release_date?: number;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:8080/games');
  const games = await response.json();
  return games;
};

export default function Index() {
  const { games } = useLoaderData<{ games: Game[] }>();
  console.log(games);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow container mx-auto mt-20 p-4">
        <h1 className="text-3xl font-bold mb-6">Game Catalog</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden group relative">
              <img src={game.cover?.url} alt={game.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
                <p className="text-sm text-gray-600 mb-2">Genre: {game.genres?.map(genre => genre.name).join(', ')}</p>
                <p className="text-sm text-gray-600">Rating: {game.rating}/5</p>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Play</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">Details</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#" className="hover:text-gray-300 mr-4">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 mr-4">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Contact Us</a>
          </div>
          <div className="text-sm">
            &copy; 2024 Game Catalog. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

