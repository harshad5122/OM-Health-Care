import React, { useEffect, useState } from 'react';
import '../styles/Team.css';
import { useInView } from 'react-intersection-observer';
import { FaLinkedin, FaFacebook, FaTwitter, FaAngleDown, FaAngleUp } from 'react-icons/fa'; // Icons for social media and expand/collapse
import { Link } from 'react-router-dom'; // Assuming a generic booking link

// --- Team Member Images (Replace with your actual photo) ---
import drGopiPhoto from '../assets/images/therapist1.jpg'; // Path to Dr. Gopi's professional photo

const teamMembersData = [
  {
    id: 'dr-gopi-dholariya',
    name: 'Dr. Gopi Dholariya',
    photo: drGopiPhoto,
    qualification: 'BPT',
    title: 'Lead Physiotherapist',
    specialization: 'Orthopedic & Sports Physiotherapy',
    experience: '4+ Years',
    bio: `Dr. Gopi Dholariya is a highly dedicated and compassionate physiotherapist with over 4 years of experience specializing in orthopedic and sports-related conditions. Her patient-centered approach focuses on evidence-based practices, ensuring personalized treatment plans that lead to optimal recovery and improved quality of life. Dr. Dholariya is passionate about empowering her patients through education and tailored exercise programs, guiding them from pain to peak performance.`,
    achievements: [
      'Certified Dry Needling Practitioner',
      'Advanced Manual Therapy Techniques',
      'Rehabilitation for ACL Injuries',
      'Certified in Postural Correction'
    ],
    socialMedia: {
      linkedin: 'https://www.linkedin.com/in/drgopidholariya',
      facebook: 'https://www.facebook.com/drgopidholariya', // Placeholder
      twitter: 'https://www.twitter.com/drgopidholariya' // Placeholder
    }
  },
  // --- ADD MORE TEAM MEMBERS HERE ---
  // {
  //   id: 'dr-jane-doe',
  //   name: 'Dr. Jane Doe',
  //   photo: 'path/to/dr-jane.jpg',
  //   qualification: 'MPT, OCS',
  //   title: 'Pediatric Physiotherapist',
  //   specialization: 'Pediatric & Neurological Rehab',
  //   experience: '7 Years',
  //   bio: `Dr. Jane Doe brings expertise in pediatric physiotherapy, focusing on developmental delays...`,
  //   achievements: [
  //     'Specialized in Cerebral Palsy rehabilitation',
  //     'Certified in NDT (Neuro-Developmental Treatment)'
  //   ],
  //   socialMedia: {
  //     linkedin: 'https://www.linkedin.com/in/drjanedoe',
  //   }
  // }
];

const TeamMemberCard = ({ member, index, inView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`team-member-card ${isExpanded ? 'expanded' : ''} ${inView ? 'animated' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-header" onClick={toggleExpand}>
        <div className="member-photo-wrapper">
          <img src={member.photo} alt={member.name} loading="lazy" />
        </div>
        <div className="member-info">
          <h3>{member.name} <span className="qualification">{member.qualification}</span></h3>
          <p className="title-spec">{member.title} - {member.specialization}</p>
          <p className="experience">{member.experience} Experience</p>
          <div className="expand-indicator">
            {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </div>

      <div className={`card-details ${isExpanded ? 'active' : ''}`}>
        <div className="details-content">
          <h4>Professional Bio:</h4>
          <p>{member.bio}</p>

          {member.achievements && member.achievements.length > 0 && (
            <>
              <h4>Achievements & Certifications:</h4>
              <ul>
                {member.achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {member.socialMedia && (
            <div className="social-links">
              {member.socialMedia.linkedin && (
                <a href={member.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              )}
              {member.socialMedia.facebook && (
                <a href={member.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
              )}
              {member.socialMedia.twitter && (
                <a href={member.socialMedia.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
              )}
              {/* Add more social media icons as needed */}
            </div>
          )}

          <Link to="/appointment" className="book-appointment-btn">
            Book an Appointment with {member.name.split(' ')[0]}
          </Link>
        </div>
      </div>
    </div>
  );
};


const Team = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation hooks for main sections
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: teamSectionRef, inView: teamSectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="team-page">
      {/* Hero Section */}
      <section ref={heroRef} className={`team-hero ${heroInView ? 'in-view' : ''}`}>
        <div className="team-hero-overlay"></div>
        <div className="team-hero-content animate-fade-in-up">
          <h1>Meet Our Expert Team</h1>
          <p className="delay-1">Dedicated professionals committed to your health and recovery.</p>
        </div>
      </section>

      {/* Team Members Section */}
      <section ref={teamSectionRef} className={`team-members-section ${teamSectionInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Our Compassionate Physiotherapist</h2>
            <p className="section-subtitle">Learn more about the skilled hands that guide your healing journey.</p>
          </div>

          <div className="team-grid">
            {teamMembersData.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} inView={teamSectionInView} />
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Call to Action for Booking */}
      <section className="team-cta-section">
        <div className="container">
          <h2>Ready to Experience Personalized Care?</h2>
          <p>Our team is eager to partner with you on your path to optimal health. Schedule your first consultation today.</p>
          <Link to="/appointment" className="cta-button">Schedule Your Visit</Link>
        </div>
      </section>
    </div>
  );
};

export default Team;