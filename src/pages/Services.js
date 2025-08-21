// import React, { useEffect, useRef, useState } from 'react';
// import '../styles/Services.css';
// import { useInView } from 'react-intersection-observer'; // For scroll-based animations
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // For scroll arrows
// import { Link } from 'react-router-dom';

// // --- Service Images (Replace with your actual image paths) ---
// import serviceImgBackPain from '../assets/images/services/back-pain.jpg';
// import serviceImgNeckPain from '../assets/images/services/neck-pain.jpg';
// import serviceImgHeelPain from '../assets/images/services/heel-pain.jpg';
// import serviceImgMusclePain from '../assets/images/services/muscle.jpg';
// import serviceImgLowerBack from '../assets/images/services/lower-back.jpg';
// import serviceImgArmLeg from '../assets/images/services/arm-leg.jpg';
// import serviceImgShoulder from '../assets/images/services/shoulder-pain.jpg';
// import serviceImgHip from '../assets/images/services/hip.jpg';
// import serviceImgLigament from '../assets/images/services/ligament.jpg';
// import serviceImgPrePostNatal from '../assets/images/services/pre-post-natal.jpeg';
// import serviceImgNumbness from '../assets/images/services/numbness.jpg';
// import serviceImgJointReplacement from '../assets/images/services/joint-replacement.jpg';
// import serviceImgFracture from '../assets/images/services/fracture.jpg';
// import serviceImgSciatica from '../assets/images/services/sciatica.jpg';
// import serviceImgParkinsons from '../assets/images/services/parkinsons.jpg';
// import serviceImgParalysis from '../assets/images/services/paralysis.jpg';
// import serviceImgNeurological from '../assets/images/services/neurological.jpg';
// import serviceImgManualTherapy from '../assets/images/services/manual-therapy.jpg';

