import { Footer } from "~/components/Footer";
import SearchComponent from "~/components/Search";
import CatalogResult from "~/components/search/CatalogResult";
import { fetchGames } from "~/services/gameService";

export default function Catalog() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow container mx-auto mt-20 p-4">
        <h1 className="text-3xl font-bold mb-6">Game Catalog</h1>
        <SearchComponent 
          apiToCall={fetchGames}
          searchName="games"
          ResultComponent={CatalogResult}
        />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
};
