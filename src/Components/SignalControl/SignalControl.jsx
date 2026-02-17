import React, { useState } from "react";
import './SignalControl.css';
import trafficImage from '../../assets/signal-control.png';
import { API_BASE_URL } from '../../config';

const SignalControl = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [status, setStatus] = useState("");

    const onFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length === 0) return;
        setFiles(selectedFiles);
        setVideoUrl("");
        setStatus("");
    };

    const pollStatus = async (jobId) => {
        setStatus("Processing...");
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/status/${jobId}`);
                const data = await res.json();
                if (data.status === 'completed') {
                    clearInterval(interval);
                    setVideoUrl(`${API_BASE_URL}${data.result_url}`);
                    setStatus("Completed");
                    setUploading(false);
                } else if (data.status === 'failed') {
                    clearInterval(interval);
                    setStatus(`Failed: ${data.error}`);
                    setUploading(false);
                }
            } catch (err) {
                console.error(err);
                clearInterval(interval);
                setUploading(false);
            }
        }, 2000);
    };

    const uploadFiles = async () => {
        if (files.length === 0) return alert("Choose files first.");
        setUploading(true);
        setStatus("Uploading...");
        try {
            const form = new FormData();
            files.forEach(file => {
                form.append("files", file);
            });

            const res = await fetch(`${API_BASE_URL}/api/signal/upload`, {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Upload failed");
            }
            const data = await res.json();
            pollStatus(data.jobId);
        } catch (err) {
            console.error(err);
            alert(`Upload failed: ${err.message}`);
            setUploading(false);
            setStatus("");
        }
    };

    const runSample = async () => {
        setUploading(true);
        setStatus("Starting Simulation...");
        setVideoUrl("");
        try {
            const res = await fetch(`${API_BASE_URL}/api/signal/sample`, {
                method: "POST",
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || "Request failed");
            }
            const data = await res.json();
            pollStatus(data.jobId);
        } catch (err) {
            console.error(err);
            alert(`Simulation failed: ${err.message}`);
            setUploading(false);
            setStatus("");
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

            <div className="signal-actions">
                <div className="action-group">
                    <h3>Simulation Mode</h3>
                    <button className="sample-btn" onClick={runSample} disabled={uploading}>
                        {uploading && status.includes("Simulation") ? "Running..." : "Run Simulation Sample"}
                    </button>
                </div>

                <div className="action-group">
                    <h3>Detection Mode (Upload 2+ Videos)</h3>
                    <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={onFileChange}
                    />
                    <button className="upload-btn" onClick={uploadFiles} disabled={uploading || files.length === 0}>
                        {uploading && !status.includes("Simulation") ? "Uploading..." : "Upload & Detect"}
                    </button>
                </div>
            </div>

            {status && <p className="status-text">{status}</p>}

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
        </div>
    );
};

export default SignalControl;
