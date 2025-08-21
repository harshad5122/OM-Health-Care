// import React from "react";
// import "../styles/home.css";

// function Home() {
//   return (
//     <div className="home">
//       {/* Hero Section */}
//       <section id="hero" className="hero-section">
//         <div className="hero-content">
//           <h1>Personalized Physiotherapy to Get You Moving Again</h1>
//           <p>Trusted physiotherapy with modern treatments for faster recovery.</p>
//           <button className="appointment-btn">Book Appointment</button>
//         </div>
//       </section>

//       {/* Introduction */}
//       <section className="intro-section">
//         <h2>Welcome to Om Health Care</h2>
//         <p>
//           At Om Health Care, we believe in providing personalized physiotherapy
//           treatments to help you recover faster, reduce pain, and improve your
//           quality of life.
//         </p>
//       </section>

//       {/* Services */}
//       <section id="services" className="services-section">
//         <h2>Our Services</h2>
//         <div className="services-grid">
//           <div className="service-card">
//             <h3>Sports Injury Rehabilitation</h3>
//             <p>Helping athletes recover and return stronger.</p>
//           </div>
//           <div className="service-card">
//             <h3>Post-Surgical Physiotherapy</h3>
//             <p>Guided recovery after major or minor surgeries.</p>
//           </div>
//           <div className="service-card">
//             <h3>Back & Neck Pain Therapy</h3>
//             <p>Targeted treatments to relieve chronic pain.</p>
//           </div>
//           <div className="service-card">
//             <h3>Neurological Rehabilitation</h3>
//             <p>Special care for neurological conditions.</p>
//           </div>
//         </div>
//       </section>

//       {/* Meet the Team */}
//       <section id="team" className="team-section">
//         <h2>Meet Our Team</h2>
//         <div className="team-grid">
//           <div className="team-member">
//             <img src="https://via.placeholder.com/150" alt="Therapist" />
//             <p>Dr. A. Sharma - Senior Physiotherapist</p>
//           </div>
//           <div className="team-member">
//             <img src="https://via.placeholder.com/150" alt="Therapist" />
//             <p>Dr. R. Mehta - Sports Specialist</p>
//           </div>
//         </div>
//         <a href="#!" className="team-link">View Full Team</a>
//       </section>

//       {/* Testimonials */}
//       <section id="testimonials" className="testimonial-section">
//         <h2>What Our Patients Say</h2>
//         <div className="testimonial-grid">
//           <blockquote>
//             “Thanks to Om Health Care, my back pain is gone, and I feel strong again!”
//           </blockquote>
//           <blockquote>
//             “The physiotherapists here truly care about your recovery. Highly recommended!”
//           </blockquote>
//         </div>
//       </section>

//       {/* Contact */}
//       <section id="contact" className="contact-section">
//         <h2>Contact Us</h2>
//         <p>Address: 123 Main Road, Rajkot, India</p>
//         <p>Phone: +91 9876543210</p>
//         <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="whatsapp-btn">
//           Chat on WhatsApp
//         </a>
//       </section>
//     </div>
//   );
// }

// export default Home;



import React, { useEffect } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

// Import images (replace with your actual images)
// import heroImage from '../assets/images/hero-image.jpg';
import service1 from '../assets/images/service1.jpg';
import service2 from '../assets/images/service2.jpg';
import service3 from '../assets/images/service3.jpg';
import service4 from '../assets/images/service4.jpg';
import therapist1 from '../assets/images/therapist1.jpg';
// import therapist2 from '../assets/images/therapist2.png';

