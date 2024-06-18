import React, { useState } from 'react';

const LanguageDropdown = ({ languages, selectedLanguage, setSelectedLanguage }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = Object.entries(languages).filter(([code, name]) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dropdown-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-3"
        placeholder="Search for a language..."
      />
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="form-control"
      >
        {filteredLanguages.map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
