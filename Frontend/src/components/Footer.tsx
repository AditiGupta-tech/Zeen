import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 relative pt-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[150px] md:h-[180px] lg:h-[200px]"
        >
          <path
            d="M0,0V46.29c47.74,1.4,87.34,21.82,140.12,28.68,65.32,8.53,166.7,17.83,250.14,3.08,
            82.45-14.76,126.93-47.62,256.5-13.04C637.56,87.2,137.93,130.63,0,0Z"
            className="fill-blue-500 opacity-90"
          ></path>
          <path
            d="M0,0V46.29c47.74,1.4,87.34,21.82,140.12,28.68,65.32,8.53,166.7,17.83,250.14,3.08,
            82.45-14.76,126.93-47.62,256.5-13.04C637.56,87.2,137.93,130.63,0,0Z"
            className="fill-blue-400 opacity-70"
            style={{ transform: 'translateX(30px)' }}
          ></path>
          <path
            d="M0,0V46.29c47.74,1.4,87.34,21.82,140.12,28.68,65.32,8.53,166.7,17.83,250.14,3.08,
            82.45-14.76,126.93-47.62,256.5-13.04C637.56,87.2,137.93,130.63,0,0Z"
            className="fill-blue-300 opacity-50"
            style={{ transform: 'translateX(60px)' }}
          ></path>
        </svg>
      </div>

      <div className="absolute top-[85px] md:top-[100px] lg:top-[120px] left-1/2 -translate-x-1/2 flex justify-center space-x-6 z-10 w-full">
        {[
          { href: "https://facebook.com/zeen", icon: Facebook, bg: "bg-blue-600" },
          { href: "https://twitter.com/zeen", icon: Twitter, bg: "bg-sky-500" },
          { href: "https://linkedin.com/company/zeen", icon: Linkedin, bg: "bg-indigo-600" },
          { href: "https://instagram.com/zeen", icon: Instagram, bg: "bg-pink-600" },
          { href: "mailto:info@zeen.com", icon: Mail, bg: "bg-red-500" },
        ].map(({ href, icon: Icon, bg }, idx) => (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${bg} text-white p-2 rounded-full shadow-lg transform transition duration-300 hover:scale-110 hover:rotate-6`}
          >
            <Icon size={24} />
          </a>
        ))}
      </div>

      <div className="max-w-xl lg:max-w-3xl xl:max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 z-10 relative text-center">
        <ul className="mb-6 mt-12 flex flex-wrap justify-center gap-x-4 sm:gap-x-6 text-sm sm:text-base font-semibold">
          {[
            { label: "Home", href: "#home", color: "hover:text-orange-500" },
            { label: "Features", href: "#features", color: "hover:text-blue-500" },
            { label: "Games", href: "#games", color: "hover:text-green-500" },
            { label: "Progress", href: "#progress", color: "hover:text-purple-500" },
            { label: "FAQs", href: "#Faqs", color: "hover:text-orange-500" },
            { label: "Privacy Policy", href: "#privacy", color: "hover:text-blue-500" },
          ].map(({ label, href, color }, idx) => (
            <li key={idx}>
              <a
                href={href}
                className={`text-gray-700 transition-colors duration-300 whitespace-nowrap ${color}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-center text-sm sm:text-base text-gray-600 leading-relaxed space-y-2">
          <p>&copy; {new Date().getFullYear()} <span className="font-bold text-blue-600">Zeen</span>. All rights reserved.</p>
          <p>
            <span className="italic text-gray-700">
              “A magical learning companion for every special child.”
            </span> 🌟
          </p>
          <p className="text-sm text-gray-500 italic">
            Inspired by <span className="font-semibold text-orange-500">"Taare Zameen Par"</span> – making learning accessible and joyful for every child.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;