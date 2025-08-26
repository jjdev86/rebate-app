import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useUser } from "../context/useUser";

// ---- Personalize these placeholders ----
export const CREATOR_NAME = "Jose Valadez";
export const CONTACT_EMAIL = "vinmajj@gmail.com";
export const SOCIAL_LINKS = {
  x: "https://x.com/yourhandle",
  linkedin: "https://www.linkedin.com/in/yourhandle",
  github: "https://github.com/yourhandle",
};

export const SiteHeader = ({
  variant = "app", // 'app' or 'auth'
  rightLink, // { to, label } for auth pages
  showNewButton = false,
}) => {
  const { user, setUser } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (variant === "app") {
      (async () => {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch {
          /* ignore */
        }
      })();
    }
  }, [variant, setUser]);

  const handleSignOut = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      navigate("/");
    }
  };

  const handleStartNew = async () => {
    try {
      const res = await api.post("/applications/draft");
      const id = res?.data?.id;
      if (!id) throw new Error("Missing id");
      navigate(`/new-application/${id}`);
    } catch (err) {
      alert("Could not start a new application. Please try again.");
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] flex items-center justify-center">
            <span className="text-[#1E2A5A] text-sm font-semibold">SB</span>
          </div>
          <Link
            to={variant === "app" ? "/dashboard" : "/"}
            className="font-semibold text-[#1E2A5A]"
          >
            Smart Benefit
          </Link>
        </div>

        {variant === "auth" ? (
          rightLink ? (
            <Link
              to={rightLink.to}
              className="text-sm text-[#0052CC] underline underline-offset-2"
            >
              {rightLink.label}
            </Link>
          ) : (
            <span />
          )
        ) : (
          <div className="flex items-center gap-2">
            {showNewButton && (
              <button
                onClick={handleStartNew}
                className="hidden sm:inline-flex items-center gap-2 btn-primary"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                New
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-[#EAF3FF] flex items-center justify-center text-[#1E2A5A] text-sm font-semibold">
                  {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden sm:block text-sm text-[#1E2A5A]">
                  {user?.email || "Account"}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-md overflow-hidden"
                >
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export const SiteFooter = ({
  creatorName = CREATOR_NAME,
  contactEmail = CONTACT_EMAIL,
  socialLinks = SOCIAL_LINKS,
}) => (
  <footer className="mt-10 border-t bg-white">
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-[#1E2A5A]">
            About this portal
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Smart Benefit helps you start, track, and manage rebate applications
            from your phone—fast, secure, and paper‑free.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1E2A5A]">Contact</h3>
          <p className="mt-2 text-sm text-gray-600">
            Questions or feedback? I’d love to hear from you.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-2 inline-flex items-center text-sm text-[#0052CC] underline underline-offset-2"
          >
            {contactEmail}
          </a>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#1E2A5A]">Social</h3>
          <nav
            aria-label="Social media"
            className="mt-2 flex items-center gap-4"
          >
            {socialLinks?.x && (
              <a
                href={socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#0052CC]"
                aria-label="X (formerly Twitter)"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4l16 16M20 4 4 20" />
                </svg>
              </a>
            )}
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#0052CC]"
                aria-label="LinkedIn"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6h-4v-12h4v2" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {socialLinks?.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#0052CC]"
                aria-label="GitHub"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 3.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-8 0C3.27.65 2.09 1 2.09 1A5.07 5.07 0 0 0 2 3.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 6 18.13V22" />
                </svg>
              </a>
            )}
          </nav>
        </div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t pt-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Smart Benefit. All rights reserved.
        </p>
        <p className="text-xs text-gray-500">
          Created by{" "}
          <span className="font-medium text-[#1E2A5A]">{creatorName}</span>
        </p>
      </div>
    </div>
  </footer>
);
