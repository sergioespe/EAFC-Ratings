import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Paper, Button, Divider, LinearProgress, Grid } from '@mui/material';
import { usePlayers } from '../hooks/usePlayers';

// Componente interno para barras de stats
const StatBar = ({ label, value }: { label: string; value: number }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
    <LinearProgress variant="determinate" value={value} sx={{ height: 8, borderRadius: 5 }} />
  </Box>
);

export const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = usePlayers();

  const player = data?.pages.flatMap(p => p.items).find(p => p.id.toString() === id);

  if (!player) return <Typography>Jugador no encontrado</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Volver</Button>
      
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Avatar src={player.avatarUrl} sx={{ width: 200, height: 200, mx: 'auto' }} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3">{player.commonName}</Typography>
            <Typography variant="h5" color="text.secondary">{player.leagueName}</Typography>
            <Typography variant="h4" sx={{ mt: 2, color: 'primary.main' }}>OVR: {player.overallRating}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Estadísticas</Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatBar label="Ritmo (PAC)" value={player.stats.pac.value} />
            <StatBar label="Tiro (SHO)" value={player.stats.sho.value} />
            <StatBar label="Pase (PAS)" value={player.stats.pas.value} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StatBar label="Regate (DRI)" value={player.stats.dri.value} />
            <StatBar label="Defensa (DEF)" value={player.stats.def.value} />
            <StatBar label="Físico (PHY)" value={player.stats.phy.value} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};