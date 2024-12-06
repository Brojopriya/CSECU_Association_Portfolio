import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShareThought.css';  // Make sure to import the CSS file

const ShareThought = () => {
  const [thought, setThought] = useState('');
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all thoughts when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8000/thoughts')
      .then((response) => {
        setThoughts(response.data.thoughts);
      })
      .catch((error) => {
        console.error('Error fetching thoughts:', error);
        setMessage('Failed to load thoughts.');
      });
  }, []);

  // Handle form submission to share a thought
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token'); // Retrieve token from local storage
    if (!token) {
      setMessage('You need to log in first.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('thought', thought);
    if (photo) formData.append('photo', photo);
    if (video) formData.append('video', video);

    try {
      const response = await axios.post(
        'http://localhost:8000/share-thought',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token to backend
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message || 'Thought shared successfully!');
      setThought('');
      setPhoto(null);
      setVideo(null);
      setLoading(false);

      // Reload thoughts after sharing
      const newThoughts = await axios.get('http://localhost:8000/thoughts');
      setThoughts(newThoughts.data.thoughts);
    } catch (error) {
      console.error('Error sharing thought:', error.response || error);
      setMessage(
        error.response?.data?.error || 'Failed to share your thought. Please try again.'
      );
      setLoading(false);
    }
  };

  // Handle file selection for photo/video
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photo') {
      setPhoto(files[0]);
    } else if (name === 'video') {
      setVideo(files[0]);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Share Your Thought</h2>
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
          {loading ? 'Sharing...' : 'Share Thought'}
        </button>
      </form>

      <h3 className="thoughts-heading">All Thoughts</h3>
      {thoughts.length > 0 ? (
        thoughts.map((thought) => (
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
              <video controls src={`http://localhost:8000/${thought.video}`} className="thought-media" />
            )}
          </div>
        ))
      ) : (
        <p className="no-thoughts">No thoughts shared yet.</p>
      )}
    </div>
  );
};

export default ShareThought;
