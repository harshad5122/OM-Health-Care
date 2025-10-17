import React, { useEffect, useState } from 'react';
// import '../styles/Team.css';
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
  
];

const TeamMemberCard = ({ member, index, inView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`team-member-card bg-[#fcfdfe] rounded-[15px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] 
    overflow-hidden cursor-pointer flex flex-col self-start
    opacity-0 scale-90 transition-all duration-500 ease-in-out ${isExpanded ? 'expanded' : ''} ${inView ? 'animated' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="card-header" onClick={toggleExpand}>
        <div className="member-photo-wrapper w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-[var(--secondary-color)] shadow-[0_4px_15px_rgba(76,175,80,0.3)] flex-shrink-0">
          <img src={member.photo} alt={member.name} loading="lazy" />
        </div>
        <div className="member-info text-left flex-grow pr-10">
          <h3 className="text-[1.6rem] text-[var(--primary-color)] mb-1 font-bold leading-snug">{member.name} <span className="qualification">{member.qualification}</span></h3>
          <p className="title-spec">{member.title} - {member.specialization}</p>
          <p className="experience">{member.experience} Experience</p>
          <div className="expand-indicator">
            {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
      </div>

      <div className={`card-details  ${isExpanded ? 'active' : ''}`}>
        <div className="details-content px-6 pb-6 text-left">
          <h4 className="text-[1.1rem] text-[var(--secondary-color)] mt-6 mb-2 font-semibold">Professional Bio:</h4>
          <p className="text-[0.95rem] leading-relaxed text-[var(--text-color)] mb-4">{member.bio}</p>

          {member.achievements && member.achievements.length > 0 && (
            <>
              <h4 className="text-[1.1rem] text-[var(--secondary-color)] mt-6 mb-2 font-semibold">Achievements & Certifications:</h4>
              <ul className="list-none p-0 mb-6">
                {member.achievements.map((item, i) => (
                  <li key={i} className="text-[0.9rem] text-[var(--text-color)] leading-snug mb-1 flex items-start"><span className="text-[var(--secondary-color)] mr-2 font-bold">★</span>
            {item}</li>
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
             
            </div>
          )}

          <Link to="/auth/login"  className="inline-block bg-[var(--primary-color)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold no-underline transition-all duration-300 mt-4 shadow-md hover:bg-[#145369] hover:-translate-y-0.5 hover:shadow-lg">
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
    <div className="team-page bg-[#f8fbfd] text-[#333]  overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className={`team-hero relative h-[50vh] min-h-[350px] bg-cover bg-center flex items-center justify-center text-center text-white mb-20 ${heroInView ? 'in-view' : ''}`}>
        <div className="absolute inset-0 bg-[rgba(26,111,139,0.7)] z-[1]"></div>
        <div className="team-hero-content relative z-[2] max-w-[900px] px-4 animate-fade-in-up">
          <h1 className="text-[3.5rem] mb-3 leading-[1.2] font-bold text-white">Meet Our Expert Team</h1>
          <p className="text-[1.5rem] text-white/90 delay-1">Dedicated professionals committed to your health and recovery.</p>
        </div>
      </section>

      {/* Team Members Section */}
      <section ref={teamSectionRef} className={`team-members-section py-20 bg-white rounded-[20px] mx-8 mb-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)] opacity-0 translate-y-[50px] transition-all duration-800 ease-out ${teamSectionInView ? 'in-view' : ''}`}>
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="section-about-header">
            <h2>Our Compassionate Physiotherapist</h2>
            <p className="section-subtitle text-[1.1rem] text-[#495057] mt-8 max-w-[700px] mx-auto leading-relaxed animate-fade-in delay-1">Learn more about the skilled hands that guide your healing journey.</p>
          </div>

          <div className="team-grid">
            {teamMembersData.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} inView={teamSectionInView} />
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Call to Action for Booking */}
      <section className="team-cta-section py-20 bg-[var(--primary-color)] text-white text-center rounded-[20px] mx-8 mb-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <div className="container max-w-[1200px] mx-auto px-8">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Experience Personalized Care?</h2>
          <p className="text-lg text-white/90 mb-12">Our team is eager to partner with you on your path to optimal health. Schedule your first consultation today.</p>
          <Link to="/auth/login" className="inline-block bg-[var(--secondary-color)] text-white px-10 py-4 rounded-[30px] text-xl font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#3b8e3f] hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)]">Schedule Your Visit</Link>
        </div>
      </section>
    </div>
  );
};

export default Team;