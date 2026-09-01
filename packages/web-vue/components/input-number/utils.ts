import NP from 'number-precision';

/**
 * Replace number.toFixed with Math.round
 */
export function toFixed(number: number, precision: number): string {
  const pow = 10 ** precision;
  return (Math.round(number * pow) / pow).toFixed(precision);
}

/**
 * Convert number to non-scientific notation
 */
export function toSafeString(number: number | string): string {
  const nativeNumberStr = number.toString();
  if (Number.isNaN(+number) || !nativeNumberStr.includes('e')) {
    return nativeNumberStr;
  }

  try {
    const isNegative = number < 0;
    const absoluteValue = Math.abs(+number);
    const digitLength = NP.digitLength(absoluteValue);
    const integerNum = NP.float2Fixed(absoluteValue);
    const integerStr = integerNum
      .toString()
      .replace(/e\+(\d+)/i, (_, $1) => new Array(+$1).fill(0).join(''));

    return `${isNegative ? '-' : ''}${
      digitLength === 0
        ? integerStr
        : integerStr.replace(new RegExp(`\\d{1,${digitLength}}$`), (match) => {
            const decimalStr = `${new Array(digitLength)
              .fill(0)
              .join('')}${match}`.slice(-digitLength);
            return `${integerStr.length <= digitLength ? 0 : ''}.${decimalStr}`;
          })
    }`;
  } catch (e) {
    // fallback to native string conversion
  }

  return nativeNumberStr;
}
