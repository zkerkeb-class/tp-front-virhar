import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import './pokemonDetails.css';

const API_URL = "http://localhost:3000";
const TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const PokemonDetails = () => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/pokemons/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Pokemon not found');
                return res.json();
            })
            .then(data => {
                setPokemon(data);
                setEditForm({
                    name: data.name?.french || '',
                    type: data.type?.[0] || 'Normal',
                    image: data.image || '',
                    HP: data.base?.HP || 50,
                    Attack: data.base?.Attack || 50,
                    Defense: data.base?.Defense || 50,
                    SpecialAttack: data.base?.SpecialAttack || 50,
                    SpecialDefense: data.base?.SpecialDefense || 50,
                    Speed: data.base?.Speed || 50
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleSave = async () => {
        try {
            const res = await fetch(`${API_URL}/pokemons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: { french: editForm.name },
                    type: [editForm.type],
                    image: editForm.image,
                    base: {
                        HP: editForm.HP,
                        Attack: editForm.Attack,
                        Defense: editForm.Defense,
                        SpecialAttack: editForm.SpecialAttack,
                        SpecialDefense: editForm.SpecialDefense,
                        Speed: editForm.Speed
                    }
                })
            });
            if (res.ok) {
                const updated = await res.json();
                setPokemon(updated.pokemon || updated);
                setIsEditing(false);
                alert('Pokemon updated!');
            } else {
                alert('Error updating');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/pokemons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                navigate('/');
            } else {
                alert('Error deleting Pokemon');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) return <div className="loading">Loading Pokemon details...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const stats = [
        { name: 'HP', key: 'HP', className: 'hp' },
        { name: 'Attack', key: 'Attack', className: 'attack' },
        { name: 'Defense', key: 'Defense', className: 'defense' },
        { name: 'Sp. Atk', key: 'SpecialAttack', className: 'special-attack' },
        { name: 'Sp. Def', key: 'SpecialDefense', className: 'special-defense' },
        { name: 'Speed', key: 'Speed', className: 'speed' }
    ];

    const displayStats = isEditing ? editForm : pokemon?.base;
    const totalStats = stats.reduce((sum, stat) => sum + (displayStats?.[stat.key] || 0), 0);
    const maxStat = 255;
    
    return (
        <div className="pokemon-details-container">
            <div className="pokemon-details-card">
                <div className="pokemon-header">
                    {isEditing ? (
                        <input 
                            className="edit-name-input"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                    ) : (
                        <h1 className="pokemon-name">{pokemon?.name?.french || pokemon?.name?.english}</h1>
                    )}
                    <div className="header-actions">
                        <span className="pokemon-id">#{String(pokemon?.id).padStart(3, '0')}</span>
                        <button 
                            className="edit-button"
                            onClick={() => setIsEditing(!isEditing)}
                            title={isEditing ? "Cancel" : "Edit"}
                        >
                            {isEditing ? '✕' : '✏️'}
                        </button>
                        <button 
                            className="delete-button"
                            onClick={() => setShowDeleteModal(true)}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                </div>

                <div className="pokemon-image-container">
                    <img 
                        src={isEditing ? editForm.image : pokemon?.image} 
                        alt={pokemon?.name?.french} 
                        className="pokemon-image"
                    />
                </div>

                {isEditing && (
                    <div className="edit-image-field">
                        <label>Image URL:</label>
                        <input 
                            type="text"
                            value={editForm.image}
                            onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                        />
                    </div>
                )}

                <div className="pokemon-types">
                    {isEditing ? (
                        <select 
                            className="type-select"
                            value={editForm.type}
                            onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                        >
                            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    ) : (
                        pokemon?.type?.map((type) => (
                            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                                {type}
                            </span>
                        ))
                    )}
                </div>

                <div className="stats-section">
                    <h2 className="stats-title">Statistics</h2>
                    {stats.map((stat) => {
                        const value = displayStats?.[stat.key] || 0;
                        const percentage = (value / maxStat) * 100;
                        return (
                            <div key={stat.key} className="stat-row">
                                <span className="stat-name">{stat.name}</span>
                                <div className="stat-bar-container">
                                    {isEditing ? (
                                        <input 
                                            type="range"
                                            min="1"
                                            max="255"
                                            value={editForm[stat.key]}
                                            onChange={(e) => setEditForm({...editForm, [stat.key]: +e.target.value})}
                                            className={`stat-slider ${stat.className}`}
                                        />
                                    ) : (
                                        <div 
                                            className={`stat-bar ${stat.className}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    )}
                                </div>
                                <span className="stat-value">{value}</span>
                            </div>
                        );
                    })}
                    
                    <div className="total-stats">
                        <span className="total-label">Total</span>
                        <span className="total-value">{totalStats}</span>
                    </div>
                </div>

                {isEditing && (
                    <button className="save-button" onClick={handleSave}>Save</button>
                )}

                <Link to="/" className="back-button">← Back to Pokédex</Link>
            </div>

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="modal-title">⚠️ Warning</h2>
                        <p className="modal-message">
                            Are you sure you want to delete <strong>{pokemon?.name?.french}</strong>?
                        </p>
                        <p className="modal-warning">This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button className="modal-cancel-btn" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="modal-delete-btn" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonDetails;