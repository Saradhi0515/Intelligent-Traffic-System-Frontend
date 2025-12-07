import React, { useState } from "react";
import './ANPR-ATCC.css';
import ANPR_ATCC_Img from '../../assets/anpr-atcc.png';

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

  const uploadToANPRATCC = async () => {
    if (!file) return alert("Choose a file first.");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("http://localhost:5000/anpr-atcc/", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Upload failed");
      }
      const data = await res.json();
      if (data.processedUrl) {
        setVideoUrl(data.processedUrl);
        setImageUrl("");
      } else if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setVideoUrl("");
      }
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message}`);
    } finally {
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