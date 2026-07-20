export const getFeaturedProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products
    .filter(
      (product) =>
        product &&
        typeof product.id === 'string' &&
        product.id.trim() &&
        typeof product.name === 'string' &&
        product.name.trim() &&
        product.featured === true,
    )
    .sort(
      (firstProduct, secondProduct) =>
        (Number.isFinite(firstProduct.sortOrder)
          ? firstProduct.sortOrder
          : Number.MAX_SAFE_INTEGER) -
        (Number.isFinite(secondProduct.sortOrder)
          ? secondProduct.sortOrder
          : Number.MAX_SAFE_INTEGER),
    );
};

export const getProductCategories = (products) => [
  ...new Set(
    (Array.isArray(products) ? products : [])
      .map((product) => product?.category?.trim())
      .filter(Boolean),
  ),
];
