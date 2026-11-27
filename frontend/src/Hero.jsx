
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

// ======================================
// OREBZ STUDIO CONTACT DETAILS
// ======================================

// Replace with the real WhatsApp number.
// Use international format without + or spaces.
const WHATSAPP_NUMBER = "2349027676110";

const INSTAGRAM_LINK = "https://www.instagram.com/orebz_studio/";

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Orebz Studio, I would like to make an enquiry."
)}`;

// ======================================
// LOAD OPTIMIZED WEBP PHOTOS ONLY
// ======================================

const imageFiles = import.meta.glob("./assets/images/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const photos = Object.entries(imageFiles).map(([path, image]) => ({
  name: path.split("/").pop(),
  image,
}));

const getPhoto = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  const match = photos.find(
    (photo) => photo.name === `${base}.webp`
  );

  return match?.image || "";
};

// ======================================
// HERO SLIDESHOW
// ======================================

const slides = [
  {
    image: getPhoto("orebz-wedding-01.jpg"),
    title: "Every Moment Deserves",
    highlight: "To Be Remembered.",
    description:
      "We capture beautiful moments and turn them into timeless memories.",
    position: "center 20%",
  },
  {
    image: getPhoto("portrait-01.jpg"),
    title: "Your Story.",
    highlight: "Our Lens.",
    description:
      "Professional photography that brings out the beauty in every detail.",
    position: "center 15%",
  },
  {
    image: getPhoto("couple-01.jpg"),
    title: "Love Worth",
    highlight: "Remembering.",
    description:
      "Beautiful wedding and couple photography for memories that last forever.",
    position: "center 20%",
  },
  {
    image: getPhoto("graduation-01.jpg"),
    title: "Celebrate Your",
    highlight: "Big Moments.",
    description:
      "From graduation to special celebrations, we capture every achievement.",
    position: "center 15%",
  },
  {
    image: getPhoto("outdoor-01.jpg"),
    title: "Moments Become",
    highlight: "Memories.",
    description:
      "Creative photography designed to tell your story beautifully.",
    position: "center 20%",
  },
  {
    image: getPhoto("portrait-02.jpg"),
    title: "Beauty in Every",
    highlight: "Detail.",
    description:
      "Every portrait deserves to be captured beautifully.",
    position: "center 15%",
  },
  {
    image: getPhoto("birthday-01.jpg"),
    title: "Celebrate Life.",
    highlight: "Capture Joy.",
    description:
      "Your special celebrations deserve unforgettable photographs.",
    position: "center 20%",
  },
  {
    image: getPhoto("studio-02.jpg"),
    title: "A Moment.",
    highlight: "A Lifetime.",
    description:
      "Creating timeless photographs and lasting memories.",
    position: "center 15%",
  },
  {
    image: getPhoto("portrait-04.jpg"),
    title: "Confidence in",
    highlight: "Every Frame.",
    description:
      "Beautiful portraits that celebrate personality and style.",
    position: "center 15%",
  },
  {
    image: getPhoto("studio-01.jpg"),
    title: "Professional Artistry.",
    highlight: "Timeless Results.",
    description:
      "Thoughtfully captured images with creativity and attention to detail.",
    position: "center 15%",
  },
  {
    image: getPhoto("wedding-02.jpg"),
    title: "Together Forever.",
    highlight: "Beautifully Captured.",
    description:
      "Preserving the love, joy and emotions of your special day.",
    position: "center 20%",
  },
];

// ======================================
// PORTFOLIO PHOTOS
// ======================================

const portfolioItems = [
  {
    title: "Wedding Photography",
    category: "WEDDINGS",
    image: getPhoto("orebz-wedding-01.jpg"),
  },
  {
    title: "Portrait Photography",
    category: "PORTRAITS",
    image: getPhoto("portrait-01.jpg"),
  },
  {
    title: "Graduation Moments",
    category: "GRADUATION",
    image: getPhoto("graduation-01.jpg"),
  },
  {
    title: "Birthday Celebrations",
    category: "BIRTHDAYS",
    image: getPhoto("birthday-01.jpg"),
  },
  {
    title: "Couple Photography",
    category: "COUPLES",
    image: getPhoto("couple-01.jpg"),
  },
  {
    title: "Outdoor Photography",
    category: "OUTDOOR",
    image: getPhoto("outdoor-01.jpg"),
  },
  {
    title: "Studio Photography",
    category: "STUDIO",
    image: getPhoto("studio-01.jpg"),
  },
  {
    title: "Creative Portraits",
    category: "PORTRAITS",
    image: getPhoto("portrait-04.jpg"),
  },
  {
    title: "Wedding Moments",
    category: "WEDDINGS",
    image: getPhoto("wedding-02.jpg"),
  },
];

// ======================================
// SERVICES
// ======================================

const services = [
  {
    number: "01",
    title: "Wedding Photography",
    description:
      "Beautifully documenting your wedding day, from the little details to the unforgettable moments.",
  },
  {
    number: "02",
    title: "Portrait Photography",
    description:
      "Professional portraits that capture your personality, confidence and individual style.",
  },
  {
    number: "03",
    title: "Event Photography",
    description:
      "Capturing birthdays, graduations and special occasions so every memory lasts.",
  },
  {
    number: "04",
    title: "Studio Photography",
    description:
      "Creative studio sessions with attention to lighting, composition and detail.",
  },
];

// ======================================
// MAIN HERO COMPONENT
// ======================================

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically change slides every 6 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Preload the current and next hero photographs.
  // This helps the next slide appear more quickly.
  useEffect(() => {
    const nextIndex = (currentSlide + 1) % slides.length;

    [currentSlide, nextIndex].forEach((index) => {
      const imageUrl = slides[index].image;

      if (imageUrl) {
        const image = new Image();
        image.src = imageUrl;
      }
    });
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
  };

  const slide = slides[currentSlide];

  const nextIndex = (currentSlide + 1) % slides.length;
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;

  return (
    <main className="orebz-site">
      {/* NAVIGATION */}

      <header className="site-header">
        <nav className="hero-navbar">
          <a href="#home" className="brand-logo">
            OREBZ<span>STUDIO.</span>
          </a>

          <div className="hero-nav-links">
            <a href="#home">Home</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <Link to="/client-galleries">Client Galleries</Link>
            <a href="#contact">Contact</a>
          </div>

          <div className="nav-actions">
            <a
              href={INSTAGRAM_LINK}
              className="nav-instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>

            <a
              href={whatsappLink}
              className="nav-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp ↗
            </a>

            <Link to="/booking" className="hero-nav-button">
              Book a Session <span>↗</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* HOME / AUTOMATIC HERO SLIDER */}

      <section className="hero-slider" id="home">
        {slides.map((item, index) => {
          const shouldLoad =
            index === currentSlide ||
            index === nextIndex ||
            index === prevIndex;

          return (
            <div
              key={item.title}
              className={`hero-slide ${
                currentSlide === index ? "active" : ""
              }`}
              style={{
                backgroundImage:
                  item.image && shouldLoad
                    ? `linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.48)), url("${item.image}")`
                    : "linear-gradient(135deg, #171717, #444)",
                backgroundPosition: item.position,
              }}
            />
          );
        })}

        <div className="hero-content">
          <p className="hero-eyebrow">OREBZ STUDIO · PHOTOGRAPHY</p>

          <h1 key={currentSlide}>
            {slide.title}
            <br />
            <span>{slide.highlight}</span>
          </h1>

          <p className="hero-description">{slide.description}</p>

          <div className="hero-buttons">
            <a href="#portfolio" className="hero-primary-button">
              Explore Our Work <span>↗</span>
            </a>

            <Link to="/booking" className="hero-secondary-button">
              Book a Session
            </Link>
          </div>
        </div>

        <button
          className="slider-arrow slider-prev"
          onClick={previousSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          className="slider-arrow slider-next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="slider-dots">
          {slides.map((item, index) => (
            <button
              key={item.title}
              className={`slider-dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-bottom-note">
          <span>
            {String(currentSlide + 1).padStart(2, "0")} —{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <span>CAPTURING MOMENTS. CREATING MEMORIES.</span>
        </div>
      </section>

      {/* INTRODUCTION */}

      <section className="intro-section">
        <p className="section-label">WELCOME TO OREBZ STUDIO</p>

        <h2>
          We don't just take pictures.
          <br />
          We <span>tell stories.</span>
        </h2>

        <p>
          Every picture has a story. Our passion is capturing the emotions,
          beauty and unforgettable moments that make your story special.
        </p>
      </section>

      {/* PORTFOLIO / CAPTURED MOMENTS */}

      <section className="portfolio-section" id="portfolio">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR SELECTED WORK</p>
            <h2>
              Captured <span>Moments.</span>
            </h2>
          </div>

          <p>
            A collection of stories, emotions and beautiful moments captured
            through our lens.
          </p>
        </div>

        <div className="portfolio-grid">
          {portfolioItems.map((item, index) => (
            <article className="portfolio-card" key={item.title}>
              <div className="portfolio-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="image-placeholder">Orebz Studio</div>
                )}

                <div className="portfolio-overlay">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <span className="portfolio-number">
                    0{index + 1} ↗
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="section-button-wrapper">
          <Link to="/client-galleries" className="dark-button">
            View Client Galleries ↗
          </Link>
        </div>
      </section>

      {/* SERVICES */}

      <section className="services-section" id="services">
        <div className="section-heading">
          <div>
            <p className="section-label">WHAT WE DO</p>
            <h2>
              Our <span>Services.</span>
            </h2>
          </div>

          <p>
            From intimate portraits to grand celebrations, we are ready to
            capture your important moments.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/booking" className="service-link">
                Book this service ↗
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}

      <section className="about-section" id="about">
        <div className="about-image">
          {getPhoto("portrait-02.jpg") ? (
            <img
              src={getPhoto("portrait-02.jpg")}
              alt="Orebz Studio photography"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="image-placeholder">OREBZ STUDIO</div>
          )}
        </div>

        <div className="about-content">
          <p className="section-label">A LITTLE ABOUT US</p>

          <h2>
            Behind every picture
            <br />
            is a <span>beautiful story.</span>
          </h2>

          <p className="about-description">
            Orebz Studio is passionate about capturing life's special
            moments through creative and professional photography.
          </p>

          <p className="about-description">
            We believe that photographs are more than images. They are
            memories that allow you to relive the moments that matter most.
          </p>

          <Link to="/booking" className="dark-button">
            Let's Create Memories ↗
          </Link>
        </div>
      </section>

      {/* EXPERIENCE */}

      <section className="experience-section">
        <p className="section-label">OUR PROMISE</p>

        <h2>
          Your memories deserve
          <br />
          <span>the best attention.</span>
        </h2>

        <p>
          We approach every session with creativity, attention to detail
          and a commitment to giving you photographs worth remembering.
        </p>

        <Link to="/booking" className="light-button">
          Start Your Booking ↗
        </Link>
      </section>

      {/* CONTACT */}

      <section className="contact-section" id="contact">
        <div className="contact-heading">
          <p className="section-label">LET'S WORK TOGETHER</p>

          <h2>
            Have a moment
            <br />
            worth <span>capturing?</span>
          </h2>

          <p>
            Tell us about your plans. We would love to be part of your
            next special moment.
          </p>
        </div>

        <div className="contact-links">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>WhatsApp</span>
            <span>Chat with us ↗</span>
          </a>

          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Instagram</span>
            <span>Follow our work ↗</span>
          </a>

          <Link to="/booking">
            <span>Bookings</span>
            <span>Book a session ↗</span>
          </Link>

          <Link to="/client-galleries">
            <span>Client Galleries</span>
            <span>Access your photos ↗</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#home" className="brand-logo">
              OREBZ<span>STUDIO.</span>
            </a>

            <p>
              Capturing moments.
              <br />
              Creating memories.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <a href="#home">Home</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Services</a>
            <a href="#about">About Us</a>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <Link to="/booking">Book a Session</Link>
            <Link to="/client-galleries">Client Galleries</Link>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Follow Us</h4>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Orebz Studio. All rights reserved.
          </p>

          <p className="footer-credit">
            Developed by <span>CalebDev</span>
          </p>

          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}

export default Hero;
