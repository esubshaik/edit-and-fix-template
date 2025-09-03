import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function JPEG2PNG() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(
      (f) => f.size <= 50 * 1024 * 1024
    );
    if (validFiles.length !== acceptedFiles.length) {
      alert("Some files exceeded 50MB and were skipped.");
    }
    setFiles(validFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/jpeg": [".jpeg", ".jpg"] },
  });

  const uploadFiles = async () => {
    if (!files.length) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("target", "png"); // target format

    try {
      const response = await axios.post("http://localhost:5000/convert", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "converted_images.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
      setFiles([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        JPEG to PNG Converter
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Upload one or more JPEG files and download them as PNG.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 rounded-xl cursor-pointer text-center transition-all w-full max-w-md ${
          isDragActive ? "border-indigo-400 bg-white shadow-lg" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {files.length ? (
          <ul className="text-left text-gray-800">
            {files.map((f, i) => (
              <li key={i} className="truncate">{f.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Drag & drop JPEG files here, or click to select</p>
        )}
      </div>

      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert & Download PNGs"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">Powered by your conversion API • Safe & Secure</p>
    </div>
  );
}
