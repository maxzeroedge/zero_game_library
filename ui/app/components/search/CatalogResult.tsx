export type CatalogResultProps = {
    id: string,
    name: string
}

export default function CatalogResult({id, name}: CatalogResultProps) {

  return (
    <div key={id} className="bg-white overflow-hidden group relative">
        <a className="text-xl font-semibold mb-2" href={`/catalog/${id}`}>
            {name}
        </a>
    </div>
  );
};
