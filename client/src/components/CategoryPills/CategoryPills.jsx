import React from 'react';
import './CategoryPills.css';

const CategoryPills = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="category-pills-container">
      <button
        onClick={() => onSelectCategory('all')}
        className={`pill ${activeCategory === 'all' ? 'active' : ''}`}
      >
        All posts
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)}
          className={`pill ${activeCategory === cat.name ? 'active' : ''}`}
        >
          {cat.name}
          <span className="badge">{cat.count}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryPills;
