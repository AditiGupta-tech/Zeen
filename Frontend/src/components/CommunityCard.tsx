import React from 'react';
import type { CommunityGroup } from '../types/Community';

interface CommunityCardProps {
  group: CommunityGroup;
  isJoined: boolean;
  onJoinGroup: (groupId: number) => void;
  onViewGroup: (groupId: number) => void;
  onLeaveGroup: (groupId: number) => void;
  currentUser: string;
  unreadMessagesCount: number;
  searchTerm: string;
}

const highlightMatch = (text: string, term: string) => {
  if (!term) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 font-semibold rounded px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const CommunityCard: React.FC<CommunityCardProps> = ({
  group,
  isJoined,
  onJoinGroup,
  onViewGroup,
  onLeaveGroup,
  currentUser,
  unreadMessagesCount,
  searchTerm,
}) => {
  const isCreator = group.createdBy === currentUser;

  return (
    <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden border border-gray-300">
      <div className="relative h-32 md:h-36"> 
        <img
          src={group.coverImage}
          alt={group.groupName}
          className="w-full h-full object-cover object-center"
        />
        {group.isPrivate && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Private
          </span>
        )}
        {isJoined && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Joined
          </span>
        )}
        {isJoined && unreadMessagesCount > 0 && (
          <span className="absolute top-2 right-2 flex items-center justify-center h-5 w-5 bg-blue-600 text-white text-xs font-bold rounded-full animate-bounce-custom">
            {unreadMessagesCount}
          </span>
        )}
      </div>
      <div className="p-3"> 
        <h3 className="text-lg font-bold text-gray-800 mb-1"> 
          {highlightMatch(group.groupName, searchTerm)}
        </h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2"> 
          {highlightMatch(group.description, searchTerm)}
        </p>

        <div className="flex flex-wrap gap-1 mb-2"> 
          {group.tags.map((tag, index) => (
            <span
              key={index}
              className={`bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full ${
                searchTerm && tag.toLowerCase().includes(searchTerm.toLowerCase()) ? 'bg-yellow-200' : ''
              }`}
            >
              #{highlightMatch(tag, searchTerm)}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-3"> 
          <span>
            <strong className="text-gray-700">{group.membersCount}</strong> members
          </span>
          {isCreator && (
            <span className="text-blue-600 font-semibold text-xs">Your Group</span>
          )}
        </div>

        <div className="flex gap-2"> 
          {!isJoined ? (
            <button
              onClick={() => onJoinGroup(group.id)}
              className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm" // Reduced padding, smaller shadow
            >
              Join Group
            </button>
          ) : (
            <button
              onClick={() => onViewGroup(group.id)}
              className="flex-1 bg-green-600 text-white py-1.5 px-3 rounded-md font-semibold hover:bg-green-700 transition-colors shadow-sm text-sm" // Reduced padding, smaller shadow
            >
              View Chat
            </button>
          )}
          {isJoined && !isCreator && (
            <button
              onClick={() => onLeaveGroup(group.id)}
              className="bg-red-500 text-white py-1.5 px-3 rounded-md font-semibold hover:bg-red-600 transition-colors shadow-sm text-xs" // Reduced padding, smaller shadow, tiny text
            >
              Leave
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;