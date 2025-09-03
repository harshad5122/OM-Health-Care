
import React, { useEffect, useState } from 'react';
// import '../styles/Services.css';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

// Import all service images (keep your existing imports)

import serviceImgBackPain from '../assets/images/services/back-pain.jpg';
import serviceImgNeckPain from '../assets/images/services/neck-pain.jpg';
import serviceImgHeelPain from '../assets/images/services/heel-pain.jpg';
import serviceImgMusclePain from '../assets/images/services/muscle.jpg'; // Changed from muscle-pain.jpg to muscle.jpg
import serviceImgLowerBack from '../assets/images/services/lower-back.jpg';
import serviceImgArmLeg from '../assets/images/services/arm-leg.jpg';
import serviceImgShoulder from '../assets/images/services/shoulder-pain.jpg'; // Changed from shoulder.jpg to shoulder-pain.jpg
import serviceImgHip from '../assets/images/services/hip.jpg';
import serviceImgLigament from '../assets/images/services/ligament.jpg';
import serviceImgPrePostNatal from '../assets/images/services/pre-post-natal.jpeg'; // Changed from pre-post-natal.jpg to pre-post-natal.jpeg
import serviceImgNumbness from '../assets/images/services/numbness.jpg';
import serviceImgJointReplacement from '../assets/images/services/joint-replacement.jpg';
import serviceImgFracture from '../assets/images/services/fracture.jpg';
import serviceImgSciatica from '../assets/images/services/sciatica.jpg';
import serviceImgParkinsons from '../assets/images/services/parkinsons.jpg';
import serviceImgParalysis from '../assets/images/services/paralysis.jpg';
import serviceImgNeurological from '../assets/images/services/neurological.jpg';
import serviceImgManualTherapy from '../assets/images/services/manual-therapy.jpg';

