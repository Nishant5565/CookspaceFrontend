import React, { useState } from 'react';

const SearchFilter = ({ onSearch }) => {
     const [term, setTerm] = useState('');

     const handleSearch = (e) => {
          setTerm(e.target.value);
          onSearch(e.target.value);
     };

     return (
          <div className="my-4 flex justify-center ">
               <input
                    type="text"
                    value={term}
                    onChange={handleSearch}
                    placeholder="Search packages..."
                    className="w-3/4 p-3 border rounded-lg shadow-sm focus:outline-none "
               />
          </div>
     );
};

export default SearchFilter;
