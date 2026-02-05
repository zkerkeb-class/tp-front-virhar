import { Link } from "react-router";
import './index.css';
import PokeTitle from "./pokeTitle";
import PokeImage from "./pokeImage";

// Couleurs associées à chaque type de pokémon
const typeColors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
};

const PokeCard = ({ pokemon }) => {
    const hp = pokemon.base?.HP || '??';
    const mainType = pokemon.type?.[0];
    const backgroundColor = typeColors[mainType?.toLowerCase()] || '#667eea';
    const typeImageUrl = `http://localhost:3000/assets/types/${mainType?.toUpperCase()}.png`;

    return (
        <Link to={`/pokemonDetails/${pokemon.id}`}>
            <div className="poke-card" style={{ backgroundColor }}>
                <div className="poke-card-top">
                    <div className={`poke-card-header poke-type-${mainType?.toLowerCase()}`}>
                        <PokeTitle name={pokemon.name?.french || pokemon.name?.english} />
                    </div>
                    <div className="poke-hp-container">
                        <span className="poke-hp">HP {hp}</span>
                        <img src={typeImageUrl} alt={mainType} className="poke-type-icon" />
                    </div>
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
};

export default PokeCard;