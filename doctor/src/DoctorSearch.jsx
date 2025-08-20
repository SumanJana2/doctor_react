import React, { useState, useEffect } from 'react';
import './styles.css';

const DoctorSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/doctors')
      .then(res => res.json())
      .then(data => {
        setAllDoctors(data);
        setFilteredDoctors(data);
      })
      .catch(err => console.error('Error fetching doctors:', err));
  }, []);

  useEffect(() => {
    let results = [...allDoctors];

    // Apply sorting first
    if (sortOption === 'nameAsc') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'nameDesc') {
      results.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'specAsc') {
      results.sort((a, b) => a.specialization.localeCompare(b.specialization));
    } else if (sortOption === 'specDesc') {
      results.sort((a, b) => b.specialization.localeCompare(a.specialization));
    }

    // Filter by doctor fields
    if (searchTerm.trim()) {
      results = results.filter(doc =>
        Object.values(doc).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by chamber fields
    if (locationTerm.trim()) {
      results = results.filter(doc =>
        Object.values(doc.chamber).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(locationTerm.toLowerCase())
        )
      );
    }

    setFilteredDoctors(results);
  }, [searchTerm, locationTerm, sortOption, allDoctors]);

  return (
    <div className="container">
      <h2>Doctor & Chamber Search</h2>

      <input
        type="text"
        placeholder="Search doctors by name, specialization..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <input
        type="text"
        placeholder="Search chambers by location, address, state..."
        value={locationTerm}
        onChange={e => setLocationTerm(e.target.value)}
      />

      <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
        <option value="">Sort by...</option>
        <option value="nameAsc">Name (A–Z)</option>
        <option value="nameDesc">Name (Z–A)</option>
        <option value="specAsc">Specialization (A–Z)</option>
        <option value="specDesc">Specialization (Z–A)</option>
      </select>

      <ul>
        {filteredDoctors.map((doc, index) => (
          <li key={index}>
            <strong>{doc.name}</strong> — {doc.specialization}<br />
            📍 {doc.chamber.address}, {doc.chamber.location}, {doc.chamber.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSearch;
