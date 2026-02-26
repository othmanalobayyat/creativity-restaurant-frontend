export function filterProducts(products, { search, selectedCategory }) {
  const s = (search || "").trim().toLowerCase();

  return products.filter((item) => {
    const matchCategory =
      selectedCategory === "0" ||
      item.category_id?.toString() === selectedCategory;

    const matchSearch = !s || item.name?.toLowerCase().includes(s);

    return matchCategory && matchSearch;
  });
}
