import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";

import './index.css';

const API_URL = "http://localhost:3000";
const TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [form, setForm] = useState({ name: '', type: 'Normal', HP: 50, Attack: 50, Defense: 50, SpecialAttack: 50, SpecialDefense: 50, Speed: 50, image: '' });

    const fetchPokemons = () => {
        setLoading(true);
        fetch(`${API_URL}/pokemons?page=${page}&limit=20`)
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.data);
                setPagination(data.pagination);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    };

    useEffect(() => { fetchPokemons(); }, [page]);

    // Appelle POST /pokemons du backend
    const handleAddPokemon = async () => {
        if (!form.name || !form.image) { alert('Remplissez le nom et l\'image'); return; }
        const res = await fetch(`${API_URL}/pokemons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: { french: form.name },
                type: [form.type],
                base: { HP: form.HP, Attack: form.Attack, Defense: form.Defense, SpecialAttack: form.SpecialAttack, SpecialDefense: form.SpecialDefense, Speed: form.Speed },
                image: form.image
            })
        });
        if (res.ok) { alert('Pokémon créé !'); setShowAddForm(false); fetchPokemons(); }
        else { alert('Erreur'); }
    };

    // Appelle DELETE /pokemons/:id du backend
    const handleDeletePokemon = async () => {
        if (!deleteId) { alert('Entrez un ID'); return; }
        const res = await fetch(`${API_URL}/pokemons/${deleteId}`, { method: 'DELETE' });
        if (res.ok) { alert('Pokémon supprimé !'); setShowDeleteForm(false); setDeleteId(''); fetchPokemons(); }
        else { alert('Pokémon non trouvé'); }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="poke-list-container">
            <h2>POKEDEX</h2>
            
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={!pagination?.hasPrevPage}>Précédent</button>
                <span>Page {pagination?.currentPage} / {pagination?.totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={!pagination?.hasNextPage}>Suivant</button>
            </div>

            <div className="pagination">
                <div className="edit_pokedex">
                    <button onClick={() => { setShowAddForm(!showAddForm); setShowDeleteForm(false); }}>
                        {showAddForm ? 'Annuler' : 'Add a new Pokemon'}
                    </button>
                    <button onClick={() => { setShowDeleteForm(!showDeleteForm); setShowAddForm(false); }}>
                        {showDeleteForm ? 'Annuler' : 'Delete a Pokemon'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="add-pokemon-form">
                    <input placeholder="Nom" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                    <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                        {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input type="number" placeholder="HP" value={form.HP} onChange={(e) => setForm({...form, HP: +e.target.value})} />
                    <input type="number" placeholder="Atk" value={form.Attack} onChange={(e) => setForm({...form, Attack: +e.target.value})} />
                    <input type="number" placeholder="Def" value={form.Defense} onChange={(e) => setForm({...form, Defense: +e.target.value})} />
                    <input type="number" placeholder="SpA" value={form.SpecialAttack} onChange={(e) => setForm({...form, SpecialAttack: +e.target.value})} />
                    <input type="number" placeholder="SpD" value={form.SpecialDefense} onChange={(e) => setForm({...form, SpecialDefense: +e.target.value})} />
                    <input type="number" placeholder="Spe" value={form.Speed} onChange={(e) => setForm({...form, Speed: +e.target.value})} />
                    <input placeholder="Lien image" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
                    <button onClick={handleAddPokemon}>Créer</button>
                </div>
            )}

            {showDeleteForm && (
                <div className="add-pokemon-form">
                    <input type="number" placeholder="ID" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
                    <button onClick={handleDeletePokemon} style={{background:'#dc3545'}}>Supprimer</button>
                </div>
            )}

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </ul>
        </div>
    );
};

export default PokeList;
