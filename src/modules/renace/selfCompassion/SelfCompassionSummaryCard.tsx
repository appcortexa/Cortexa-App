import { Card, CardContent, Stack, Typography } from '@mui/material';

export interface SelfCompassionSummaryIndicator {
  label: string;
  value: string | number;
}

export interface SelfCompassionSummaryCardProps {
  title?: string;
  indicators: SelfCompassionSummaryIndicator[];
}

export const SelfCompassionSummaryCard = ({
  title,
  indicators,
}: SelfCompassionSummaryCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack spacing={1.5}>
        {title ? (
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        ) : null}
        {indicators.map((indicator) => (
          <Stack
            key={indicator.label}
            direction="row"
            sx={{ justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {indicator.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {indicator.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);
