"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code,
  Bot,
  Smartphone,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "services", "projects", "contact"];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl hidden sm:block">Shovon</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {["home", "services", "projects", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              {["home", "services", "projects", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-sm font-medium py-2 transition-colors ${
                    activeSection === item
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="max-w-xl">
                <div className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium">
                  AI Developer
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Hi, I'm Shovon
                </h1>
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8">
                  I build intelligent solutions with AI. Specializing in
                  chatbots, mobile applications, and custom AI solutions that
                  transform businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => scrollToSection("contact")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Get in Touch
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => scrollToSection("projects")}
                  >
                    View My Work
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 dark:from-purple-600/10 dark:to-indigo-600/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Shovon"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                    <Bot size={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">My Services</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              I offer specialized AI development services tailored to your
              business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot size={40} />,
                title: "AI Chatbot Development",
                description:
                  "Custom chatbots built with GPT and other advanced language models. Perfect for customer support, lead generation, and process automation.",
              },
              {
                icon: <Smartphone size={40} />,
                title: "Mobile App Development",
                description:
                  "AI-powered mobile applications for iOS and Android. Integrate machine learning capabilities into your mobile experience.",
              },
              {
                icon: <Code size={40} />,
                title: "Custom AI Solutions",
                description:
                  "Bespoke AI solutions designed for your specific business challenges. From recommendation systems to predictive analytics.",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="p-6 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group"
              >
                <div className="mb-6 w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Check out some of my recent work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "HealthBot AI",
                description:
                  "An AI-powered healthcare assistant that provides medical information and symptom analysis.",
                tags: ["ChatGPT", "React Native", "Healthcare"],
              },
              {
                title: "RetailGenius",
                description:
                  "Retail analytics platform with AI-driven inventory management and sales forecasting.",
                tags: ["Machine Learning", "React", "E-commerce"],
              },
              {
                title: "LegalAssist",
                description:
                  "AI legal assistant that helps with document analysis and legal research.",
                tags: ["NLP", "Document Analysis", "Legal Tech"],
              },
              {
                title: "SmartHome Voice",
                description:
                  "Voice-controlled smart home assistant with custom wake word detection.",
                tags: ["Voice AI", "IoT", "Mobile App"],
              },
              {
                title: "TravelCompanion",
                description:
                  "AI travel planner that creates personalized itineraries based on preferences.",
                tags: ["Recommendation System", "Mobile App", "Travel"],
              },
              {
                title: "FinanceAdvisor",
                description:
                  "Personal finance advisor that provides investment recommendations and budget tracking.",
                tags: ["Financial AI", "Data Analysis", "Web App"],
              },
            ].map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden group border-0 shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-purple-600/90 to-indigo-600/90 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-30 group-hover:opacity-10 transition-opacity">
                    <img
                      src={`/placeholder.svg?height=400&width=600&text=${project.title}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Get In Touch
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Have a project in mind or want to discuss how AI can help your
                  business? I'm always open to new opportunities and
                  collaborations.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        shovon@example.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <span className="font-bold text-xl">Shovon</span>
              </div>
              <p className="text-slate-400 max-w-md">
                Building intelligent solutions with AI. Transforming businesses
                through innovation.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex gap-4 mb-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
              <p className="text-slate-500 text-sm">
                © {new Date().getFullYear()} Shovon. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
