import { Link } from "react-router";

import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    // Les données viennent directement du backend local
    // Structure: { id, name: { french, english, ... }, type: [...], base: {...}, image }

    return (
        <Link to={`/pokemonDetails/${pokemon.id}`}>
        <div className="poke-card">
            <div className={`poke-card-header poke-type-${pokemon.type?.[0]?.toLowerCase()}`}>
                <PokeTitle name={pokemon.name?.french || pokemon.name?.english} />
            </div>
            <div className="poke-image-background">
                <PokeImage imageUrl={pokemon.image} />
            </div>
            <div>
                {pokemon.base && Object.entries(pokemon.base).map(([statName, statValue]) => (
                    <div className="poke-stat-row" key={statName}>
                        <span className={`poke-type-font poke-type-${statName.toLowerCase()}`}>{statName}</span>
                        <span className="poke-type-font poke-stat-value">{statValue}</span>
                    </div>
                ))}
            </div>
        </div>
        </Link>
    );
}

export default PokeCard;