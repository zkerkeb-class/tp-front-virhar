import { useState } from 'react';
import pokemonLocations from '../../data/pokemonLocations';
import './pokemonMap.css';

// Zones en coordonnées SVG (VIEW coords) adaptées à VIEW_W/VIEW_H ci-dessous
const kantoZones = [
    { name: 'Bourg Palette', x: 110, y: 310 },
    { name: 'Jadielle', x: 110, y: 230 },
    { name: 'Argenta', x: 110, y: 110 },
    { name: 'Azuria', x: 330, y: 90 },
    { name: 'Lavanville', x: 440, y: 170 },
    { name: 'Carmin sur Mer', x: 330, y: 250 },
    { name: 'Céladopole', x: 240, y: 170 },
    { name: 'Safrania', x: 330, y: 170 },
    { name: 'Parmanie', x: 280, y: 340 },
    { name: "Cramois'Île", x: 110, y: 370 },
    { name: 'Plateau Indigo', x: 50, y: 60 },
    { name: 'Centrale', x: 400, y: 110 }
];

const PokemonMap = ({ pokemonId, isVisible, onClose, selectMode = false, onMapSelect, selectedPosition, inline = false }) => {
    const [hoveredZone, setHoveredZone] = useState(null);
    const locationData = pokemonLocations[pokemonId];
    const locations = locationData?.locations || [];

    const VIEW_W = 500;
    const VIEW_H = 400;

    // toView: ici les données kantoZones sont déjà en VIEW coords
    const toView = (x, y) => ({ x, y });

    const handleSvgClick = (e) => {
        if (!selectMode || typeof onMapSelect !== 'function') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const x = (cx / rect.width) * VIEW_W;
        const y = (cy / rect.height) * VIEW_H;
        onMapSelect(Math.round(x), Math.round(y));
    };

    const isPosNearZone = (pos, zonePos, threshold = 18) => {
        const dx = pos.x - zonePos.x;
        const dy = pos.y - zonePos.y;
        return Math.sqrt(dx * dx + dy * dy) <= threshold;
    };

    // construire le SVG (réutilisable pour la version inline et modal)
    const svgContent = (
        <div className="kanto-map-container">
            <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="kanto-map-svg"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleSvgClick}
                style={selectMode ? { cursor: 'crosshair' } : {}}
            >
                <defs>
                    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
                    </filter>
                </defs>

                {/* Continent */}
                <path d="M 20,60 L 80,60 L 80,100 L 280,100 L 280,80 L 350,80 L 380,60 L 460,60 L 460,180 L 360,180 L 360,250 L 420,250 L 420,340 L 240,340 L 240,290 L 180,290 L 180,340 L 150,340 L 150,290 L 80,290 L 80,200 L 20,200 Z" fill="#91E473" stroke="#5DA642" strokeWidth="3" filter="url(#shadow)" />
                <rect x="80" y="350" width="60" height="40" rx="5" fill="#91E473" stroke="#5DA642" strokeWidth="3" filter="url(#shadow)" />

                {/* Routes (exemples) */}
                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <g stroke="#E83558" strokeWidth="6">
                        <line x1="110" y1="310" x2="110" y2="230" />
                        <line x1="110" y1="230" x2="110" y2="110" />
                        <line x1="110" y1="230" x2="50" y2="230" />
                        <line x1="50" y1="230" x2="50" y2="60" />
                        <line x1="110" y1="110" x2="220" y2="110" />
                        <line x1="220" y1="110" x2="330" y2="110" />
                        <line x1="330" y1="110" x2="330" y2="90" />
                        <line x1="330" y1="110" x2="440" y2="110" />
                        <line x1="440" y1="110" x2="440" y2="170" />
                        <line x1="330" y1="110" x2="330" y2="170" />
                        <line x1="240" y1="170" x2="330" y2="170" />
                        <line x1="330" y1="170" x2="440" y2="170" />
                        <line x1="330" y1="170" x2="330" y2="250" />
                        <polyline points="440,170 440,340 280,340" />
                        <line x1="240" y1="170" x2="190" y2="170" />
                        <line x1="190" y1="340" x2="280" y2="340" />
                    </g>

                    <line x1="190" y1="170" x2="190" y2="340" stroke="#9E9E9E" strokeWidth="8" />
                    <line x1="190" y1="170" x2="190" y2="340" stroke="#FFF" strokeWidth="2" strokeDasharray="5,5" />

                    <g stroke="#2980B9" strokeWidth="4" strokeDasharray="6,6">
                        <polyline points="280,340 280,370 110,370" />
                        <line x1="110" y1="370" x2="110" y2="310" />
                    </g>
                </g>

                {/* Villes */}
                {kantoZones.map((zone) => {
                    const pos = toView(zone.x, zone.y);
                    const isHighlighted = locations.some(loc => loc.zone === zone.name);
                    const isHovered = hoveredZone === zone.name;
                    return (
                        <g key={zone.name} onMouseEnter={() => setHoveredZone(zone.name)} onMouseLeave={() => setHoveredZone(null)} style={{ cursor: 'pointer' }}>
                            {isHighlighted && <circle cx={pos.x} cy={pos.y} r="14" fill="rgba(255,215,0,0.4)" className="map-pulse" />}
                            <rect x={pos.x - 8} y={pos.y - 8} width="16" height="16" fill={isHighlighted ? '#FFD700' : '#34495E'} stroke="white" strokeWidth="2" rx="2" />
                            <circle cx={pos.x} cy={pos.y} r="3" fill={isHighlighted ? 'white' : '#F1C40F'} />
                            {isHovered && (
                                <g pointerEvents="none">
                                    <rect x={pos.x - 40} y={pos.y - 35} width="80" height="24" rx="4" fill="white" stroke="#333" strokeWidth="2" />
                                    <text x={pos.x} y={pos.y - 20} textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold" fontFamily="sans-serif" dominantBaseline="middle">{zone.name}</text>
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

                {/* Marqueur sélectionné */}
                {selectedPosition && (() => {
                    const pos = { x: selectedPosition.x, y: selectedPosition.y };
                    const nearestZone = kantoZones.find(z => isPosNearZone(pos, toView(z.x, z.y), 18));
                    if (nearestZone) {
                        const size = 12;
                        return (
                            <g key="selected-pos-city" className="map-zone-active">
                                <rect x={pos.x - size/2} y={pos.y - size/2} width={size} height={size} fill="#FFD700" stroke="#FFD700" strokeWidth="1" rx="2" />
                                <text x={pos.x} y={pos.y - size/2 - 6} textAnchor="middle" fill="#FFD700" fontSize="12" fontFamily="Orbitron, sans-serif">{nearestZone.name}</text>
                            </g>
                        );
                    }
                    return (
                        <g key="selected-pos-plain">
                            <circle cx={pos.x} cy={pos.y} r="6" fill="#FF4D4D" stroke="#AA2222" strokeWidth="1" />
                        </g>
                    );
                })()}
            </svg>
        </div>
    );

    if (inline) return svgContent;

    return (
        <div className={`map-overlay ${isVisible ? 'map-overlay-visible' : ''}`} onClick={onClose}>
            <div className="map-overlay-content" onClick={(e) => e.stopPropagation()}>
                <button className="map-close-btn" onClick={onClose}>✕</button>
                <h2 className="map-title" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Kanto</h2>
                {svgContent}
            </div>
        </div>
    );
};

export default PokemonMap;