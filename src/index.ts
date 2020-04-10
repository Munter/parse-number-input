// Assumption: Everyone uses + and - to indicate a negative number
const minusSign = "-";
const plusSign = "+";

// See https://brilliantmaps.com/decimals/
const validDecimalSeperators = [
  ".", // dot
  ",", // comma
  "٫", // Arabic decimal seperator. See https://en.wikipedia.org/wiki/Decimal_separator#Other_numeral_systems
];

type NumberGroup = {
  type: "NumberGroup";
  value: string;
  length: number;
};

type Seperator = {
  type: "Seperator";
  value: string;
};

type DecimalSeperator = {
  type: "DecimalSeperator";
  value: string;
};

type ThousandSeperator = {
  type: "ThousandSeperator";
  value: string;
};

const isNumberRegex = /\d/;

export function parser(numString: string) {
  const chars = [...numString.trim()];
  const tokens: Array<NumberGroup | Seperator> = [];

  const firstChar = chars[0];
  let currentToken: NumberGroup | Seperator = isNumberRegex.test(firstChar)
    ? {
        type: "NumberGroup",
        value: "",
        length: 0,
      }
    : {
        type: "Seperator",
        value: "",
      };

  for (const char of chars) {
    if (isNumberRegex.test(char)) {
      if (currentToken && currentToken.type !== "NumberGroup") {
        tokens.push(currentToken);
      }

      if (currentToken.type === "NumberGroup") {
        currentToken.value += char;
        currentToken.length += 1;
      } else {
        currentToken = {
          type: "NumberGroup",
          value: char,
          length: 1,
        };
      }
    } else {
      if (currentToken && currentToken.type !== "Seperator") {
        tokens.push(currentToken);
      }

      if (currentToken && currentToken.type === "Seperator") {
        currentToken.value += char;
      } else {
        currentToken = {
          type: "Seperator",
          value: char,
        };
      }
    }
  }

  tokens.push(currentToken);

  // Hypothesis: White space characters can never be used as a decimal point indicator
  // Conclusion: White space charaters are safe to trim away, and resulting empty Seperator groups can be filtered out
  let cleanTokens = tokens
    .map((token) => {
      if (token.type === "Seperator") {
        token.value = token.value.trim();
      }

      return token;
    })
    .filter((token) => token.value !== "");

  // Hypothesis: No numbering system has indicators affecting the value of the number after the last number literal
  // Conclusion: We can remove all non-number trailing tokens
  const reversedTokens = [...cleanTokens].reverse();
  const lastNumberToken = reversedTokens.find(
    (token) => token.type === "NumberGroup"
  );
  if (lastNumberToken) {
    cleanTokens = cleanTokens.slice(0, cleanTokens.indexOf(lastNumberToken));
  }

  // Attempt to qualify seperators into decimal and thousand seperators

  return cleanTokens;
}

export function parseNumberInput(formattedString: string, locale?: string) {
  // Clean up input
  let numString = formattedString.trim();

  // Handle positive/negative signs
  const isNegative = numString.startsWith(minusSign);
  const negativeMultiplier = isNegative ? -1 : 1;

  if (isNegative || numString.startsWith(plusSign)) {
    numString = numString.slice(1);
  }

  // Inifinity
  if (numString === "∞") {
    return Infinity * negativeMultiplier;
  }

  // Extremely naive: Remove all non-numbers
  // numString = numString.replace(/[^\d]/g, "");

  let result;

  result = parseFloat(numString) * negativeMultiplier;

  const input = formattedString.split(/[^\d]/g).join("");
  const output = result.toString().split(/[^\d]/g).join("");

  if (input !== output) {
    console.log({
      formattedString,
      input,
      output,
      result,
      parsed: parser(formattedString),
    });
  }

  return result;
}
