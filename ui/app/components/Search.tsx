import { useCallback, useEffect, useState } from "react";
import { Game } from "~/models/igdb";
import debounce from 'lodash/debounce';

export type SearchComponentProps = {
    apiToCall: (params: any) => any,
    searchName: string,
    ResultComponent: React.FC<any>
}

const SearchComponent = ({ apiToCall, searchName, ResultComponent }: SearchComponentProps) => {


    const [games, setGames] = useState<Game[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);

    const callFetchGames = async (searchString: string) => {
        setIsLoading(true);
        let games = [];
        try {
            games = await apiToCall({searchName, searchString});
        } catch (error) {
            setErrors([...errors, error]);
        } finally {
            setIsLoading(false);
        }
        return games;
    };

    const debouncedApiCall = useCallback(
        debounce(async (searchString: string) => {
            const fetchedGames = await callFetchGames(searchString);
            setGames(fetchedGames);
        }, 1000),
        []
    );

    useEffect(() => {
        if (searchTerm) {
            debouncedApiCall(searchTerm);
        } else {
            setGames([]);
        }
    }, [searchTerm, debouncedApiCall]);

    const removeError = (index: number) => {
        setErrors(prevErrors => prevErrors.filter((_, i) => i !== index));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center">
                    <div className="relative w-full">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                name="search"
                                placeholder={`Search ${searchName}...`}
                                className="w-full px-4 py-2 pr-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                className="absolute right-0 p-3 bg-blue-500 text-white hover:text-gray-600 focus:outline-none border-r-1 rounded-tr-lg rounded-br-lg"
                                onClick={() => debouncedApiCall(searchTerm)}
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
                    <ResultComponent 
                        {...game}
                    />
                ))}
            </div>
            <div className="fixed bottom-4 right-4 flex flex-col-reverse space-y-reverse space-y-2">
                {errors.map((error, index) => (
                    <div
                        key={index}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
                    >
                        <span className="mr-4">{error}</span>
                        <button
                            onClick={() => removeError(index)}
                            className="text-white hover:text-red-200 focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchComponent;