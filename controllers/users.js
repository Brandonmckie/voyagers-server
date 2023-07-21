import Itinerary from "../models/Itinerary.js";
import User from "../models/User.js";
import userService from "../services/userService.js";
import { mediaUpload } from "../utils/amazonUpload.js";
import stripe from "../utils/stripe.js";

let countries = {
  Asia: [
    {
      code: "AF",
      country: "Afghanistan",
    },
    {
      code: "AM",
      country: "Armenia",
    },
    {
      code: "AZ",
      country: "Azerbaijan",
    },
    {
      code: "BH",
      country: "Bahrain",
    },
    {
      code: "BD",
      country: "Bangladesh",
    },
    {
      code: "BT",
      country: "Bhutan",
    },
    {
      code: "KH",
      country: "Cambodia",
    },
    {
      code: "CN",
      country: "China",
    },
    {
      code: "CY",
      country: "Cyprus",
    },
    {
      code: "GE",
      country: "Georgia",
    },
    {
      code: "HK",
      country: "Hong Kong",
    },
    {
      code: "IN",
      country: "India",
    },
    {
      code: "ID",
      country: "Indonesia",
    },
    {
      code: "IQ",
      country: "Iraq",
    },
    {
      code: "IL",
      country: "Israel",
    },
    {
      code: "JP",
      country: "Japan",
    },
    {
      code: "JO",
      country: "Jordan",
    },
    {
      code: "KZ",
      country: "Kazakhstan",
    },
    {
      code: "KW",
      country: "Kuwait",
    },
    {
      code: "KG",
      country: "Kyrgyzstan",
    },
    {
      code: "LB",
      country: "Lebanon",
    },
    {
      code: "MO",
      country: "Macao",
    },
    {
      code: "MY",
      country: "Malaysia",
    },
    {
      code: "MV",
      country: "Maldives",
    },
    {
      code: "MN",
      country: "Mongolia",
    },
    {
      code: "MM",
      country: "Myanmar",
    },
    {
      code: "NP",
      country: "Nepal",
    },
    {
      code: "OM",
      country: "Oman",
    },
    {
      code: "PK",
      country: "Pakistan",
    },
    {
      code: "PH",
      country: "Philippines",
    },
    {
      code: "QA",
      country: "Qatar",
    },
    {
      code: "SA",
      country: "Saudi Arabia",
    },
    {
      code: "SG",
      country: "Singapore",
    },
    {
      code: "LK",
      country: "Sri Lanka",
    },
    {
      code: "TJ",
      country: "Tajikistan",
    },
    {
      code: "TH",
      country: "Thailand",
    },
    {
      code: "TR",
      country: "Turkey",
    },
    {
      code: "TM",
      country: "Turkmenistan",
    },
    {
      code: "AE",
      country: "United Arab Emirates",
    },
    {
      code: "UZ",
      country: "Uzbekistan",
    },
    {
      code: "YE",
      country: "Yemen",
    },
  ],
  Europe: [
    {
      code: "AL",
      country: "Albania",
    },
    {
      code: "AD",
      country: "Andorra",
    },
    {
      code: "AT",
      country: "Austria",
    },
    {
      code: "BY",
      country: "Belarus",
    },
    {
      code: "BE",
      country: "Belgium",
    },
    {
      code: "BA",
      country: "Bosnia and Herzegovina",
    },
    {
      code: "BG",
      country: "Bulgaria",
    },
    {
      code: "HR",
      country: "Croatia",
    },
    {
      code: "CZ",
      country: "Czech Republic",
    },
    {
      code: "DK",
      country: "Denmark",
    },
    {
      code: "EE",
      country: "Estonia",
    },
    {
      code: "FO",
      country: "Faroe Islands",
    },
    {
      code: "FI",
      country: "Finland",
    },
    {
      code: "FR",
      country: "France",
    },
    {
      code: "DE",
      country: "Germany",
    },
    {
      code: "GI",
      country: "Gibraltar",
    },
    {
      code: "GR",
      country: "Greece",
    },
    {
      code: "VA",
      country: "Holy See (Vatican City State)",
    },
    {
      code: "HU",
      country: "Hungary",
    },
    {
      code: "IS",
      country: "Iceland",
    },
    {
      code: "IE",
      country: "Ireland",
    },
    {
      code: "IT",
      country: "Italy",
    },
    {
      code: "LV",
      country: "Latvia",
    },
    {
      code: "LI",
      country: "Liechtenstein",
    },
    {
      code: "LT",
      country: "Lithuania",
    },
    {
      code: "LU",
      country: "Luxembourg",
    },
    {
      code: "MT",
      country: "Malta",
    },
    {
      code: "MC",
      country: "Monaco",
    },
    {
      code: "ME",
      country: "Montenegro",
    },
    {
      code: "NL",
      country: "Netherlands",
    },
    {
      code: "NO",
      country: "Norway",
    },
    {
      code: "PL",
      country: "Poland",
    },
    {
      code: "PT",
      country: "Portugal",
    },
    {
      code: "RO",
      country: "Romania",
    },
    {
      code: "RU",
      country: "Russian Federation",
    },
    {
      code: "SM",
      country: "San Marino",
    },
    {
      code: "RS",
      country: "Serbia",
    },
    {
      code: "SK",
      country: "Slovakia",
    },
    {
      code: "SI",
      country: "Slovenia",
    },
    {
      code: "ES",
      country: "Spain",
    },
    {
      code: "SJ",
      country: "Svalbard and Jan Mayen",
    },
    {
      code: "SE",
      country: "Sweden",
    },
    {
      code: "CH",
      country: "Switzerland",
    },
    {
      code: "UA",
      country: "Ukraine",
    },
    {
      code: "GB",
      country: "United Kingdom",
    },
  ],
  Africa: [
    {
      code: "DZ",
      country: "Algeria",
    },
    {
      code: "AO",
      country: "Angola",
    },
    {
      code: "BJ",
      country: "Benin",
    },
    {
      code: "BW",
      country: "Botswana",
    },
    {
      code: "IO",
      country: "British Indian Ocean Territory",
    },
    {
      code: "BF",
      country: "Burkina Faso",
    },
    {
      code: "BI",
      country: "Burundi",
    },
    {
      code: "CM",
      country: "Cameroon",
    },
    {
      code: "CV",
      country: "Cape Verde",
    },
    {
      code: "CF",
      country: "Central African Republic",
    },
    {
      code: "TD",
      country: "Chad",
    },
    {
      code: "KM",
      country: "Comoros",
    },
    {
      code: "CG",
      country: "Congo",
    },
    {
      code: "DJ",
      country: "Djibouti",
    },
    {
      code: "EG",
      country: "Egypt",
    },
    {
      code: "GQ",
      country: "Equatorial Guinea",
    },
    {
      code: "ER",
      country: "Eritrea",
    },
    {
      code: "ET",
      country: "Ethiopia",
    },
    {
      code: "GA",
      country: "Gabon",
    },
    {
      code: "GM",
      country: "Gambia",
    },
    {
      code: "GH",
      country: "Ghana",
    },
    {
      code: "GN",
      country: "Guinea",
    },
    {
      code: "GW",
      country: "Guinea-Bissau",
    },
    {
      code: "KE",
      country: "Kenya",
    },
    {
      code: "LS",
      country: "Lesotho",
    },
    {
      code: "LR",
      country: "Liberia",
    },
    {
      code: "LY",
      country: "Libyan Arab Jamahiriya",
    },
    {
      code: "MG",
      country: "Madagascar",
    },
    {
      code: "MW",
      country: "Malawi",
    },
    {
      code: "ML",
      country: "Mali",
    },
    {
      code: "MR",
      country: "Mauritania",
    },
    {
      code: "MU",
      country: "Mauritius",
    },
    {
      code: "YT",
      country: "Mayotte",
    },
    {
      code: "MA",
      country: "Morocco",
    },
    {
      code: "MZ",
      country: "Mozambique",
    },
    {
      code: "NA",
      country: "Namibia",
    },
    {
      code: "NE",
      country: "Niger",
    },
    {
      code: "NG",
      country: "Nigeria",
    },
    {
      code: "RE",
      country: "Reunion",
    },
    {
      code: "RW",
      country: "Rwanda",
    },
    {
      code: "SH",
      country: "Saint Helena",
    },
    {
      code: "ST",
      country: "Sao Tome and Principe",
    },
    {
      code: "SN",
      country: "Senegal",
    },
    {
      code: "SC",
      country: "Seychelles",
    },
    {
      code: "SL",
      country: "Sierra Leone",
    },
    {
      code: "SO",
      country: "Somalia",
    },
    {
      code: "ZA",
      country: "South Africa",
    },
    {
      code: "SS",
      country: "South Sudan",
    },
    {
      code: "SD",
      country: "Sudan",
    },
    {
      code: "SZ",
      country: "Swaziland",
    },
    {
      code: "TG",
      country: "Togo",
    },
    {
      code: "TN",
      country: "Tunisia",
    },
    {
      code: "UG",
      country: "Uganda",
    },
    {
      code: "EH",
      country: "Western Sahara",
    },
    {
      code: "ZM",
      country: "Zambia",
    },
    {
      code: "ZW",
      country: "Zimbabwe",
    },
  ],
  Oceania: [
    {
      code: "AS",
      country: "American Samoa",
    },
    {
      code: "AU",
      country: "Australia",
    },
    {
      code: "CX",
      country: "Christmas Island",
    },
    {
      code: "CC",
      country: "Cocos (Keeling) Islands",
    },
    {
      code: "CK",
      country: "Cook Islands",
    },
    {
      code: "PF",
      country: "French Polynesia",
    },
    {
      code: "GU",
      country: "Guam",
    },
    {
      code: "KI",
      country: "Kiribati",
    },
    {
      code: "MH",
      country: "Marshall Islands",
    },
    {
      code: "FM",
      country: "Micronesia, Federated States of",
    },
    {
      code: "NR",
      country: "Nauru",
    },
    {
      code: "NC",
      country: "New Caledonia",
    },
    {
      code: "NZ",
      country: "New Zealand",
    },
    {
      code: "NU",
      country: "Niue",
    },
    {
      code: "NF",
      country: "Norfolk Island",
    },
    {
      code: "MP",
      country: "Northern Mariana Islands",
    },
    {
      code: "PW",
      country: "Palau",
    },
    {
      code: "PG",
      country: "Papua New Guinea",
    },
    {
      code: "PN",
      country: "Pitcairn",
    },
    {
      code: "WS",
      country: "Samoa",
    },
    {
      code: "SB",
      country: "Solomon Islands",
    },
    {
      code: "TK",
      country: "Tokelau",
    },
    {
      code: "TO",
      country: "Tonga",
    },
    {
      code: "TV",
      country: "Tuvalu",
    },
    {
      code: "UM",
      country: "United States Minor Outlying Islands",
    },
    {
      code: "VU",
      country: "Vanuatu",
    },
    {
      code: "WF",
      country: "Wallis and Futuna",
    },
  ],
  "North America": [
    {
      code: "AI",
      country: "Anguilla",
    },
    {
      code: "AG",
      country: "Antigua and Barbuda",
    },
    {
      code: "AW",
      country: "Aruba",
    },
    {
      code: "BS",
      country: "Bahamas",
    },
    {
      code: "BB",
      country: "Barbados",
    },
    {
      code: "BZ",
      country: "Belize",
    },
    {
      code: "BM",
      country: "Bermuda",
    },
    {
      code: "CA",
      country: "Canada",
    },
    {
      code: "KY",
      country: "Cayman Islands",
    },
    {
      code: "CR",
      country: "Costa Rica",
    },
    {
      code: "CU",
      country: "Cuba",
    },
    {
      code: "DM",
      country: "Dominica",
    },
    {
      code: "DO",
      country: "Dominican Republic",
    },
    {
      code: "SV",
      country: "El Salvador",
    },
    {
      code: "GL",
      country: "Greenland",
    },
    {
      code: "GD",
      country: "Grenada",
    },
    {
      code: "GP",
      country: "Guadeloupe",
    },
    {
      code: "GT",
      country: "Guatemala",
    },
    {
      code: "HT",
      country: "Haiti",
    },
    {
      code: "HN",
      country: "Honduras",
    },
    {
      code: "JM",
      country: "Jamaica",
    },
    {
      code: "MQ",
      country: "Martinique",
    },
    {
      code: "MX",
      country: "Mexico",
    },
    {
      code: "MS",
      country: "Montserrat",
    },
    {
      code: "AN",
      country: "Netherlands Antilles",
    },
    {
      code: "NI",
      country: "Nicaragua",
    },
    {
      code: "PA",
      country: "Panama",
    },
    {
      code: "PR",
      country: "Puerto Rico",
    },
    {
      code: "KN",
      country: "Saint Kitts and Nevis",
    },
    {
      code: "LC",
      country: "Saint Lucia",
    },
    {
      code: "PM",
      country: "Saint Pierre and Miquelon",
    },
    {
      code: "VC",
      country: "Saint Vincent and the Grenadines",
    },
    {
      code: "TT",
      country: "Trinidad and Tobago",
    },
    {
      code: "TC",
      country: "Turks and Caicos Islands",
    },
    {
      code: "US",
      country: "United States",
    },
    {
      code: "VG",
      country: "Virgin Islands, British",
    },
  ],
  Antarctica: [
    {
      code: "AQ",
      country: "Antarctica",
    },
    {
      code: "BV",
      country: "Bouvet Island",
    },
    {
      code: "GS",
      country: "South Georgia and the South Sandwich Islands",
    },
  ],
  "South America": [
    {
      code: "AR",
      country: "Argentina",
    },
    {
      code: "BO",
      country: "Bolivia",
    },
    {
      code: "BR",
      country: "Brazil",
    },
    {
      code: "CL",
      country: "Chile",
    },
    {
      code: "CO",
      country: "Colombia",
    },
    {
      code: "EC",
      country: "Ecuador",
    },
    {
      code: "GF",
      country: "French Guiana",
    },
    {
      code: "GY",
      country: "Guyana",
    },
    {
      code: "PY",
      country: "Paraguay",
    },
    {
      code: "PE",
      country: "Peru",
    },
    {
      code: "SR",
      country: "Suriname",
    },
    {
      code: "UY",
      country: "Uruguay",
    },
    {
      code: "VE",
      country: "Venezuela",
    },
  ],
};

