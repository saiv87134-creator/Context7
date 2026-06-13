export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card' | 'sub';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface MatchStats {
  homePossession: number;
  awayPossession: number;
  homeShots: number;
  awayShots: number;
  homeShotsOnTarget: number;
  awayShotsOnTarget: number;
  homeCorners: number;
  awayCorners: number;
  homeFouls: number;
  awayFouls: number;
  homeYellowCards: number;
  awayYellowCards: number;
  homeRedCards: number;
  awayRedCards: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date?: string;
  time?: string;
  score: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'scheduled';
  minute?: number;
  stadium?: string;
  referee?: string;
  attendance?: number;
  stats: MatchStats;
  events: MatchEvent[];
  preMatchAnalysis?: string;
  aiCommentary?: string;
  aiDetailedAnalysis?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  teamTag?: string;
  imageUrl: string;
  date: string;
  aiGenerated: boolean;
}
