import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './BeerList.css';

const BeerList = () => {
    const [beers, setBeers] = useState([]);
    const [filteredBeers, setFilteredBeers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStyle, setFilterStyle] = useState('');
    const [sortOrder, setSortOrder] = useState('name-asc'); 

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

        if (searchQuery) {
            // Si la recherche contient un nombre entier (prix ou quantité)
            const searchNumber = searchQuery.trim();

            if (!isNaN(searchNumber)) {
                // Recherche par prix ou taille (sous forme de chaîne)
                updatedBeers = updatedBeers.filter((beer) =>
                    (beer.price && beer.price.includes(searchNumber)) || 
                    (beer.size && beer.size.includes(searchNumber))
                );
            } else {
                // Recherche par nom ou style
                updatedBeers = updatedBeers.filter((beer) =>
                    beer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (beer.style && beer.style.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }
        }

        // Filtrer par style
        if (filterStyle) {
            updatedBeers = updatedBeers.filter((beer) =>
                beer.style && beer.style.toLowerCase().includes(filterStyle.toLowerCase())
            );
        }

        updatedBeers = sortBeers(updatedBeers, sortOrder);

        setFilteredBeers(updatedBeers);
    }, [searchQuery, filterStyle, sortOrder, beers]);

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
            <h1 className="title">Liste des Bières</h1>

            <input
                type="text"
                placeholder="Rechercher une bière, prix ou quantité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

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

            <select
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
