export type TimeFrame =
  | `${number}d`
  | `${number}w`
  | `${number}m`
  | `${number}y`;

export const toArea = (data: any) => {
  return Object.keys(data)
    .reverse()
    .map((key) => {
      return {
        time: key,
        value: parseFloat(data[key]["4. close"]),
      };
    });
};

export const toHistogram = (data: any) => {
  return Object.keys(data)
    .reverse()
    .map((key) => ({
      time: key,
      value: parseFloat(data[key]["5. volume"]),
    }));
};

export function* generateSingleData(
  minValue: number,
  maxValue: number
): Generator<{ time: string; value: number }> {
  // Helper function to generate a random value between min and max
  const getRandomValue = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  while (true) {
    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Generate the random value
    const value = parseFloat(getRandomValue(minValue, maxValue).toFixed(2));

    // Yield the result
    yield { time: today, value };
  }
}
