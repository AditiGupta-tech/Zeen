export interface Message {
  user: string; 
  message: string;
  time: string; 
}

export interface CommunityGroup {
  id: number;
  groupName: string;
  description: string;
  tags: string[];
  membersCount: number;
  createdBy: string;
  createdAt: string; 
  messages: Message[];
  isPrivate: boolean; 
  coverImage: string; 
}

export interface GroupMember {
  username: string;
  isOnline: boolean; 
  role?: 'admin' | 'moderator' | 'member'; 
}