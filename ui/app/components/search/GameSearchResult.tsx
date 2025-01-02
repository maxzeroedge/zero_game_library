export type GameSearchResultProps = {
    name: string,
    url: string
}

export default function GameSearchResult({name, url}: GameSearchResultProps) {

  return (
    <div className="bg-white overflow-hidden group relative">
        <a className="text-xl font-semibold mb-2" href={`${url}`} target="blank">
            {name}
        </a>
    </div>
  );
};
