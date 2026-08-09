import { Card, CardContent, Stack, Typography } from '@mui/material';

export interface MindfulnessExperienceCardProps {
  situation?: string;
  experience: string;
  attentionTarget?: string;
  bodyArea?: string;
  emotion?: string;
  thought?: string;
  notes?: string;
}

export const MindfulnessExperienceCard = ({
  situation,
  experience,
  attentionTarget,
  bodyArea,
  emotion,
  thought,
  notes,
}: MindfulnessExperienceCardProps) => {
  const details = [
    { label: 'Situación', value: situation },
    { label: 'Experiencia', value: experience },
    { label: 'Foco de atención', value: attentionTarget },
    { label: 'Zona corporal', value: bodyArea },
    { label: 'Emoción', value: emotion },
    { label: 'Pensamiento', value: thought },
    { label: 'Notas', value: notes },
  ].filter((detail) => detail.value);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          {details.map((detail) => (
            <div key={detail.label}>
              <Typography variant="overline" color="text.secondary">
                {detail.label}
              </Typography>
              <Typography variant="body1">{detail.value}</Typography>
            </div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
