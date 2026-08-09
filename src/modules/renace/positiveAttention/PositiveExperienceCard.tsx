import { Card, CardContent, Stack, Typography } from '@mui/material';

interface PositiveExperienceCardProps {
  situation: string;
  description: string;
}

export const PositiveExperienceCard = ({
  situation,
  description,
}: PositiveExperienceCardProps) => (
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
            Descripción
          </Typography>
          <Typography variant="body1">{description}</Typography>
        </div>
      </Stack>
    </CardContent>
  </Card>
);
