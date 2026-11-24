
import "./PhotoMarquee.css";

function PhotoMarquee({ photos = [] }) {
  if (!photos.length) return null;

  return (
    <section className="photo-marquee">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            className="marquee-group"
            key={copy}
            aria-hidden={copy === 1}
          >
            {photos.map((photo, index) => (
              <div
                className="marquee-card"
                key={`${copy}-${photo.src}-${index}`}
              >
                <img
                  src={photo.src}
                  alt={copy === 0 ? photo.name : ""}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PhotoMarquee;
