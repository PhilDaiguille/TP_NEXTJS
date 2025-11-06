export type PokemonType = {
	id: number;
	name: string;
	image: string;
};

export type Stat = {
	name: string;
	value: number;
};

export type Evolution = {
	pokedexId: number;
	name: string;
	image?: string;
};

export type Pokemon = {
	pokedexId: number;
	name: string;
	image: string;
	types: PokemonType[];
};

export type PokemonDetail = {
	pokedexId: number;
	name: string;
	image: string;
	types: PokemonType[];
	stats: Stat[] | Record<string, number>;
	evolutions: Evolution[];
};

export enum StatName {
	HP = "hp",
	Attack = "attack",
	Defense = "defense",
	Speed = "speed",
	SpecialAttack = "special_attack",
	SpecialDefense = "special_defense",
}
