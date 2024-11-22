import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './BeerList.css';

const BeerList = () => {
    const [beers, setBeers] = useState([]);
    const [filteredBeers, setFilteredBeers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Utilisé dans la recherche
    const [filterStyle, setFilterStyle] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minSize, setMinSize] = useState('');
    const [maxSize, setMaxSize] = useState('');
    const [minAbv, setMinAbv] = useState('');
    const [maxAbv, setMaxAbv] = useState('');
    const [sortOrder, setSortOrder] = useState('name-asc');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetch('/beers.csv')
            .then((response) => response.text())
            .then((csvData) => {
                Papa.parse(csvData, {
                    header: true,
                    delimiter: ';',
                    skipEmptyLines: true,
                    complete: (result) => {
                        const validBeers = result.data.filter(
                            (beer) => beer.name && beer.abv
                        );
                        setBeers(validBeers);
                        setFilteredBeers(validBeers);
                    },
                });
            });
    }, []);

    useEffect(() => {
        let updatedBeers = beers;

        // Recherche uniquement par nom
        if (searchQuery) {
            updatedBeers = updatedBeers.filter((beer) =>
                beer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrer par style
        if (filterStyle) {
            updatedBeers = updatedBeers.filter((beer) =>
                beer.style && beer.style.toLowerCase().includes(filterStyle.toLowerCase())
            );
        }

        // Filtrer par prix
        if (minPrice) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseFloat(beer.price) >= parseFloat(minPrice)
            );
        }
        if (maxPrice) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseFloat(beer.price) <= parseFloat(maxPrice)
            );
        }

        // Filtrer par taille
        if (minSize) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseInt(beer.size) >= parseInt(minSize)
            );
        }
        if (maxSize) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseInt(beer.size) <= parseInt(maxSize)
            );
        }

        // Filtrer par ABV
        if (minAbv) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseFloat(beer.abv) >= parseFloat(minAbv)
            );
        }
        if (maxAbv) {
            updatedBeers = updatedBeers.filter(
                (beer) => parseFloat(beer.abv) <= parseFloat(maxAbv)
            );
        }

        updatedBeers = sortBeers(updatedBeers, sortOrder);

        setFilteredBeers(updatedBeers);
    }, [searchQuery, filterStyle, minPrice, maxPrice, minSize, maxSize, minAbv, maxAbv, sortOrder, beers]);

    const sortBeers = (beersToSort, order) => {
        const [key, direction] = order.split('-');
        const sortKey = key === 'name' ? 'name' : key;

        return [...beersToSort].sort((a, b) => {
            if (!a[sortKey] || !b[sortKey]) return 0;

            if (sortKey === 'name') {
                return direction === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortKey === 'abv') {
                return direction === 'asc'
                    ? parseFloat(a.abv) - parseFloat(b.abv)
                    : parseFloat(b.abv) - parseFloat(a.abv);
            } else if (sortKey === 'price') {
                return direction === 'asc'
                    ? parseFloat(a.price) - parseFloat(b.price)
                    : parseFloat(b.price) - parseFloat(a.price);
            } else if (sortKey === 'size') {
                const sizeA = parseInt(a.size) || 0;
                const sizeB = parseInt(b.size) || 0;
                return direction === 'asc' ? sizeA - sizeB : sizeB - sizeA;
            }
            return 0;
        });
    };

    return (
        <div className="beer-list">
            <h1 className="title1">AmericanBeers</h1>
            <h2 className="title2">Liste des Bières</h2>

            {/* Barre de recherche */}
            <input
                type="text"
                className="search-bar"
                placeholder="Rechercher une bière par nom ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Bouton pour afficher/masquer les filtres */}
            <button
                className="toggle-filters"
                onClick={() => setShowFilters((prev) => !prev)}
            >
                {showFilters ? 'Masquer les Filtres' : 'Afficher les Filtres'}
            </button>

            {/* Filtres */}
            {/* Filtres */}
            {showFilters && (
                <div className="filters">
                    <select
                        value={filterStyle}
                        onChange={(e) => setFilterStyle(e.target.value)}
                    >
                        <option value="">Tous les styles</option>
                        {[...new Set(beers.map((beer) => beer.style))].filter(Boolean).map((style, index) => (
                            <option key={index} value={style}>
                                {style}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Prix minimum (€)"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Prix maximum (€)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Taille minimum (ml)"
                        value={minSize}
                        onChange={(e) => setMinSize(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Taille maximum (ml)"
                        value={maxSize}
                        onChange={(e) => setMaxSize(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="ABV minimum (%)"
                        value={minAbv}
                        onChange={(e) => setMinAbv(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="ABV maximum (%)"
                        value={maxAbv}
                        onChange={(e) => setMaxAbv(e.target.value)}
                    />

                    {/* Bouton Reset */}
                    <button
                        className="reset-filters"
                        onClick={() => {
                            setFilterStyle('');
                            setMinPrice('');
                            setMaxPrice('');
                            setMinSize('');
                            setMaxSize('');
                            setMinAbv('');
                            setMaxAbv('');
                        }}
                    >
                        Reset
                    </button>
                </div>
            )}

            {/* Tri */}
            <select
                className="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
                <option value="abv-asc">Alcool (%) - Croissant</option>
                <option value="abv-desc">Alcool (%) - Décroissant</option>
                <option value="price-asc">Prix (€) - Croissant</option>
                <option value="price-desc">Prix (€) - Décroissant</option>
                <option value="size-asc">Quantité (ml) - Croissant</option>
                <option value="size-desc">Quantité (ml) - Décroissant</option>
            </select>

            {/* Liste des bières */}
            <ul className="grid">
                {filteredBeers.map((beer, index) => (
                    <li key={index} className="beer-card">
                        <img
                            src={'/img/beers/' + beer.image_url}
                            alt={beer.name}
                            className="beer-image"
                        />
                        <div className="beer-info">
                            <h2 className="beer-name">{beer.name}</h2>
                            <p className="beer-tagline">{beer.tagline}</p>
                            <p className="beer-style">{beer.style}</p>
                            <p className="beer-attributes">
                                {beer.size} • {beer.price}€ • {beer.abv}%
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BeerList;
