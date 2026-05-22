import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface EmptyStateProps {
  searchTerm: string;
}

export const EmptyState = ({ searchTerm }: EmptyStateProps) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 8,
        textAlign: 'center'
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        No se encontraron resultados
      </Typography>
      <Typography variant="body1" color="text.secondary">
        No pudimos encontrar ningún jugador que coincida con "{searchTerm}".
        Prueba a buscar con otro nombre.
      </Typography>
    </Box>
  );
};
