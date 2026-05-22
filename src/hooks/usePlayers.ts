import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPlayers } from '../api/playerService';

export const usePlayers = (searchTerm: string = '') => {
  return useInfiniteQuery({
    queryKey: ['players', searchTerm] as const,
    queryFn: fetchPlayers,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};