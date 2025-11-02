import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50 shadow-inner border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-14 px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-gray-700">
        
        {/* Brand and Description */}
        <div className="space-y-4">
          <img
            src="/mru-logo.png"
            alt="IFQE Logo"
            className="w-28"
            loading="lazy"
          />
          <p className="text-sm leading-relaxed max-w-xs">
            Institutional Framework for Quality Enhancement (IFQE) at Manav Rachna University. Fostering academic excellence, research innovation, and continuous improvement.
          </p>
          <div className="flex space-x-4 mt-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <a
                href="#"
                key={idx}
                className="text-gray-500 hover:text-pink-500 transition transform hover:scale-110"
                aria-label={`Visit our ${Icon.name} profile`}
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>

        {/* Links column 1 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-700 uppercase tracking-wide">
            About
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/about-mru" className="hover:text-pink-600 transition">
                MRU
              </a>
            </li>
            <li>
              <a href="/leadership-messages" className="hover:text-pink-600 transition">
                Leadership
              </a>
            </li>
            <li>
              <a href="/faculty-team" className="hover:text-pink-600 transition">
                Our Team
              </a>
            </li>
          </ul>
        </div>

        {/* Links column 2 */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-700 uppercase tracking-wide">
            Resources
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/about-ifqe" className="hover:text-pink-600 transition">
                IFQE Overview
              </a>
            </li>
            <li>
              <a href="/criteria" className="hover:text-pink-600 transition">
                7 Criteria
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <h3 className="text-lg font-semibold text-blue-700 uppercase tracking-wide">
            Contact
          </h3>
          <p>Email: <a href="mailto:info@ifqe.mru.edu" className="hover:text-pink-600">director.iqac@mru.edu.in</a></p>
          <p>Phone: <a href="tel:+911234567890" className="hover:text-pink-600">01294268605</a></p>
          <p className="mt-4 text-xs text-gray-400">
            © {new Date().getFullYear()} Manav Rachna University - IFQE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
