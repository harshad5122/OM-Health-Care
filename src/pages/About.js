import React, { useEffect } from 'react';
import '../styles/About.css';
import { useInView } from 'react-intersection-observer'; // For scroll-based animations

// --- Image Imports (Replace with your actual image paths) ---
// Clinic Story
import clinicStoryImg1 from '../assets/images/service1.jpg'; // e.g., founder/team photo
import clinicStoryImg2 from '../assets/images/service2.jpg'; // e.g., clinic exterior/interior

// Facility Showcase
import facilityImg1 from '../assets/images/hero-image.jpg'; // Treatment room
import facilityImg2 from '../assets/images/service3.jpg'; // Exercise area
import facilityImg3 from '../assets/images/service4.jpg'; // Reception/waiting area
import facilityImg4 from '../assets/images/service1.jpg'; // Specialized equipment
import facilityImg5 from '../assets/images/icon-modern-eq.jpg';
import facilityImg6 from '../assets/images/icon-personalized.jpg';

// Why Choose Us Icons (Placeholder images, replace with actual icons or SVGs)
import iconExperienced from '../assets/images/icon-experienced.jpg';
import iconModernEq from '../assets/images/icon-modern-eq.jpg';
import iconPersonalized from '../assets/images/icon-personalized.jpg';
import iconWideRange from '../assets/images/service3.jpg';
import iconLongTerm from '../assets/images/service4.jpg';

