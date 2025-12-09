import React, { useState } from "react";
import './AccidentDetection.css';
import accidentimg from '../../assets/accident-detection.png';
import { API_BASE_URL } from '../../config';

const AccidentDetection = () => {
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
            const res = await fetch(`${API_BASE_URL}/accident/`, {
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

            if (data.processedUrl) {
                let finalUrl = data.processedUrl;
                if (finalUrl.startsWith('/')) {
                    finalUrl = `${API_BASE_URL}${finalUrl}`;
                }

                try {
                    const vidRes = await fetch(finalUrl, {
                        headers: {
                            "ngrok-skip-browser-warning": "true",
                        },
                    });
                    const vidBlob = await vidRes.blob();
                    const vidObjUrl = URL.createObjectURL(vidBlob);
                    setVideoUrl(vidObjUrl);
                } catch (e) {
                    console.error("Failed to fetch video blob:", e);
                    setVideoUrl(finalUrl);
                }
                setImageUrl("");
            } else if (data.imageUrl) {
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
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="accident-detection">
            <img className="accident-image" src={accidentimg} alt="Accident Detection" />
            <h1 className="accident-heading">Accident Detection Module</h1>
            <p className="accident-description">
                The Accident Detection module uses advanced AI to identify traffic accidents in real-time from video feeds.
                It enables rapid response times for emergency services, potentially saving lives and reducing traffic congestion caused by incidents.
            </p>

            <div className="accident-upload">
                <input type="file" accept="image/*,video/*" onChange={onFileChange} />
                <button className="upload-btn" onClick={uploadFile} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {videoUrl && (
                <div className="accident-result">
                    <video
                        src={videoUrl}
                        controls
                        width="720"
                        style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                </div>
            )}
            {imageUrl && (
                <div className="accident-result">
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

export default AccidentDetection;
