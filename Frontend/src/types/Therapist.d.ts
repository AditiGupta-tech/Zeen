export interface Therapist {
  id: number;
  name: string;
  image: string; 
  tags: string[]; 
  experience: number; 
  rating: number;
  location: {
    city: string;
    state: string;
    distance_km: number; 
    latitude?: number;
    longitude?: number;
  };
  website: string;
  availableAppointments: string[]; 
}

export type ViewMode = 'grid' | 'table'; 