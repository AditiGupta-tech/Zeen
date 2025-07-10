import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CommunityCard from './CommunityCard';
import CommChatModal from './CommChatModal'; 
import communityData from '../data/community.json';
import type { CommunityGroup, Message } from '../types/Community';

const CURRENT_USER_USERNAME = 'current.user';

interface LastReadMessageCounts {
  [groupId: number]: number;
}

const Community: React.FC = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>(JSON.parse(JSON.stringify(communityData)));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [joinedGroupIds, setJoinedGroupIds] = useState<number[]>(() => {
    const savedJoined = localStorage.getItem('joinedGroupIds');
    return savedJoined ? JSON.parse(savedJoined) : [];
  });
  const [lastReadMessageCounts, setLastReadMessageCounts] = useState<LastReadMessageCounts>(() => {
    const savedCounts = localStorage.getItem('lastReadMessageCounts');
    return savedCounts ? JSON.parse(savedCounts) : {};
  });
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<CommunityGroup | null>(null);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('joinedGroupIds', JSON.stringify(joinedGroupIds));
  }, [joinedGroupIds]);

  useEffect(() => {
    localStorage.setItem('lastReadMessageCounts', JSON.stringify(lastReadMessageCounts));
  }, [lastReadMessageCounts]);

  useEffect(() => {
    const fetchUserInterests = async () => {
      setIsLoadingInterests(true);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setUserInterests([]);
        setIsLoadingInterests(false);
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('authToken');
          }
          setUserInterests([]);
          return;
        }

        const userData = await response.json();
        if (userData && Array.isArray(userData.interests)) {
          setUserInterests(userData.interests);
        } else {
          setUserInterests([]);
        }
      } catch (error) {
        setUserInterests([]);
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchUserInterests();
  }, []);

  const uniqueTags = useMemo(() => {
    const tags = Array.from(new Set(groups.flatMap(group => group.tags)));
    return ['', ...tags.sort()];
  }, [groups]);

  const filteredGroups = useMemo(() => {
    let currentFilteredGroups = groups;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFilteredGroups = currentFilteredGroups.filter(
        group =>
          group.groupName.toLowerCase().includes(lowerCaseSearchTerm) ||
          group.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          group.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedTag) {
      currentFilteredGroups = currentFilteredGroups.filter(group =>
        group.tags.includes(selectedTag)
      );
    }

    const hasUserInterests = userInterests.length > 0 && !isLoadingInterests;

    const sortedGroups = [...currentFilteredGroups].sort((a, b) => {
      const aIsJoined = joinedGroupIds.includes(a.id);
      const bIsJoined = joinedGroupIds.includes(b.id);
      const aIsRecommended = hasUserInterests && userInterests.some(interest => a.tags.includes(interest));
      const bIsRecommended = hasUserInterests && userInterests.some(interest => b.tags.includes(interest));

      if (aIsJoined && !bIsJoined) return -1;
      if (!aIsJoined && bIsJoined) return 1;

      if (aIsRecommended && !bIsRecommended) return -1;
      if (!aIsRecommended && bIsRecommended) return 1;

      return b.membersCount - a.membersCount;
    });

    return sortedGroups;
  }, [groups, searchTerm, selectedTag, joinedGroupIds, userInterests, isLoadingInterests]);

  const handleJoinGroup = useCallback((groupId: number) => {
    setJoinedGroupIds(prev => {
      if (!prev.includes(groupId)) {
        return [...prev, groupId];
      }
      return prev;
    });

    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, membersCount: group.membersCount + 1 }
          : group
      )
    );

    const groupToOpen = groups.find(g => g.id === groupId);
    if (groupToOpen) {
      setActiveGroup(groupToOpen);
      setIsChatModalOpen(true);
      setLastReadMessageCounts(prev => ({ ...prev, [groupId]: groupToOpen.messages.length }));
    }
  }, [groups]);

  const handleLeaveGroup = useCallback((groupId: number) => {
    setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, membersCount: Math.max(0, group.membersCount - 1) }
          : group
      )
    );
    if (activeGroup?.id === groupId) {
      setIsChatModalOpen(false);
      setActiveGroup(null);
    }
    setLastReadMessageCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[groupId];
      return newCounts;
    });
  }, [activeGroup]);

  const handleViewGroup = useCallback((groupId: number) => {
    const groupToOpen = groups.find(g => g.id === groupId);
    if (groupToOpen) {
      setActiveGroup(groupToOpen);
      setIsChatModalOpen(true);
      setLastReadMessageCounts(prev => ({ ...prev, [groupId]: groupToOpen.messages.length }));
    }
  }, [groups]);

  const handleSendMessage = useCallback((groupId: number, message: Message) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          const updatedGroup = { ...group, messages: [...group.messages, message] };
          setLastReadMessageCounts(prev => ({ ...prev, [groupId]: updatedGroup.messages.length }));
          return updatedGroup;
        }
        return group;
      })
    );

    if (activeGroup?.id === groupId) {
      setActiveGroup(prevActiveGroup => {
        if (!prevActiveGroup) return null;
        return {
          ...prevActiveGroup,
          messages: [...prevActiveGroup.messages, message]
        };
      });
    }
  }, [activeGroup]);

  const handleCloseChatModal = useCallback(() => {
    if (activeGroup) {
      setLastReadMessageCounts(prev => ({ ...prev, [activeGroup.id]: activeGroup.messages.length }));
    }
    setIsChatModalOpen(false);
    setActiveGroup(null);
  }, [activeGroup]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Community Hub</h1>

      <div className="flex flex-wrap gap-4 mb-8 items-end justify-center md:justify-start">
        <div className="flex flex-col">
          <label htmlFor="searchTerm" className="mb-1 text-sm font-medium text-gray-700">
            Search Groups:
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, description, tags"
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tagFilter" className="mb-1 text-sm font-medium text-gray-700">
            Filter by Tag:
          </label>
          <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
          >
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag === '' ? 'All Tags' : tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoadingInterests ? (
        <p className="text-center text-gray-600 mt-8 text-lg">Loading community groups and personalizing recommendations...</p>
      ) : (
        <>
          {filteredGroups.length === 0 ? (
            <p className="text-center text-gray-600 mt-8 text-lg">No community groups found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGroups.map((group) => {
                const totalMessages = group.messages.length;
                const lastRead = lastReadMessageCounts[group.id] || 0;
                const unread = totalMessages - lastRead;

                return (
                  <CommunityCard
                    key={group.id}
                    group={group}
                    isJoined={joinedGroupIds.includes(group.id)}
                    onJoinGroup={handleJoinGroup}
                    onViewGroup={handleViewGroup}
                    onLeaveGroup={handleLeaveGroup}
                    currentUser={CURRENT_USER_USERNAME}
                    unreadMessagesCount={unread > 0 ? unread : 0}
                    searchTerm={searchTerm}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {isChatModalOpen && activeGroup && (
        <CommChatModal // Corrected component name here
          group={activeGroup}
          currentUser={CURRENT_USER_USERNAME}
          isJoined={joinedGroupIds.includes(activeGroup.id)}
          onClose={handleCloseChatModal}
          onSendMessage={handleSendMessage}
          onJoinLeaveGroup={(groupId, action) => {
            if (action === 'join') handleJoinGroup(groupId);
            if (action === 'leave') handleLeaveGroup(groupId);
          }}
        />
      )}
    </div>
  );
};

export default Community;