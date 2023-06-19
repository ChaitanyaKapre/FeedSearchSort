const { POSTS } = require('./posts');
const express = require('express');
const app = express();
const port = 8080;


module.exports = app.get('/feed', (req, res) => {
  const searchQuery = req.query.search || '';
  const sortBy = req.query.sortBy || 'name';
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // Search
  const searchResults = searchPosts(searchQuery);
  // Sort
  const sortedResults = sortPosts(searchResults, sortBy);
  // Pagination
  const paginatedResults = getPaginatedResult(sortedResults, page, pageSize);

  const response = {
    error: false,
    totalSearchedResults: searchResults?.length,
    page: page,
    limit: pageSize,
    paginatedResults,
  }
  res.json(response);
});

function searchPosts(query) {
  if (!query) {
    // Return all posts if no query is provided
    return POSTS;
  }

  const isExactMatch = query.startsWith('"') && query.endsWith('"');
  const normalizedQuery = isExactMatch ? query.slice(1, -1) : query.toLowerCase();

  return POSTS.filter((post) => {
    const normalizedPostName = post.name.toLowerCase();
    const normalizedPostDescription = post.description.toLowerCase();
    // isExactMatch represents the case when search term is in " "
    if (isExactMatch) {
      return (
        normalizedPostName.includes(normalizedQuery) ||
        normalizedPostDescription.includes(normalizedQuery)
      );
    } else {
      const queryTerms = normalizedQuery.split(" ");
      return queryTerms.every(
        (term) =>
          normalizedPostName.includes(term) || normalizedPostDescription.includes(term)
      );
    }
  });
}

function sortPosts(POSTS, sortBy) {
  if (sortBy === "name") {
    return POSTS.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "dateLastEdited") {
    return POSTS.sort((a, b) => Date.parse(a?.dateLastEdited) - Date.parse(b?.dateLastEdited));
  }

  // If sortBy is not specified or invalid, original posts are returned
  return POSTS;
}

function getPaginatedResult(POSTS, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = POSTS.slice(startIndex, endIndex);

  return {
    data: paginatedPosts,
    totalCount: POSTS.length,
  };
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