// // Service Data
// const allServices = [
//   {
//     id: 'back-pain',
//     name: 'Back Pain Treatment',
//     shortDescription: 'Comprehensive therapy to alleviate acute and chronic back pain.',
//     longDescription: 'Our specialized programs target the root cause of your back pain, offering personalized exercises, manual therapy, and education to restore mobility and prevent recurrence. We help you regain strength and function for a pain-free life.',
//     conditionsTreated: ['Disc herniation', 'Sciatica', 'Muscle strain', 'Osteoarthritis', 'Spondylosis'],
//     benefits: ['Significant pain relief', 'Improved posture', 'Increased flexibility', 'Enhanced core strength', 'Better daily function'],
//     image: serviceImgBackPain,
//   },
//   {
//     id: 'neck-pain',
//     name: 'Neck Pain Treatment',
//     shortDescription: 'Targeted solutions for persistent neck discomfort and stiffness.',
//     longDescription: 'Whether from poor posture, injury, or tension, our neck pain treatments involve gentle mobilization, strengthening exercises, and ergonomic advice. We aim to reduce stiffness, improve range of motion, and alleviate headaches associated with neck issues.',
//     conditionsTreated: ['Whiplash', 'Cervical spondylosis', 'Tension headaches', 'Pinched nerve', 'Tech neck'],
//     benefits: ['Reduced neck stiffness', 'Headache relief', 'Improved neck mobility', 'Better sleep quality', 'Prevention of future pain'],
//     image: serviceImgNeckPain,
//   },
//   {
//     id: 'heel-pain',
//     name: 'Heel Pain Treatment',
//     shortDescription: 'Effective therapies for plantar fasciitis and other heel pain conditions.',
//     longDescription: 'Our approach to heel pain focuses on reducing inflammation, strengthening foot muscles, and improving biomechanics. Treatment includes stretching, orthotic recommendations, and modalities to get you back on your feet comfortably.',
//     conditionsTreated: ['Plantar fasciitis', 'Achilles tendinitis', 'Heel spurs', 'Bursitis'],
//     benefits: ['Reduced heel discomfort', 'Improved walking comfort', 'Faster recovery from injury', 'Stronger foot arch', 'Return to daily activities'],
//     image: serviceImgHeelPain,
//   },
//   {
//     id: 'muscle-pain',
//     name: 'Muscle Pain Management',
//     shortDescription: 'Holistic approaches to soothe and heal sore muscles.',
//     longDescription: 'From general soreness to chronic myofascial pain, our management strategies include deep tissue massage, dry needling, therapeutic exercises, and pain education. We help identify triggers and provide tools for long-term relief and muscle health.',
//     conditionsTreated: ['Myofascial pain syndrome', 'Muscle knots', 'Tension', 'Post-exercise soreness', 'Fibromyalgia'],
//     benefits: ['Immediate pain reduction', 'Increased muscle flexibility', 'Reduced muscle stiffness', 'Improved blood circulation', 'Enhanced recovery'],
//     image: serviceImgMusclePain,
//   },
//   {
//     id: 'lower-back',
//     name: 'Lower Back Pain Therapy',
//     shortDescription: 'Specialized interventions for chronic and acute lower back issues.',
//     longDescription: 'Lower back pain can be debilitating. Our therapy involves specific exercises, spinal mobilization, core stabilization, and posture correction to relieve pressure on nerves, strengthen weakened muscles, and alleviate pain effectively.',
//     conditionsTreated: ['Lumbar strain', 'Sciatica', 'Degenerative disc disease', 'Spondylolisthesis', 'Piriformis syndrome'],
//     benefits: ['Sustainable pain relief', 'Restored lumbar mobility', 'Improved core stability', 'Better posture', 'Enhanced quality of life'],
//     image: serviceImgLowerBack,
//   },
//   {
//     id: 'arm-leg',
//     name: 'Arm & Leg Pain Treatment',
//     shortDescription: 'Comprehensive care for radiating pain in limbs.',
//     longDescription: 'Pain radiating down arms or legs often originates from nerve compression or joint issues. Our treatment focuses on nerve gliding exercises, joint mobilization, and strengthening specific muscle groups to reduce numbness, tingling, and pain.',
//     conditionsTreated: ['Radiculopathy', 'Carpal Tunnel Syndrome', 'Tarsal Tunnel Syndrome', 'Peripheral neuropathy'],
//     benefits: ['Reduced numbness and tingling', 'Alleviated radiating pain', 'Improved limb strength', 'Restored sensation', 'Enhanced daily function'],
//     image: serviceImgArmLeg,
//   },
//   {
//     id: 'shoulder-therapy',
//     name: 'Shoulder Pain Therapy',
//     shortDescription: 'Rehabilitation programs for shoulder injuries and chronic pain.',
//     longDescription: 'Shoulder pain can severely limit daily activities. Our therapy addresses conditions like rotator cuff tears, frozen shoulder, and impingement, using a blend of manual techniques, strengthening, and mobility exercises to restore full function.',
//     conditionsTreated: ['Rotator cuff injuries', 'Frozen shoulder (adhesive capsulitis)', 'Shoulder impingement', 'Bursitis', 'Tendinitis'],
//     benefits: ['Increased range of motion', 'Reduced pain during movement', 'Improved shoulder strength', 'Faster return to activities', 'Enhanced overall shoulder health'],
//     image: serviceImgShoulder,
//   },
//   {
//     id: 'hip-pain',
//     name: 'Hip Pain Treatment',
//     shortDescription: 'Effective treatment for various hip conditions causing discomfort.',
//     longDescription: 'Hip pain can stem from joint issues, muscle imbalances, or nerve problems. Our physiotherapy targets the source of pain through tailored exercises, manual therapy, and gait training to improve hip stability, flexibility, and reduce discomfort.',
//     conditionsTreated: ['Hip osteoarthritis', 'Trochanteric bursitis', 'Hip impingement', 'Piriformis syndrome', 'Labral tear'],
//     benefits: ['Reduced hip pain', 'Improved hip mobility', 'Enhanced balance', 'Increased walking endurance', 'Better participation in sports/activities'],
//     image: serviceImgHip,
//   },
//   {
//     id: 'ligament-injury',
//     name: 'Ligament Injury Rehabilitation',
//     shortDescription: 'Rehabilitation to restore stability and function after ligament injuries.',
//     longDescription: 'Whether it\'s an ankle sprain or a knee ligament tear, our rehabilitation protocols focus on progressive strengthening, balance training, and proprioceptive exercises to ensure full recovery and prevent re-injury, returning you to optimal performance.',
//     conditionsTreated: ['ACL/PCL tears', 'MCL/LCL sprains', 'Ankle sprains', 'Wrist sprains'],
//     benefits: ['Restored joint stability', 'Increased strength around the joint', 'Reduced swelling and pain', 'Prevention of chronic instability', 'Safe return to activity'],
//     image: serviceImgLigament,
//   },
//   {
//     id: 'pre-post-natal',
//     name: 'Pre-Natal & Post-Natal Exercises',
//     shortDescription: 'Safe and effective exercise programs for expectant and new mothers.',
//     longDescription: 'Our specialized programs support women through pregnancy and post-partum recovery. We focus on core strengthening, pelvic floor exercises, posture correction, and general fitness to prepare for childbirth and regain strength afterwards.',
//     conditionsTreated: ['Pelvic girdle pain', 'Diastasis recti', 'Sciatica during pregnancy', 'Postural changes'],
//     benefits: ['Reduced pregnancy-related pain', 'Improved core strength post-partum', 'Enhanced pelvic floor function', 'Easier recovery after childbirth', 'Better physical well-being'],
//     image: serviceImgPrePostNatal,
//   },
//   {
//     id: 'numbness-hands-legs',
//     name: 'Severe Pain & Numbness in Hands and Legs',
//     shortDescription: 'Diagnosis and treatment for nerve-related pain and altered sensation.',
//     longDescription: 'Numbness and severe pain often indicate nerve impingement or damage. Our therapy includes nerve gliding, specific mobilizations, and exercises to alleviate pressure on nerves, restoring sensation and reducing pain and tingling.',
//     conditionsTreated: ['Neuropathy', 'Radiculopathy', 'Carpal Tunnel Syndrome', 'Tarsal Tunnel Syndrome', 'Spinal stenosis'],
//     benefits: ['Alleviated numbness and tingling', 'Reduced nerve pain', 'Improved sensation', 'Enhanced motor control', 'Increased comfort in daily life'],
//     image: serviceImgNumbness,
//   },
//   {
//     id: 'joint-replacement',
//     name: 'Post Joint Replacement Physiotherapy',
//     shortDescription: 'Accelerated recovery programs after knee, hip, or shoulder replacement surgery.',
//     longDescription: 'Physiotherapy is crucial after joint replacement. Our program focuses on pain management, restoring range of motion, progressive strengthening, and gait training to ensure a rapid and complete return to function and independence.',
//     conditionsTreated: ['Total knee replacement', 'Total hip replacement', 'Shoulder replacement'],
//     benefits: ['Faster recovery from surgery', 'Improved joint mobility and strength', 'Reduced post-operative pain', 'Increased independence in daily activities', 'Optimized surgical outcome'],
//     image: serviceImgJointReplacement,
//   },
//   {
//     id: 'fracture-rehab',
//     name: 'Fracture Rehabilitation Exercises',
//     shortDescription: 'Targeted exercises to regain strength and mobility post-fracture.',
//     longDescription: 'After a fracture, immobility can lead to stiffness and weakness. Our rehabilitation begins with gentle exercises and progresses to strengthening and functional training, ensuring proper bone healing and complete restoration of affected limb function.',
//     conditionsTreated: ['Arm fractures', 'Leg fractures', 'Spinal compression fractures', 'Wrist fractures'],
//     benefits: ['Restored bone health and strength', 'Increased joint mobility', 'Reduced swelling', 'Prevention of muscle atrophy', 'Safe return to full activity'],
//     image: serviceImgFracture,
//   },
//   {
//     id: 'sciatica-treatment',
//     name: 'Sciatica Treatment',
//     shortDescription: 'Specialized therapy for relief from radiating sciatic nerve pain.',
//     longDescription: 'Sciatica, characterized by pain radiating from the lower back down the leg, is effectively treated with targeted exercises, nerve gliding, spinal mobilization, and posture correction techniques to decompress the sciatic nerve and alleviate symptoms.',
//     conditionsTreated: ['Lumbar disc herniation', 'Spinal stenosis', 'Piriformis syndrome', 'Spondylolisthesis'],
//     benefits: ['Significant reduction in leg pain', 'Alleviated numbness and tingling', 'Improved lower back mobility', 'Enhanced walking endurance', 'Return to pain-free daily activities'],
//     image: serviceImgSciatica,
//   },
//   {
//     id: 'parkinsons-physio',
//     name: 'Parkinson’s Disease Physiotherapy',
//     shortDescription: 'Specialized exercises to manage symptoms and improve quality of life for Parkinson\'s patients.',
//     longDescription: 'Our physiotherapy for Parkinson\'s focuses on maintaining mobility, improving balance, reducing stiffness, and enhancing gait. Exercises are tailored to address motor symptoms, promoting independence and improving daily function.',
//     conditionsTreated: ['Bradykinesia', 'Tremor', 'Rigidity', 'Postural instability', 'Gait dysfunction'],
//     benefits: ['Improved balance and coordination', 'Reduced risk of falls', 'Enhanced walking ability', 'Increased flexibility and strength', 'Better independence in daily tasks'],
//     image: serviceImgParkinsons,
//   },
//   {
//     id: 'paralysis-rehab',
//     name: 'Paralysis Rehabilitation',
//     shortDescription: 'Comprehensive rehabilitation programs for patients recovering from paralysis.',
//     longDescription: 'Our intensive rehabilitation helps patients regain movement, strength, and function after paralysis caused by stroke, spinal cord injury, or other neurological conditions. We focus on neuroplasticity, functional retraining, and assistive device integration.',
//     conditionsTreated: ['Stroke (hemiplegia, paraplegia)', 'Spinal cord injury', 'Bell\'s Palsy', 'Guillain-Barré Syndrome'],
//     benefits: ['Recovery of lost motor function', 'Increased muscle strength and control', 'Improved balance and coordination', 'Enhanced independence in self-care', 'Better quality of life'],
//     image: serviceImgParalysis,
//   },
//   {
//     id: 'neurological-rehab',
//     name: 'Neurological Rehabilitation',
//     shortDescription: 'Advanced therapies for patients with neurological conditions.',
//     longDescription: 'Our neurological rehabilitation helps individuals with conditions affecting the brain, spinal cord, or nerves. Programs focus on improving balance, coordination, strength, and cognitive functions to maximize independence and functional abilities.',
//     conditionsTreated: ['Stroke', 'Multiple Sclerosis', 'Parkinson\'s Disease', 'Spinal Cord Injury', 'Cerebral Palsy'],
//     benefits: ['Improved motor control and coordination', 'Enhanced balance and stability', 'Increased strength and endurance', 'Better management of spasticity', 'Greater independence in daily activities'],
//     image: serviceImgNeurological,
//   },
//   {
//     id: 'manual-therapy',
//     name: 'Manual Therapy & Massage',
//     shortDescription: 'Hands-on techniques to mobilize joints, reduce pain, and restore movement.',
//     longDescription: 'Manual therapy involves skilled, hands-on techniques including mobilization, manipulation, and massage to treat musculoskeletal pain and dysfunction. It is effective for reducing stiffness, improving range of motion, and alleviating chronic pain.',
//     conditionsTreated: ['Joint stiffness', 'Muscle spasms', 'Headaches', 'Spinal dysfunction', 'Soft tissue restrictions'],
//     benefits: ['Immediate pain relief', 'Increased joint flexibility', 'Reduced muscle tension', 'Improved circulation', 'Faster healing of soft tissues'],
//     image: serviceImgManualTherapy,
//   },
// ];

// const ServiceCard = ({ service, index, inView }) => {
//   return (
//     <div className={`service-detail-card ${inView ? 'animated' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
//       <div className="card-image-wrapper">
//         <img src={service.image} alt={service.name} loading="lazy" />
//       </div>
//       <div className="card-content">
//         <h3>{service.name}</h3>
//         <p className="short-desc">{service.shortDescription}</p>
//         <div className="full-desc-toggle">
//           <p className="long-desc">{service.longDescription}</p>
//           <h4>Conditions We Treat:</h4>
//           <ul>
//             {service.conditionsTreated.map((condition, i) => (
//               <li key={i}>{condition}</li>
//             ))}
//           </ul>
//           <h4>Benefits You'll Experience:</h4>
//           <ul>
//             {service.benefits.map((benefit, i) => (
//               <li key={i}>{benefit}</li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };


// const Services = () => {
//   const scrollRef = useRef(null);
//   const scrollInterval = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);

//   const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
//   const { ref: servicesSectionRef, inView: servicesSectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });

//   // Define stopAutoScroll and startAutoScroll outside useEffect
//   const stopAutoScroll = () => {
//     if (scrollInterval.current) {
//       clearInterval(scrollInterval.current);
//       scrollInterval.current = null; // Clear the ref
//     }
//   };

