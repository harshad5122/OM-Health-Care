import React, { useEffect } from 'react';
import '../styles/Testimonials.css';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'; // For quote icons
import { Link } from 'react-router-dom';

// --- Testimonial Images & Videos (Replace with your actual paths/links) ---
// IMPORTANT: Use high-quality, professional images/videos.
// For videos, use embed links from YouTube/Vimeo for best results.
import patient1Photo from '../assets/images/therapist1.jpg';
// import patient2Photo from '../assets/images/testimonials/patient2.jpg';
import patient3Photo from '../assets/images/therapist2.png';
// import patient4Photo from '../assets/images/testimonials/patient4.jpg';
import patient5Photo from '../assets/images/therapist1.jpg';

const testimonialsData = [
  {
    id: 'test-1',
    identifier: 'Michael B.',
    mediaType: 'image', // 'image' or 'video'
    mediaSrc: patient1Photo,
    challenge: 'Suffered from severe chronic lower back pain for 6 months, impacting daily life.',
    result: 'After just a few weeks of personalized therapy at Om Health Care, my pain is completely gone, and I can finally work and enjoy my hobbies normally again!',
    quote: "Om Health Care gave me my life back. Their dedication and tailored approach are truly exceptional. I haven't felt this good in years!"
  },
  {
    id: 'test-2',
    identifier: 'Rina P.',
    mediaType: 'video',
    // Replace with actual YouTube/Vimeo embed URL (e.g., https://www.youtube.com/embed/YOUR_VIDEO_ID?controls=0)
    // Make sure to set `controls=0` for a cleaner look, and `modestbranding=1` if desired.
    mediaSrc: 'https://www.youtube.com/embed/M0T9t8G0Y0Y?controls=0&modestbranding=1&rel=0', // Placeholder YouTube video
    challenge: 'Struggled with limited shoulder mobility after a sports injury, unable to lift arm.',
    result: 'Thanks to their focused rehabilitation program, I have full range of motion back and am ready to return to my sport stronger than ever!',
    quote: "I thought my athletic career was over, but Om Health Care's therapists pushed me gently and effectively. Their expertise is unmatched!"
  },
  {
    id: 'test-3',
    identifier: 'Amit S.',
    mediaType: 'image',
    mediaSrc: patient3Photo,
    challenge: 'Persistent neck stiffness and frequent headaches from prolonged desk work.',
    result: 'My headaches are gone, and my neck feels incredibly loose. I can now focus better at work without constant discomfort.',
    quote: "Professional, attentive, and incredibly effective. Om Health Care transformed my workday. Highly recommend their ergonomic advice and treatments!"
  },
  {
    id: 'test-4',
    identifier: 'Priya M.',
    mediaType: 'video',
    mediaSrc: 'https://www.youtube.com/embed/oQ3Q-5yN86A?controls=0&modestbranding=1&rel=0', // Placeholder YouTube video
    challenge: 'Recovering from knee replacement surgery, needed to regain strength and walking ability.',
    result: 'The post-op physiotherapy was incredible. I’m walking confidently without pain, far ahead of my recovery schedule!',
    quote: "Choosing Om Health Care for my rehab was the best decision. They made a challenging recovery process smooth and empowering. Truly grateful!"
  },
  {
    id: 'test-5',
    identifier: 'Rajesh K.',
    mediaType: 'image',
    mediaSrc: patient5Photo,
    challenge: 'Experiencing numbness and tingling in hands and feet due to nerve compression.',
    result: 'The specific nerve gliding exercises and manual therapy worked wonders. The sensation is returning, and the pain has significantly reduced.',
    quote: "I was losing hope with the tingling and numbness, but Om Health Care provided clear explanations and effective treatments. Life-changing experience!"
  },
];


const TestimonialItem = ({ testimonial, index, inView }) => {
  const isEven = index % 2 === 0; // For zigzag layout (0, 2, 4... will be left aligned text/right image)

  return (
    <div
      className={`testimonial-item ${isEven ? 'layout-left' : 'layout-right'} ${inView ? 'animated' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }} // Staggered animation
    >
      <div className="media-container">
        {testimonial.mediaType === 'image' ? (
          <img
            src={testimonial.mediaSrc}
            alt={`Patient ${testimonial.identifier}`}
            loading="lazy" // Lazy load images
          />
        ) : (
          <div className="video-wrapper">
            <iframe
              src={testimonial.mediaSrc}
              title={`Video testimonial by ${testimonial.identifier}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy" // Lazy load iframe
            ></iframe>
          </div>
        )}
        <div className="identifier-tag">
          {testimonial.identifier}
        </div>
      </div>

      <div className="content-container">
        <FaQuoteLeft className="quote-icon-left" />
        <h3 className="result-headline">{testimonial.quote}</h3>
        <p className="challenge-text">
          <span className="bold-label">Challenge:</span> {testimonial.challenge}
        </p>
        <p className="result-text">
          <span className="bold-label">Result:</span> {testimonial.result}
        </p>
        <FaQuoteRight className="quote-icon-right" />
      </div>
    </div>
  );
};


const Testimonials = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation hooks for main sections
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: testimonialsSectionRef, inView: testimonialsSectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="testimonials-page">
      {/* Hero Section */}
      <section ref={heroRef} className={`testimonials-hero ${heroInView ? 'in-view' : ''}`}>
        <div className="testimonials-hero-overlay"></div>
        <div className="testimonials-hero-content animate-fade-in-up">
          <h1>Hear From Our Happy Patients</h1>
          <p className="delay-1">Real stories, real results – your journey to wellness starts here.</p>
        </div>
      </section>

      {/* Testimonials List/Grid */}
      <section ref={testimonialsSectionRef} className={`testimonials-list-section ${testimonialsSectionInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Transforming Lives, One Success Story at a Time</h2>
            <p className="section-subtitle">Read how Om Health Care has helped countless individuals regain their health, mobility, and confidence.</p>
          </div>

          <div className="testimonials-grid">
            {testimonialsData.map((testimonial, index) => (
              <TestimonialItem
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
                inView={testimonialsSectionInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="testimonials-cta-section">
        <div className="container">
          <h2>Ready to Write Your Own Success Story?</h2>
          <p>Don't let pain hold you back any longer. Contact us today to begin your personalized physiotherapy journey.</p>
          <Link to="/contact" className="cta-button">Start Your Recovery</Link>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;