import { useRef, useState } from 'react';
import './index.css';
import './pokeCardForm.css';
import PokemonMap from '../pokemonMap/PokemonMap';

// Couleurs associées à chaque type
const typeColors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
};

const TYPES = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const STATS = [
    { key: 'HP', label: 'HP', className: 'hp' },
    { key: 'Attack', label: 'Attack', className: 'attack' },
    { key: 'Defense', label: 'Defense', className: 'defense' },
    { key: 'SpecialAttack', label: 'Sp. Atk', className: 'special-attack' },
    { key: 'SpecialDefense', label: 'Sp. Def', className: 'special-defense' },
    { key: 'Speed', label: 'Speed', className: 'speed' }
];

// Carte de création de pokémon (même visuel qu'une PokeCard)
const PokeCardForm = ({ form, setForm, onSubmit, onCancel }) => {
    const fileInputRef = useRef(null);
    const [showMap, setShowMap] = useState(false);
    const mainType = form.type;
    const backgroundColor = typeColors[mainType?.toLowerCase()] || '#667eea';
    const typeImageUrl = `http://localhost:3000/assets/types/${mainType?.toUpperCase()}.png`;

    // Preview : fichier local ou URL
    const previewSrc = form.localFile
        ? URL.createObjectURL(form.localFile)
        : form.image || null;

    // Sélection d'un fichier depuis l'explorateur
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, localFile: file, image: '' });
        }
    };

    const handleMapSelect = (x, y) => {
        // Convertir si nécessaire : ici on garde les valeurs retournées par la map
        setForm({ ...form, mapX: x, mapY: y });
        setShowMap(false);
    };

    return (
        <div className="poke-card-form-wrapper">
            <div className="poke-card poke-card-form" style={{ backgroundColor }}>
                <div className="poke-card-top">
                    <div className={`poke-card-header poke-type-${mainType?.toLowerCase()}`}>
                        <input
                            className="form-card-input form-card-name"
                            placeholder="Pokemon name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="poke-hp-container">
                        <span className="poke-hp">HP {form.HP}</span>
                        <img src={typeImageUrl} alt={mainType} className="poke-type-icon" />
                    </div>
                </div>

                {/* Zone image cliquable pour ouvrir l'explorateur */}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                />
                <div
                    className="poke-image-background form-card-image-zone"
                    onClick={() => fileInputRef.current.click()}
                    title="Click to choose an image"
                >
                    {previewSrc ? (
                        <img src={previewSrc} alt="Preview" className="poke-image" />
                    ) : (
                        <span className="form-card-placeholder">?</span>
                    )}
                </div>

                {form.localFile && (
                    <div className="form-card-file-info">
                        📁 {form.localFile.name}
                        <span
                            className="form-card-file-remove"
                            onClick={() => setForm({ ...form, localFile: null })}
                        >✕</span>
                    </div>
                )}

                <div className="form-card-image-input">
                    <input
                        className="form-card-input"
                        placeholder="Or paste a URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value, localFile: null })}
                        disabled={!!form.localFile}
                    />
                </div>

                <div className="form-card-type-select">
                    <select
                        className="form-card-input"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div className="form-card-map-btn-container">
                    <button
                        type="button"
                        className="form-card-map-btn"
                        onClick={() => setShowMap(true)}
                        style={{ color: '#ffd700', borderColor: 'transparent', background: 'transparent', cursor: 'pointer' }}
                    >
                        Select Location on Map
                    </button>
                </div>

                <div className="form-card-stats">
                    {STATS.map(({ key, label, className }) => (
                        <div className="form-card-stat-row" key={key}>
                            <span className="form-card-stat-name">{label}</span>
                            <div className="form-card-slider-container">
                                <input
                                    type="range"
                                    min="1"
                                    max="255"
                                    value={form[key]}
                                    onChange={(e) => setForm({ ...form, [key]: +e.target.value })}
                                    className={`form-card-slider ${className}`}
                                />
                            </div>
                            <span className="form-card-stat-value">{form[key]}</span>
                        </div>
                    ))}
                </div>
            </div>

                <div className="form-card-buttons">
                <button className="form-card-btn form-card-btn-create" onClick={onSubmit}>Create</button>
                <button className="form-card-btn form-card-btn-cancel" onClick={onCancel}>Cancel</button>
            </div>
                {showMap && (
                    <PokemonMap
                        pokemonId={null}
                        isVisible={true}
                        onClose={() => setShowMap(false)}
                        selectMode={true}
                        onMapSelect={handleMapSelect}
                    />
                )}
        </div>
    );
};

export default PokeCardForm;
