import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router"
import './index.css'
import App from './App.jsx'
import PokemonDetails from './screens/pokemonDetails.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/pokemonDetails/:id" element={<PokemonDetails />} />
    </Routes>
  </BrowserRouter>
)
