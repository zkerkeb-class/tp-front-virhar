import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";

import './index.css';

const API_URL = "http://localhost:3000";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/pokemons?page=${page}&limit=20`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Données reçues:", data);
                setPokemons(data.data);
                setPagination(data.pagination);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [page]);

    if (loading) {
        return <p>Chargement...</p>
    }

    return (
        <div className="poke-list-container">
            <h2>Liste des Pokémon</h2>
            
            {/* Pagination */}
            <div className="pagination">
                <button 
                    onClick={() => setPage(page - 1)} 
                    disabled={!pagination?.hasPrevPage}
                >
                    Précédent
                </button>
                <span>Page {pagination?.currentPage} / {pagination?.totalPages}</span>
                <button 
                    onClick={() => setPage(page + 1)} 
                    disabled={!pagination?.hasNextPage}
                >
                    Suivant
                </button>
            </div>

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </ul>
        </div>
    );
};

export default PokeList;
