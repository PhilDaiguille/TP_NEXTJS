import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Pokemon, PokemonType } from "../types/pokemon";
import PokemonCard from "../components/PokemonCard";

const API_URL = "https://nestjs-pokedex-api.vercel.app";

export default function Home() {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(50);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [nameFilter, setNameFilter] = useState<string>("");
	const [types, setTypes] = useState<PokemonType[]>([]);
	const [selectedTypes, setSelectedTypes] = useState<number[]>([]);

	const observer = useRef<IntersectionObserver | null>(null);
	const lastPokemonRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new window.IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					setPage((prev) => prev + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore],
	);

	useEffect(() => {
		fetch(`${API_URL}/types`)
			.then((res) => res.json())
			.then((data: PokemonType[]) => setTypes(data));
	}, []);

	useEffect(() => {
		setLoading(true);
		const params = new URLSearchParams();
		params.append("page", page.toString());
		params.append("limit", limit.toString());
		if (nameFilter) params.append("name", nameFilter);
		if (selectedTypes.length > 0) {
			selectedTypes.forEach((typeId: number) =>
				params.append("typeId", typeId.toString()),
			);
		}
		fetch(`${API_URL}/pokemons?${params.toString()}`)
			.then((res) => res.json())
			.then((data: Pokemon[] | { data: Pokemon[] }) => {
				const pokemonArray = Array.isArray(data)
					? data
					: data.data || [];
				if (page === 1) {
					setPokemons(pokemonArray);
				} else {
					setPokemons((prev) => [...prev, ...pokemonArray]);
				}
				setHasMore(pokemonArray.length === limit);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Erreur lors du chargement des pokémons:", error);
				setLoading(false);
			});
	}, [page, limit, nameFilter, selectedTypes]);

	useEffect(() => {
		setPage(1);
		setPokemons([]);
	}, [nameFilter, selectedTypes, limit]);

	useEffect(() => {
		if (nameFilter === "") {
			setPage(1);
		}
	}, [nameFilter]);

	const handleTypeChange = (typeId: number) => {
		setSelectedTypes((prev) =>
			prev.includes(typeId)
				? prev.filter((id: number) => id !== typeId)
				: [...prev, typeId],
		);
	};

	const handleReset = () => {
		setNameFilter("");
		setSelectedTypes([]);
		setLimit(50);
		setPage(1);
	};

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNameFilter(e.target.value);
	};

	const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLimit(Number(e.target.value));
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold text-center mb-10 text-white">
				Le super pokédex
			</h1>
			<div className="bg-white border-3 border-black rounded-2xl p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between rounded-lg py-4">
					<input
						type="text"
						placeholder="Filtrer par nom..."
						value={nameFilter}
						onChange={handleNameChange}
						className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg text-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
						autoComplete="off"
					/>
					<div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
						<select
							value={limit}
							onChange={handleLimitChange}
							className="px-4 py-2 border border-gray-300 rounded-lg text-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
						>
							{[10, 20, 50, 100].map((val) => (
								<option key={val} value={val}>
									{val} / page
								</option>
							))}
						</select>
						<button
							onClick={handleReset}
							className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium border border-gray-300 transition"
						>
							Réinitialiser
						</button>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
					<div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-center md:justify-start">
						{types.map((type) => (
							<label
								key={type.id}
								className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer select-none border border-gray-200 bg-white transition-all hover:bg-blue-50 ${selectedTypes.includes(type.id) ? "ring-2 ring-blue-400" : ""}`}
							>
								<input
									type="checkbox"
									checked={selectedTypes.includes(type.id)}
									onChange={() => handleTypeChange(type.id)}
									className="accent-blue-500"
								/>
								<img
									src={type.image}
									alt={type.name}
									className="w-5 h-5 object-contain"
								/>
								<span className="text-xs font-medium text-gray-700">
									{type.name}
								</span>
							</label>
						))}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{(() => {
					const filtered = pokemons.filter((pokemon) => {
						if (selectedTypes.length === 0) return true;
						if (!pokemon.types || pokemon.types.length === 0)
							return false;
						return pokemon.types.some((type) =>
							selectedTypes.includes(type.id),
						);
					});
					if (filtered.length === 0 && !loading) {
						return (
							<div className="col-span-full text-center text-gray-400 py-12 text-lg">
								Aucun Pokémon trouvé pour ce filtre.
							</div>
						);
					}
					return filtered.map((pokemon, idx) => {
						const ref =
							idx === pokemons.length - 1
								? lastPokemonRef
								: undefined;
						return (
							<PokemonCard
								key={pokemon.pokedexId}
								pokemon={pokemon}
								cardRef={ref}
							/>
						);
					});
				})()}
			</div>
			{loading && (
				<div className="text-center my-8 text-lg text-blue-500 animate-pulse">
					Chargement...
				</div>
			)}
			{!hasMore && !loading && (
				<div className="text-center my-8 text-white">
					Fin de la liste
				</div>
			)}
		</div>
	);
}
