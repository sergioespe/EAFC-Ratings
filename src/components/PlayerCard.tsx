import {
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Avatar,
    Box,
    Chip,
    Stack
} from '@mui/material';
import type { Player } from '../types/player';
import { Link as RouterLink } from 'react-router-dom';

interface PlayerCardProps {
    player: Player;
}

export const PlayerCard = ({ player }: PlayerCardProps) => {
    return (
        <Card
            sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
            }}
        >
            <CardActionArea
                component={RouterLink}
                to={`/player/${player.id}`}
                sx={{
                    height: '100%',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <CardContent>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Avatar
                            src={player.avatarUrl}
                            alt={player.commonName || player.lastName}
                            sx={{ width: 60, height: 60 }}
                        />
                        <Box>
                            <Typography variant="h6" noWrap>
                                {player.commonName || `${player.firstName} ${player.lastName}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {player.leagueName}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Chip
                            label={`OVR: ${player.overallRating}`}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label={player.position.shortLabel}
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};