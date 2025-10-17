import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import service1 from '../assets/images/service1.jpg';
import service2 from '../assets/images/service2.jpg';
import service3 from '../assets/images/service3.jpg';
import service4 from '../assets/images/service4.jpg';
import therapist1 from '../assets/images/therapist1.jpg';

const Home = () => {
	useEffect(() => {
		// Add animation class to elements when component mounts
		const animateElements = () => {
			const elements = document.querySelectorAll('.animate-on-scroll');
			elements.forEach((el) => {
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
			title: 'Sports Injury Rehabilitation',
			description:
				'Specialized treatment for athletes to recover from injuries and enhance performance.',
			image: service1,
		},
		{
			id: 2,
			title: 'Post-Surgical Physiotherapy',
			description:
				'Customized rehabilitation programs to restore mobility after surgery.',
			image: service2,
		},
		{
			id: 3,
			title: 'Back & Neck Pain Therapy',
			description:
				'Effective techniques to relieve chronic back and neck pain.',
			image: service3,
		},
		{
			id: 4,
			title: 'Neurological Rehabilitation',
			description:
				'Advanced therapies for patients with neurological conditions.',
			image: service4,
		},
	];

	const testimonials = [
		{
			id: 1,
			quote: 'Thanks to Om Physio Care, my back pain is gone, and I feel strong again!',
			author: 'Rajesh P.',
		},
		{
			id: 2,
			quote: 'The team helped me recover from my knee surgery faster than expected. Highly recommended!',
			author: 'Priya M.',
		},
		{
			id: 3,
			quote: 'Professional care with personalized attention. My shoulder mobility has improved dramatically.',
			author: 'Amit S.',
		},
	];

	const teamMembers = [
		{
			id: 1,
			name: 'Dr. Gopi Dholariya',
			specialization: 'Physiotherapy',
			image: therapist1,
		},
	];

	return (
		<div className="home pt-[2px] overflow-x-hidden">
			{/* Hero Section */}
			<section className="hero-section">
				<div className="absolute top-0 left-0 w-[100%] h-[100%] z-10 bg-black/50"></div>
				<div className="hero-content relative z-20 max-w-[800px] px-4">
					<h1
						// className="slide-up"
						className="text-[3.8rem] mb-6 leading-[1.2] text-white "
						style={{
							animation: ' slideUp 1s ease-out',
						}}
					>
						Personalized Physiotherapy to Get You Moving Again
					</h1>
					<p
						// className="slide-up"
						className="text-[#e0e0e0] text-[1.4rem] mb-[2.5rem]"
						style={{
							animationDelay: '0.3s',
							animation: 'slideUp 1s ease-out 0.3s forwards',
						}}
					>
						Trusted physiotherapy with modern treatments for faster
						recovery.
					</p>
					<Link
						to="/auth/login"
						className="hero-button slide-up inline-block  text-white px-10 py-4 rounded-[30px] text-[1.2rem] font-semibold shadow-md"
						style={{
							animationDelay: '0.6s',
							transition: 'all 0.3s ease',
							boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
							animation: 'slideUp 1s ease-out 0.6s forwards',
							backgroundColor: 'var(--secondary-color)',
						}}
					>
						Book Appointment
					</Link>
				</div>
			</section>

			<section
				// className="intro-section"
				className="py-20"
				style={{ backgroundColor: 'var(--light-color)' }}
			>
				<div className="container max-w-[1200px] mx-auto px-8">
					<h2 className="section-title fade-in text-[2.2rem] mb-4 relative inline-block text-primary animate-fadeIn">
						Welcome to Om Physio Care
					</h2>
					<p
						className="fade-in"
						style={{ animationDelay: '0.3s' }}
					>
						At Om Physio Care, we believe in providing personalized
						physiotherapy treatments to help you recover faster,
						reduce pain, and improve your quality of life. Our
						evidence-based approach combines the latest techniques
						with compassionate care.
					</p>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-20 bg-[#f0f8ff]">
				<div className="container">
					<h2 className="section-title fade-in text-[2.2rem] mb-4 relative inline-block text-primary animate-fadeIn">
						Our Services
					</h2>
					<p
						className="section-subtitle fade-in text-[1.1rem]  mb-12 max-w-[700px] mx-auto leading-[1.6]"
						style={{
							animationDelay: '0.3s',
							color: 'var(--text-color)',
						}}
					>
						Comprehensive care for all your physiotherapy needs
					</p>

					<div className="services-grid">
						{services.map((service, index) => (
							<div
								key={service.id}
								// className="service-card animate-on-scroll"
								className={`service-card animate-on-scroll bg-white rounded-[10px] overflow-hidden shadow-md text-left flex flex-col h-full transform transition-transform transition-shadow duration-300 hover:-translate-y-2.5 hover:shadow-xl animate-on-scroll`}
								style={{ transitionDelay: `${index * 0.1}s` }}
							>
								<div className="relative w-full h-52 overflow-hidden">
									<img
										src={service.image}
										alt={service.title}
										className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
									/>
									<div className="absolute inset-0 bg-[#1a6f8b]/30 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
								</div>

								<h3 className="text-[22px] mt-6 mb-2 px-6 text-primary">
									{service.title}
								</h3>
								<p className="text-[0.95rem] text-text-color mb-6 px-6 flex-grow">
									{service.description}
								</p>

								<Link
									to={`/services`}
									// className="service-link"
									className="inline-block text-[#1a6f8b] font-semibold px-6 mb-6 transition-colors duration-300 hover:text-[#4caf50]"
								>
									Learn More →
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team Preview Section */}

			<section className="py-20 bg-[#f8f9fa]">
				<div className="container">
					<h2 className="section-title fade-in text-[2.2rem] mb-4 relative inline-block text-primary animate-fadeIn">
						Meet Our Experts
					</h2>
					<p
						className="section-subtitle fade-in text-[1.1rem]  mb-12 max-w-[700px] mx-auto leading-[1.6]"
						style={{
							animationDelay: '0.3s',
							color: 'var(--text-color)',
						}}
					>
						Dedicated professionals committed to your wellness
						journey
					</p>

					<div className="team-grid flex flex-col items-center gap-10 max-w-[1200px] mx-auto px-12 w-full box-border">
						{teamMembers.map((member, index) => (
							<div
								key={member.id}
								className="team-card animate-on-scroll flex bg-white rounded-[12px] overflow-hidden shadow-md w-full max-w-[1100px] transform transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.1)] hover:-translate-y-1.5 hover:shadow-xl animate-on-scroll"
								style={{ transitionDelay: `${index * 0.1}s` }}
							>
								<div className="profile-section flex-[0_0_35%] p-8 flex flex-col items-center justify-center text-center">
									<div className="w-[180px] h-[180px] rounded-full overflow-hidden mb-6 border-4 border-[#4caf50] transition-transform duration-500 ease-in-out hover:scale-105">
										<img
											src={member.image}
											alt={member.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<h3 className="text-[1.5rem] my-2 text-primary">
										{member.name}
									</h3>
									<p className="text-[1rem] text-text-color font-medium mb-0">
										{member.specialization}
									</p>
								</div>

								<div className="bio-section flex-1 bg-[#1a6f8b] text-white p-10 flex items-center">
									<p className="text-white text-[1.05rem] leading-[1.7] m-0">
										Dr. Gopi Dholariya is a highly dedicated
										and compassionate physiotherapist with
										over 4 years of experience specializing
										in orthopedic and sports-related
										conditions. Her patient-centered
										approach focuses on evidence-based
										practices, ensuring personalized
										treatment plans that lead to optimal
										recovery and improved quality of life.
									</p>
								</div>
							</div>
						))}
					</div>

					<Link
						to="/team"
						className="inline-block bg-[#1a6f8b] text-white px-10 py-3 rounded-[30px] text-[1.05rem] font-semibold no-underline mt-14 shadow-md border-2 border-transparent transform transition-all duration-300 ease-in-out hover:bg-transparent hover:text-[#1a6f8b] hover:border-[#1a6f8b] hover:-translate-y-1 hover:shadow-lg animate-on-scroll"
					>
						View Full Team
					</Link>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 bg-[#f0f8ff]">
				<div className="container">
					<h2 className="section-title fade-in text-[2.2rem] mb-4 relative inline-block text-primary animate-fadeIn">
						Patient Testimonials
					</h2>
					<p
						className="section-subtitle fade-in text-[1.1rem]  mb-12 max-w-[700px] mx-auto leading-[1.6]"
						style={{
							animationDelay: '0.3s',
							color: 'var(--text-color)',
						}}
					>
						Hear from those who've experienced our care
					</p>

					<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
						{testimonials.map((testimonial, index) => (
							<div
								key={testimonial.id}
								className="testimonial-card bg-white rounded-[10px] p-8 shadow-sm text-center relative transform transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-md animate-on-scroll"
								style={{ transitionDelay: `${index * 0.1}s` }}
							>
								<div className="text-[4rem] text-[#4caf50] absolute top-[10px] left-5 opacity-20">"</div>
								<p className="text-[1.1rem] leading-[1.8] mb-6 text-[#495057] italic">
									{testimonial.quote}
								</p>
								<p className="font-semibold text-[#1a6f8b] text-base">
									— {testimonial.author}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Contact CTA Section */}
			<section className="py-20 bg-[#1a6f8b] text-white text-center">
				<div className="container">
					<div className="animate-on-scroll">
						<h2 className="text-4xl text-white mb-6">Ready to Start Your Recovery Journey?</h2>
						<p className="text-lg text-white/90 mb-12">
							Contact us today to schedule your first appointment
						</p>
						<div className="contact-buttons flex flex-wrap justify-center gap-6">
							<Link
								to="/contact"
								className="flex items-center gap-2 bg-[var(--secondary-color)] text-white px-8 py-4 rounded-full text-lg font-semibold no-underline shadow-md transition-all duration-300 hover:bg-[#3b8e3f] hover:-translate-y-1 hover:shadow-xl"
							>
								<i className="fas fa-map-marker-alt text-xl"></i> Visit
								Us
							</Link>
							<a
								href="tel:+911234567890"
								className="flex items-center gap-2 bg-[var(--secondary-color)] text-white px-8 py-4 rounded-full text-lg font-semibold no-underline shadow-md transition-all duration-300 hover:bg-[#3b8e3f] hover:-translate-y-1 hover:shadow-xl"
							>
								<i className="fas fa-phone text-xl"></i> Call Now
							</a>
							<a
								href="https://wa.me/911234567890"
								className="flex items-center gap-2 bg-[var(--secondary-color)] text-white px-8 py-4 rounded-full text-lg font-semibold no-underline shadow-md transition-all duration-300 hover:bg-[#3b8e3f] hover:-translate-y-1 hover:shadow-xl whatsapp"
							>
								<i className="fab fa-whatsapp text-xl"></i> WhatsApp
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
