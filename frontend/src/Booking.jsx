
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Booking.css";

// AUTOMATICALLY LOAD EXISTING PHOTOS
const bookingImages = Object.values(
  import.meta.glob(
    "./assets/images/*.{jpg,jpeg,png,webp}",
    {
      eager: true,
      query: "?url",
      import: "default",
    }
  )
);

const bookingBackground = bookingImages[0];

function Booking() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    service: "",
    preferred_date: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://orebz-studio.onrender.com/api/bookings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Object.entries(data)
            .map(([field, messages]) =>
              `${field}: ${
                Array.isArray(messages)
                  ? messages.join(", ")
                  : messages
              }`
            )
            .join(" | ") || "Booking failed."
        );
      }

      setSuccess(
        "Your booking request has been received! Orebz Studio will contact you shortly."
      );

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        service: "",
        preferred_date: "",
        location: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="booking-page"
      style={{
        "--booking-background": bookingBackground
          ? `url("${bookingBackground}")`
          : "none",
      }}
    >
      <nav className="booking-nav">
        <Link to="/" className="booking-logo">
          OREBZ STUDIO<span>.</span>
        </Link>

        <Link to="/" className="booking-back">
          ← Back to Home
        </Link>
      </nav>

      <section className="booking-container">
        <div className="booking-heading">
          <p className="booking-eyebrow">
            LET'S CREATE SOMETHING BEAUTIFUL
          </p>

          <h1>
            Book Your <span>Session.</span>
          </h1>

          <p>
            Every moment deserves to be remembered.
            Tell us about your occasion and let Orebz Studio
            capture your special memories.
          </p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="booking-field">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="booking-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="booking-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="booking-field">
            <label>Photography Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Choose a service</option>
              <option value="Wedding">Wedding Photography</option>
              <option value="Portrait">Portrait Photography</option>
              <option value="Outdoor">Outdoor Photography</option>
              <option value="Birthday">Birthday Photography</option>
              <option value="Other">Other Photography</option>
            </select>
          </div>

          <div className="booking-field">
            <label>Preferred Date</label>
            <input
              type="date"
              name="preferred_date"
              min={new Date().toLocaleDateString("en-CA")}
              value={formData.preferred_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="booking-field">
            <label>Event Location</label>
            <input
              type="text"
              name="location"
              placeholder="Where will the session take place?"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="booking-field booking-message">
            <label>Additional Details</label>
            <textarea
              name="message"
              placeholder="Tell us more about your photography needs..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          {success && (
            <p className="booking-success">{success}</p>
          )}

          {error && (
            <p className="booking-error">{error}</p>
          )}

          <button
            type="submit"
            className="booking-submit"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Booking Request ↗"}
          </button>
        </form>
      </section>

      <footer className="booking-footer">
        <div className="booking-socials">
          <a
            href="https://instagram.com/orebz_studio"
            target="_blank"
            rel="noreferrer"
          >
            Instagram: @orebz_studio
          </a>

          <a href="tel:+2349027676110">
            09027676110
          </a>
        </div>

        <p>
          © {new Date().getFullYear()} Orebz Studio.
          All rights reserved.
        </p>
      </footer>
    </main>
  );
}

export default Booking;
