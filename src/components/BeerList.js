import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './BeerList.css';

const BeerList = () => {
    const [beers, setBeers] = useState([]);

    useEffect(() => {
        fetch('/beers.csv')
            .then((response) => response.text())
            .then((csvData) => {
                Papa.parse(csvData, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => setBeers(result.data),
                });
            });
    }, []);

    return (
        <div className="beer-list">
            <h1 className="title">Liste des Bières</h1>
            <ul className="grid">
                {beers.map((beer, index) => (
                    <li key={index} className="beer-card">
                        {/* Image */}
                        <img
                            src={'/img/beers/' + beer.image_url}
                            alt={beer.name}
                            className="beer-image"
                        />

                        {/* Informations */}
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