//   const startAutoScroll = () => {
//     if (!scrollInterval.current && !isHovered && scrollRef.current) {
//       scrollInterval.current = setInterval(() => {
//         const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
//         const maxScrollLeft = scrollWidth - clientWidth;

//         if (scrollLeft >= maxScrollLeft) {
//           scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//         } else {
//           scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//         }
//       }, 3000);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);

//     if (isHovered) {
//       stopAutoScroll();
//     } else {
//       startAutoScroll();
//     }

//     return () => stopAutoScroll();
//   }, [isHovered]);


//   const handleManualScroll = (direction) => {
//     if (scrollRef.current) {
//       stopAutoScroll(); // Now accessible
//       const scrollAmount = 400;
//       if (direction === 'left') {
//         scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
//       } else {
//         scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//       }
//       // Auto-scroll will resume when isHovered becomes false again
//     }
//   };


//   return (
//     <div className="services-page">
//       {/* Hero Section */}
//       <section ref={heroRef} className={`services-hero ${heroInView ? 'in-view' : ''}`}> {/* <-- MODIFIED HERE */}
//         <div className="services-hero-overlay"></div>
//         <div className="services-hero-content animate-fade-in-up">
//           <h1>Our Specialized Physiotherapy Services</h1>
//           <p className="delay-1">Tailored treatments for your unique journey to wellness.</p>
//         </div>
//       </section>

