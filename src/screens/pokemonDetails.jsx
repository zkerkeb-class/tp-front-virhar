import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

const API_URL = "http://localhost:3000";

const PokemonDetails = () => { 
    const { id } = useParams(); 
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/pokemons/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Pokemon not found');
                }
                return response.json();
            })
            .then((data) => {
                console.log('pokemonData details', data);
                setPokemon(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <p>Chargement des détails du Pokémon...</p>;
    }

    if (error) {
        return <p>Erreur: {error}</p>;
    }
    
    return (
        <div>
            <h1>Détails du Pokémon {pokemon?.name?.french || pokemon?.name?.english}</h1>
            <img src={pokemon?.image} alt={pokemon?.name?.french} style={{ width: '200px' }} />
            <p><strong>Types:</strong> {pokemon?.type?.join(', ')}</p>
            <h3>Statistiques:</h3>
            <ul>
                {pokemon?.base && Object.entries(pokemon.base).map(([stat, value]) => (
                    <li key={stat}><strong>{stat}:</strong> {value}</li>
                ))}
            </ul>
            <Link to="/">Retour à la liste des Pokémon</Link>
        </div>
    );
};

export default PokemonDetails;