import { Card, CardContent, Stack, Typography } from '@mui/material';

export interface SelfCompassionSituationCardProps {
  situation: string;
  selfCriticalThought: string;
}

export const SelfCompassionSituationCard = ({
  situation,
  selfCriticalThought,
}: SelfCompassionSituationCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack spacing={1.5}>
        <div>
          <Typography variant="overline" color="text.secondary">
            Situación
          </Typography>
          <Typography variant="body1">{situation}</Typography>
        </div>
        <div>
          <Typography variant="overline" color="text.secondary">
            Pensamiento autocrítico
          </Typography>
          <Typography variant="body1">{selfCriticalThought}</Typography>
        </div>
      </Stack>
    </CardContent>
  </Card>
);
