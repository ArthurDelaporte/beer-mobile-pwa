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
            updatedBeers = updatedBeers.filter((beer) =>
                beer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

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
        return beersToSort.sort((a, b) => {
            if (!a[key] || !b[key]) return 0; 
            if (key === 'name') {
                return direction === 'asc'
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            } else if (key === 'abv') {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            }
            return 0;
        });
    };

    return (
        <div>
            <h1>Liste des Bières</h1>

            <input
                type="text"
                placeholder="Rechercher une bière..."
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
            </select>

            <ul>
                {filteredBeers.map((beer, index) => (
                    <li key={index}>
                        <div>
                            <strong>{beer.name || 'Nom inconnu'}</strong>
                            <span>{beer.style || 'Style inconnu'}</span>
                        </div>
                        <div>{beer.abv ? `${beer.abv}% ABV` : 'ABV non renseigné'}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BeerList;
