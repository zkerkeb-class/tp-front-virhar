import { useState, useEffect } from "react"
import PokeCard from "../pokeCard"
import PokeCardForm from "../pokeCard/PokeCardForm"
import Toast from "../toast/Toast"
import './index.css'

const API_URL = "http://localhost:3000"

const PokeList = () => {
    const [pokemons, setPokemons] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [toasts, setToasts] = useState([])
    const [form, setForm] = useState({ 
        name: '', type: 'Normal', HP: 50, Attack: 50, Defense: 50, 
        SpecialAttack: 50, SpecialDefense: 50, Speed: 50, image: '', localFile: null 
    })

    // Afficher une notification
    const showToast = (message, type = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

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

    // Recherche d'un pokémon par nom ou par ID
    const handleSearch = async () => {
        const term = searchTerm.trim();
        if (!term) {
            fetchPokemons();
            return;
        }
        setLoading(true);
        try {
            // Si c'est un nombre, on cherche par ID, sinon par nom
            const isId = /^\d+$/.test(term);
            const url = isId
                ? `${API_URL}/pokemons/${term}`
                : `${API_URL}/pokemons/name/${term}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setPokemons([data]);
                setPagination(null);
            } else {
                showToast('Pokémon non trouvé', 'error');
                setLoading(false);
                return;
            }
        } catch (error) {
            console.error("Erreur de recherche:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { fetchPokemons() }, [page])

    // Création d'un nouveau pokémon
    const handleAddPokemon = async () => {
        if (!form.name || (!form.image && !form.localFile)) { 
            showToast('Remplis le nom et une image', 'error')
            return 
        }

        // Utiliser FormData pour supporter l'upload de fichier
        const formData = new FormData();
        formData.append('name', JSON.stringify({ french: form.name }));
        formData.append('type', JSON.stringify([form.type]));
        formData.append('base', JSON.stringify({ 
            HP: form.HP, Attack: form.Attack, Defense: form.Defense, 
            SpecialAttack: form.SpecialAttack, SpecialDefense: form.SpecialDefense, Speed: form.Speed 
        }));

        if (form.localFile) {
            formData.append('imageFile', form.localFile);
        } else {
            formData.append('image', form.image);
        }

        const res = await fetch(`${API_URL}/pokemons`, {
            method: 'POST',
            body: formData
        })
        if (res.ok) { 
            showToast('Pokémon créé avec succès !', 'success')
            setShowAddForm(false)
            setForm({ name: '', type: 'Normal', HP: 50, Attack: 50, Defense: 50, SpecialAttack: 50, SpecialDefense: 50, Speed: 50, image: '', localFile: null })
            fetchPokemons()
        } else { 
            showToast('Erreur lors de la création', 'error') 
        }
    }

    if (loading) return <p>Loading...</p>

    return (
        <div className="poke-list-container">
            {/* Notifications */}
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
                ))}
            </div>

            <h2>POKEDEX OF FUTURE</h2>
            
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Pokemon name or ID" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">Search</button>
                <button onClick={() => { setSearchTerm(''); fetchPokemons(); }} className="search-button">Reset</button>
            </div>

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
                <div className="form-modal-overlay" onClick={() => setShowAddForm(false)}>
                    <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
                        <PokeCardForm
                            form={form}
                            setForm={setForm}
                            onSubmit={handleAddPokemon}
                            onCancel={() => setShowAddForm(false)}
                        />
                    </div>
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
