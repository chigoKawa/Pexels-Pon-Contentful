export interface IQuery {
    query: string;
    per_page: number;
    orientation: string;
    page?: number;
  }
  
  export interface IPexelPhotos {
    id: string;
    total_results: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    src: {
      original: string;
      large2x: string;
      large: string;
      medium: string;
      small: string;
      portrait: string;
      landscape: string;
      tiny: string;
    };
    liked: boolean;
    alt: string;
  }
  
  export interface IPexelPhotoData {
    query: string;
    total_results: number;
    page: number;
    per_page: number;
    photos: IPexelPhotos[];
    next_page: string;
  }