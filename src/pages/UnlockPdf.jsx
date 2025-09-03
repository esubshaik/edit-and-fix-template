import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function UnlockPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const selected = acceptedFiles[0];

    if (selected.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB.");
      return;
    }

    setFile(selected);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  const uploadFile = async () => {
    if (!file) return;
    if (!password.trim()) {
      alert("Please enter the PDF password.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await axios.post("http://localhost:5000/unlock", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${file.name.replace(".pdf", "")}_unlocked.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unlock failed. Please check the password and try again.");
    } finally {
      setLoading(false);
      setFile(null);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        PDF Unlocker
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload your password-protected PDF, enter the password, and download an
        unlocked copy instantly. Maximum file size 50MB.
      </p>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 rounded-xl cursor-pointer text-center transition-all w-full max-w-md ${
          isDragActive ? "border-indigo-400 bg-white shadow-lg" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-gray-800 font-medium">{file.name}</p>
        ) : isDragActive ? (
          <p className="text-indigo-600 font-semibold">Drop your PDF file here...</p>
        ) : (
          <p className="text-gray-400">Drag & drop a PDF here, or click to select a file</p>
        )}
      </div>

      {/* Password Input */}
      {file && (
        <div className="mt-6 w-full max-w-md">
          <input
            type="password"
            placeholder="Enter PDF password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={uploadFile}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Unlocking..." : "Unlock & Download PDF"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">
        Powered by your PDF API • Safe & Secure • No installation required
      </p>
    </div>
  );
}
