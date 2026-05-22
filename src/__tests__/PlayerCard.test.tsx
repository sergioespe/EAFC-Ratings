import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlayerCard } from '../components/PlayerCard';
import type { Player } from '../types/player';

// Jugador de prueba mínimo y tipado
const mockPlayer: Player = {
  id: 1,
  rank: 1,
  overallRating: 91,
  firstName: 'Lionel',
  lastName: 'Messi',
  commonName: 'Messi',
  birthdate: '06/24/1987 12:00:00 AM',
  height: 169,
  weight: 67,
  skillMoves: 4,
  weakFootAbility: 3,
  preferredFoot: 1,
  leagueName: 'MLS',
  avatarUrl: 'https://example.com/messi.png',
  shieldUrl: 'https://example.com/shield.png',
  alternatePositions: [],
  playerAbilities: [],
  team: 'Inter Miami',
  position: {
    id: '16',
    shortLabel: 'DCH',
    label: 'Delantero derecho',
    positionType: { id: 'forward', name: 'Delantero' },
  },
  stats: {
    pac: { value: 85, diff: 0 },
    sho: { value: 92, diff: 0 },
    pas: { value: 91, diff: 0 },
    dri: { value: 95, diff: 0 },
    def: { value: 34, diff: 0 },
    phy: { value: 65, diff: 0 },
    acceleration: { value: 91, diff: 0 },
    agility: { value: 91, diff: 0 },
    jumping: { value: 68, diff: 0 },
    stamina: { value: 75, diff: 0 },
    strength: { value: 69, diff: 0 },
    aggression: { value: 45, diff: 0 },
    balance: { value: 95, diff: 0 },
    ballControl: { value: 96, diff: 0 },
    composure: { value: 96, diff: 0 },
    crossing: { value: 85, diff: 0 },
    curve: { value: 93, diff: 0 },
    defensiveAwareness: { value: 35, diff: 0 },
    dribbling: { value: 96, diff: 0 },
    finishing: { value: 95, diff: 0 },
    freeKickAccuracy: { value: 93, diff: 0 },
    gkDiving: { value: 6, diff: 0 },
    gkHandling: { value: 11, diff: 0 },
    gkKicking: { value: 15, diff: 0 },
    gkPositioning: { value: 14, diff: 0 },
    gkReflexes: { value: 8, diff: 0 },
    headingAccuracy: { value: 70, diff: 0 },
    interceptions: { value: 40, diff: 0 },
    longPassing: { value: 87, diff: 0 },
    longShots: { value: 82, diff: 0 },
    penalties: { value: 75, diff: 0 },
  },
};

// PlayerCard usa useNavigate, necesita estar dentro de un Router
const renderCard = (player: Player) =>
  render(
    <MemoryRouter>
      <PlayerCard player={player} />
    </MemoryRouter>
  );

describe('PlayerCard', () => {
  it('muestra el commonName del jugador cuando existe', () => {
    renderCard(mockPlayer);
    expect(screen.getByText('Messi')).toBeInTheDocument();
  });

  it('muestra el firstName + lastName si no hay commonName', () => {
    const playerSinAlias: Player = { ...mockPlayer, commonName: null };
    renderCard(playerSinAlias);
    expect(screen.getByText('Lionel Messi')).toBeInTheDocument();
  });

  it('muestra el nombre de la liga', () => {
    renderCard(mockPlayer);
    expect(screen.getByText('MLS')).toBeInTheDocument();
  });

  it('muestra el OVR del jugador', () => {
    renderCard(mockPlayer);
    expect(screen.getByText('OVR: 91')).toBeInTheDocument();
  });

  it('muestra la posición abreviada del jugador', () => {
    renderCard(mockPlayer);
    expect(screen.getByText('DCH')).toBeInTheDocument();
  });

  it('genera un enlace correcto al detalle del jugador', () => {
    renderCard(mockPlayer);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/player/1');
  });
});
