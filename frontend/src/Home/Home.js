import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import {
    Brain,
    Rocket,
    Clock,
    Users,
    Github,
    Code,
    Globe,
    Leaf,
    Trophy,
    Coffee,
    Lightbulb,
    Presentation,
    Star,
    Plus,
    Minus,
    Award,
    Heart,
    Zap,
    Target,
    Shield,
    Database,
    Smartphone,
    Monitor,
    Cloud
} from "lucide-react";

function Home() {
    const [faqs, setFaqs] = useState([
        {
            question: "What is HackStad 2024?",
            answer:
                "HackStad 2024 is a 48-hour hackathon where participants can collaborate to innovate and create projects.",
            isOpen: false,
        },
        {
            question: "How can I register?",
            answer:
                'You can register by clicking the "Register Now" button on the website and filling out the registration form.',
            isOpen: false,
        },
        {
            question: "What are the eligibility criteria?",
            answer:
                "Participants of all skill levels are welcome! You just need to have a passion for technology and innovation.",
            isOpen: false,
        },
        {
            question: "Are there prizes?",
            answer:
                "Yes, there will be exciting prizes for the top projects, along with mentorship opportunities.",
            isOpen: false,
        },
    ]);

    const toggleFAQ = (index) => {
        setFaqs(
            faqs.map((faq, i) =>
                i === index ? { ...faq, isOpen: !faq.isOpen } : faq
            )
        );
    };

    const timelineSteps = [
        {
            icon: Users,
            time: "09:00 AM",
            day: "Day 1",
            title: "Opening Ceremony",
            description: "Welcome speech, rules explanation, and team formation",
        },
        {
            icon: Lightbulb,
            time: "10:00 AM",
            day: "Day 1",
            title: "Ideation Phase",
            description: "Brainstorming and project planning with mentors",
        },
        {
            icon: Code,
            time: "12:00 PM",
            day: "Day 1",
            title: "Hacking Begins",
            description: "Start building your revolutionary project",
        },
        {
            icon: Coffee,
            time: "08:00 PM",
            day: "Day 1",
            title: "Evening Activities",
            description: "Network, mini-games, and relaxation events",
        },
        {
            icon: Star,
            time: "09:00 AM",
            day: "Day 2",
            title: "Checkpoint",
            description: "Progress review and mentor feedback",
        },
        {
            icon: Code,
            time: "02:00 PM",
            day: "Day 2",
            title: "Final Sprint",
            description: "Last push to complete your projects",
        },
        {
            icon: Presentation,
            time: "05:00 PM",
            day: "Day 2",
            title: "Project Submission",
            description: "Submit your project and prepare for demos",
        },
        {
            icon: Trophy,
            time: "07:00 PM",
            day: "Day 2",
            title: "Closing Ceremony",
            description: "Project showcase and winners announcement",
        },
    ];

    const pastHackathons = [
        {
            image:
                "https://www.telecomreviewasia.com/images/stories/2019/10/Hackathon_2019_Junior_Winner-_Education.jpg",
            testimonial:
                "HackStad was an amazing experience! I learned so much and made great friends.",
            name: "John Doe",
        },
        {
            image:
                "https://miro.medium.com/v2/resize:fit:8534/1*yYD0kn7THp5pzvi-YpzvOQ.jpeg",
            testimonial:
                "A fantastic opportunity to showcase my skills and meet industry experts.",
            name: "Jane Smith",
        },
        {
            image:
                "https://analyticsindiamag.com/wp-content/uploads/2020/11/House-Price-Prediction-Challenge-%E2%80%94-Meet-The-Winners-Know-Their-Approach-1024x576.jpg",
            testimonial:
                "I loved the energy and creativity at HackStad. Can't wait for the next one!",
            name: "Alice Johnson",
        },
    ];

    const innovationTracks = [
        {
            icon: Brain,
            title: "AI & Machine Learning",
            description:
                "Explore innovative solutions using artificial intelligence and machine learning techniques.",
        },
        {
            icon: Rocket,
            title: "Web Development",
            description: "Build cutting-edge web applications and services.",
        },
        {
            icon: Globe,
            title: "Blockchain",
            description:
                "Dive into the world of decentralized applications and smart contracts.",
        },
        {
            icon: Leaf,
            title: "Sustainability",
            description:
                "Create projects focused on environmental sustainability and conservation.",
        },
    ];

    const mentors = [
        {
            name: "Dr. Arjun Rajshekhar",
            role: "Manager",
            company: "Raj Reddy centre for Technology and society IIIT-H",
            image: "images/Arjun.jpg",
            experience: "12+ years",
            icon: Brain,
            social: { linkedin: "#", twitter: "#", github: "#" }
        },
        {
            name: "Durga Bhavani Gunnam",
            role: "Senior Research translation enginee",
            company: "Raj Reddy centre for Technology and society  IIIT-H",
            image: "/images/Bhanu.jpg",
            experience: "7+ years",
            icon: Cloud,

            social: { linkedin: "#", twitter: "#", github: "#" }
        },
        {
            name: "Ajay Sigireddy",
            role: "Research engineer",
            company: "Raj Reddy centre for Technology and society  IIIT-H",
            image: "/images/Ajay.jpg",
            experience: "5+ years",
            icon: Target,
            social: { linkedin: "#", twitter: "#", github: "#" }
        }
    ];

    const developers = [
        {
            name: "A Satya Balaji",
            role: "Full Stack Developer",
            tech: ["React", "Node.js", "MongoDB"],
            icon: Monitor,
            projects: 45,
            experience: "5+ years"
        },
        {
            name: "P Dhanunjairam",
            role: "Full Stack Developer",
            tech: ["React", "Node.js", "MongoDB"],
            icon: Smartphone,
            projects: 32,
            experience: "4+ years"
        },
        {
            name: "P Sri Krishna Sai",
            role: "Full Stack Developer",
            tech: ["React", "Node.js", "MongoDB"],
            icon: Database,
            projects: 18,
            experience: "6+ years"
        },
        {
            name: "A Chandhini",
            role: "Frontend Specialist",
            tech: ["Vue.js", "TypeScript", "Sass"],
            icon: Code,
            projects: 22,
            experience: "5+ years"
        },
        {
            name: "R Benayaram",
            role: "Full Stack Developer",
            tech: ["React", "Node.js", "MongoDB"],
            icon: Cloud,
            projects: 29,
            experience: "7+ years"
        },
        {
            name: "P Vaishnavi",
            role: "UI/UX Designer",
            image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
            tech: ["Figma", "Adobe XD", "Framer"],
            icon: Heart,
            projects: 5,
            experience: "1+ years"
        },
        {
            name: "A Padma Sri",
            role: "Backend Engineer",
            tech: ["Python", "Django", "PostgreSQL"],
            icon: Brain,
            projects: 7,
            experience: "2+ years"
        },
        {
            name: "M Rushika Sri",
            role: "Frontend Engineer",
            tech: ["React", "Node.js", "Typescript"],
            icon: Shield,
            projects: 9,
            experience: "3+ years"
        },
        {
            name: "S Rahamath",
            role: "Game Developer",
            tech: ["Unity", "C#", "Blender"],
            icon: Zap,
            projects: 2,
            experience: "5+ years"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                        <div className="relative z-10">
                            {/* Innovation Badge with Animation */}
                            <div className="animate_animated animate_fadeInLeft inline-block mb-4 px-6 py-2 bg-purple-500/20 rounded-full opacity-80">
                                <p className="text-purple-200 text-xl">48 Hours of Innovation</p>
                            </div>
                            {/* Title with Slide-in Animation */}
                            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 animate_animated animatefadeInUp animate_delay-1s">
                                HackStad 2024
                            </h1>
                            {/* Description with Fade-in Animation */}
                            <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto animate_animated animatefadeIn animate_delay-1.5s">
                                Where brilliant minds collide and groundbreaking ideas come to life. Join us for the most innovative hackathon of the year.
                            </p>
                            {/* Call to Action Button with Hover Animation */}
                            <div className="flex justify-center">
                                <a
                                    href="https://discord.gg/eKvhWz2W"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all transform hover:scale-110 hover:translate-y-2 ease-in-out duration-300 animate_animated animate_zoomIn"
                                >
                                    Join our community
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 py-24">
                    <div className="absolute inset-0 bg-opacity-80 bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 z-0"></div>
                    <div className="max-w-7xl mx-auto text-center relative z-10 bg-gray-900 p-16 rounded-xl shadow-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-4xl border-t-8 border-indigo-600">
                        <h2 className="text-4xl font-bold text-white mb-8 animate_animated animatefadeIn animate_delay-0.5s">
                            Why HackStad?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                            <div className="text-center animate_animated animatefadeIn animate_delay-1s">
                                <div className="mb-4 text-indigo-600 text-6xl transition-transform transform hover:scale-110">
                                    <i className="fas fa-code"></i>
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Innovative Challenges</h3>
                                <p className="text-lg text-gray-400">Solve cutting-edge problems with the latest tech and tools.</p>
                            </div>
                            <div className="text-center animate_animated animatefadeIn animate_delay-1.5s">
                                <div className="mb-4 text-indigo-600 text-6xl transition-transform transform hover:scale-110">
                                    <i className="fas fa-users"></i>
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Collaborate & Network</h3>
                                <p className="text-lg text-gray-400">Meet like-minded innovators, share ideas, and build lasting connections.</p>
                            </div>
                            <div className="text-center animate_animated animatefadeIn animate_delay-2s">
                                <div className="mb-4 text-indigo-600 text-6xl transition-transform transform hover:scale-110">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Exciting Prizes</h3>
                                <p className="text-lg text-gray-400">Win amazing prizes and recognition for your groundbreaking work.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About the Hackathon */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400 mb-12">
                            About HackStad
                        </h2>
                        <div className="flex flex-col lg:flex-row lg:space-x-12">
                            {/* Vision Section */}
                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg p-8 mb-6 lg:mb-0">
                                <h3 className="text-3xl font-semibold text-purple-400 mb-4">Our Vision</h3>
                                <p className="text-gray-300 text-lg">
                                    We envision a world where technology acts as a bridge to solving real-world problems, where anyone with the passion to innovate can contribute to a brighter, more connected future. HackStad is a platform that nurtures this vision by fostering a culture of collaboration, creativity, and continuous learning.
                                </p>
                            </div>
                            {/* Values Section */}
                            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-lg p-8">
                                <h3 className="text-3xl font-semibold text-purple-400 mb-4">Our Values</h3>
                                <p className="text-gray-300 text-lg">
                                    At HackStad, we are driven by values that promote growth, inclusivity, and impact. We believe in the power of diverse ideas and encourage individuals from all backgrounds to come together, share knowledge, and build the future.
                                </p>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="mt-16 text-center">
                            <h3 className="text-2xl font-semibold text-gray-300 mb-4">Join Us at HackStad 2024</h3>
                            <p className="text-lg text-gray-200 mb-6">
                                Ready to create, innovate, and be part of an unforgettable journey? HackStad is your chance to challenge yourself, grow, and make connections that last a lifetime. Let's build something amazing together.
                            </p>
                            <Link to="/signup-selection">
                                <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
                                    Register Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                                Meet Our Amazing Team
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                The brilliant minds behind HackStad - experienced mentors and talented developers working together to create an unforgettable hackathon experience.
                            </p>
                        </div>

                        {/* Mentors Section */}
                        <div className="mb-20">
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-bold text-yellow-400 mb-2 flex items-center justify-center">
                                    <Award className="w-10 h-10 mr-3" />
                                    Expert Mentors
                                </h3>
                                <p className="text-lg text-gray-300">Industry leaders here to guide and inspire</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {mentors.map((mentor, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-300/20 hover:border-purple-300/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                                    >
                                        {/* Glowing effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10">
                                            {/* Profile Image */}
                                            <div className="relative mb-6">
                                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-400 to-pink-400 p-1">
                                                    <img
                                                        src={mentor.image}
                                                        alt={mentor.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2">
                                                    <mentor.icon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>

                                            {/* Name and Role */}
                                            <div className="text-center mb-4">
                                                <h4 className="text-2xl font-bold text-white mb-1">{mentor.name}</h4>
                                                <p className="text-purple-300 font-semibold">{mentor.role}</p>
                                                <p className="text-pink-300 text-sm">{mentor.company}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                                <span className="px-3 py-1 bg-pink-400/30 rounded-full text-xs text-pink-200 border border-pink-400/40">
                                                    {mentor.experience}
                                                </span>
                                            </div>




                                            {/* Social Links */}
                                            <div className="flex justify-center space-x-4">
                                                <a href={mentor.social.linkedin} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-lg transition-colors">
                                                    <Users className="w-4 h-4 text-blue-300" />
                                                </a>
                                                <a href={mentor.social.github} className="p-2 bg-gray-500/20 hover:bg-gray-500/40 rounded-lg transition-colors">
                                                    <Github className="w-4 h-4 text-gray-300" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Developers Section */}
                        <div>
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center justify-center">
                                    <Code className="w-10 h-10 mr-3" />
                                    Development Team
                                </h3>
                                <p className="text-lg text-gray-300">The creative force building amazing experiences</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {developers.map((developer, index) => (
                                    <div
                                        key={index}
                                        className="group bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-300/20 hover:border-cyan-300/40 transition-all duration-300 transform hover:scale-105"
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Profile Image */}
                                            <div className="relative flex-shrink-0">
                                                
                                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full p-1">
                                                    <developer.icon className="w-4 h-4 text-white" />
                                                </div>
                                            </div>

                                            {/* Developer Info */}
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white mb-1">{developer.name}</h4>
                                                <p className="text-cyan-300 text-sm font-medium mb-2">{developer.role}</p>


                                                {/* Tech Stack */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {developer.tech.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-indigo-400/20 text-indigo-200 text-xs rounded border border-indigo-400/30"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <span className="flex items-center">
                                                        <Rocket className="w-3 h-3 mr-1" />
                                                        {developer.projects} projects
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {developer.experience}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Stats */}
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Users, label: "Team Members", value: "12", color: "purple" },
                                { icon: Brain, label: "Years Experience", value: "60+", color: "pink" },
                                { icon: Rocket, label: "Projects Built", value: "300+", color: "cyan" },
                                { icon: Heart, label: "Happy Participants", value: "1000+", color: "indigo" }
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className={`text-center p-6 bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 rounded-lg border border-${stat.color}-400/20 hover:border-${stat.color}-400/40 transition-all duration-300 transform hover:scale-105`}
                                >
                                    <stat.icon className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`} />
                                    <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                                    <p className="text-gray-300 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <section className="bg-purple-700 text-white py-16 text-center">
                    <h2 className="text-4xl font-bold mb-10">Event Schedule</h2>
                    <div className="flex flex-wrap justify-center">
                        {timelineSteps.map((step, index) => (
                            <div key={index} className="mx-4 my-6 text-center">
                                <div className="relative w-20 h-20 bg-purple-500 rounded-full text-2xl font-bold flex items-center justify-center shadow-lg">
                                    <step.icon className="w-12 h-12 text-white" />
                                </div>
                                <p className="mt-4 font-semibold">{step.title}</p>
                                <p className="text-sm text-gray-300">
                                    {step.time} | {step.day}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Innovation Tracks */}
                <div className="bg-gray-900 py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-purple-400 mb-8">
                            Innovation Tracks
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {innovationTracks.map((track, index) => (
                                <div key={index} className="bg-white/10 rounded-lg p-6">
                                    <div className="mb-4">
                                        <track.icon className="w-12 h-12 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-purple-400 mb-2">
                                        {track.title}
                                    </h3>
                                    <p className="text-gray-300">{track.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Users, label: "Participants", value: "500+" },
                                { icon: Clock, label: "Hours", value: "48" },
                                { icon: Rocket, label: "Projects", value: "100+" },
                                { icon: Github, label: "Commits", value: "10k+" },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 rounded-lg p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105"
                                >
                                    <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                    <h3 className="text-xl font-bold text-gray-300">{stat.value}</h3>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Past Hackathons */}
                <div className="w-full py-24 bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold mb-16 text-center text-white animate_animated animate_fadeInDown">
                            Past Hackathons
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pastHackathons.map((hackathon, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-900 rounded-lg p-6 shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl animate_animated animatefadeInUp animate_delay-1s"
                                >
                                    <img
                                        src={hackathon.image}
                                        alt={hackathon.name}
                                        className="rounded-lg mb-4 w-full h-40 object-cover border-2 border-pink-400 transition-transform transform hover:scale-110"
                                    />
                                    <p className="text-gray-300 mb-4 italic">"{hackathon.testimonial}"</p>
                                    <p className="text-pink-300 font-semibold text-lg">{hackathon.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-purple-400 mb-12 animate_animated animate_fadeInDown">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`bg-purple-500/20 rounded-lg p-6 shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate__animated ${faq.isOpen ? "animate_fadeInUp" : "animate_fadeIn"
                                        }`}
                                >
                                    <div
                                        onClick={() => toggleFAQ(index)}
                                        className="flex justify-between items-center cursor-pointer"
                                    >
                                        <h3 className="text-lg font-semibold text-purple-400">{faq.question}</h3>
                                        <span
                                            className="text-purple-400 transform transition-transform duration-300"
                                            style={{ transform: faq.isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                        >
                                            {faq.isOpen ? <Minus /> : <Plus />}
                                        </span>
                                    </div>
                                    {faq.isOpen && (
                                        <p className="mt-4 text-gray-300 animate_animated animate_fadeIn">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row-reverse justify-between items-center">
                                {/* Right Side: Contact Us Form */}
                                <div className="md:w-1/2 mb-6 animate_animated animate_fadeInRight">
                                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                        Contact Us
                                    </h2>
                                    <p className="text-md text-gray-200 mb-6">
                                        Reach out to us with your inquiries, we are here to assist you.
                                    </p>
                                    <form className="mt-6 max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-col mb-3">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <textarea
                                                placeholder="Your Message"
                                                className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-105"
                                                rows="3"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 bg-purple-400 text-white rounded-lg font-medium transition-all transform hover:translate-y-[-2px] hover:bg-purple-300 hover:shadow-xl"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </div>

                                {/* Left Side: Our Information */}
                                <div className="md:w-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                                        Our Information
                                    </h3>
                                    <div className="mb-4 p-3 bg-gray-700 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                                        <p className="flex items-center text-md text-gray-300 hover:text-purple-400">
                                            <i className="fas fa-envelope mr-3 text-pink-500"></i> hackathons.hackstad@gmail.com
                                        </p>
                                    </div>
                                    <div className="mb-4 p-3 bg-gray-700 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                                        <p className="flex items-center text-md text-gray-300 hover:text-purple-400">
                                            <i className="fas fa-phone-alt mr-3 text-pink-500"></i> +91 98765 43210
                                        </p>
                                    </div>
                                    <div className="mb-4 p-3 bg-gray-700 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                                        <p className="flex items-center text-md text-gray-300 hover:text-purple-400">
                                            <i className="fas fa-map-marker-alt mr-3 text-pink-500"></i> Kakinada, Andhra Pradesh, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 py-4 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white">
                        <div className="mb-4">
                            <h3 className="text-3xl font-extrabold text-violet-300 mb-2">HackStad</h3>
                            <p className="text-violet-200 text-md">Innovating the Future of Hackathons</p>
                            <p className="text-violet-400 text-xs mt-2">&copy; 2024 HackStad. All rights reserved.</p>
                        </div>
                        <div className="mt-4 border-t border-violet-500 pt-4">
                            <p className="text-violet-200 text-xs">Made with ❤ by the HackStad Team</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Home;
