const DEFAULT_PRODUCT_QUERY_ENDPOINT = "/api/products/direct-query";

function getProductQueryEndpoint() {
  return (
    import.meta.env.VITE_REACT_APP_PRODUCT_QUERY_ENDPOINT ||
    DEFAULT_PRODUCT_QUERY_ENDPOINT
  );
}

function rowsFromResponse(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.rows)) {
    return payload.data.rows;
  }

  return [];
}

export default async function DirectProductQueryFunction(productType, filters) {
  const response = await fetch(getProductQueryEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productType, filters }),
  });

  if (!response.ok) {
    throw new Error(`Product query failed with status ${response.status}`);
  }

  const payload = await response.json();
  return rowsFromResponse(payload)[0];
}
