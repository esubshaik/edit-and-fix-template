import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function PdfToImage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png"); // default PNG

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
    formData.append("format", format);

    try {
      const response = await axios.post("http://localhost:5000/pdf-to-image", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `images-${file.name.replace(".pdf", "")}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        PDF to Images
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload a PDF file and convert it into JPG or PNG images. Maximum file size 50MB.
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

      {/* Format Selector */}
      {file && (
        <div className="w-full max-w-md mt-6">
          <label className="block text-gray-700 font-medium mb-2 text-center">
            Select Image Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
          </select>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <button
          onClick={uploadFile}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Converting..." : "Convert & Download ZIP"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">
        Powered by your conversion API • Secure & Fast • Download as ZIP
      </p>
    </div>
  );
}
