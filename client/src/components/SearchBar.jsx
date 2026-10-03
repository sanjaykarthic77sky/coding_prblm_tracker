import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedPlatform,
  setSelectedPlatform,
  selectedStatus,
  setSelectedStatus,
  selectedTopic,
  setSelectedTopic,
  topicsList = [],
  onReset,
}) => {
  return (
    <div className="filter-container">
      {/* Search Bar */}
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, topic, or platform..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Select Dropdowns */}
      <div className="filters-row">
        {/* Difficulty Filter */}
        <select
          className="filter-select"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          aria-label="Filter by Difficulty"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Platform Filter */}
        <select
          className="filter-select"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          aria-label="Filter by Platform"
        >
          <option value="All">All Platforms</option>
          <option value="LeetCode">LeetCode</option>
          <option value="HackerRank">HackerRank</option>
          <option value="CodeChef">CodeChef</option>
          <option value="GeeksforGeeks">GeeksforGeeks</option>
          <option value="Other">Other</option>
        </select>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Solved</option>
          <option value="Unsolved">Unsolved</option>
        </select>

        {/* Topic Filter */}
        <select
          className="filter-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          aria-label="Filter by Topic"
        >
          <option value="All">All Topics</option>
          {topicsList.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onReset}
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
