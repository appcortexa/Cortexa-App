import { Card, CardContent, Stack, Typography } from '@mui/material';

export interface CompassionPhraseCardProps {
  title: string;
  phrase: string;
}

export const CompassionPhraseCard = ({ title, phrase }: CompassionPhraseCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack spacing={1}>
        <Typography variant="h6" component="h3">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {phrase}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);
