export interface TMDBMovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBCredits {
  id: number;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
}

export interface TMDBCastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface TMDBCrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

export interface TMDBVideos {
  id: number;
  results: TMDBVideo[];
}

export interface TMDBVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface TMDBRatings {
  id: number;
  results: TMDBRating[];
}

export interface TMDBRating {
  iso_3166_1: string;
  certification: string | number | 'Not Rated' | undefined;
  meaning: string | '';
  order: number | 0;
}

export interface TMDBReleaseDates {
  id: number;
  results: TMDBReleaseDatesResult[];
}

export interface TMDBReleaseDatesResult {
  iso_3166_1: string;
  release_dates: TMDBReleaseDate[];
}

export interface TMDBReleaseDate {
  certification: string;
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

export type MovieDetailsProps = {
  movie: TMDBMovieDetails;
  credits: TMDBCredits;
  videos: TMDBVideos;
  videoId: string | undefined;
  ageRating:
    | {
        certification?: undefined;
        fullData?: undefined;
      }
    | {
        certification: string | number;
        fullData: TMDBReleaseDates;
      };
  currentMovieIds: number[];
};
