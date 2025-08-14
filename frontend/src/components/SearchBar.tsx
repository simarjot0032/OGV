import React from 'react'
import '@/styles/SearchBar.scss';

export const SearchBar = () => {
  return (
    <div className="search-bar">
        <input type="text" placeholder="Search By Category" className="search-bar-input" />
    </div>
  )
}
