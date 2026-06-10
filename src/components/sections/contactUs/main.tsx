'use client'
import { useState, useEffect } from "react";

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

interface FormErrors {
  name?: string;
  contact?: string;
  message?: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    const hasEmail = formData.email.trim() !== "";
    const hasPhone = formData.phoneNumber.trim() !== "";

    if (!hasEmail && !hasPhone) {
      newErrors.contact = "Please provide either an email address or a phone number.";
    } else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.contact = "Please enter a valid email address.";
    } else if (hasPhone && !/^\d{7,15}$/.test(formData.phoneNumber.replace(/[\s\-\+]/g, ""))) {
      newErrors.contact = "Please enter a valid phone number.";
    }

    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name === "email" || name === "phoneNumber" ? "contact" : name]: undefined,
    }));
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const payload: Partial<FormData> = { name: formData.name, message: formData.message };
      if (formData.email.trim()) payload.email = formData.email.trim();
      if (formData.phoneNumber.trim()) payload.phoneNumber = formData.phoneNumber.trim();

      const response = await fetch("{{neelgiribackend}}/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.message || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .contact-input {
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          font-size: 14px;
          color: #1e293b;
          background: #f8fafc;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .contact-input:focus {
          border-color: #0d9488;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.14);
        }
        .contact-input.error {
          border-color: #fca5a5;
          background: #fff5f5;
        }
        .contact-input.textarea-field {
          resize: vertical;
          min-height: 220px;
        }
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #0a7c6e 0%, #0d9488 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          box-shadow: 0 4px 14px rgba(13,148,136,0.35);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .reset-btn {
          margin-top: 12px;
          padding: 10px 28px;
          background: transparent;
          color: #0d9488;
          border: 1.5px solid #0d9488;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .reset-btn:hover { background: #0d9488; color: #fff; }
      `}</style>

      <section
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #eef2f7 0%, #e4ecf5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 6px 40px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.04)",
            width: "100%",
            maxWidth: "1000px",
            overflow: "hidden",
            animation: "fadeUp 0.45s ease both",
          }}
        >
          {/* ── TOP HEADER BANNER ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #0a7c6e 0%, #0d9488 100%)",
              padding: isMobile ? "28px 24px 24px" : "36px 48px 30px",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect width="26" height="26" rx="7" fill="rgba(255,255,255,0.18)" />
                <path d="M13 5L19 9V13C19 16.31 16.31 19 13 21C9.69 19 7 16.31 7 13V9L13 5Z" fill="white" />
              </svg>
              <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", opacity: 0.85 }}>
                NEELGIRI PUBLIC SCHOOL
              </span>
            </div>
            <h1 style={{ margin: "0 0 8px", fontSize: isMobile ? "26px" : "32px", fontWeight: 700, letterSpacing: "-0.5px" }}>
              Get in Touch
            </h1>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.65, opacity: 0.78, maxWidth: "540px" }}>
              Have a question or want to learn more about admissions? We'd love to hear from you.
            </p>
          </div>

          {/* ── BODY ── */}
          {submitted ? (
            /* Success */
            <div
              style={{
                padding: "56px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "14px",
              }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="28" fill="#e8f5e9" />
                <path d="M17 28L24 35L39 20" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#1e293b" }}>
                Message Sent!
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: 1.75, maxWidth: "400px" }}>
                Thank you for reaching out. We will contact you shortly via{" "}
                <strong>
                  {formData.email && formData.phoneNumber
                    ? "email or phone number"
                    : formData.email
                    ? "email"
                    : "phone number"}
                </strong>
                .
              </p>
              <button
                className="reset-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", phoneNumber: "", message: "" });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 0,
                }}
              >
                {/* ── LEFT COLUMN — Name, Email, Phone ── */}
                <div
                  style={{
                    padding: isMobile ? "28px 24px 8px" : "36px 36px 36px 48px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    borderRight: isMobile ? "none" : "1px solid #f1f5f9",
                    borderBottom: isMobile ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  {/* Name */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="name" style={labelStyle}>
                      Full Name <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Chetan Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className={`contact-input${errors.name ? " error" : ""}`}
                      autoComplete="name"
                    />
                    {errors.name && <p style={errStyle}>{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address
                      <span style={optionalTag}>optional</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`contact-input${errors.contact ? " error" : ""}`}
                      autoComplete="email"
                    />
                  </div>

                  {/* OR divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>OR</span>
                    <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label htmlFor="phoneNumber" style={labelStyle}>
                      Phone Number
                      <span style={optionalTag}>optional</span>
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`contact-input${errors.contact ? " error" : ""}`}
                      autoComplete="tel"
                    />
                    {errors.contact && <p style={errStyle}>{errors.contact}</p>}
                  </div>

                  {/* hint */}
                  <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.5 }}>
                    At least one contact method is required — email or phone number.
                  </p>
                </div>

                {/* ── RIGHT COLUMN — Message + Submit ── */}
                <div
                  style={{
                    padding: isMobile ? "24px 24px 28px" : "36px 48px 36px 36px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    <label htmlFor="message" style={labelStyle}>
                      Message <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`contact-input textarea-field${errors.message ? " error" : ""}`}
                      style={{ flex: 1, minHeight: isMobile ? "140px" : "220px" }}
                    />
                    {errors.message && <p style={errStyle}>{errors.message}</p>}
                  </div>

                  {apiError && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        background: "#fff5f5",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        fontSize: "13px",
                        color: "#c62828",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                        <circle cx="8" cy="8" r="7" stroke="#c62828" strokeWidth="1.5" />
                        <path d="M8 5V9M8 11V11.5" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>{apiError}</span>
                    </div>
                  )}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                            display: "inline-block",
                            animation: "spin 0.7s linear infinite",
                          }}
                        />
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>

              {/* Footer strip */}
              <div
                style={{
                  borderTop: "1px solid #f1f5f9",
                  padding: "12px 48px",
                  background: "#fafbfc",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1C5.24 1 3 3.24 3 6C3 9.75 8 15 8 15C8 15 13 9.75 13 6C13 3.24 10.76 1 8 1ZM8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5Z"
                    fill="#94a3b8"
                  />
                </svg>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Neelgiri Public School, Shimla, Himachal Pradesh
                </span>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const optionalTag: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 400,
  color: "#94a3b8",
  background: "#f1f5f9",
  padding: "1px 7px",
  borderRadius: "20px",
};

const errStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#dc2626",
};