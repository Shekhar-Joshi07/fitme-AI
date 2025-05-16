import countryList from 'react-select-country-list';

export const getCountries = () => {
  return countryList().getData().map(country => ({
    value: country.value,
    label: country.label
  }));
}; 