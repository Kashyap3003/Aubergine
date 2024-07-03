import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

export default function App() {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchUniversities = (country) => {
    setLoading(true);
    fetch(`http://universities.hipolabs.com/search?country=${country}`)
      .then(response => response.json())
      .then(data => {
        setUniversities(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
        setLoading(false);
      });
  };

  const fetchSuggestions = (query) => {
    fetch(`http://universities.hipolabs.com/search?country=${query}`)
      .then(response => response.json())
      .then(data => {
        setSuggestions(data.map(university => university.country));
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
      });
  };

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchSuggestions(searchTerm.charAt(0)); // Fetch suggestions starting with the first character
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSelectedState('');
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUniversities(searchTerm);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const downloadUniversityDetailsAsImage = (universityId) => {
    const element = document.getElementById(universityId);
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = `${universityId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const uniqueStates = [...new Set(universities.map(u => u['state-province']))];

  const filteredUniversities = universities.filter(university =>
    selectedState ? university['state-province'] === selectedState : true
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="justify-center flex item-center text-3xl font-bold underline mb-4">University Search</h1>
      <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center justify-between relative">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter country name"
            className="border p-2 mr-2"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="cursor-pointer py-1 px-3 hover:bg-gray-100"
                  onClick={() => setSearchTerm(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <button type="submit" className="border p-2">Search</button>
        </div>
        <div>
          <label htmlFor="state-filter" className="block font-bold mb-2">Filter by State/Province:</label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={handleStateChange}
            className="border p-2"
          >
            <option value="">All</option>
            {uniqueStates.map(state => (
              state && <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUniversities.map(university => (
            <div key={university.name} id={university.name} className="border p-4 rounded shadow-md">
              <h3 className="text-xl font-bold">{university.name}</h3>
              <p><strong>Alpha Two Code:</strong> {university.alpha_two_code}</p>
              <p><strong>Country:</strong> {university.country}</p>
              <p><strong>State/Province:</strong> {university['state-province']}</p>
              <p><strong>Domains:</strong> {university.domains.join(', ')}</p>
              <a href={university.web_pages[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {university.web_pages[0]}
              </a>
              <br></br>
              <button
                onClick={() => downloadUniversityDetailsAsImage(university.name)}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Download as Image
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
