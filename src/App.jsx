import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./pages/NavBar";

// PDF Tools
import CompressPdf from "./pages/CompressPdf";
import DocxToPdf from "./pages/DocxToPdf";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import PdfToDocx from "./pages/PdfToDocx";
import PdfToImages from "./pages/PdfToImages";
import RotatePdf from "./pages/RotatePdf";
import ProtectPdf from "./pages/ProtectPdf";
import UnlockPdf from "./pages/UnlockPdf";
import OcrPdf from "./pages/OcrPdf";

// Document Tools
import PdfToOdt from "./pages/PdtToOdt";

import RtfToPdf from "./pages/RtfToPdf";
import PdfToMarkdown from "./pages/PdfToMarkdown";
// 
// // Image Tools
import JpegToPng from "./pages/JpegToPng";
import PngToJpeg from "./pages/PngToJpeg";

// ⚠️ Missing components for PPTX, ODT-to-PDF, Markdown-to-PDF, PDF-to-PPTX, PDF-to-RTF, RotateImage
// You can create placeholder components for these so the routes don’t break.

function App() {
  return (
    <Router>
      <Navbar />
      <div className="">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* PDF Tools */}
          <Route path="/pdf/docx-to-pdf" element={<DocxToPdf />} />
          <Route path="/pdf/merge" element={<MergePdf />} />
          <Route path="/pdf/split" element={<SplitPdf />} />
          <Route path="/pdf/compress" element={<CompressPdf />} />
          <Route path="/pdf/pdf-to-docx" element={<PdfToDocx />} />
          <Route path="/pdf/pdf-to-image" element={<PdfToImages />} />
          <Route path="/pdf/rotate" element={<RotatePdf />} />
          <Route path="/pdf/protect" element={<ProtectPdf />} />
          <Route path="/pdf/unlock" element={<UnlockPdf />} />
          <Route path="/pdf/ocr" element={<OcrPdf />} />

          {/* Document Tools */}
          <Route path="/docs/docx-to-pdf" element={<DocxToPdf />} />
          {/* Placeholder for PPTX to PDF */}
          {/* Placeholder for ODT to PDF */}
          <Route path="/docs/rtf-to-pdf" element={<RtfToPdf />} />
          <Route path="/docs/md-to-pdf" element={<PdfToMarkdown />} />
          <Route path="/docs/pdf-to-docx" element={<PdfToDocx />} />
          {/* Placeholder for PDF to PPTX */}
          <Route path="/docs/pdf-to-odt" element={<PdfToOdt />} />
          {/* Placeholder for PDF to RTF */}
          <Route path="/docs/pdf-to-md" element={<PdfToMarkdown />} />

          {/* Image Tools */}
          <Route path="/image/jpg-to-png" element={<JpegToPng />} />
          <Route path="/image/png-to-jpg" element={<PngToJpeg />} />
          {/* Placeholder for Rotate Image */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
