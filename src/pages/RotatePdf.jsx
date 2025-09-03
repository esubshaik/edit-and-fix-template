import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function RotatePDF() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const selected = acceptedFiles[0];

    if (selected.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB.");
      return;
    }

    setFile(selected);

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjs.getDocument({ data: typedarray }).promise;

      const renderedPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 }); // ✅ slightly smaller
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        renderedPages.push({
          pageNum: i,
          image: canvas.toDataURL("image/jpeg", 0.8), // ✅ lighter image
          rotation: 0,
        });
      }
      setPages(renderedPages);
      setCurrentPage(0);
    };
    reader.readAsArrayBuffer(selected);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  });

  const rotateCurrentPage = () => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === currentPage ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);

    const rotations = pages.map(({ pageNum, rotation }) => [pageNum, rotation]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("rotations", JSON.stringify(rotations));

    try {
      const response = await axios.post("http://localhost:5000/rotate", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${file.name.replace(".pdf", "")}_rotated.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Rotation failed. Please try again.");
    } finally {
      setLoading(false);
      setFile(null);
      setPages([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-20">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        PDF Rotator
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload a PDF, preview it, rotate pages individually, and download the rotated version.
      </p>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 rounded-xl cursor-pointer text-center transition-all w-full max-w-md ${isDragActive ? "border-indigo-400 bg-white shadow-lg" : "border-gray-300 bg-white"
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

      {/* Page Viewer */}
      {file && pages.length > 0 && (
        <div className="mt-8 w-[40%] max-h-[50%] bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <div className="relative w-full flex justify-center items-center">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="absolute left-0 p-3 bg-gray-200 rounded-full shadow hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="w-full h-full flex justify-center items-center bg-white p-10">
              <img
                src={pages[currentPage].image}
                alt={`Page ${pages[currentPage].pageNum}`}
                style={{
                  transform: `rotate(${pages[currentPage].rotation}deg)`,
                  // transition: "transform 0.01s ease",
                  maxWidth: "60%",
                  maxHeight: "60%",
                  objectFit: "contain", // ✅ keeps aspect ratio and fits inside div
                }}
                className="rounded-lg shadow"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1))}
              disabled={currentPage === pages.length - 1}
              className="absolute right-0 p-3 bg-gray-200 rounded-full shadow hover:bg-gray-300 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <p className="mt-2 text-gray-600">
            Page {currentPage + 1} of {pages.length}
          </p>

          {/* Rotate button */}
          <button
            onClick={rotateCurrentPage}
            className="mt-4 flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
          >
            <RotateCcw className="w-5 h-5" />
            Rotate This Page
          </button>
        </div>
      )}

      {/* Upload Button */}
      {file && pages.length > 0 && (
        <button
          onClick={uploadFile}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Rotate & Download PDF"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">Powered by your PDF API • Safe & Secure</p>
    </div>
  );
}
