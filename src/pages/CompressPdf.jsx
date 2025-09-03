import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compression, setCompression] = useState(50); // default 50%

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
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("compression", compression);

    try {
      const response = await axios.post("http://localhost:5000/compress-pdf", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `compressed-${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Compression failed. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        PDF Compressor
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload your PDF file and select compression percentage to reduce size. Maximum file size 50MB.
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
          <p className="text-indigo-600 font-semibold">Drop your PDF here...</p>
        ) : (
          <p className="text-gray-400">
            Drag & drop a PDF file here, or click to select
          </p>
        )}
      </div>

      {/* Compression Slider */}
      {file && (
        <div className="w-full max-w-md mt-6">
          <label className="block text-gray-700 font-medium mb-2 text-center">
            Compression Level: {compression}%
          </label>
          <input
            type="range"
            min="10"
            max="90"
            value={compression}
            onChange={(e) => setCompression(e.target.value)}
            className="w-full accent-indigo-600"
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
          {loading ? "Compressing..." : "Compress & Download PDF"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">
        Powered by your compression API • Safe & Secure • No installation required
      </p>
    </div>
  );
}
