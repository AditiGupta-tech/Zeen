import { useEffect, useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  XCircle,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import ResourcesSection from "../components/ResourcesSection";
import AboutDyslexia from "../components/AboutDyslexia";

interface Review {
  id: string | number;
  name: string;
  text: string;
  rating: number;
  likes: number;
  dislikes: number;
  userAction: "like" | "dislike" | null;
  canDelete: boolean;
}

interface Story {
  title: string;
  text: string;
  upvotes: number;
  userUpvoted: boolean;
}

export default function ParentsSection() {
  const [showModal, setShowModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [rating, setRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("Parent");
  const [email, setEmail] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [motivationalStories, setMotivationalStories] = useState<Story[]>([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    async function fetchData() {
      try {
        const [reviewsRes, storiesRes] = await Promise.all([
          fetch("/data/reviews.json"),
          fetch("/data/motivationalStories.json"),
        ]);

        const reviewsData = await reviewsRes.json();
        const storiesData = await storiesRes.json();

        setReviews(
          reviewsData.map((review: any, index: number) => ({
            ...review,
            id: `initial-${index}`,
            likes: 0,
            dislikes: 0,
            userAction: null,
            canDelete: false,
          }))
        );

        setMotivationalStories(
          storiesData.map((story: any) => ({
            ...story,
            upvotes: 0,
            userUpvoted: false,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, []);

  const handleReviewVote = (
    index: number,
    type: "like" | "dislike"
  ) => {
    setReviews((prevReviews) =>
      prevReviews.map((review, i) => {
        if (i !== index) return review;

        const updated = { ...review };

        if (type === "like") {
          if (updated.userAction === "like") {
            updated.likes = Math.max(0, updated.likes - 1);
            updated.userAction = null;
          } else {
            if (updated.userAction === "dislike") {
              updated.dislikes = Math.max(0, updated.dislikes - 1);
            }
            updated.likes += 1;
            updated.userAction = "like";
          }
        } else {
          if (updated.userAction === "dislike") {
            updated.dislikes = Math.max(0, updated.dislikes - 1);
            updated.userAction = null;
          } else {
            if (updated.userAction === "like") {
              updated.likes = Math.max(0, updated.likes - 1);
            }
            updated.dislikes += 1;
            updated.userAction = "dislike";
          }
        }

        return updated;
      })
    );
  };

  const handleStoryUpvote = (index: number) => {
    setMotivationalStories((prevStories) =>
      prevStories.map((story, i) =>
        i === index
          ? {
              ...story,
              upvotes: story.userUpvoted
                ? Math.max(0, story.upvotes - 1)
                : story.upvotes + 1,
              userUpvoted: !story.userUpvoted,
            }
          : story
      )
    );
  };

  const handleSubmitReview = () => {
    if (newReview.trim() && rating > 0) {
      const newReviewObj: Review = {
        id: Date.now(),
        name: userName.trim() || "Anonymous Parent",
        text: newReview,
        rating,
        likes: 0,
        dislikes: 0,
        userAction: null,
        canDelete: true,
      };
      setReviews((prev) => [newReviewObj, ...prev]);
      setNewReview("");
      setRating(0);
      setUserName("Parent");
      setShowModal(false);
    } else {
      alert("Please write a review and select a rating.");
    }
  };

  const handleDeleteReview = (id: string | number) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== id)
    );
  };

  return (
    <>
      <Navigation />

      <div className="px-6 md:px-20 py-10 bg-[#FFF8F1] text-gray-800 space-y-16 animate-fadeIn">
        <section className="text-center" data-aos="fade-up">
          <h1 className="text-4xl mt-10 md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F06724] via-[#4B90FE] to-[#8E66CB] animate-textGlow drop-shadow-md">
            For Parents
          </h1>
          <p className="mt-4 text-lg text-center">
            A guide for families to understand, support, and empower children
            with dyslexia and other learning challenges. <br /> Because you're
            not alone in this journey.{" "}
            <span className="inline-block animate-pulse">🌟</span>
          </p>
        </section>

        <AboutDyslexia />
        <ResourcesSection data-aos="fade-up" />

        {/* MOTIVATIONAL STORIES */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4" data-aos="fade-right">
            💫 Motivational Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {motivationalStories.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md animate-slideInUp hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                data-aos="zoom-in-up"
                data-aos-delay={idx * 100}
              >
                <h3 className="text-xl font-semibold mb-2 text-orange-700">
                  {s.title}
                </h3>
                <p className="text-gray-700">{s.text}</p>
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => handleStoryUpvote(idx)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                      s.userUpvoted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                    <span>Upvote {s.upvotes > 0 && `(${s.upvotes})`}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4" data-aos="fade-right">
            🌟 Reviews From Parents
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, idx) => (
              <div
                key={r.id}
                className="bg-white p-4 rounded-xl shadow animate-fadeIn flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all duration-200 ease-in-out"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div>
                  <p className="italic mb-2">"{r.text}"</p>
                  <p className="mt-2 font-semibold text-gray-700">– {r.name}</p>
                  <div className="flex gap-1 text-yellow-400 mb-3">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star
                        key={i}
                        fill="currentColor"
                        className="w-4 h-4"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-auto items-center">
                  {r.canDelete && (
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                      title="Delete this review"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleReviewVote(idx, "like")}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                      r.userAction === "like"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />{" "}
                    {r.likes > 0 && r.likes}
                  </button>
                  <button
                    onClick={() => handleReviewVote(idx, "dislike")}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
                      r.userAction === "dislike"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-red-100"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />{" "}
                    {r.dislikes > 0 && r.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full shadow transition-colors duration-200"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            Add Your Review
          </button>
        </section>

        {/* REVIEW MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full animate-slideInUp"
              data-aos="zoom-in"
            >
              <h3 className="text-xl font-bold mb-4">Share Your Review</h3>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
                placeholder="Your Name (e.g., Parent, Aarti)"
              />
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-300 focus:border-transparent outline-none"
                rows={3}
                placeholder="Write your experience..."
              />
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    onClick={() => setRating(i)}
                    fill={i <= rating ? "#FACC15" : "none"}
                    className="cursor-pointer text-yellow-400 w-5 h-5 transition-colors duration-150"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NEWSLETTER SECTION */}
        <section
          className="mt-20 bg-white p-6 rounded-xl max-w-xl mx-auto shadow-md animate-fadeIn"
          data-aos="fade-up"
        >
          <h2 className="text-xl font-semibold mb-2">
            📩 Subscribe to our Newsletter
          </h2>
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <span>✅</span> Thank you for subscribing!
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-green-300 focus:border-transparent outline-none"
              />
              <button
                onClick={() => setSubscribed(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors duration-200"
              >
                Subscribe
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}
