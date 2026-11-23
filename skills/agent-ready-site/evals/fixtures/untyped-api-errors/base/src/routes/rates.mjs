const BASE_PENCE = { standard: 395, express: 695, overnight: 1295 };
const PER_KG_PENCE = { standard: 60, express: 110, overnight: 180 };

export const rateRoutes = [
  {
    method: "POST",
    pattern: /^\/rates\/quote$/,
    handle: ({ body }) => {
      if (!Number.isInteger(body.weightGrams) || body.weightGrams <= 0) {
        return { status: 422, error: "weightGrams must be a positive integer" };
      }
      const quotes = Object.keys(BASE_PENCE).map((service) => ({
        service,
        amountPence: BASE_PENCE[service] + Math.ceil(body.weightGrams / 1000) * PER_KG_PENCE[service],
        currency: "GBP",
      }));
      return { body: { data: quotes } };
    },
  },
];
