import React, { useEffect } from 'react';
// import '../styles/About.css';
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
	const { ref: storyRef, inView: storyInView } = useInView({
		triggerOnce: true,
		threshold: 0.2,
	});
	const { ref: facilityRef, inView: facilityInView } = useInView({
		triggerOnce: true,
		threshold: 0.2,
	});
	const { ref: whyChooseUsRef, inView: whyChooseUsInView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	// Optional: Scroll to top on component mount
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="about-page pt-[5px] bg-[#f8fbfd] text-[#333] overflow-x-hidden">
			{/* Hero Section */}
			<section className="about-hero relative h-[50vh] min-h-[350px]  flex items-center justify-center text-center text-white mb-20">
				<div className="absolute top-0 left-0 w-[100%] h-[100%] bg-[rgba(26,111,139,0.7)] z-10"></div>
				<div className="about-hero-content relative z-20 max-w-[900px] px-4">
					<h1 className="text-[3.5rem] mb-3 leading-tight font-bold text-white animate-fade-in-up">
						Our Journey to Your Well-being
					</h1>
					<p className="text-[1.5rem] text-white/90 animate-fade-in-up delay-100">
						Discover the Heart of Om Health Care
					</p>
				</div>
			</section>

			{/* Clinic Story & Philosophy */}
			<section
				ref={storyRef}
				className={`clinic-story-section opacity-0 translate-y-12 transition-all duration-800 ease-out bg-white rounded-[20px] mx-8 mb-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)] py-20  ${
					storyInView ? 'in-view' : ''
				}`}
			>
				<div className="container max-w-[1200px] mx-auto px-8">
					<div className="section-about-header text-center mb-16">
						<h2>Our Story & Philosophy</h2>
						<p className="section-subtitle text-[1.1rem] text-[#495057] mt-8 max-w-[700px] mx-auto leading-relaxed animate-fade-in delay-1">
							Rooted in care, growing with trust.
						</p>
					</div>

					<div className="story-content flex items-center gap-12">
						<div className="story-text animate-slide-right flex-1 text-[1.1rem] leading-[1.8] text-[#495057]">
							<p className="mb-6">
								<strong className="text-[#1a6f8b] font-semibold">
									Om Health Care
								</strong>{' '}
								was founded with a profound vision: to transform
								the physiotherapy experience by providing
								unparalleled, patient-centered care in a
								compassionate and supportive environment. Our
								journey began with a simple belief – that true
								healing extends beyond treating symptoms; it
								involves understanding each individual's unique
								needs, challenges, and aspirations.
							</p>
							<p>
								We started as a small clinic, driven by a
								commitment to excellence and a passion for
								empowering our patients. Over the years, we've
								grown, but our core philosophy remains
								unchanged: **Every patient deserves dedicated,
								one-to-one attention.** This commitment ensures
								that each treatment plan is meticulously
								tailored, guiding you towards faster recovery
								and sustainable well-being. We're not just about
								fixing problems; we're about building lasting
								health partnerships.
							</p>
						</div>
						<div className="story-images animate-slide-left flex-[0.8] flex justify-center items-center relative min-h-[350px]">
							<div className="image-stack relative w-full h-full pb-[60%]">
								<div className="image-wrapper image-1 absolute w-[70%] h-[70%] top-0 left-0 z-[2] rounded-[15px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-in-out hover:scale-[1.03] hover:rotate-0 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:z-[3]">
									<img
										src={clinicStoryImg1}
										alt="Clinic Founder/Team"
										className="w-full h-full object-cover block"
									/>
								</div>
								<div className="image-wrapper image-2 absolute w-[70%] h-[70%] bottom-0 right-0 z-[1] rounded-[15px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-in-out hover:scale-[1.03] hover:rotate-0 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:z-[3] brightness-90">
									<img
										src={clinicStoryImg2}
										alt="Clinic Interior"
										className="w-full h-full object-cover block"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section
				ref={facilityRef}
				className={`pb-24 bg-[var(--light-color)] ${
					facilityInView ? 'in-view' : ''
				}`}
			>
				<div className="container max-w-[1200px] mx-auto px-8">
					<div className="section-about-header text-center mb-16">
						<h2 className="animate-scale-in">
							Our State-of-the-Art Facility
						</h2>
						<p className="section-subtitle text-[1.1rem] text-[#495057] mt-8 max-w-[700px] mx-auto leading-relaxed animate-fade-in delay-1">
							Designed for healing, equipped for excellence.
						</p>
					</div>

					<div className="facility-grid">
						<div className="facility-item facility-item-lg animate-fade-in-up">
							<img
								src={facilityImg1}
								alt="Spacious Treatment Room"
							/>
							<div className="facility-caption">
								Spacious & Modern Treatment Rooms
							</div>
						</div>
						<div className="facility-item facility-item-md animate-fade-in-up delay-1">
							<img
								src={facilityImg2}
								alt="Advanced Exercise Area"
							/>
							<div className="facility-caption">
								Advanced Rehabilitation Gym
							</div>
						</div>
						<div className="facility-item facility-item-sm animate-fade-in-up delay-2">
							<img
								src={facilityImg3}
								alt="Comfortable Waiting Area"
							/>
							<div className="facility-caption">
								Comfortable Patient Lounge
							</div>
						</div>
						<div className="facility-item facility-item-vert animate-fade-in-up delay-3">
							<img
								src={facilityImg4}
								alt="Specialized Therapy Equipment"
							/>
							<div className="facility-caption">
								Cutting-Edge Therapy Equipment
							</div>
						</div>
						<div className="facility-item  facility-item-i2 animate-fade-in-up delay-4">
							<img
								src={facilityImg5}
								alt="Hydrotherapy Pool"
							/>
							<div className="facility-caption">
								Hydrotherapy Pool
							</div>
						</div>
						<div className="facility-item facility-item-set animate-fade-in-up delay-5">
							<img
								src={facilityImg6}
								alt="Private Consultation Room"
							/>
							<div className="facility-caption">
								Private Consultation Suites
							</div>
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
							<div className="facility-caption">
								Virtual Facility Tour
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section
				ref={whyChooseUsRef}
				className={`why-choose-us-section py-20 bg-white rounded-[20px] mx-8 mb-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)] ${
					whyChooseUsInView ? 'in-view' : ''
				}`}
			>
				<div className="container max-w-[1200px] mx-auto px-8">
					<div className="section-about-header text-center mb-16">
						<h2 className="animate-scale-in">
							Why Choose Om Health Care?
						</h2>
						<p className="section-subtitle text-[1.1rem] text-[#495057] mt-8 max-w-[700px] mx-auto leading-relaxed animate-fade-in delay-1">
							Your trusted partner in recovery and wellness.
						</p>
					</div>

					<div className="benefits-grid">
						<div className="benefit-card animate-zoom-in">
							<div className="icon-wrapper">
								<img
									src={iconExperienced}
									alt="Experienced Icon"
								/>
							</div>
							<h3 className="text-[1.3rem] text-[var(--primary-color)] mb-3 font-semibold">
								Experienced & Certified Physiotherapists
							</h3>
							<p className="text-[0.95rem] leading-relaxed text-[var(--text-color)]">
								Our team comprises highly qualified, seasoned
								professionals passionate about delivering
								exceptional results.
							</p>
						</div>
						<div className="benefit-card animate-zoom-in delay-1">
							<div className="icon-wrapper">
								<img
									src={iconModernEq}
									alt="Equipment Icon"
								/>
							</div>
							<h3 className="text-[1.3rem] text-[var(--primary-color)] mb-3 font-semibold">
								Modern Equipment & Updated Techniques
							</h3>
							<p className="text-[0.95rem] leading-relaxed text-[var(--text-color)]">
								We leverage cutting-edge technology and
								evidence-based methods for the most effective
								treatments.
							</p>
						</div>
						<div className="benefit-card animate-zoom-in delay-2">
							<div className="icon-wrapper">
								<img
									src={iconPersonalized}
									alt="Personalized Icon"
								/>
							</div>
							<h3 className="text-[1.3rem] text-[var(--primary-color)] mb-3 font-semibold">
								One-to-One Personalized Care
							</h3>
							<p className="text-[0.95rem] leading-relaxed text-[var(--text-color)]">
								Receive undivided attention and a treatment plan
								meticulously crafted for your unique needs and
								goals.
							</p>
						</div>
						<div className="benefit-card animate-zoom-in delay-3">
							<div className="icon-wrapper">
								<img
									src={iconWideRange}
									alt="Wide Range Icon"
								/>
							</div>
							<h3 className="text-[1.3rem] text-[var(--primary-color)] mb-3 font-semibold">
								Wide Range of Specialized Treatments
							</h3>
							<p className="text-[0.95rem] leading-relaxed text-[var(--text-color)]">
								From sports injuries to neurological
								rehabilitation, we offer comprehensive care
								under one roof.
							</p>
						</div>
						<div className="benefit-card animate-zoom-in delay-4">
							<div className="icon-wrapper">
								<img
									src={iconLongTerm}
									alt="Long-Term Icon"
								/>
							</div>
							<h3 className="text-[1.3rem] text-[var(--primary-color)] mb-3 font-semibold">
								Focus on Long-Term Recovery
							</h3>
							<p className="text-[0.95rem] leading-relaxed text-[var(--text-color)]">
								Our aim is not just quick fixes, but empowering
								you with tools for lasting health and pain
								prevention.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default About;
