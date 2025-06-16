import React, { useState } from "react";
import axios from "axios";
import "./App.css";  // Ensure you import the CSS file

function App() {
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [response, setResponse] = useState("");
  const [responseClass, setResponseClass] = useState(""); // State to hold CSS class for styling

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) { // Ensure the file is a video
      setVideo(file);
      setVideoURL(URL.createObjectURL(file)); // Create a local URL for video preview
      setResponse(""); // Reset response message when a new file is selected
    } else {
      console.error("Please upload a valid video file.");
      setResponse("Invalid file type. Please upload a video.");
      setResponseClass("error-message"); // Set class to red color for invalid file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) {
      console.error("Please select a video file.");
      setResponse("No video selected.");
      setResponseClass("error-message"); // Set class to red color for no video
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.message); // Set the response message
      setResponseClass(res.data.message === "Video Received" ? "success-message" : "error-message"); // Conditionally set class
    } catch (error) {
      console.error("Error sending video to server:", error);
      setResponse("Failed to send video to server.");
      setResponseClass("error-message"); // Set class to red color for failure
    }
  };

  return (
    <div className="App center-container">
      <header className="Prediction">
        <h1>Automatic Cricket Analysis</h1>
        <form onSubmit={handleSubmit}>
          <label className="file-upload">
            <input
              type="file"
              accept="video/mp4, video/avi, video/*"
              onChange={handleVideoUpload}
              hidden
            />
            <span className="file-button">Choose File</span>
          </label>
          <button type="submit">Submit</button>
        </form>

        {/* Video Preview */}
        {videoURL && (
          <div className="video-preview">
            <h2>Video Preview:</h2>
            <video key={videoURL} width="600" controls>
              <source src={videoURL} />
              Your browser does not support the video tag.
            </video>
            <p className="file-name">{video?.name}</p>
          </div>
        )}

        {/* Display Response from Backend with Conditional Styling */}
        {response && (
          <div className={`response-message ${responseClass}`}>
            <h2>Server Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
