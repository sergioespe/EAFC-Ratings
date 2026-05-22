import { Container, Typography, Alert, Box, InputAdornment, TextField } from '@mui/material';
import Grid from '@mui/material/Grid'; // Importamos Grid moderno
import SearchIcon from '@mui/icons-material/Search';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useDeferredValue } from 'react';

import { usePlayers } from '../hooks/usePlayers';
import { PlayerSkeleton } from '../components/PlayerSkeleton';
import { PlayerCard } from '../components/PlayerCard';
import { EmptyState } from '../components/EmptyState';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = usePlayers(deferredSearchTerm);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Filtramos directamente en la "API" mediante usePlayers(deferredSearchTerm)

  const itemsLength = data?.pages?.reduce((acc, page) => acc + (page.items?.length || 0), 0) ?? 0;
  const isEmpty = status === 'success' && itemsLength === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        EAFC Ratings
      </Typography>

      <TextField
        fullWidth
        placeholder="Buscar por nombre..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Loading Inicial (Skeleton) */}
      {status === 'pending' && (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <PlayerSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Error State */}
      {status === 'error' && (
        <Alert severity="error">
          Error al cargar los jugadores: {error?.message}
        </Alert>
      )}

      {/* Listado de Jugadores */}
      {isEmpty && (
        <EmptyState searchTerm={searchTerm} />
      )}
      {!isEmpty && status === 'success' && (
        <Grid container spacing={3}>
          {data?.pages.map((page) =>
            page.items.map((player) => (
              <Grid key={player.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PlayerCard player={player} />
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Centinela para Infinite Scroll */}
      <Box ref={ref} sx={{ height: 20, mt: 4 }}>
        {isFetchingNextPage && (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid key={`load-${i}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PlayerSkeleton />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};