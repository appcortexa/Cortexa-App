import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

const practiceOptions = [
  { value: 'breathing', label: 'Respiración' },
  { value: 'observation', label: 'Observación' },
  { value: 'body-scan', label: 'Escaneo corporal' },
  { value: 'acceptance', label: 'Aceptación' },
  { value: 'other', label: 'Otra' },
] as const;

export interface MindfulnessPracticeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name?: string;
}

export const MindfulnessPracticeSelector = ({
  value = '',
  onChange,
  label = 'Práctica',
  name = 'practice',
}: MindfulnessPracticeSelectorProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange?.(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {practiceOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
