import type { QueryFunctionContext } from '@tanstack/react-query';
import type { Player } from '../types/player';
import rawData from '../data/listadoJugadores.json';

const data = {
  items: rawData.items.map((player) => ({
    ...player,
    team: player.team.label,
  })) as Player[],
};

// QueryKey: ['players', searchTerm]  |  PageParam: number
type PlayersQueryContext = QueryFunctionContext<[string, string], number>;

export const fetchPlayers = async ({ pageParam = 0, queryKey }: PlayersQueryContext): Promise<{ items: Player[], nextCursor: number | null }> => {
  // Simulamos delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const [_key, searchTerm] = queryKey;
  let allPlayers = data.items;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    allPlayers = allPlayers.filter(player => 
      (player.commonName || '').toLowerCase().includes(term) ||
      (player.lastName || '').toLowerCase().includes(term) ||
      (player.firstName || '').toLowerCase().includes(term)
    );
  }

  const ITEMS_PER_PAGE = 20;
  
  const start = pageParam * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  const paginatedItems = allPlayers.slice(start, end);
  const nextCursor = end < allPlayers.length ? pageParam + 1 : null;

  return {
    items: paginatedItems,
    nextCursor,
  };
};