const Home = () => {
  useEffect(() => {
    // Add animation class to elements when component mounts
    const animateElements = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const elementPosition = el.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
          el.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', animateElements);
    animateElements(); // Run once on mount
    
    return () => window.removeEventListener('scroll', animateElements);
  }, []);

  const services = [
    {
      id: 1,
      title: "Sports Injury Rehabilitation",
      description: "Specialized treatment for athletes to recover from injuries and enhance performance.",
      image: service1
    },
    {
      id: 2,
      title: "Post-Surgical Physiotherapy",
      description: "Customized rehabilitation programs to restore mobility after surgery.",
      image: service2
    },
    {
      id: 3,
      title: "Back & Neck Pain Therapy",
      description: "Effective techniques to relieve chronic back and neck pain.",
      image: service3
    },
    {
      id: 4,
      title: "Neurological Rehabilitation",
      description: "Advanced therapies for patients with neurological conditions.",
      image: service4
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "Thanks to Om Health Care, my back pain is gone, and I feel strong again!",
      author: "Rajesh P."
    },
    {
      id: 2,
      quote: "The team helped me recover from my knee surgery faster than expected. Highly recommended!",
      author: "Priya M."
    },
    {
      id: 3,
      quote: "Professional care with personalized attention. My shoulder mobility has improved dramatically.",
      author: "Amit S."
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Gopi Dholariya",
      specialization: "Physiotherapy",
      image: therapist1
    },
  ];

  return (
    
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="slide-up">Personalized Physiotherapy to Get You Moving Again</h1>
          <p className="slide-up" style={{ animationDelay: '0.3s' }}>
            Trusted physiotherapy with modern treatments for faster recovery.
          </p>
          <Link 
            to="/appointment" 
            className="hero-button slide-up" 
            style={{ animationDelay: '0.6s' }}
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <h2 className="section-title fade-in">Welcome to Om Health Care</h2>
          <p className="fade-in" style={{ animationDelay: '0.3s' }}>
            At Om Health Care, we believe in providing personalized physiotherapy treatments to help you recover faster, 
            reduce pain, and improve your quality of life. Our evidence-based approach combines the latest techniques 
            with compassionate care.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title fade-in">Our Services</h2>
          <p className="section-subtitle fade-in" style={{ animationDelay: '0.3s' }}>
            Comprehensive care for all your physiotherapy needs
          </p>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="service-image-container">
                  <img src={service.image} alt={service.title} className="service-image" />
                  <div className="service-overlay"></div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to={`/services`} className="service-link">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Preview Section */}
    
      <section className="team-section">
  <div className="container">
    <h2 className="section-title fade-in">Meet Our Experts</h2>
    <p className="section-subtitle fade-in" style={{ animationDelay: '0.3s' }}>
      Dedicated professionals committed to your wellness journey
    </p>
    
    <div className="team-grid">
      {teamMembers.map((member, index) => (
        <div 
          key={member.id} 
          className="team-card animate-on-scroll"
          style={{ transitionDelay: `${index * 0.1}s` }}
        >
          <div className="profile-section">
            <div className="team-image-container">
              <img src={member.image} alt={member.name} className="team-image" />
            </div>
            <h3>{member.name}</h3>
            <p className="specialization">{member.specialization}</p>
          </div>
          
          <div className="bio-section">
            <p>
              Dr. Gopi Dholariya is a highly dedicated and compassionate physiotherapist with over 4 years of experience specializing in orthopedic and sports-related conditions. Her patient-centered approach focuses on evidence-based practices, ensuring personalized treatment plans that lead to optimal recovery and improved quality of life.
            </p>
          </div>
        </div>
      ))}
    </div>
    
    <Link to="/team" className="view-all-button animate-on-scroll">
      View Full Team
    </Link>
  </div>
</section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title fade-in">Patient Testimonials</h2>
          <p className="section-subtitle fade-in" style={{ animationDelay: '0.3s' }}>
            Hear from those who've experienced our care
          </p>
          
          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card animate-on-scroll"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="quote-icon">"</div>
                <p className="testimonial-text">{testimonial.quote}</p>
                <p className="testimonial-author">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-content animate-on-scroll">
            <h2>Ready to Start Your Recovery Journey?</h2>
            <p>Contact us today to schedule your first appointment</p>
            <div className="contact-buttons">
              <Link to="/contact" className="contact-button">
                <i className="fas fa-map-marker-alt"></i> Visit Us
              </Link>
              <a href="tel:+911234567890" className="contact-button">
                <i className="fas fa-phone"></i> Call Now
              </a>
              <a href="https://wa.me/911234567890" className="contact-button whatsapp">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;