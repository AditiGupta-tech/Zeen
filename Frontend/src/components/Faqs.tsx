import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "./Card";

const faqItems = [
  {
    question: "What is Zeen?",
    answer:
      "Zeen is a magical learning companion designed for every special child. We believe every star shines differently, and Zeen provides a unique, engaging platform for learning and growth.",
    color: "blue", 
  },
  {
    question: "How does Zeen help children learn?",
    answer:
      "Through interactive games, a friendly voice assistant named Ishaan, guided meditation, and progress tracking, Zeen makes learning an exciting adventure tailored to each child's pace and preferences.",
    color: "orange",
  },
  {
    question: "Is Zeen suitable for all children?",
    answer:
      "Zeen is thoughtfully designed to cater to diverse learning styles and needs. While inspired by 'special children,' its engaging content and adaptive features can benefit any child looking for a fun and supportive learning environment.",
    color: "green",
  },
  {
    question: "What makes Zeen unique?",
    answer:
      "Zeen combines cutting-edge AI (Ishaan's voice), playful gamification, mindfulness practices, and personalized progress insights into one enchanting platform, making it a truly holistic learning experience.",
    color: "purple",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-100 to-blue-200 border-blue-300 text-blue-800";
      case "orange":
        return "from-orange-100 to-orange-200 border-orange-300 text-orange-800";
      case "green":
        return "from-green-100 to-green-200 border-green-300 text-green-800";
      case "purple":
        return "from-purple-100 to-purple-200 border-purple-300 text-purple-800";
      default:
        return "from-gray-100 to-gray-200 border-gray-300 text-gray-800";
    }
  };

  const getButtonColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600 hover:text-blue-800";
      case "orange":
        return "text-orange-600 hover:text-orange-800";
      case "green":
        return "text-green-600 hover:text-green-800";
      case "purple":
        return "text-purple-600 hover:text-purple-800";
      default:
        return "text-gray-600 hover:text-gray-800";
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50 bg-opacity-70 backdrop-blur-sm relative z-20">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 bg-clip-text text-transparent leading-tight animate-fade-in">
          Curious About Zeen? We've Got Answers!
        </h2>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <Card
              key={index}
              className={`p-6 border-2 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl rounded-3xl ${getColorClasses(
                item.color
              )} ${openIndex === index ? "shadow-2xl scale-[1.02]" : ""}`}
            >
              <button
                className={`flex justify-between items-center w-full text-left font-semibold text-lg cursor-pointer focus:outline-none ${getButtonColorClasses(
                  item.color
                )}`}
                onClick={() => handleToggle(index)}
              >
                <span className="flex items-center">
                  {item.question}{" "}
                </span>
                <ChevronDown
                  className={`h-6 w-6 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <p
                  className={`mt-4 text-base leading-relaxed animate-fade-in-down ${
                    item.color === "blue"
                      ? "text-blue-700"
                      : item.color === "orange"
                      ? "text-orange-700"
                      : item.color === "green"
                      ? "text-green-700"
                      : item.color === "purple"
                      ? "text-purple-700"
                      : ""
                  }`}
                >
                  {item.answer}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
