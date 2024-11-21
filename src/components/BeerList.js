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
        <div>
            <h1>Liste des Bières</h1>
            <ul>
                {beers.map((beer, index) => (
                    <li key={index}>
                        <div>
                            <strong>{beer.name}</strong>
                            <span>{beer.style}</span>
                        </div>
                        <div>{beer.abv}% ABV</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BeerList;
