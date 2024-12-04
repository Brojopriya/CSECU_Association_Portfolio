import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaDownload, FaShareAlt, FaUpload } from "react-icons/fa"; // Importing the icons
import "./ResourcesPage.css";

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [userId] = useState(1);
  const [username] = useState("testUser");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/resources/all");
      setResources(response.data.resources);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setMessage("Error loading resources.");
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title) {
      alert("Please provide a file and title.");
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the maximum limit of 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("user_id", userId);
    formData.append("username", username);

    try {
      const response = await axios.post(
        "http://localhost:8000/resources/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Resource uploaded successfully!");
        fetchResources(); // Refresh resources after upload
        setFile(null); // Reset file input
        setTitle("");
        setDescription("");
      } else {
        alert("Failed to upload resource.");
      }
    } catch (error) {
      console.error("Upload error:", error.response || error.message);
      alert(
        error.response?.data?.message ||
          "An error occurred while uploading the resource."
      );
    }
  };

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      alert("File URL is missing.");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  const handleShare = (fileUrl) => {
    navigator.clipboard
      .writeText(fileUrl)
      .then(() => alert("File URL copied to clipboard!"))
      .catch(() => alert("Failed to copy URL."));
  };

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="resources-page">
      <header className="header">
        <h1 className="page-title">Resource Manager</h1>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>

          <div className="resource-list">
            {loading && <p className="loading">Loading...</p>}
            {message && <p className="message">{message}</p>}
            {filteredResources.map((resource) => (
              <div key={resource.resource_id} className="resource-card">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="card-buttons">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(resource.file_url)}
                  >
                    <FaDownload />
                    Download
                  </button>
                  <button
                    className="share-btn"
                    onClick={() => handleShare(resource.file_url)}
                  >
                    <FaShareAlt />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <form onSubmit={handleUpload} className="upload-form">
            <h2>
              <FaUpload />
              Upload New Resource
            </h2>
            <input
              type="text"
              placeholder="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="form-file"
            />
            <button type="submit" className="upload-btn">
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
