import React, { useState } from "react";
import './SignalControl.css';
import trafficImage from '../../assets/traffic_image.png';

const SignalControl = () => {
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
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/signal/`, {
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
        <div className="signal-control">
            <img className="signal-image" src={trafficImage} alt="Signal Control" />
            <h1 className="signal-heading">Signal Control Module</h1>
            <p className="signal-description">
                The Signal Control module optimizes traffic light timings based on real-time traffic density.
                It helps in reducing congestion and improving the overall flow of traffic in urban areas.
            </p>

            <div className="signal-upload">
                <input type="file" accept="image/*,video/*" onChange={onFileChange} />
                <button className="upload-btn" onClick={uploadFile} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {videoUrl && (
                <div className="signal-result">
                    <video
                        src={videoUrl}
                        controls
                        width="720"
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                </div>
            )}
            {imageUrl && (
                <div className="signal-result">
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

export default SignalControl;
