import * as expect from "unexpected";
import { parseNumberInput as parse } from "./index";

const supportedLocales = [
  "en-US",
  "en-GB",
  "da-DK",
  "sv-SE",
  "de-DE",
  "nb-NO",
  "fr-FR",
  "es-ES",
  "it-IT",
  "nl-NL",
  "pt-BR",
  "fi-FI",
  "ja-JP",
];

const combinedTests = {
  "hould handle negative numbers": -10,
  "should handle no decimals": 1000,
  "should handle 1 decimal": 1000.1,
  "should handle 2 decimals": 1000.12,
  "should handle 3 decimals": 1000.123,
};

describe("parseFormattedNumber", () => {
  for (const locale of supportedLocales) {
    describe(`with locale '${locale}'`, () => {
      for (const combinedLocale of supportedLocales) {
        describe(`with formatted input from locale '${combinedLocale}'`, () => {
          const formatter = new Intl.NumberFormat(combinedLocale);

          for (const [testName, number] of Object.entries(combinedTests)) {
            it(testName, () => {
              expect(parse(formatter.format(number)), "to be", number);
            });
          }
        });
      }
    });
  }
});