const About = () => {
  // Animation hooks for each section
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: facilityRef, inView: facilityInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: whyChooseUsRef, inView: whyChooseUsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Optional: Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="animate-fade-in-up">Our Journey to Your Well-being</h1>
          <p className="animate-fade-in-up delay-1">Discover the Heart of Om Health Care</p>
        </div>
      </section>

      {/* Clinic Story & Philosophy */}
      <section ref={storyRef} className={`clinic-story-section ${storyInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="animate-scale-in">Our Story & Philosophy</h2>
            <p className="section-subtitle animate-fade-in delay-1">Rooted in care, growing with trust.</p>
          </div>

          <div className="story-content">
            <div className="story-text animate-slide-right">
              <p>
                <strong>Om Health Care</strong> was founded with a profound vision: to transform the physiotherapy experience by providing unparalleled, patient-centered care in a compassionate and supportive environment. Our journey began with a simple belief – that true healing extends beyond treating symptoms; it involves understanding each individual's unique needs, challenges, and aspirations.
              </p>
              <p>
                We started as a small clinic, driven by a commitment to excellence and a passion for empowering our patients. Over the years, we've grown, but our core philosophy remains unchanged:
                **Every patient deserves dedicated, one-to-one attention.** This commitment ensures that each treatment plan is meticulously tailored, guiding you towards faster recovery and sustainable well-being. We're not just about fixing problems; we're about building lasting health partnerships.
              </p>
            </div>
            <div className="story-images animate-slide-left">
              <div className="image-stack">
                <div className="image-wrapper image-1">
                  <img src={clinicStoryImg1} alt="Clinic Founder/Team" />
                </div>
                <div className="image-wrapper image-2">
                  <img src={clinicStoryImg2} alt="Clinic Interior" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Showcase */}
      {/* <section ref={facilityRef} className={`facility-showcase-section ${facilityInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="animate-scale-in">Our State-of-the-Art Facility</h2>
            <p className="section-subtitle animate-fade-in delay-1">Designed for healing, equipped for excellence.</p>
          </div>

          <div className="facility-grid">
            <div className="facility-item facility-large animate-fade-in-up">
              <img src={facilityImg1} alt="Treatment Room" />
              <div className="facility-caption">Dedicated Treatment Spaces</div>
            </div>
            <div className="facility-item animate-fade-in-up delay-1">
              <img src={facilityImg2} alt="Exercise Machines" />
              <div className="facility-caption">Advanced Exercise Area</div>
            </div>
            <div className="facility-item animate-fade-in-up delay-2">
              <img src={facilityImg3} alt="Reception Area" />
              <div className="facility-caption">Comfortable Waiting Area</div>
            </div>
             <div className="facility-item animate-fade-in-up delay-3">
              <img src={facilityImg4} alt="Specialized Equipment" />
              <div className="facility-caption">Specialized Therapy Equipment</div>
            </div>
           
          </div>
        </div>
      </section> */}
      <section ref={facilityRef} className={`facility-showcase-section ${facilityInView ? 'in-view' : ''}`}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="animate-scale-in">Our State-of-the-Art Facility</h2>
                        <p className="section-subtitle animate-fade-in delay-1">Designed for healing, equipped for excellence.</p>
                    </div>

                    <div className="facility-grid">
                        <div className="facility-item facility-item-lg animate-fade-in-up">
                            <img src={facilityImg1} alt="Spacious Treatment Room" />
                            <div className="facility-caption">Spacious & Modern Treatment Rooms</div>
                        </div>
                        <div className="facility-item facility-item-md animate-fade-in-up delay-1">
                            <img src={facilityImg2} alt="Advanced Exercise Area" />
                            <div className="facility-caption">Advanced Rehabilitation Gym</div>
                        </div>
                        <div className="facility-item facility-item-sm animate-fade-in-up delay-2">
                            <img src={facilityImg3} alt="Comfortable Waiting Area" />
                            <div className="facility-caption">Comfortable Patient Lounge</div>
                        </div>
                        <div className="facility-item facility-item-vert animate-fade-in-up delay-3">
                            <img src={facilityImg4} alt="Specialized Therapy Equipment" />
                            <div className="facility-caption">Cutting-Edge Therapy Equipment</div>
                        </div>
                        <div className="facility-item facility-item-sm animate-fade-in-up delay-4">
                            <img src={facilityImg5} alt="Hydrotherapy Pool" />
                            <div className="facility-caption">Hydrotherapy Pool</div>
                        </div>
                        <div className="facility-item facility-item-md animate-fade-in-up delay-5">
                            <img src={facilityImg6} alt="Private Consultation Room" />
                            <div className="facility-caption">Private Consultation Suites</div>
                        </div>
                        {/* Optional: Video Tour Item - Make sure to set its class appropriately */}
                         <div className="facility-item facility-item-video animate-fade-in-up delay-6">
                           <iframe
                             width="100%"
                             height="100%"
                             src="https://www.youtube.com/embed/your-video-id?controls=0&modestbranding=1" // Replace with your YouTube video ID
                             title="Clinic Video Tour"
                             frameBorder="0"
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                             allowFullScreen
                           ></iframe>
                           <div className="facility-caption">Virtual Facility Tour</div>
                         </div>
                    </div>
                </div>
            </section>

      {/* Why Choose Us */}
      <section ref={whyChooseUsRef} className={`why-choose-us-section ${whyChooseUsInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2 className="animate-scale-in">Why Choose Om Health Care?</h2>
            <p className="section-subtitle animate-fade-in delay-1">Your trusted partner in recovery and wellness.</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card animate-zoom-in">
              <div className="icon-wrapper"><img src={iconExperienced} alt="Experienced Icon" /></div>
              <h3>Experienced & Certified Physiotherapists</h3>
              <p>Our team comprises highly qualified, seasoned professionals passionate about delivering exceptional results.</p>
            </div>
            <div className="benefit-card animate-zoom-in delay-1">
              <div className="icon-wrapper"><img src={iconModernEq} alt="Equipment Icon" /></div>
              <h3>Modern Equipment & Updated Techniques</h3>
              <p>We leverage cutting-edge technology and evidence-based methods for the most effective treatments.</p>
            </div>
            <div className="benefit-card animate-zoom-in delay-2">
              <div className="icon-wrapper"><img src={iconPersonalized} alt="Personalized Icon" /></div>
              <h3>One-to-One Personalized Care</h3>
              <p>Receive undivided attention and a treatment plan meticulously crafted for your unique needs and goals.</p>
            </div>
            <div className="benefit-card animate-zoom-in delay-3">
              <div className="icon-wrapper"><img src={iconWideRange} alt="Wide Range Icon" /></div>
              <h3>Wide Range of Specialized Treatments</h3>
              <p>From sports injuries to neurological rehabilitation, we offer comprehensive care under one roof.</p>
            </div>
            <div className="benefit-card animate-zoom-in delay-4">
              <div className="icon-wrapper"><img src={iconLongTerm} alt="Long-Term Icon" /></div>
              <h3>Focus on Long-Term Recovery</h3>
              <p>Our aim is not just quick fixes, but empowering you with tools for lasting health and pain prevention.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;