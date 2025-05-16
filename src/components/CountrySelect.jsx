import { useMemo } from 'react';
import Select from 'react-select';
import { getCountries } from '../data/countries';
import Flag from 'react-world-flags';

const CountrySelect = ({ value, onChange, mode }) => {
  const countries = useMemo(() => {
    return getCountries().map(country => ({
      ...country,
      component: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flag 
            code={country.value.toLowerCase()} 
            width="24"
          />
          {country.label}
        </div>
      )
    }));
  }, []);

  return (
    <Select
      options={countries}
      value={countries.find(option => option.value === value)}
      onChange={(option) => onChange(option?.value)}
      formatOptionLabel={option => option.component}
      placeholder="Select your country"
      styles={{
        control: (base) => ({
          ...base,
          padding: '0.3rem',
          borderRadius: '12px',
          border: `2px solid ${mode === 'dark' ? '#424242' : '#e1e1e1'}`,
          backgroundColor: mode === 'dark' ? '#424242' : 'white',
          '&:hover': {
            borderColor: '#007bff'
          }
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
          backgroundColor: mode === 'dark' ? '#424242' : 'white',
        }),
        singleValue: (base) => ({
          ...base,
          color: mode === 'dark' ? 'white' : 'inherit',
        }),
        input: (base) => ({
          ...base,
          color: mode === 'dark' ? 'white' : 'inherit',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused 
            ? mode === 'dark' ? '#616161' : '#f5f5f5'
            : mode === 'dark' ? '#424242' : 'white',
          color: mode === 'dark' ? 'white' : 'inherit',
        }),
      }}
      isSearchable
    />
  );
};

export default CountrySelect; 