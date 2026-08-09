import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

export interface ProtectiveFactorOption {
  value: string;
  label: string;
}

const defaultProtectiveFactorOptions: ProtectiveFactorOption[] = [
  { value: 'support-network', label: 'Red de apoyo' },
  { value: 'professional-support', label: 'Apoyo profesional' },
  { value: 'healthy-routines', label: 'Rutinas saludables' },
  { value: 'self-care', label: 'Autocuidado' },
  { value: 'coping-skills', label: 'Habilidades de afrontamiento' },
  { value: 'meaningful-activities', label: 'Actividades significativas' },
];

export interface ProtectiveFactorSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  name?: string;
  options?: ProtectiveFactorOption[];
}

export const ProtectiveFactorSelector = ({
  value = '',
  onChange,
  label = 'Factor protector',
  name = 'protective-factor',
  options = defaultProtectiveFactorOptions,
}: ProtectiveFactorSelectorProps) => {
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
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
