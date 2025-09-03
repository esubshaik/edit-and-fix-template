import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
const navItems = [
  { name: "Home", path: "/" },
  {
    name: "PDF Tools",
    path: "/pdf",
    subMenu: [
      { name: "DOCX to PDF", path: "/pdf/docx-to-pdf" },
      { name: "Merge PDF", path: "/pdf/merge" },
      { name: "Split PDF", path: "/pdf/split" },
      { name: "Compress PDF", path: "/pdf/compress" },
      { name: "PDF to Word", path: "/pdf/pdf-to-docx" },
      { name: "PDF to Image", path: "/pdf/pdf-to-image" },
      { name: "Rotate PDF", path: "/pdf/rotate" },
      { name: "Protect PDF", path: "/pdf/protect" },
      { name: "Unlock PDF", path: "/pdf/unlock" },
      { name: "OCR PDF", path: "/pdf/ocr" },
    ],
  },
  {
    name: "Document Tools",
    path: "/docs",
    subMenu: [
      { name: "DOCX to PDF", path: "/docs/docx-to-pdf" },
      { name: "PPTX to PDF", path: "/docs/pptx-to-pdf" }, // placeholder
      { name: "ODT to PDF", path: "/docs/odt-to-pdf" },
      { name: "RTF to PDF", path: "/docs/rtf-to-pdf" },
      { name: "Markdown to PDF", path: "/docs/md-to-pdf" },
      { name: "PDF to DOCX", path: "/docs/pdf-to-docx" },
      { name: "PDF to PPTX", path: "/docs/pdf-to-pptx" }, // placeholder
      { name: "PDF to ODT", path: "/docs/pdf-to-odt" },
      { name: "PDF to RTF", path: "/docs/pdf-to-rtf" }, // placeholder
      { name: "PDF to Markdown", path: "/docs/pdf-to-md" },
    ],
  },
  {
    name: "Image Tools",
    path: "/image",
    subMenu: [
      { name: "JPG/JPEG to PNG", path: "/image/jpg-to-png" },
      { name: "PNG to JPG/JPEG", path: "/image/png-to-jpg" },
      { name: "Rotate Image", path: "/image/rotate" }, // placeholder
    ],
  },
];


export default function Navbar() {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between ">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              FrostAPI
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.name)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-gray-700 font-medium transition-colors ${location.pathname === item.path
                      ? "bg-indigo-600 text-white shadow"
                      : "hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {item.name}
                </Link>

                {/* SubMenu Dropdown */}
                {item.subMenu && openMenu === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-max bg-white shadow-lg rounded-lg p-4 grid grid-cols-2 gap-3 z-50">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-indigo-50 text-gray-700 font-medium text-center transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 space-y-2 px-2 pb-4">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-gray-700 font-medium transition-colors ${location.pathname === item.path
                      ? "bg-indigo-600 text-white shadow"
                      : "hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                >
                  {item.name}
                </Link>

                {/* Mobile submenu */}
                {item.subMenu && (
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md bg-gray-100 hover:bg-indigo-50 text-gray-700 text-center font-medium"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
