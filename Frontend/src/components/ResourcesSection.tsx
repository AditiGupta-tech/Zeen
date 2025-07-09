import { useEffect, useState, useMemo } from "react";
import { Search, Youtube, BookOpen, Tag, ArrowUp } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Resource {
  id: string; 
  type: string;
  tags?: string[];
  title: string;
  imageUrl: string;
  link: string;
  upvotes: number;
  userUpvoted: boolean;
}

export default function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    async function fetchResources() {
      try {
        const res = await fetch('/data/resources.json');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Resource[] = await res.json(); 

        setResources(data.map(resItem => ({
          ...resItem, 
          upvotes: resItem.upvotes || 0, 
          userUpvoted: resItem.userUpvoted || false
        })));
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    }
    fetchResources();
  }, []);

  const uniqueTypes = useMemo(() => {
    const types = new Set(resources.map(r => r.type));
    return ["All", ...Array.from(types)];
  }, [resources]);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach(r => r.tags && r.tags.forEach(tag => tags.add(tag)));
    return ["All", ...Array.from(tags).sort()];
  }, [resources]);

  const filteredAndSearchedResources = useMemo(() => {
    let filtered = resources;

    if (selectedType !== "All") {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    if (selectedTag !== "All") {
      filtered = filtered.filter(r => r.tags && r.tags.includes(selectedTag));
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (r.tags && r.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
      );
    }

    return filtered;
  }, [resources, searchTerm, selectedType, selectedTag]);

  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return (
      <span>
        {text.split(regex).map((part, i) =>
          regex.test(part) ? <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark> : part
        )}
      </span>
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "Video":
        return <Youtube className="w-5 h-5 text-red-500" />;
      case "Article":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleResourceUpvote = (resourceId: string) => {
    setResources(prevResources => {
      const newResources = prevResources.map(resource => {
        if (resource.id === resourceId) {
          return {
            ...resource,
            upvotes: resource.userUpvoted ? resource.upvotes - 1 : resource.upvotes + 1,
            userUpvoted: !resource.userUpvoted
          };
        }
        return resource;
      });
      return newResources;
    });
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4" data-aos="fade-right">🎥 Helpful Resources</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6" data-aos="fade-up" data-aos-delay="100">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search titles or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded border focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {uniqueTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSearchedResources.length > 0 ? (
          filteredAndSearchedResources.map((r) => (
            <div
              key={r.id} 
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100
                          transform transition-all duration-300 ease-in-out
                          hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-400
                          relative overflow-hidden group flex flex-col"
            >
              <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={r.imageUrl}
                  alt={r.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="https://placehold.co/400x200/CCCCCC/666666?text=Image+Not+Found"; }}
                />
              </div>

              <div className="flex items-center gap-2 mb-2 text-gray-600">
                {getIconForType(r.type)}
                <span className="font-semibold text-sm">{r.type}</span>
              </div>
              <h3 className="text-lg font-semibold text-orange-700 mb-2">
                {highlightMatch(r.title, searchTerm)}
              </h3>
              {r.tags && r.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                  {r.tags.map((tag, tagIdx) => (
                    <span key={tagIdx} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {highlightMatch(tag, searchTerm)}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-4 flex justify-between items-center">
                {r.type === "Article" ? (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-full text-sm
                                hover:bg-blue-600 transition-colors duration-200 shadow-md"
                  >
                    <BookOpen className="w-4 h-4" /> Read More
                  </a>
                ) : (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-full text-sm
                                hover:bg-red-600 transition-colors duration-200 shadow-md"
                  >
                    <Youtube className="w-4 h-4" /> Watch Video
                  </a>
                )}

                <button
                  onClick={() => handleResourceUpvote(r.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-200
                              ${r.userUpvoted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Upvote {r.upvotes > 0 && `(${r.upvotes})`}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10" data-aos="fade-in">
            {resources.length === 0 ? "Loading resources..." : "No resources found matching your criteria."}
          </p>
        )}
      </div>
    </section>
  );
}