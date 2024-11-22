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
                            (beer) => beer.beer && beer.abv 
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
                beer.beer.toLowerCase().includes(searchQuery.toLowerCase())
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
        const sortKey = key === 'name' ? 'beer' : key;
    
        return [...beersToSort].sort((a, b) => {
            if (!a[sortKey] || !b[sortKey]) return 0;
    
            if (sortKey === 'beer') {

                return direction === 'asc'
                    ? a.beer.localeCompare(b.beer)
                    : b.beer.localeCompare(a.beer);
            } else if (sortKey === 'abv') {

                return direction === 'asc'
                    ? parseFloat(a.abv) - parseFloat(b.abv)
                    : parseFloat(b.abv) - parseFloat(a.abv);
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
                            <strong>{beer.beer || 'Nom inconnu'}</strong>
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
