export interface Event {
  id: number;
  title: string;
  description: string;
  ageGroup: string;
  location: {
    city: string;
    latitude: number; 
    longitude: number; 
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