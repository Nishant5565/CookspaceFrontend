import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalItems }) => {
     const itemsPerPage = 10;
     const totalPages = Math.ceil(totalItems / itemsPerPage);

     const handlePageChange = (page) => {
          setCurrentPage(page);
     };

     return (
          <div className="flex justify-center mt-10">
               {Array.from({ length: totalPages }, (_, index) => (
                    <button
                         key={index}
                         onClick={() => handlePageChange(index + 1)}
                         className={`px-4 py-2 rounded-md mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                         {index + 1}
                    </button>
               ))}
          </div>
     );
};

export default Pagination;
