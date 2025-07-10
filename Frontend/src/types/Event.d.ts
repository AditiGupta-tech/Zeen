export interface Event {
  id: number;
  title: string;
  description: string;
  ageGroup: string;
  location: {
    city: string;
    mapUrl: string;
  };
  tags: string[];
  startDate: string;
  endDate: string;
  time: string;
  organizer: string;
  registrationLink: string;
  themeColor: string; 
  recommended: boolean;
  image: string; 
}

export type ViewMode = 'grid' | 'table';