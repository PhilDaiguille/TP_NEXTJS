import Link from "next/link";
import type { Pokemon } from "../types/pokemon";

interface PokemonCardProps {
	pokemon: Pokemon;
	cardRef?: (node: HTMLDivElement | null) => void;
}

export default function PokemonCard({ pokemon, cardRef }: PokemonCardProps) {
	return (
		<div ref={cardRef}>
			<Link
				href={`/pokemon/${pokemon.pokedexId}`}
				className="bg-white border-4 border-red-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col items-center p-6 cursor-pointer group min-h-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
				tabIndex={0}
				title={`Voir ${pokemon.name}`}
			>
				<span className="font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
					#{pokemon.pokedexId}
				</span>
				<img
					src={pokemon.image}
					alt={pokemon.name}
					className="w-28 h-28 object-contain my-3 drop-shadow-md group-hover:scale-105 transition-transform"
				/>
				<h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
					{pokemon.name}
				</h2>
				<div className="flex flex-wrap gap-2 mt-2 w-full relative">
					{pokemon.types.map((type) => (
						<span
							key={type.id}
							className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
						>
							<img
								src={type.image}
								alt={type.name}
								className="w-5 h-5 object-contain"
							/>
							{type.name}
						</span>
					))}
					<img
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexId}.png`}
						alt={`${pokemon.name} sprite`}
						className="absolute bottom-0 right-0 w-10 h-10 drop-shadow-md bg-white border border-gray-200"
						style={{ zIndex: 2 }}
					/>
				</div>
			</Link>
		</div>
	);
}
