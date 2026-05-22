import { Card, CardContent, Skeleton, Stack, Box } from '@mui/material';

export const PlayerSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="80%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={40} height={24} sx={{ borderRadius: 1 }} />
        </Stack>
      </CardContent>
    </Card>
  );
};