import React, { useState } from 'react';

const DatabaseQueryExecutor = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const executeQuery = async () => {
        setError('');
        setResults(null);
        try {
            const response = await fetch('http://localhost:3001/api/executeQuery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div>
            <textarea
                rows="4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
            <button
                onClick={executeQuery}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
                Execute Query
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
        </div>
    );
};

export default DatabaseQueryExecutor;