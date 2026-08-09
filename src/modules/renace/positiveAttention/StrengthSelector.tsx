import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

const strengthOptions = [
  { value: 'perseverance', label: 'Perseverancia' },
  { value: 'creativity', label: 'Creatividad' },
  { value: 'courage', label: 'Valentía' },
  { value: 'kindness', label: 'Amabilidad' },
  { value: 'curiosity', label: 'Curiosidad' },
  { value: 'patience', label: 'Paciencia' },
  { value: 'optimism', label: 'Optimismo' },
  { value: 'responsibility', label: 'Responsabilidad' },
  { value: 'other', label: 'Otra' },
] as const;

interface StrengthSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name?: string;
}

export const StrengthSelector = ({
  value = '',
  onChange,
  label = 'Fortaleza',
  name = 'strength',
}: StrengthSelectorProps) => {
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
        {strengthOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
