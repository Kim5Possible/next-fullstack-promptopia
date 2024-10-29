"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({
  data,
  handleTagClick,
  searchedResults,
  searchText,
}) => {
  return (
    <div className="mt-16 prompt_layout ">
      {searchedResults.length === 0 && searchText !== ""
        ? []
        : searchedResults.length > 0
        ? searchedResults.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleTagClick={handleTagClick}
            />
          ))
        : data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleTagClick={handleTagClick}
            />
          ))}
    </div>
  );
};
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = posts.filter(
          (item) =>
            item.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
            item.creator.username
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.tag.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = posts.filter(
          (item) => item.tag.toLowerCase() === tagName.toLowerCase()
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);
  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          className="search_input peer"
        />
      </form>

      <PromptCardList
        searchText={searchText}
        searchedResults={searchedResults}
        data={posts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
