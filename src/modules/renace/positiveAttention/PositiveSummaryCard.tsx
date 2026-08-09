import { Card, CardContent, Typography } from '@mui/material';

export interface PositiveSummaryIndicator {
  label: string;
  value: string | number;
}

interface PositiveSummaryCardProps {
  title?: string;
  indicators: PositiveSummaryIndicator[];
}

export const PositiveSummaryCard = ({
  title = 'Resumen',
  indicators,
}: PositiveSummaryCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {indicators.map((indicator) => (
          <div
            key={indicator.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {indicator.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {indicator.value}
            </Typography>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
