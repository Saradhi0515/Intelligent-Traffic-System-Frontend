import React, { useState } from "react";
import './ANPR-ATCC.css';
import ANPR_ATCC_Img from '../../assets/anpr-atcc.png';
import { API_BASE_URL } from '../../config';

const ANPRATCC = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Allow images and videos
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/") && !f.type.startsWith("image/")) {
      alert("Please select an image or video file.");
      e.target.value = "";
      return;
    }
    setFile(f);
    setVideoUrl("");
    setImageUrl("");
  };

  const pollStatus = async (jobId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/status/${jobId}`, {
          headers: { "ngrok-skip-browser-warning": "true" }
        });
        const data = await res.json();

        if (data.status === 'completed') {
          clearInterval(interval);
          setUploading(false);

          let finalUrl = data.result_url;
          if (finalUrl.startsWith('/')) {
            finalUrl = `${API_BASE_URL}${finalUrl}`;
          }

          // Fetch video as blob to bypass ngrok warning page for playback
          try {
            const vidRes = await fetch(finalUrl, {
              headers: { "ngrok-skip-browser-warning": "true" },
            });
            const vidBlob = await vidRes.blob();
            const vidObjUrl = URL.createObjectURL(vidBlob);
            setVideoUrl(vidObjUrl);
          } catch (e) {
            console.error("Failed to fetch video blob:", e);
            setVideoUrl(finalUrl);
          }
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setUploading(false);
          alert(`Processing failed: ${data.error}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000); // Poll every 2 seconds
  };

  const uploadToANPRATCC = async () => {
    if (!file) return alert("Choose a file first.");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE_URL}/anpr-atcc/`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Upload failed");
      }
      const data = await res.json();

      if (data.jobId) {
        // Start polling
        pollStatus(data.jobId);
      } else if (data.imageUrl) {
        // Image flow remains synchronous
        setUploading(false);
        let finalImgUrl = data.imageUrl;
        if (finalImgUrl.startsWith('/')) {
          finalImgUrl = `${API_BASE_URL}${finalImgUrl}`;
        }
        setImageUrl(finalImgUrl);
        setVideoUrl("");
      }
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="anpr-atcc" id="anpr-atcc">
      <img className="anpr-atcc-image" src={ANPR_ATCC_Img} alt="ANPR & ATCC Illustration" />
      <h1 className="anpr-atcc-heading">ANPR & ATCC Module</h1>
      <p className="anpr-atcc-description">
        The ANPR - <em>{"{"}Automatic Number Plate Recognition{"}"}</em> & ATCC - <em>{"{"}Automatic Traffic Classification and Control{"}"}</em> module is a critical component of our Intelligent Traffic System. This module utilizes advanced computer vision techniques to automatically recognize vehicle number plates and vehicle types in real-time, enabling efficient monitoring and management of urban traffic.
      </p>

      {/* Upload controls */}
      <div className="anpr-atcc-upload">
        <input type="file" accept="image/*,video/*" onChange={onFileChange} />
        <button className="upload-btn" onClick={uploadToANPRATCC} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Result player */}
      {videoUrl && (
        <div className="anpr-atcc-result">
          <video
            src={videoUrl}
            controls
            width="720"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}
      {imageUrl && (
        <div className="anpr-atcc-result">
          <img
            src={imageUrl}
            alt="Processed result"
            style={{ maxWidth: "95%", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
};

export default ANPRATCC;