const SearchComponent = () => {
    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center">
                    <div className="relative w-full">
                    <div className="relative flex items-center">
                        <input
                        type="text"
                        name="search"
                        placeholder="Search games..."
                        className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        />
                        <button
                        className="absolute right-0 p-3 bg-blue-500 text-white hover:text-gray-600 focus:outline-none border-r-1 rounded-tr-lg rounded-br-lg"
                        onClick={() => debouncedFetchGames(searchTerm)}
                        >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        </button>
                        {isLoading && (
                        <div className="absolute right-14 flex items-center">
                            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {games?.map((game) => (
                    <div key={game.id} className="bg-white overflow-hidden group relative">
                    <a className="text-xl font-semibold mb-2" href={`/catalog/${game.id}`}>
                        {game.name}
                    </a>
                    </div>
                ))}
            </div>
        </div>
    )
}