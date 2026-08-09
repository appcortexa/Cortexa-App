import { Card, CardContent, Stack, Typography } from '@mui/material';

export interface RelapseSituationCardProps {
  riskSituation?: string;
  warningSigns?: string[];
  copingPlan?: string;
}

export const RelapseSituationCard = ({
  riskSituation,
  warningSigns = [],
  copingPlan,
}: RelapseSituationCardProps) => (
  <Card variant="outlined" sx={{ borderRadius: 2 }}>
    <CardContent>
      <Stack spacing={1.5}>
        <div>
          <Typography variant="overline" color="text.secondary">
            Situación de riesgo
          </Typography>
          <Typography variant="body1">{riskSituation || 'Sin registrar'}</Typography>
        </div>
        <div>
          <Typography variant="overline" color="text.secondary">
            Señales
          </Typography>
          <Typography variant="body1">
            {warningSigns.length > 0 ? warningSigns.join(', ') : 'Sin registrar'}
          </Typography>
        </div>
        <div>
          <Typography variant="overline" color="text.secondary">
            Plan
          </Typography>
          <Typography variant="body1">{copingPlan || 'Sin registrar'}</Typography>
        </div>
      </Stack>
    </CardContent>
  </Card>
);
