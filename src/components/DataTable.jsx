import React, { useState, useEffect, useMemo } from 'react';// Asegúrate de que este componente esté disponible

const DataTable = ({ headers, data, color = 'bg-[#DBEAFE] text-blue-muni', loading = false }) => {
  const [search, setSearch] = useState('');
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [sortType, setSortType] = useState(false);

  // Crear una lista de claves de búsqueda
  const searchables = useMemo(() => headers.map(header => header.key.toLowerCase().trim()), [headers]);

  const filteredData = useMemo(() => {
    const searchTerms = search.toLowerCase().trim().split(';').map(term => term.trim());
    return sortedItems.filter(item => 
      searchTerms.every(searchTerm =>
        searchables.some(column => {
          const value = getObjectValue(item, column);
          return String(value).toLowerCase().includes(searchTerm);
        })
      )
    );
  }, [search, sortedItems, searchables]);

  const paginatedData = useMemo(() => {
    setStartIndex((currentPage - 1) * rowsPerPage);
    setEndIndex(startIndex + rowsPerPage);
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, startIndex, endIndex, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => Math.ceil(filteredData.length / rowsPerPage), [filteredData, rowsPerPage]);

  const sortedItems = useMemo(() => {
    if (sortColumn) {
      return data.sort((a, b) => {
        if (!sortType) {
          const valA = String(getObjectValue(a, sortColumn));
          const valB = String(getObjectValue(b, sortColumn));
          return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        const valA = Number(getObjectValue(a, sortColumn));
        const valB = Number(getObjectValue(b, sortColumn));
        return sortDir === 'asc' ? valA - valB : valB - valA;
      });
    }
    return data;
  }, [data, sortColumn, sortDir, sortType]);

  const displayedPages = useMemo(() => {
    const totalDisplayedPages = 6;
    const halfDisplayedPages = Math.floor(totalDisplayedPages / 2);
    let startPage = Math.max(currentPage - halfDisplayedPages, 1);
    let endPage = Math.min(startPage + totalDisplayedPages - 1, totalPages);

    if (endPage - startPage + 1 < totalDisplayedPages) {
      startPage = Math.max(endPage - totalDisplayedPages + 1, 1);
    }

    return Array(endPage - startPage + 1).fill().map((_, index) => startPage + index);
  }, [currentPage, totalPages]);

  const getObjectValue = (object, key) => {
    const keys = key.split('.');
    return keys.reduce((value, currentKey) => value && value[currentKey], object);
  };

  const sort = (column, type) => {
    setSortType(type);
    if (sortColumn === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDir('asc');
    }
  };

  const formatAsNumber = (value, symbol = false) => {
    return new Intl.NumberFormat("es-GT", {
      style: symbol ? "currency" : "decimal",
      currency: symbol ? "GTQ" : undefined,
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <section className="mx-auto mb-8 px-5">
      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="text-gray-400 bg-white flex items-center border-2 px-2 py-1.5 rounded-lg shadow-lg">
          <span>Mostrar</span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(1); }} className="text-center bg-white font-bold w-full focus:outline-none ring-0">
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>registros</span>
        </div>
        <div className="relative flex items-center mt-4 md:mt-0">
          <span className="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" placeholder="Buscar" className="block w-full py-1.5 pr-5 text-gray-700 bg-white border-2 shadow-lg border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-5 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border-2 border-gray-200 shadow-lg md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className={color}>
                    {headers.map((head, index) => (
                      <th key={index} onClick={() => sort(head.key, head.type)} scope="col"
                          className="px-4 py-3.5 text-sm font-normal rtl:text-right cursor-pointer select-none"
                          style={{ width: head.width }}
                          align={head.align ?? 'left'}>
                        <span>{sortColumn === head.key ? (sortDir === 'asc' ? '▲' : '▼') : null}</span>
                        {head.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td align="center" colSpan={headers.length}>
                        <span className="animate-ping">Cargando data ....</span>
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td align="center" colSpan={headers.length}>
                        No hay data ....
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-100 text-gray-800">
                        {headers.map((head, index) => (
                          <td key={index} align={head.align} style={{ width: head.width }}>
                            {head.NumberFormat ? formatAsNumber(getObjectValue(item, head.key), head.symbol) : getObjectValue(item, head.key)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        {/* RESPONSIVE MOBILE BUTTONS */}
        <div className="flex flex-1 justify-between md:hidden">
          <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Anterior
          </button>
          <button onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            Siguiente
          </button>
        </div>

        <div className="hidden md:flex md:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-gray-500">
              Mostrando
              <span className="font-medium">{startIndex + 1}</span>
              a
              <span className="font-medium">{endIndex >= filteredData.length ? filteredData.length : endIndex}</span>
              de
              <span className="font-medium">{filteredData.length}</span>
              resultados
            </p>
          </div>
          {filteredData.length >= 11 && displayedPages.length > 1 && (
            <nav className="inline-flex -space-x-px rounded-md bg-white shadow-lg mr-2">
              {currentPage > 4 && (
                <button onClick={() => setCurrentPage(1)} className="cursor-pointer relative inline-flex items-center rounded-l-md px-4 py-2 font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0">
                  <i className="fas fa-angles-left text-xs"></i>
                </button>
              )}
              {currentPage > 1 && (
                <button onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)} className={`cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0 ${currentPage > 1 && currentPage <= 4 ? 'rounded-l-md' : ''}`}>
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-angle-left text-xs"></i>
                </button>
              )}
              {displayedPages.map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`cursor-pointer select-none relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-200 hover:text-gray-500 focus:z-20 focus:outline-offset-0 ${page === currentPage ? 'scale-125 z-10 ' + color : ''}`}>
                  {page}
                </button>
              ))}
              {currentPage < (totalPages - 1) && (
                <button onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)} className={`cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0 ${currentPage < (totalPages - 1) && currentPage > (totalPages - 3) ? 'rounded-r-md' : ''}`}>
                  <span className="sr-only">Next</span>
                  <i className="fas fa-angle-right text-xs"></i>
                </button>
              )}
              {currentPage < (totalPages - 2) && (
                <button onClick={() => setCurrentPage(totalPages)} className="cursor-pointer relative inline-flex items-center rounded-r-md px-4 py-2 font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-200 focus:z-20 focus:outline-offset-0">
                  <i className="fas fa-angles-right text-xs"></i>
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataTable;
