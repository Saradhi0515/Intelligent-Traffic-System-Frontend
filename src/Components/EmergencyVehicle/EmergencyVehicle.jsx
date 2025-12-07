import React, { useState } from "react";
import './EmergencyVehicle.css';
import emergencyImage from '../../assets/emergency-vehicle.png';
import { API_BASE_URL } from '../../config';

const EmergencyVehicle = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");

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

    const uploadFile = async () => {
        if (!file) return alert("Choose a file first.");
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch(`${API_BASE_URL}/emergency/`, {
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
        <div className="emergency-vehicle">
            <img className="emergency-image" src={emergencyImage} alt="Emergency Vehicle" />
            <h1 className="emergency-heading">Emergency Vehicle Module</h1>
            <p className="emergency-description">
                The Emergency Vehicle module detects ambulances, fire trucks, and police cars to prioritize their passage through traffic.
                This ensures faster response times for critical situations.
            </p>

            <div className="emergency-upload">
                <input type="file" accept="image/*,video/*" onChange={onFileChange} />
                <button className="upload-btn" onClick={uploadFile} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {videoUrl && (
                <div className="emergency-result">
                    <video
                        src={videoUrl}
                        controls
                        width="720"
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                </div>
            )}
            {imageUrl && (
                <div className="emergency-result">
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

export default EmergencyVehicle;
