
import { useEffect, useState } from "react";
import "./ClientGalleries.css";

const API_URL = "http://127.0.0.1:8000/api/galleries";

function ClientGalleries() {
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("form");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [galleries, setGalleries] = useState([]);

  // REQUEST GALLERY ACCESS
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");
    setSearchedEmail(email.trim().toLowerCase());

    try {
      const response = await fetch(`${API_URL}/request-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 404 && data.found === false) {
        setView("not-found");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (data.found && data.ready === false) {
        setView("not-ready");
        return;
      }

      setMessage(data.message);
      setView("link-generated");
    } catch (err) {
      setError(err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY PRIVATE LOGIN LINK
  useEffect(() => {
    const verifyLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) return;

      setLoading(true);
      setView("verifying");

      try {
        const response = await fetch(
          `${API_URL}/verify-login/?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Your login link is invalid or expired."
          );
        }

        setGalleries(data.galleries || []);
        setView("gallery");

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (err) {
        setError(err.message);
        setView("verification-error");
      } finally {
        setLoading(false);
      }
    };

    verifyLogin();
  }, []);

  // SIGN OUT
  const handleSignOut = () => {
    setEmail("");
    setSearchedEmail("");
    setGalleries([]);
    setMessage("");
    setError("");
    setView("form");

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  };

  return (
    <main className="client-galleries">

      {/* EMAIL FORM */}
      {view === "form" && (
        <section className="gallery-access">
          <p className="gallery-eyebrow">OREBZ STUDIO</p>

          <h1>
            Your Memories, <span>Delivered.</span>
          </h1>

          <p className="gallery-intro">
            Enter the email address you used when
            booking to access your private photographs.
          </p>

          <form onSubmit={handleSubmit} className="gallery-form">
            <label htmlFor="client-email">Email Address</label>

            <input
              id="client-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </form>

          {error && (
            <p className="gallery-error">{error}</p>
          )}

          <a href="/" className="gallery-back">
            ← Back to website
          </a>
        </section>
      )}

      {/* EMAIL NOT REGISTERED */}
      {view === "not-found" && (
        <section className="gallery-access">
          <p className="gallery-eyebrow">OREBZ STUDIO</p>

          <h1>Welcome back.</h1>

          <p className="gallery-intro">
            We couldn't find a gallery for{" "}
            <strong>{searchedEmail}</strong>.
          </p>

          <p className="gallery-intro">
            If you booked with a different email,
            sign out and try that one, or let us know.
          </p>

          <button type="button" onClick={handleSignOut}>
            Sign out ({searchedEmail})
          </button>

          <a href="/#contact" className="gallery-back">
            Contact Orebz Studio
          </a>

          <a href="/" className="gallery-back">
            ← Back to website
          </a>
        </section>
      )}

      {/* GALLERY NOT READY */}
      {view === "not-ready" && (
        <section className="gallery-access">
          <p className="gallery-eyebrow">OREBZ STUDIO</p>

          <h1>Your memories are almost ready.</h1>

          <p className="gallery-intro">
            We're carefully preparing your photographs.
            Please check back later. We can't wait for you
            to see your memories.
          </p>

          <a href="/" className="gallery-back">
            ← Back to website
          </a>
        </section>
      )}

      {/* LOGIN LINK REQUESTED */}
      {view === "link-generated" && (
        <section className="gallery-access">
          <p className="gallery-eyebrow">OREBZ STUDIO</p>

          <h1>You're almost there.</h1>

          <p className="gallery-intro">
            {message}
          </p>

          <a href="/" className="gallery-back">
            ← Back to website
          </a>
        </section>
      )}

      {/* VERIFYING */}
      {view === "verifying" && (
        <section className="gallery-access">
          <h1>Verifying your access...</h1>

          <p className="gallery-intro">
            Please wait while we prepare your private gallery.
          </p>
        </section>
      )}

      {/* VERIFICATION ERROR */}
      {view === "verification-error" && (
        <section className="gallery-access">
          <h1>Unable to access your gallery.</h1>

          <p className="gallery-error">{error}</p>

          <button onClick={handleSignOut}>
            Request a new login link
          </button>

          <a href="/" className="gallery-back">
            ← Back to website
          </a>
        </section>
      )}

      {/* CLIENT GALLERY */}
      {view === "gallery" && (
        <section className="gallery-results">
          <p className="gallery-eyebrow">OREBZ STUDIO</p>

          <h1>Your Private Collection</h1>

          {galleries.map((gallery) => (
            <div key={gallery.id}>
              <h2>{gallery.title}</h2>

              <p>Welcome, {gallery.client_name}.</p>

              <div className="client-photo-grid">
                {gallery.photos?.length > 0 ? (
                  gallery.photos.map((photo) => (
                    <div className="client-photo" key={photo.id}>
                      <img
                        src={photo.image}
                        alt={photo.caption || gallery.title}
                      />

                      {photo.caption && (
                        <p>{photo.caption}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No photographs have been added yet.</p>
                )}
              </div>
            </div>
          ))}

          <button onClick={handleSignOut}>
            Sign Out
          </button>
        </section>
      )}
    </main>
  );
}

export default ClientGalleries;