const allServices = [
  {
    id: 'back-pain',
    name: 'Back Pain Treatment',
    shortDescription: 'Comprehensive therapy to alleviate acute and chronic back pain.',
    longDescription: 'Our specialized programs target the root cause of your back pain, offering personalized exercises, manual therapy, and education to restore mobility and prevent recurrence. We help you regain strength and function for a pain-free life.',
    conditionsTreated: ['Disc herniation', 'Sciatica', 'Muscle strain', 'Osteoarthritis', 'Spondylosis'],
    benefits: ['Significant pain relief', 'Improved posture', 'Increased flexibility', 'Enhanced core strength', 'Better daily function'],
    image: serviceImgBackPain,
  },
  {
    id: 'neck-pain',
    name: 'Neck Pain Treatment',
    shortDescription: 'Targeted solutions for persistent neck discomfort and stiffness.',
    longDescription: 'Whether from poor posture, injury, or tension, our neck pain treatments involve gentle mobilization, strengthening exercises, and ergonomic advice. We aim to reduce stiffness, improve range of motion, and alleviate headaches associated with neck issues.',
    conditionsTreated: ['Whiplash', 'Cervical spondylosis', 'Tension headaches', 'Pinched nerve', 'Tech neck'],
    benefits: ['Reduced neck stiffness', 'Headache relief', 'Improved neck mobility', 'Better sleep quality', 'Prevention of future pain'],
    image: serviceImgNeckPain,
  },
  {
    id: 'heel-pain',
    name: 'Heel Pain Treatment',
    shortDescription: 'Effective therapies for plantar fasciitis and other heel pain conditions.',
    longDescription: 'Our approach to heel pain focuses on reducing inflammation, strengthening foot muscles, and improving biomechanics. Treatment includes stretching, orthotic recommendations, and modalities to get you back on your feet comfortably.',
    conditionsTreated: ['Plantar fasciitis', 'Achilles tendinitis', 'Heel spurs', 'Bursitis'],
    benefits: ['Reduced heel discomfort', 'Improved walking comfort', 'Faster recovery from injury', 'Stronger foot arch', 'Return to daily activities'],
    image: serviceImgHeelPain,
  },
  {
    id: 'muscle-pain',
    name: 'Muscle Pain Management',
    shortDescription: 'Holistic approaches to soothe and heal sore muscles.',
    longDescription: 'From general soreness to chronic myofascial pain, our management strategies include deep tissue massage, dry needling, therapeutic exercises, and pain education. We help identify triggers and provide tools for long-term relief and muscle health.',
    conditionsTreated: ['Myofascial pain syndrome', 'Muscle knots', 'Tension', 'Post-exercise soreness', 'Fibromyalgia'],
    benefits: ['Immediate pain reduction', 'Increased muscle flexibility', 'Reduced muscle stiffness', 'Improved blood circulation', 'Enhanced recovery'],
    image: serviceImgMusclePain,
  },
  {
    id: 'lower-back',
    name: 'Lower Back Pain Therapy',
    shortDescription: 'Specialized interventions for chronic and acute lower back issues.',
    longDescription: 'Lower back pain can be debilitating. Our therapy involves specific exercises, spinal mobilization, core stabilization, and posture correction to relieve pressure on nerves, strengthen weakened muscles, and alleviate pain effectively.',
    conditionsTreated: ['Lumbar strain', 'Sciatica', 'Degenerative disc disease', 'Spondylolisthesis', 'Piriformis syndrome'],
    benefits: ['Sustainable pain relief', 'Restored lumbar mobility', 'Improved core stability', 'Better posture', 'Enhanced quality of life'],
    image: serviceImgLowerBack,
  },
  {
    id: 'arm-leg',
    name: 'Arm & Leg Pain Treatment',
    shortDescription: 'Comprehensive care for radiating pain in limbs.',
    longDescription: 'Pain radiating down arms or legs often originates from nerve compression or joint issues. Our treatment focuses on nerve gliding exercises, joint mobilization, and strengthening specific muscle groups to reduce numbness, tingling, and pain.',
    conditionsTreated: ['Radiculopathy', 'Carpal Tunnel Syndrome', 'Tarsal Tunnel Syndrome', 'Peripheral neuropathy'],
    benefits: ['Reduced numbness and tingling', 'Alleviated radiating pain', 'Improved limb strength', 'Restored sensation', 'Enhanced daily function'],
    image: serviceImgArmLeg,
  },
  {
    id: 'shoulder-therapy',
    name: 'Shoulder Pain Therapy',
    shortDescription: 'Rehabilitation programs for shoulder injuries and chronic pain.',
    longDescription: 'Shoulder pain can severely limit daily activities. Our therapy addresses conditions like rotator cuff tears, frozen shoulder, and impingement, using a blend of manual techniques, strengthening, and mobility exercises to restore full function.',
    conditionsTreated: ['Rotator cuff injuries', 'Frozen shoulder (adhesive capsulitis)', 'Shoulder impingement', 'Bursitis', 'Tendinitis'],
    benefits: ['Increased range of motion', 'Reduced pain during movement', 'Improved shoulder strength', 'Faster return to activities', 'Enhanced overall shoulder health'],
    image: serviceImgShoulder,
  },
  {
    id: 'hip-pain',
    name: 'Hip Pain Treatment',
    shortDescription: 'Effective treatment for various hip conditions causing discomfort.',
    longDescription: 'Hip pain can stem from joint issues, muscle imbalances, or nerve problems. Our physiotherapy targets the source of pain through tailored exercises, manual therapy, and gait training to improve hip stability, flexibility, and reduce discomfort.',
    conditionsTreated: ['Hip osteoarthritis', 'Trochanteric bursitis', 'Hip impingement', 'Piriformis syndrome', 'Labral tear'],
    benefits: ['Reduced hip pain', 'Improved hip mobility', 'Enhanced balance', 'Increased walking endurance', 'Better participation in sports/activities'],
    image: serviceImgHip,
  },
  {
    id: 'ligament-injury',
    name: 'Ligament Injury Rehabilitation',
    shortDescription: 'Rehabilitation to restore stability and function after ligament injuries.',
    longDescription: 'Whether it\'s an ankle sprain or a knee ligament tear, our rehabilitation protocols focus on progressive strengthening, balance training, and proprioceptive exercises to ensure full recovery and prevent re-injury, returning you to optimal performance.',
    conditionsTreated: ['ACL/PCL tears', 'MCL/LCL sprains', 'Ankle sprains', 'Wrist sprains'],
    benefits: ['Restored joint stability', 'Increased strength around the joint', 'Reduced swelling and pain', 'Prevention of chronic instability', 'Safe return to activity'],
    image: serviceImgLigament,
  },
  {
    id: 'pre-post-natal',
    name: 'Pre-Natal & Post-Natal Exercises',
    shortDescription: 'Safe and effective exercise programs for expectant and new mothers.',
    longDescription: 'Our specialized programs support women through pregnancy and post-partum recovery. We focus on core strengthening, pelvic floor exercises, posture correction, and general fitness to prepare for childbirth and regain strength afterwards.',
    conditionsTreated: ['Pelvic girdle pain', 'Diastasis recti', 'Sciatica during pregnancy', 'Postural changes'],
    benefits: ['Reduced pregnancy-related pain', 'Improved core strength post-partum', 'Enhanced pelvic floor function', 'Easier recovery after childbirth', 'Better physical well-being'],
    image: serviceImgPrePostNatal,
  },
  {
    id: 'numbness-hands-legs',
    name: 'Severe Pain & Numbness in Hands and Legs',
    shortDescription: 'Diagnosis and treatment for nerve-related pain and altered sensation.',
    longDescription: 'Numbness and severe pain often indicate nerve impingement or damage. Our therapy includes nerve gliding, specific mobilizations, and exercises to alleviate pressure on nerves, restoring sensation and reducing pain and tingling.',
    conditionsTreated: ['Neuropathy', 'Radiculopathy', 'Carpal Tunnel Syndrome', 'Tarsal Tunnel Syndrome', 'Spinal stenosis'],
    benefits: ['Alleviated numbness and tingling', 'Reduced nerve pain', 'Improved sensation', 'Enhanced motor control', 'Increased comfort in daily life'],
    image: serviceImgNumbness,
  },
  {
    id: 'joint-replacement',
    name: 'Post Joint Replacement Physiotherapy',
    shortDescription: 'Accelerated recovery programs after knee, hip, or shoulder replacement surgery.',
    longDescription: 'Physiotherapy is crucial after joint replacement. Our program focuses on pain management, restoring range of motion, progressive strengthening, and gait training to ensure a rapid and complete return to function and independence.',
    conditionsTreated: ['Total knee replacement', 'Total hip replacement', 'Shoulder replacement'],
    benefits: ['Faster recovery from surgery', 'Improved joint mobility and strength', 'Reduced post-operative pain', 'Increased independence in daily activities', 'Optimized surgical outcome'],
    image: serviceImgJointReplacement,
  },
  {
    id: 'fracture-rehab',
    name: 'Fracture Rehabilitation Exercises',
    shortDescription: 'Targeted exercises to regain strength and mobility post-fracture.',
    longDescription: 'After a fracture, immobility can lead to stiffness and weakness. Our rehabilitation begins with gentle exercises and progresses to strengthening and functional training, ensuring proper bone healing and complete restoration of affected limb function.',
    conditionsTreated: ['Arm fractures', 'Leg fractures', 'Spinal compression fractures', 'Wrist fractures'],
    benefits: ['Restored bone health and strength', 'Increased joint mobility', 'Reduced swelling', 'Prevention of muscle atrophy', 'Safe return to full activity'],
    image: serviceImgFracture,
  },
  {
    id: 'sciatica-treatment',
    name: 'Sciatica Treatment',
    shortDescription: 'Specialized therapy for relief from radiating sciatic nerve pain.',
    longDescription: 'Sciatica, characterized by pain radiating from the lower back down the leg, is effectively treated with targeted exercises, nerve gliding, spinal mobilization, and posture correction techniques to decompress the sciatic nerve and alleviate symptoms.',
    conditionsTreated: ['Lumbar disc herniation', 'Spinal stenosis', 'Piriformis syndrome', 'Spondylolisthesis'],
    benefits: ['Significant reduction in leg pain', 'Alleviated numbness and tingling', 'Improved lower back mobility', 'Enhanced walking endurance', 'Return to pain-free daily activities'],
    image: serviceImgSciatica,
  },
  {
    id: 'parkinsons-physio',
    name: 'Parkinson’s Disease Physiotherapy',
    shortDescription: 'Specialized exercises to manage symptoms and improve quality of life for Parkinson\'s patients.',
    longDescription: 'Our physiotherapy for Parkinson\'s focuses on maintaining mobility, improving balance, reducing stiffness, and enhancing gait. Exercises are tailored to address motor symptoms, promoting independence and improving daily function.',
    conditionsTreated: ['Bradykinesia', 'Tremor', 'Rigidity', 'Postural instability', 'Gait dysfunction'],
    benefits: ['Improved balance and coordination', 'Reduced risk of falls', 'Enhanced walking ability', 'Increased flexibility and strength', 'Better independence in daily tasks'],
    image: serviceImgParkinsons,
  },
  {
    id: 'paralysis-rehab',
    name: 'Paralysis Rehabilitation',
    shortDescription: 'Comprehensive rehabilitation programs for patients recovering from paralysis.',
    longDescription: 'Our intensive rehabilitation helps patients regain movement, strength, and function after paralysis caused by stroke, spinal cord injury, or other neurological conditions. We focus on neuroplasticity, functional retraining, and assistive device integration.',
    conditionsTreated: ['Stroke (hemiplegia, paraplegia)', 'Spinal cord injury', 'Bell\'s Palsy', 'Guillain-Barré Syndrome'],
    benefits: ['Recovery of lost motor function', 'Increased muscle strength and control', 'Improved balance and coordination', 'Enhanced independence in self-care', 'Better quality of life'],
    image: serviceImgParalysis,
  },
  {
    id: 'neurological-rehab',
    name: 'Neurological Rehabilitation',
    shortDescription: 'Advanced therapies for patients with neurological conditions.',
    longDescription: 'Our neurological rehabilitation helps individuals with conditions affecting the brain, spinal cord, or nerves. Programs focus on improving balance, coordination, strength, and cognitive functions to maximize independence and functional abilities.',
    conditionsTreated: ['Stroke', 'Multiple Sclerosis', 'Parkinson\'s Disease', 'Spinal Cord Injury', 'Cerebral Palsy'],
    benefits: ['Improved motor control and coordination', 'Enhanced balance and stability', 'Increased strength and endurance', 'Better management of spasticity', 'Greater independence in daily activities'],
    image: serviceImgNeurological,
  },
  {
    id: 'manual-therapy',
    name: 'Manual Therapy & Massage',
    shortDescription: 'Hands-on techniques to mobilize joints, reduce pain, and restore movement.',
    longDescription: 'Manual therapy involves skilled, hands-on techniques including mobilization, manipulation, and massage to treat musculoskeletal pain and dysfunction. It is effective for reducing stiffness, improving range of motion, and alleviating chronic pain.',
    conditionsTreated: ['Joint stiffness', 'Muscle spasms', 'Headaches', 'Spinal dysfunction', 'Soft tissue restrictions'],
    benefits: ['Immediate pain reduction', 'Increased joint flexibility', 'Reduced muscle tension', 'Improved circulation', 'Faster healing of soft tissues'],
    image: serviceImgManualTherapy,
  },
];

