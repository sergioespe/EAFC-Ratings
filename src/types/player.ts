// src/types/player.ts

export interface Position {
    id: string;
    shortLabel: string;
    label: string;
    positionType: {
      id: string;
      name: string;
    };
  }
  
  export interface PlayerStatValue {
    value: number;
    diff: number;
  }
  
  export interface PlayerStats {
    acceleration: PlayerStatValue;
    agility: PlayerStatValue;
    jumping: PlayerStatValue;
    stamina: PlayerStatValue;
    strength: PlayerStatValue;
    aggression: PlayerStatValue;
    balance: PlayerStatValue;
    ballControl: PlayerStatValue;
    composure: PlayerStatValue;
    crossing: PlayerStatValue;
    curve: PlayerStatValue;
    def: PlayerStatValue;
    defensiveAwareness: PlayerStatValue;
    dri: PlayerStatValue;
    dribbling: PlayerStatValue;
    finishing: PlayerStatValue;
    freeKickAccuracy: PlayerStatValue;
    gkDiving: PlayerStatValue;
    gkHandling: PlayerStatValue;
    gkKicking: PlayerStatValue;
    gkPositioning: PlayerStatValue;
    gkReflexes: PlayerStatValue;
    headingAccuracy: PlayerStatValue;
    interceptions: PlayerStatValue;
    longPassing: PlayerStatValue;
    longShots: PlayerStatValue;
    pac: PlayerStatValue;
    pas: PlayerStatValue;
    penalties: PlayerStatValue;
    phy: PlayerStatValue;
    sho: PlayerStatValue;
    // Añadir el resto de stats conforme a la lista completa del JSON
  }
  
  export interface PlayerAbility {
    id: string;
    label: string;
    description: string;
    imageUrl: string;
    type: {
      id: string;
      label: string;
    };
  }
  
  export interface Player {
    team: string;
    position: Position;
    id: number;
    rank: number;
    overallRating: number;
    firstName: string;
    lastName: string;
    commonName: string | null;
    birthdate: string;
    height: number;
    weight: number;
    skillMoves: number;
    weakFootAbility: number;
    preferredFoot: number;
    leagueName: string;
    avatarUrl: string;
    shieldUrl: string;
    alternatePositions: Array<{ id: string; label: string; shortLabel: string }>;
    playerAbilities: PlayerAbility[];
    stats: PlayerStats;
  }
  
  export interface ApiResponse {
    items: Player[];
  }