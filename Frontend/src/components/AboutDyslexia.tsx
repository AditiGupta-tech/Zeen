import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Youtube, ExternalLink, CheckCircle, XCircle,  } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutDyslexia() { 
  const [content, setContent] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/data/aboutDyslexiaContent.json');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setContent(data);
      } catch (e) {
        console.error("Failed to fetch about dyslexia content:", e);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">Loading comprehensive dyslexia guide...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">Error: {error}</div>
    );
  }

  if (!content) {
    return null;
  }

  const mediaContainerClasses = "relative w-500 max-w-lg mx-auto";
  const mediaAspectRatioStyle = { paddingBottom: '20%', height: 0 };

  return ( 
    <section className="mt-12 bg-white p-6 md:p-10 rounded-2xl shadow-lg relative overflow-hidden">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8E66CB] to-[#4B90FE] mb-6">
        {content.title}
      </h2>
      <p className="text-lg text-gray-700 mb-8">{content.intro}</p>

      <div
        className={`transition-all duration-700 ease-in-out ${
          isExpanded ? 'max-h-full' : 'max-h-[40px]'
        } overflow-hidden relative`}
      >
        {content.sections.map((section, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <h3 className={`text-2xl font-semibold mb-3 flex items-center gap-2 ${section.headingColor || 'text-gray-800'}`}>
              {section.type === 'article' && <BookOpen className="w-6 h-6 text-blue-600" />}
              {section.type === 'video' && <Youtube className="w-6 h-6 text-red-600" />}
              {section.type === 'link' && <ExternalLink className="w-6 h-6 text-orange-600" />}
              {section.type === 'case_table' && <BookOpen className="w-6 h-6 text-teal-600" />}
              {section.type === 'dyslexia_types' && <BookOpen className="w-6 h-6 text-red-600" />}
              {section.heading}
            </h3>
            {section.type === 'text' && (
              <div className="space-y-3 text-gray-700 leading-relaxed">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx}
                     dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                     className="text-gray-700"
                  />
                ))}
              </div>
            )}
            {section.type === 'image' && (
              <div className="my-4 text-center">
                <div className={mediaContainerClasses} style={mediaAspectRatioStyle}>
                  <img
                    src={section.imageUrl}
                    alt={section.altText}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/CCCCCC/666666?text=Image+Not+Found"; }}
                  />
                </div>
                {section.caption && (
                  <p className="text-sm text-gray-500 mt-2 italic max-w-md mx-auto">{section.caption}</p>
                )}
              </div>
            )}
            {section.type === 'video' && (
              <div className="my-4">
                <div className={mediaContainerClasses} style={mediaAspectRatioStyle}>
                  <iframe
                    src={section.videoUrl}
                    title={section.heading}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                  ></iframe>
                </div>
                {section.caption && (
                  <p className="text-sm text-gray-500 mt-2 italic text-center max-w-md mx-auto">{section.caption}</p>
                )}
                {section.note && (
                  <p className="text-xs text-gray-400 mt-1 text-center max-w-md mx-auto">{section.note}</p>
                )}
              </div>
            )}
            {section.type === 'link' && (
              <div className="my-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center shadow-sm">
                <p className="text-lg text-orange-700 font-medium mb-2">{section.text}</p>
                <Link
                  to={section.linkUrl}
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-semibold
                             transition-colors duration-200 text-base underline decoration-dashed"
                >
                  Click here to see the visual simulation <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}

            {section.type === 'dyslexia_types' && (
              <div className="space-y-6">
                {section.types.map((type, typeIdx) => (
                  <div key={typeIdx} className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
                    <h4 className={`text-xl font-bold underline ${type.emphasisColor || 'text-gray-800'} mb-2`}>
                      {type.name}
                    </h4>
                    {type.symptoms && type.symptoms.length > 0 && (
                      <div className="mb-2">
                        <p className="font-semibold text-blue-700">Symptoms:</p>
                        <ul className="list-disc list-inside text-gray-700 ml-4">
                          {type.symptoms.map((symptom, sIdx) => (
                            <li key={sIdx}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {type.identification && type.identification.length > 0 && (
                      <div className="mb-2">
                        <p className="font-semibold text-blue-700">Identification:</p>
                        <ul className="list-disc list-inside text-gray-700 ml-4">
                          {type.identification.map((id, idIdx) => (
                            <li key={idIdx}>{id}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {type.difference && (
                      <div>
                        <p className="font-semibold text-blue-700">Difference from other types:</p>
                        <p className="text-gray-700 ml-4 italic">{type.difference}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'case_table' && (
              <div className="my-6 overflow-x-auto">
                {section.description && (
                    <p className="text-gray-600 italic mb-4">{section.description}</p>
                )}
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      {section.tableData.headers.map((header, hIdx) => (
                        <th key={hIdx} className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {section.tableData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 align-top">{row.scenario}</td>
                        <td className="py-3 px-4 text-center align-top">
                          {row.isDyslexiaCase === true && <CheckCircle className="text-green-500 w-6 h-6 mx-auto" />}
                          {row.isDyslexiaCase === false && <XCircle className="text-red-500 w-6 h-6 mx-auto" />}
                          {row.isDyslexiaCase === "unclear" && <span className="text-yellow-600 font-bold text-2xl">?</span>}
                        </td>
                        <td className="py-3 px-4 text-gray-600 italic align-top">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        ))}

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg
                     hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="ml-2 w-5 h-5" /></>
          ) : (
            <>Read More <ChevronDown className="ml-2 w-5 h-5" /></>
          )}
        </button>
      </div>
    </section>
  ); 
} 