import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function OcrPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const selected = acceptedFiles[0];

    if (selected.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB.");
      return;
    }
    setFile(selected);
    setOcrText("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  const extractText = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/ocr-pdf", formData, {
        responseType: "text",
      });

      setOcrText(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to extract text from PDF.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([ocrText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file?.name || "ocr"}-text.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        OCR PDF (Extract Text)
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload a scanned or normal PDF and extract all text using OCR.
      </p>

      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 rounded-xl cursor-pointer text-center transition-all w-full max-w-md ${
          isDragActive ? "border-green-400 bg-white shadow-lg" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-gray-800 font-medium">{file.name}</p>
        ) : isDragActive ? (
          <p className="text-green-600 font-semibold">Drop your PDF here...</p>
        ) : (
          <p className="text-gray-400">Drag & drop a PDF here, or click to select</p>
        )}
      </div>

      {/* Extract Button */}
      {file && (
        <button
          onClick={extractText}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Extracting..." : "Extract Text from PDF"}
        </button>
      )}

      {/* Results */}
      {ocrText && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-lg font-semibold mb-2">Extracted Text:</h2>
          <textarea
            value={ocrText}
            readOnly
            rows={12}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 font-mono bg-gray-50"
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={downloadTxt}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Download TXT
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(ocrText)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Copy Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
