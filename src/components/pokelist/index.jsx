import { useState, useEffect } from "react"
import PokeCard from "../pokeCard"
import './index.css'

const API_URL = "http://localhost:3000"
const TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy']

const PokeList = () => {
    const [pokemons, setPokemons] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [form, setForm] = useState({ 
        name: '', type: 'Normal', HP: 50, Attack: 50, Defense: 50, 
        SpecialAttack: 50, SpecialDefense: 50, Speed: 50, image: '' 
    })

    // Récupération des pokémons avec pagination
    const fetchPokemons = () => {
        setLoading(true)
        fetch(`${API_URL}/pokemons?page=${page}&limit=20`)
            .then(res => res.json())
            .then(data => {
                setPokemons(data.data)
                setPagination(data.pagination)
                setLoading(false)
            })
            .catch(err => {
                console.error("Erreur:", err)
                setLoading(false)
            })
    }

    useEffect(() => { fetchPokemons() }, [page])

    // Création d'un nouveau pokémon
    const handleAddPokemon = async () => {
        if (!form.name || !form.image) { 
            alert('Please fill in name and image')
            return 
        }
        const res = await fetch(`${API_URL}/pokemons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: { french: form.name },
                type: [form.type],
                base: { 
                    HP: form.HP, Attack: form.Attack, Defense: form.Defense, 
                    SpecialAttack: form.SpecialAttack, SpecialDefense: form.SpecialDefense, Speed: form.Speed 
                },
                image: form.image
            })
        })
        if (res.ok) { 
            alert('Pokemon created!')
            setShowAddForm(false)
            fetchPokemons()
        } else { 
            alert('Error') 
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="poke-list-container">
            <h2>POKEDEX OF FUTURE</h2>
            
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={!pagination?.hasPrevPage}>Previous</button>
                <span>Page {pagination?.currentPage} / {pagination?.totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={!pagination?.hasNextPage}>Next</button>
            </div>

            <div className="pagination">
                <div className="edit_pokedex">
                    <button onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Cancel' : 'Add a new Pokemon'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className="add-pokemon-form">
                    <div className="form-field">
                        <label>Name</label>
                        <input placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Type</label>
                        <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                            {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>HP</label>
                        <input type="number" value={form.HP} onChange={(e) => setForm({...form, HP: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Attack</label>
                        <input type="number" value={form.Attack} onChange={(e) => setForm({...form, Attack: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Defense</label>
                        <input type="number" value={form.Defense} onChange={(e) => setForm({...form, Defense: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Sp. Atk</label>
                        <input type="number" value={form.SpecialAttack} onChange={(e) => setForm({...form, SpecialAttack: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Sp. Def</label>
                        <input type="number" value={form.SpecialDefense} onChange={(e) => setForm({...form, SpecialDefense: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Speed</label>
                        <input type="number" value={form.Speed} onChange={(e) => setForm({...form, Speed: +e.target.value})} />
                    </div>
                    <div className="form-field">
                        <label>Image (URL or path)</label>
                        <input placeholder="http://... or C:\..." value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} />
                    </div>
                    <button onClick={handleAddPokemon}>Create</button>
                </div>
            )}

            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </ul>
        </div>
    )
}

export default PokeList
