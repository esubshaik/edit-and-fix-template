import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable item component
function SortableItem({ id, name }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "12px",
    marginBottom: "8px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
    </div>
  );
}

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const validFiles = acceptedFiles.filter(
      (file) => file.size <= 50 * 1024 * 1024
    );
    if (validFiles.length !== acceptedFiles.length) {
      alert("Some files exceeded the 50MB limit and were skipped.");
    }
    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "application/pdf": [".pdf"] },
  });

  // Handle drag reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.name === active.id);
      const newIndex = files.findIndex((f) => f.name === over.id);
      setFiles((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const mergeFiles = async () => {
    if (!files.length) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("files", file, `file${index + 1}.pdf`);
    });

    try {
      const response = await axios.post("http://localhost:5000/merge", formData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `merged.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Merge failed. Please try again.");
    } finally {
      setLoading(false);
      setFiles([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        Merge PDF Files
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-lg">
        Upload multiple PDF files, reorder them, and download a single merged PDF. Max size: 50MB each.
      </p>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-12 rounded-xl cursor-pointer text-center transition-all w-full max-w-md ${
          isDragActive ? "border-indigo-400 bg-white shadow-lg" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-indigo-600 font-semibold">Drop your PDF files here...</p>
        ) : (
          <p className="text-gray-400">
            Drag & drop PDFs here, or click to select files
          </p>
        )}
      </div>

      {/* File List with Drag-and-Drop */}
      {files.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={files.map((f) => f.name)}
              strategy={verticalListSortingStrategy}
            >
              {files.map((file) => (
                <SortableItem key={file.name} id={file.name} name={file.name} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Merge Button */}
      {files.length > 0 && (
        <button
          onClick={mergeFiles}
          disabled={loading}
          className="mt-6 w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Merging..." : "Merge & Download PDF"}
        </button>
      )}

      <p className="mt-4 text-gray-500 text-sm">
        Powered by your conversion API • Safe & Secure • No installation required
      </p>
    </div>
  );
}
