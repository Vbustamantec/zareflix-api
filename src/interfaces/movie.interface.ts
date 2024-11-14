export interface FavoriteMovie {
    _id?: string;
    userId: string;
    movieId: string;
    title: string;
    poster: string;
    year: string;
    personalNotes?: string;
    createdAt: Date;
    updatedAt: Date;
  }