//       {/* Main Services Carousel Section */}
//       <section ref={servicesSectionRef} className={`main-services-section ${servicesSectionInView ? 'in-view' : ''}`}>
//         <div className="container">
//           <div className="section-header">
//             <h2>Comprehensive Care for Every Need</h2>
//             <p className="section-subtitle">Discover how our expert team can help you regain mobility, reduce pain, and improve your quality of life.</p>
//           </div>

//           <div
//             className="services-carousel-wrapper"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <button className="carousel-nav left" onClick={() => handleManualScroll('left')}>
//               <FaChevronLeft />
//             </button>
//             <div className="services-carousel" ref={scrollRef}>
//               {allServices.map((service, index) => (
//                 <ServiceCard key={service.id} service={service} index={index} inView={servicesSectionInView} />
//               ))}
//             </div>
//             <button className="carousel-nav right" onClick={() => handleManualScroll('right')}>
//               <FaChevronRight />
//             </button>
//           </div>
//           <p className="carousel-hint">Hover over cards to pause auto-scroll. Click arrows or drag to navigate.</p>
//         </div>
//       </section>

//       {/* Optional: Add a general CTA section at the end */}
//       <section className="services-cta-section">
//         <div className="container">
//           <h2>Ready to Start Your Recovery?</h2>
//           <p>Contact us today to schedule a consultation and begin your personalized treatment plan.</p>
//           <Link to="/contact" className="cta-button">Schedule Consultation</Link> {/* <-- Link component used here */}
//         </div>
//       </section>
//     </div>
//   );
// };


