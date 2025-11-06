import {
	Brain,
	HeartPulse,
	Shield,
	ShieldCheck,
	Sparkle,
	Sword,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { Evolution, PokemonDetail, Stat } from "../../types/pokemon";

const API_URL = "https://nestjs-pokedex-api.vercel.app";

export default function PokemonDetailPage() {
	const router = useRouter();
	const { id } = router.query;
	const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [evolutionChain, setEvolutionChain] = useState<Evolution[]>([]);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		fetch(`${API_URL}/pokemons/${id}`)
			.then((res) => res.json())
			.then(async (data) => {
				let stats: Stat[] = [];
				if (Array.isArray(data.stats)) {
					stats = data.stats;
				} else if (data.stats && typeof data.stats === "object") {
					stats = Object.entries(data.stats).map(([name, value]) => ({
						name,
						value: Number(value),
					}));
				}
				setPokemon({ ...data, stats });
				setLoading(false);

				const chain: Evolution[] = [
					{
						pokedexId: data.pokedexId,
						name: data.name,
						image: data.image,
					},
				];
				let current = data;
				while (
					current.evolutions &&
					Array.isArray(current.evolutions) &&
					current.evolutions.length > 0
				) {
					const nextEvo = current.evolutions[0];
					const nextData = await fetch(
						`${API_URL}/pokemons/${nextEvo.pokedexId}`,
					).then((res) => res.json());
					chain.push({
						pokedexId: nextData.pokedexId,
						name: nextData.name,
						image: nextData.image,
					});
					current = nextData;
				}
				setEvolutionChain(chain);
			});
	}, [id]);

	if (loading || !pokemon) {
		return (
			<div className="text-center my-16 text-lg text-blue-500 animate-pulse">
				Chargement...
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 mt-10">
			<Link
				href="/"
				className="mb-8 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors inline-block"
			>
				← Retour
			</Link>
			<div className="flex flex-col md:flex-row items-center gap-8">
				<div className="flex flex-col items-center">
					<img
						src={pokemon.image}
						alt={pokemon.name}
						className="w-36 h-36 object-contain bg-gray-50 rounded-xl"
					/>
					<img
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokedexId}.png`}
						alt={`${pokemon.name}·sprite`}
						className="w-16 h-16 mt-2 drop-shadow-md bg-white border border-gray-200"
					/>
				</div>
				<div className="flex-1 w-full">
					<h1 className="text-3xl font-bold mb-2 text-gray-800">
						{pokemon.name}
					</h1>
					<div className="flex flex-wrap gap-2 mb-4">
						{pokemon.types.map((type) => (
							<span
								key={type.id}
								className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
							>
								<img
									src={type.image}
									alt={type.name}
									className="w-5 h-5 object-contain"
								/>
								{type.name}
							</span>
						))}
					</div>
					<div className="mt-2">
						<h3 className="font-semibold mb-1 text-gray-700">
							Stats
						</h3>
						<ul className="space-y-3">
							{Array.isArray(pokemon.stats) &&
								pokemon.stats.map((stat: Stat) => {
									let icon = null;
									let color = "bg-gray-300";
									switch (stat.name.toLowerCase()) {
										case "hp":
											icon = (
												<HeartPulse className="w-4 h-4 text-red-500 inline mr-1" />
											);
											color = "bg-red-400";
											break;
										case "attack":
											icon = (
												<Sword className="w-4 h-4 text-orange-500 inline mr-1" />
											);
											color = "bg-orange-400";
											break;
										case "defense":
											icon = (
												<Shield className="w-4 h-4 text-blue-500 inline mr-1" />
											);
											color = "bg-blue-400";
											break;
										case "speed":
											icon = (
												<Zap className="w-4 h-4 text-yellow-500 inline mr-1" />
											);
											color = "bg-yellow-400";
											break;
										case "specialattack":
										case "special_attack":
											icon = (
												<Sparkle className="w-4 h-4 text-pink-500 inline mr-1" />
											);
											color = "bg-pink-400";
											break;
										case "specialdefense":
										case "special_defense":
											icon = (
												<ShieldCheck className="w-4 h-4 text-green-500 inline mr-1" />
											);
											color = "bg-green-400";
											break;
										default:
											icon = (
												<Brain className="w-4 h-4 text-gray-400 inline mr-1" />
											);
											color = "bg-gray-400";
									}
									const percent = Math.min(
										(stat.value / 100) * 100,
										100,
									);
									return (
										<li
											key={stat.name}
											className="text-sm text-gray-700"
										>
											<div className="flex justify-between items-center mb-1">
												<span className="flex items-center gap-1">
													{icon}
													<span className="capitalize">
														{stat.name.replace(
															/_/g,
															" ",
														)}
													</span>
												</span>
												<span className="font-bold text-gray-900 w-32 text-right">
													{stat.value}
												</span>
											</div>
											<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
												<div
													className={`${color} h-3 rounded-full transition-all`}
													style={{
														width: `${percent}%`,
													}}
												></div>
											</div>
										</li>
									);
								})}
						</ul>
					</div>
				</div>
			</div>
			<div className="mt-10">
				<h3 className="text-lg font-semibold mb-3 text-gray-700">
					Évolutions
				</h3>
				<div className="flex gap-4 items-center flex-wrap">
					{evolutionChain && evolutionChain.length > 1 ? (
						evolutionChain.map((evo, idx) => (
							<React.Fragment key={evo.pokedexId}>
								<Link
									href={`/pokemon/${evo.pokedexId}`}
									className={`flex flex-col items-center cursor-pointer group hover:bg-blue-50 rounded-xl p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${evo.pokedexId === pokemon.pokedexId ? "ring-2 ring-blue-400" : ""}`}
									title={`Voir ${evo.name}`}
								>
									<img
										src={evo.image}
										alt={evo.name}
										className="w-20 h-20 object-contain bg-gray-50 rounded-lg group-hover:scale-105 transition-transform"
									/>
									<div className="mt-2 text-sm text-gray-800 font-medium group-hover:text-blue-700">
										{evo.name}
									</div>
								</Link>
								{idx < evolutionChain.length - 1 && (
									<span className="mx-2 text-blue-400 text-2xl select-none">
										→
									</span>
								)}
							</React.Fragment>
						))
					) : (
						<div className="text-gray-400">Aucune évolution</div>
					)}
				</div>
			</div>
		</div>
	);
}
