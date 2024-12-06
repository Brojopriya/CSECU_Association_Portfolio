import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShareThought.css"; // Ensure CSS matches new structure

const ShareThought = () => {
  const [thought, setThought] = useState("");
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all thoughts when the component mounts
  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/thoughts");
      setThoughts(response.data.thoughts);
    } catch (error) {
      console.error("Error fetching thoughts:", error);
      setMessage("Failed to load thoughts.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You need to log in first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("thought", thought);
    if (photo) formData.append("photo", photo);
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(
        "http://localhost:8000/share-thought",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "Thought shared successfully!");
      setThought("");
      setPhoto(null);
      setVideo(null);
      setLoading(false);

      // Reload thoughts after sharing
      fetchThoughts();
    } catch (error) {
      console.error("Error sharing thought:", error.response || error);
      setMessage(
        error.response?.data?.error ||
          "Failed to share your thought. Please try again."
      );
      setLoading(false);
    }
  };

  // Handle file selection for photo/video
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "photo") {
      setPhoto(files[0]);
    } else if (name === "video") {
      setVideo(files[0]);
    }
  };

  // Handle search functionality
  const handleSearch = () => {
    return thoughts.filter((thought) =>
      thought.thought.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="container">
      {/* Left Side: All Thoughts */}
      <div className="left-column">
        <h3 className="thoughts-heading">All Thoughts</h3>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">Search</button>
        </div>
        <div className="thoughts-list">
          {handleSearch().length > 0 ? (
            handleSearch().map((thought) => (
              <div key={thought.id} className="thought-card">
                <p>
                  <strong>{thought.name}</strong>: {thought.thought}
                </p>
                {thought.photo && (
                  <img
                    src={`http://localhost:8000/${thought.photo}`}
                    alt="Thought"
                    className="thought-media"
                  />
                )}
                {thought.video && (
                  <video
                    controls
                    src={`http://localhost:8000/${thought.video}`}
                    className="thought-media"
                  />
                )}
              </div>
            ))
          ) : (
            <p className="no-thoughts">No thoughts found.</p>
          )}
        </div>
      </div>

      {/* Right Side: Share Thought */}
      <div className="right-column">
        <h3 className="heading">Share Your Thought</h3>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="thought-form">
          <textarea
            name="thought"
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="What's on your mind?"
            rows="5"
            required
            className="thought-textarea"
          />
          <div className="file-upload">
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Sharing..." : "Share Thought"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareThought;