// Service Data (keep your existing allServices array)

const ServiceCard = ({ service, index, inView, onViewMore }) => {
  return (
    <div
      className={`service-grid-card bg-[#fcfdfe] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] 
              flex flex-col overflow-hidden transform scale-90 opacity-0 
              transition-all duration-400 ease-in-out 
              hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] ${inView ? 'animated' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative overflow-hidden h-[250px]">
        <div className="card-image-wrapper">
          <img src={service.image} alt={service.name} loading="lazy" />
        </div>
        <div className="absolute bottom-0 left-0 w-full pb-4 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,0)] text-white z-10 px-4">
          <h3 className="text-2xl font-semibold text-white">{service.name}</h3>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-base text-gray-700 leading-relaxed mb-6">{service.shortDescription}</p>
        <button 
          className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-full 
                 text-sm font-semibold shadow-md mt-auto self-start 
                 transition-all duration-300 hover:bg-[#145369] 
                 hover:-translate-y-0.5 hover:shadow-lg self-center"
          onClick={() => onViewMore(service)}
        >
          View More
        </button>
      </div>
    </div>
  );
};


const ServiceModal = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] p-4" onClick={onClose}>
      <div className="modal-content bg-white rounded-2xl max-w-[900px] w-full max-h-[90vh] overflow-y-auto relative 
               shadow-[0_25px_50px_rgba(0,0,0,0.3)] flex flex-col" onClick={e => e.stopPropagation()}>
        <button className="absolute top-6 right-6 text-gray-500 text-xl 
                 w-10 h-10 flex items-center justify-center rounded-full
                 hover:text-[var(--primary-color)] hover:bg-black/5
                 transition-all duration-300 ease-in-out hover:rotate-90" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="modal-grid-container">
          <div className="modal-image-container w-[300px] h-[300px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
            <img src={service.image} alt={service.name} />
          </div>
          
          <div className="modal-text-content p-8">
            <h3 className="text-2xl text-[var(--primary-color)] mb-4 font-bold">{service.name}</h3>
            <p className="text-[1.1rem] text-[#555] leading-relaxed mb-5 font-medium">{service.shortDescription}</p>
            <p className="text-[0.95rem] text-[var(--text-color)] leading-snug mb-0">{service.longDescription}</p>
          </div>
        </div>
        
        <div className="modal-details-grid">
          <div className="modal-details-column conditions-column">
            <h4 className="text-[1.1rem] text-[#38a169] mb-[1.2rem] font-semibold tracking-[0.5px] uppercase flex items-start gap-[0.5rem] pl-[15%]">Conditions We Treat</h4>
            <ul className="list-none p-0 m-0">
              {service.conditionsTreated.map((condition, i) => (
                <li key={i} className="text-[0.95rem] text-[var(--text-color)] leading-[1.7] mb-2 relative flex items-start gap-2 pl-[20%] justify-start">
                  <span className="bullet-icon">•</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="modal-details-column benefits-column">
            <h4 className="text-[1.1rem] text-[#38a169] mb-[1.2rem] font-semibold tracking-[0.5px] uppercase flex items-start gap-[0.5rem] pl-[15%]">Benefits You'll Experience</h4>
            <ul className="list-none p-0 m-0">
              {service.benefits.map((benefit, i) => (
                <li key={i} className="text-[0.95rem] text-[var(--text-color)] leading-[1.7] mb-2 relative flex items-start gap-2 pl-[20%] justify-start">
                  <span className="bullet-icon">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pb-[20px]">
          <Link to="/appointment" className="modal-cta-button inline-block bg-gradient-to-br from-[var(--primary-color)] to-[#1a6f8b] text-white px-10 py-2 rounded-[30px] text-base font-semibold no-underline transition-all duration-300 shadow-[0_4px_15px_rgba(26,111,139,0.3)] border-0 cursor-pointer hover:bg-[#145369] hover:-translate-y-[3px] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3)]">
            Book This Service
          </Link>
        </div>
      </div>
    </div>
  );
};


const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  // const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: servicesGridRef, inView: servicesGridInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleViewMore = (service) => {
    setSelectedService(service);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const handleCloseModal = () => {
    setSelectedService(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="pt-5 bg-[#f8fbfd] text-[#333] overflow-x-hidden">
      {/* Hero Section (keep your existing hero section) */}
      
      {/* Main Services Grid Section */}
      <section ref={servicesGridRef} className={`main-services-grid-section py-20 bg-white rounded-[20px] mx-8 mb-20 shadow-[0_10px_40px_rgba(0,0,0,0.05)] opacity-0 translate-y-[50px] transition-opacity transition-transform duration-800 ease-out ${servicesGridInView ? 'in-view' : ''}`}>
        <div className="container max-w-[1200px] mx-auto px-8">
          <div className="section-header">
            <h2>Comprehensive Care for Every Need</h2>
            <p className="section-subtitle text-[1.1rem] text-[#495057] mt-8 max-w-[700px] mx-auto leading-relaxed animate-fade-in delay-1">Discover how our expert team can help you regain mobility, reduce pain, and improve your quality of life.</p>
          </div>

          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {allServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                inView={servicesGridInView}
                onViewMore={handleViewMore}
              />
            ))}
          </div>
        </div>
      </section>

      
      <ServiceModal service={selectedService} onClose={handleCloseModal} />
    </div>
  );
};

export default Services;