// export default Services;



import React, { useEffect, useState } from 'react';
import '../styles/Services.css';
import { useInView } from 'react-intersection-observer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // For expand/collapse icons
import { Link } from 'react-router-dom';

// --- Service Images (Ensure correct paths) ---
// Using placeholder images for demonstration. Replace with your actual paths.
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

// Service Data (your existing comprehensive data)
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

// ServiceCard component modified for expandable content
const ServiceCard = ({ service, index, inView, expandedCardId, setExpandedCardId }) => {
  const isExpanded = expandedCardId === service.id;

  const toggleExpand = () => {
    setExpandedCardId(isExpanded ? null : service.id);
  };

  return (
    <div
      className={`service-grid-card ${isExpanded ? 'expanded' : ''} ${inView ? 'animated' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }} // Faster staggered animation for grid
    >
      <div className="card-top-section" onClick={toggleExpand}>
        <div className="card-image-wrapper">
          <img src={service.image} alt={service.name} loading="lazy" /> {/* Lazy loading */}
        </div>
        <div className="card-title-overlay">
          <h3>{service.name}</h3>
        </div>
        <div className="expand-icon-wrapper">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      <div className="card-bottom-section">
        <p className="short-desc">{service.shortDescription}</p>
        {isExpanded && (
          <div className="full-details-content">
            <p className="long-desc">{service.longDescription}</p>
            <h4>Conditions We Treat:</h4>
            <ul>
              {service.conditionsTreated.map((condition, i) => (
                <li key={i}>{condition}</li>
              ))}
            </ul>
            <h4>Benefits You'll Experience:</h4>
            <ul>
              {service.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
            {/* Optional: Add a call to action within the expanded view */}
            <Link to="/appointment" className="expanded-cta-button">
              Book This Service
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};


const Services = () => {
  const [expandedCardId, setExpandedCardId] = useState(null); // State to manage which card is expanded

  // Animation hooks for main sections
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: servicesGridRef, inView: servicesGridInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
  }, []);


  return (
    <div className="services-page">
      {/* Hero Section */}
      <section ref={heroRef} className={`services-hero ${heroInView ? 'in-view' : ''}`}>
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content animate-fade-in-up">
          <h1>Our Specialized Physiotherapy Services</h1>
          <p className="delay-1">Tailored treatments for your unique journey to wellness.</p>
        </div>
      </section>

      {/* Main Services Grid Section */}
      <section ref={servicesGridRef} className={`main-services-grid-section ${servicesGridInView ? 'in-view' : ''}`}>
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Care for Every Need</h2>
            <p className="section-subtitle">Discover how our expert team can help you regain mobility, reduce pain, and improve your quality of life.</p>
          </div>

          <div className="services-grid-container">
            {allServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                inView={servicesGridInView}
                expandedCardId={expandedCardId}
                setExpandedCardId={setExpandedCardId}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Optional: Add a general CTA section at the end */}
      <section className="services-cta-section">
        <div className="container">
          <h2>Ready to Start Your Recovery?</h2>
          <p>Contact us today to schedule a consultation and begin your personalized treatment plan.</p>
          <Link to="/contact" className="cta-button">Schedule Consultation</Link>
        </div>
      </section>
    </div>
  );
};

export default Services;