import React, { useState, useEffect, useRef } from 'react';
import type { CommunityGroup, Message, GroupMember } from '../types/Community';

interface CommChatModalProps {
  group: CommunityGroup;
  currentUser: string;
  isJoined: boolean;
  onClose: () => void;
  onSendMessage: (groupId: number, message: Message) => void;
  onJoinLeaveGroup: (groupId: number, action: 'join' | 'leave') => void;
}

const CommChatModal: React.FC<CommChatModalProps> = ({
  group,
  currentUser,
  isJoined,
  onClose,
  onSendMessage,
  onJoinLeaveGroup,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentMembers, setCurrentMembers] = useState<GroupMember[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMembers: GroupMember[] = Array.from(new Set(group.messages.map(msg => msg.user)))
      .map(user => ({
        username: user,
        isOnline: Math.random() > 0.7,
        role: user === group.createdBy ? 'admin' : 'member'
      }));

    if (isJoined && !initialMembers.some(m => m.username === currentUser)) {
      initialMembers.push({ username: currentUser, isOnline: true, role: 'member' });
    }
    setCurrentMembers(initialMembers);

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [group.messages, isJoined, currentUser, group.createdBy]);

  const handleSendMessage = () => {
    if (newMessage.trim() && isJoined) {
      const messageToSend: Message = {
        user: currentUser,
        message: newMessage.trim(),
        time: new Date().toISOString(),
      };
      onSendMessage(group.id, messageToSend);
      setNewMessage('');
    }
  };

  const handleJoinLeaveClick = () => {
    if (isJoined) {
      onJoinLeaveGroup(group.id, 'leave');
      onClose(); 
    } else {
      onJoinLeaveGroup(group.id, 'join');
    }
  };

  const getMemberStatusColor = (isOnline: boolean) => (isOnline ? 'text-green-500' : 'text-gray-400');
  const isCreator = group.createdBy === currentUser;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-4xl h-[90vh] animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold">{group.groupName}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-3xl font-bold leading-none">
            &times;
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto hidden md:block">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Members ({currentMembers.length})</h3>
            <ul className="space-y-2">
              {currentMembers.map((member, index) => (
                <li key={index} className="flex items-center text-gray-800 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full mr-2 ${getMemberStatusColor(member.isOnline)}`}>
                    {member.isOnline ? '🟢' : '⚫'}
                  </span>
                  {member.username}
                  {member.role === 'admin' && <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Admin</span>}
                  {member.username === currentUser && <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">You</span>}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h4 className="text-md font-semibold text-gray-700 mb-2">Group Info</h4>
              <p className="text-gray-600 text-sm mb-2">{group.description}</p>
              <div className="flex flex-wrap gap-1">
                {group.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                {isJoined && !isCreator && (
                  <button
                    onClick={handleJoinLeaveClick}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition-colors shadow-md text-sm"
                  >
                    Leave Group
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4">
            <div className="flex-grow overflow-y-auto mb-4 p-2 custom-scrollbar">
              {group.messages.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-10">No messages yet. Be the first to say hello!</p>
              ) : (
                group.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      msg.user === currentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                        msg.user === currentUser
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{msg.user === currentUser ? 'You' : msg.user}</p>
                      <p className="text-base">{msg.message}</p>
                      <span className={`block text-xs mt-1 ${msg.user === currentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 pt-4">
              {!isJoined ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">You must join this group to send messages.</p>
                  <button
                    onClick={handleJoinLeaveClick}
                    className="bg-blue-600 text-white py-2 px-5 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Join Group to Chat
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommChatModal;