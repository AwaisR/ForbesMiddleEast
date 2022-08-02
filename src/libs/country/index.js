import _ from "lodash";
import { countries } from "country-data";

let country = countries.all.filter(c => c.alpha3);
const countryList = country.map(c => {
  return {
    value: c.alpha3,
    label: c.name
  };
});

export default countryList;

const codes = countries.all.filter(c => c.countryCallingCodes.length);
const phoneCodeListInitial = codes.map(c => {
  return {
    value: c.countryCallingCodes[0],
    label: `${c.emoji} ${c.name} (${c.countryCallingCodes[0]}) `
  };
});
export const phoneCodeList = _.uniqBy(phoneCodeListInitial, "value");

export const getCountryName = code => {
  return countries[code].name;
};
