import { UserPlus, LogIn, BookOpen, MessageSquare, Star, Zap, TrendingUp, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WithoutAuth() {
  const benefits = [
    {
      icon: <BookOpen className="w-10 h-10 text-orange-500" />,
      title: "Tailored Learning Paths",
      description: "Personalized content and strategies for unique learning styles."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-blue-500" />,
      title: "Insightful Progress Tracking",
      description: "Visualize growth, celebrate milestones, pinpoint areas for support."
    },
    {
      icon: <MessageSquare className="w-10 h-10 text-purple-500" />,
      title: "Connect & Collaborate",
      description: "Join a vibrant community, access expert advice, and workshops."
    },
    {
      icon: <Star className="w-10 h-10 text-yellow-500" />,
      title: "Exclusive Resource Library",
      description: "Curated premium articles, interactive games, and printables."
    },
    {
      icon: <Zap className="w-10 h-10 text-pink-500" />,
      title: "Engaging Interactive Tools",
      description: "Fun, stimulating activities for effective skill reinforcement."
    },
    {
      icon: <Compass className="w-10 h-10 text-teal-500" />,
      title: "Empowering Parent Workshops",
      description: "Live sessions by experts, equipping you with knowledge and confidence."
    }
  ];

  return (
    <section className="px-4 md:px-12 py-16 text-gray-800 text-center animate-fadeIn
                         bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">

      <div className="relative z-10 max-w-4xl mx-auto mb-10 text-center" data-aos="fade-up">
        <h1 className="text-4xl mt-10 md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to bg-pink-400
                       animate-textGlow drop-shadow-md mb-4">
          <span className="inline-block text-green-500 animate-pulse">Personalize</span> Your Journey
        </h1>

        <p className="text-lg md:text-xl text-gray-700 text-center mx-auto font-medium">
          Join the <strong className="text-orange-600">ZEEN</strong> family for exclusive content, AI-powered insights, and a supportive community tailored to your child’s unique needs.
        </p>

        <div className="flex flex-col mt-12 sm:flex-row justify-center gap-6 mb-16">
          {/* Sign Up Button  */}
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center px-10 py-3 rounded-full font-semibold text-lg text-white bg-gradient-to-r from-red-600 to bg-pink-600
                       shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300
                       overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 rounded-full transition-all duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <UserPlus className="w-5 h-5 group-hover:rotate-6 transform transition-transform duration-300" />
              Sign Up Free
            </span>
          </Link>

          {/* Log In Button */}
          <Link
            to="/login"
            className="group relative inline-flex items-center justify-center px-10 py-3 rounded-full font-semibold text-lg text-blue-700 bg-white
                       border-2 border-transparent transition-all duration-300 ease-in-out shadow-sm hover:shadow-md
                       hover:scale-105 hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-0" />
            <span className="relative z-10 flex items-center gap-2">
              <LogIn className="w-5 h-5 transition-transform group-hover:-translate-x-1 duration-300" />
              Log In
            </span>
          </Link>
        </div>

      </div>

      {/* BENEFITS SECTION */}
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4B90FE] to-[#8E66CB] mb-12 relative z-10 animate-fade-in-up">
        What You Get with a Personalized Account
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            data-aos="zoom-in-up"
            data-aos-delay={index * 150}
            className="group relative bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center cursor-pointer transition-all duration-500 ease-out
                         hover:scale-[1.04] hover:rotate-1 hover:shadow-2xl hover:shadow-blue-300/50"
          >
            <div className="relative z-20 flex flex-col items-center">
              <div className="p-5 bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100 rounded-full mb-5 shadow-lg ring-4 ring-transparent
                               group-hover:ring-white group-hover:ring-opacity-80 transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">{benefit.description}</p>
            </div>

            <div className="absolute inset-0 rounded-3xl bg-blue-400 opacity-0 group-hover:opacity-10 group-hover:animate-pulseLight transition-opacity duration-300 z-0"></div>

            <style jsx>{`
              .group:hover {
                transform: perspective(1000px) rotateX(3deg) rotateY(-3deg);
              }
            `}</style>
          </div>
        ))}
      </div>

    </section>
  );
}