class UserController {
  async login(req, res) {
    try {
      let { values, isValid, errors } = userService.validateLoginInput(
        req.body
      );

      if (!isValid) {
        return res.status(400).json(errors);
      }

      let { status, token, error } = await userService.loginUser(values);

      if (status === "OK") {
        return res.send({ token });
      } else {
        return res
          .status(401)
          .json(error || { error: "email/password is wrong" });
      }
    } catch (err) {
      console.log(console.log(err));
    }
  }

  async addUser(req, res) {
    try {
      let { values, errors, isValid } = userService.validateRegisterInput(
        req.body
      );

      if (!isValid) {
        return res.status(400).json(errors);
      }

      const { status, error, token } = await userService.addUser(values);

      if (status === "OK") {
        return res.status(201).send({ token });
      } else {
        return res.status(400).send(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select("+email +accountId");

      const destinationAccount = await stripe.accounts.retrieve(user.accountId);
      res.send({
        user: {
          ...user._doc,
          stripeConnected:
            destinationAccount?.capabilities?.transfers === "active",
        },
      });

      if (user) {
        let updatedUser = await User.findByIdAndUpdate(req.user.id, {
          $set: {
            stripeConnected:
              destinationAccount?.capabilities?.transfers === "active",
          },
        });
        console.log(updatedUser);
        return;
      } else {
        return res.status(400).send({ error: "Something went wrong" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  verifyToken(req, res) {
    try {
      return res.status(200).json({ message: "Token verified" });
    } catch (error) {
      console.log(error);
    }
  }
async getCountries(req, res) {
  try {
    const itineraries = await Itinerary.find();
    const filteredCountries = {};

    Object.entries(countries).forEach(([countryKey, countryValues]) => {
      const uniqueCountries = [];
      itineraries.forEach((itinerary) => {
        const country = countryValues.find((val) => itinerary.country === val.code);

        if (country && !uniqueCountries.some((c) => c.code === country.code)) {
          uniqueCountries.push(country);
        }
      });

      if (uniqueCountries.length > 0) {
        filteredCountries[countryKey] = uniqueCountries;
      }
    });

    return res.send(filteredCountries);
  } catch (err) {
    console.log(err);
  }
}


  async getCountriesld(req, res) {
    try {
      const itineraries = await Itinerary.find();
      let filteredCountries = {};

      Object.entries(countries).filter((each) => {
        itineraries.map((itinerary) => {
          console.log(itinerary.country, each[1]);
          let country = each[1].find((val) => itinerary.country === val.code);

          if (country) {
            filteredCountries[each[0]] = filteredCountries[each[0]]
              ? [...filteredCountries[each[0]], country]
              : [country];
          }
        });
      });

      return res.send(filteredCountries);
    } catch (err) {
      console.log(err);
    }
  }

  async updateUser(req, res) {
    try {
      let image;
      if (req.files) {
        let url = await mediaUpload(req.files);
        image = url;
      } else {
        image = req.body.image;
      }

      const user = await userService.updateUser({ ...req.body, image }, req.user.id);
      console.log(user);
      return res.send(user);
    } catch (err) {
      console.log(err);
    }
  }
}
export default new UserController();
