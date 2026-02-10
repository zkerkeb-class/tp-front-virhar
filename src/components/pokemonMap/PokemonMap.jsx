import { useState } from 'react';
import pokemonLocations from '../../data/pokemonLocations'; // Note: on n'importe plus kantoZones ici pour éviter le conflit si on le déclare en dur, mais idéalement utilisez l'import.
import './pokemonMap.css';

const kantoZones = [
    { name: "Bourg Palette", x: 110, y: 310 },
    { name: "Jadielle", x: 110, y: 230 },
    { name: "Argenta", x: 110, y: 110 },
    { name: "Azuria", x: 330, y: 90 },
    { name: "Lavanville", x: 440, y: 170 },
    { name: "Carmin sur Mer", x: 330, y: 250 },
    { name: "Céladopole", x: 240, y: 170 },
    { name: "Safrania", x: 330, y: 170 },
    { name: "Parmanie", x: 280, y: 340 },
    { name: "Cramois'Île", x: 110, y: 370 }, // Île en bas à gauche
    { name: "Plateau Indigo", x: 50, y: 60 },
    { name: "Centrale", x: 400, y: 110 },
];

const PokemonMap = ({ pokemonId, isVisible, onClose, selectMode = false, onMapSelect }) => {
    const [hoveredZone, setHoveredZone] = useState(null);
    const locationData = pokemonLocations[pokemonId];
    const locations = locationData?.locations || [];

    // Dimensions fixes pour la précision du dessin SVG
    const VIEW_W = 500;
    const VIEW_H = 400; // Légèrement plus haut pour inclure Cramois'île confortablement

    const toView = (x, y) => ({ x, y }); // Coordonnées directes (1:1)

    const handleSvgClick = (e) => {
        if (!selectMode || typeof onMapSelect !== 'function') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const x = (cx / rect.width) * VIEW_W;
        const y = (cy / rect.height) * VIEW_H;
        console.log(`Zone cliquée : x=${Math.round(x)}, y=${Math.round(y)}`); // Utile pour debug
        onMapSelect(Math.round(x), Math.round(y));
    };

    return (
        <div className={`map-overlay ${isVisible ? 'map-overlay-visible' : ''}`} onClick={onClose}>
            <div className="map-overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="map-close-btn" onClick={onClose}>✕</button>
                <h2 className="map-title" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    Kanto
                </h2>

                <div className="kanto-map-container" style={{ background: '#4FD0F7', borderColor: '#fff' }}>
                    <svg 
                        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} 
                        className="kanto-map-svg" 
                        xmlns="http://www.w3.org/2000/svg" 
                        onClick={handleSvgClick} 
                        style={selectMode ? { cursor: 'crosshair' } : {}}
                    >
                        <defs>
                            {/* Ombre portée pour la terre */}
                            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
                            </filter>
                        </defs>

                        {/* === CONTINENT (Forme précise de Kanto) === */}
                        <path 
                            d="
                            M 20,60                
                            L 80,60 L 80,100       
                            L 280,100 L 280,80 L 350,80 
                            L 380,60 L 460,60      
                            L 460,180              
                            L 360,180 L 360,250    
                            L 420,250 L 420,340    
                            L 240,340              
                            L 240,290              
                            L 180,290 L 180,340    
                            L 150,340              
                            L 150,290 L 80,290     
                            L 80,200 L 20,200      
                            Z" 
                            fill="#91E473" 
                            stroke="#5DA642" 
                            strokeWidth="3"
                            filter="url(#shadow)"
                        />

                        {/* === CRAMOIS'ÎLE (Séparée) === */}
                        <rect x="80" y="350" width="60" height="40" rx="5" fill="#91E473" stroke="#5DA642" strokeWidth="3" filter="url(#shadow)" />

                        {/* === ROUTES (Rouge pour terre, Pointillés bleus pour eau) === */}
                        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                            
                            {/* ROUTES TERRESTRES (Style Rouge/Rose vif comme le jeu) */}
                            <g stroke="#E83558" strokeWidth="6">
                                {/* Route 1 (Palette -> Jadielle) */}
                                <line x1="110" y1="310" x2="110" y2="230" />
                                {/* Route 2 (Jadielle -> Argenta) */}
                                <line x1="110" y1="230" x2="110" y2="110" />
                                {/* Route 22 (Vers Indigo) */}
                                <line x1="110" y1="230" x2="50" y2="230" />
                                <line x1="50" y1="230" x2="50" y2="60" /> {/* Route victoire verticale */}
                                
                                {/* Route 3 (Argenta -> Mt Moon) */}
                                <line x1="110" y1="110" x2="220" y2="110" />
                                {/* Route 4 (Mt Moon -> Azuria) */}
                                <line x1="220" y1="110" x2="330" y2="110" />
                                <line x1="330" y1="110" x2="330" y2="90" />

                                {/* Route 9 (Azuria -> Est) */}
                                <line x1="330" y1="110" x2="440" y2="110" />
                                {/* Route 10 (Centrale -> Lavanville) */}
                                <line x1="440" y1="110" x2="440" y2="170" />

                                {/* Route 5 (Azuria -> Sud -> Safrania) */}
                                <line x1="330" y1="110" x2="330" y2="170" />
                                
                                {/* Route 7 (Céladopole -> Safrania) */}
                                <line x1="240" y1="170" x2="330" y2="170" />
                                
                                {/* Route 8 (Safrania -> Lavanville) */}
                                <line x1="330" y1="170" x2="440" y2="170" />

                                {/* Route 6 (Safrania -> Carmin) */}
                                <line x1="330" y1="170" x2="330" y2="250" />

                                {/* Route 12/13/14/15 (Lavanville -> Sud -> Parmanie) */}
                                <polyline points="440,170 440,340 280,340" />

                                {/* Route 16 (Céladopole -> Ouest) */}
                                <line x1="240" y1="170" x2="190" y2="170" />
                                {/* Route 18 (Fin piste cyclable -> Parmanie) */}
                                <line x1="190" y1="340" x2="280" y2="340" />
                            </g>

                            {/* PISTE CYCLABLE (Pont distinctif) */}
                            <line x1="190" y1="170" x2="190" y2="340" stroke="#9E9E9E" strokeWidth="8" />
                            <line x1="190" y1="170" x2="190" y2="340" stroke="#FFF" strokeWidth="2" strokeDasharray="5,5" />

                            {/* ROUTES MARITIMES (Pointillés bleus) */}
                            <g stroke="#2980B9" strokeWidth="4" strokeDasharray="6,6">
                                {/* Route 19/20 (Parmanie -> Cramois'île) */}
                                <polyline points="280,340 280,370 110,370" />
                                {/* Route 21 (Cramois'île -> Palette) */}
                                <line x1="110" y1="370" x2="110" y2="310" />
                            </g>
                        </g>

                        {/* === VILLES (Carrés avec bordure colorée) === */}
                        {kantoZones.map((zone) => {
                            const pos = toView(zone.x, zone.y);
                            const isHighlighted = locations.some(loc => loc.zone === zone.name);
                            const isHovered = hoveredZone === zone.name;

                            return (
                                <g key={zone.name} 
                                   onMouseEnter={() => setHoveredZone(zone.name)} 
                                   onMouseLeave={() => setHoveredZone(null)}
                                   style={{ cursor: 'pointer' }}>
                                    
                                    {isHighlighted && (
                                        <circle cx={pos.x} cy={pos.y} r="14" fill="rgba(255, 215, 0, 0.4)" className="map-pulse" />
                                    )}

                                    {/* Style "Jeu vidéo" : Carré bleu avec bord blanc */}
                                    <rect 
                                        x={pos.x - 8} y={pos.y - 8} width="16" height="16" 
                                        fill={isHighlighted ? "#FFD700" : "#34495E"} 
                                        stroke="white" 
                                        strokeWidth="2"
                                        rx="2"
                                    />
                                    
                                    {/* Petit point central */}
                                    <circle cx={pos.x} cy={pos.y} r="3" fill={isHighlighted ? "white" : "#F1C40F"} />

                                    {/* Tooltip Nom de la ville */}
                                    {isHovered && (
                                        <g pointerEvents="none">
                                            <rect x={pos.x - 40} y={pos.y - 35} width="80" height="24" rx="4" fill="white" stroke="#333" strokeWidth="2"/>
                                            <text 
                                                x={pos.x} y={pos.y - 20} 
                                                textAnchor="middle" 
                                                fill="#333" 
                                                fontSize="11" 
                                                fontWeight="bold"
                                                fontFamily="sans-serif"
                                                dominantBaseline="middle"
                                            >
                                                {zone.name}
                                            </text>
                                            {/* Petite flèche du tooltip */}
                                            <path d={`M ${pos.x-5} ${pos.y-11} L ${pos.x+5} ${pos.y-11} L ${pos.x} ${pos.y-5} Z`} fill="white" stroke="#333" strokeWidth="1" />
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                        {/* Localisations spécifiques hors villes */}
                        {locations.map((loc, i) => {
                            const isOnMainZone = kantoZones.some(z => z.name === loc.zone);
                            if (isOnMainZone) return null;
                            const pos = toView(loc.x, loc.y);
                            return (
                                <g key={i} onMouseEnter={() => setHoveredZone(loc.zone)} onMouseLeave={() => setHoveredZone(null)}>
                                    <circle cx={pos.x} cy={pos.y} r="5" fill="#C0392B" stroke="white" strokeWidth="2" />
                                </g>
                            );
                        })}

                    </svg>
                </div>
            </div>
        </div>
    );
};

export default PokemonMap;