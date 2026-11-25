export interface Sport {
  idSport: string;
  strSport: string;
  strSportThumb?: string;
  strSportIconGreen?: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strBadge?: string;
  strTeamBadge?: string;
  strLeague?: string;
  strLeague2?: string;
  strStadium?: string;
  strDescriptionEN?: string;
  strCountry?: string;
  strSport?: string;
  intFormedYear?: string;
  strWebsite?: string;
  strStadiumThumb?: string;
  intStadiumCapacity?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strDescriptionEN?: string;
  strCountry?: string;
  strCurrentSeason?: string;
  intFormedYear?: string;
  strWebsite?: string;
  strGender?: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb?: string;
  strCutout?: string;
  strPosition?: string;
  strTeam?: string;
  strNationality?: string;
  dateBorn?: string;
  strDescriptionEN?: string;
  strHeight?: string;
  strWeight?: string;
  strSport?: string;
  strNumber?: string;
}

export type SearchResultType = 'team' | 'league' | 'player';

export interface SearchResult {
  id: string;
  name: string;
  type: SearchResultType;
  badge?: string;
  subtitle?: string;
}

export interface SportsApiResponse<T> {
  teams?: T[] | null;
  leagues?: T[] | null;
  players?: T[] | null;
  sports?: T[] | null;
}
