import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FilterSidebar, { applyFilters, createEmptyFilters, sortProducts } from "../../components/product/FilterSidebar";
import ProductGrid from "../../components/product/ProductGrid";
import ProductGridSkeleton from "../../components/product/ProductGridSkeleton";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import * as productService from "../../services/productService";
import "../pages.css";

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(createEmptyFilters());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const sort = searchParams.get("sort") || "featured";

  useEffect(() => {
    setLoading(true);
    productService.getAllProducts().then((data) => {
      setAllProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFilters(createEmptyFilters());
  }, [category]);

  const baseProducts = useMemo(() => {
    if (!category) return allProducts;
    return allProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }, [allProducts, category]);

  const visibleProducts = useMemo(() => {
    const filtered = applyFilters(baseProducts, filters);
    return sortProducts(filtered, sort);
  }, [baseProducts, filters, sort]);

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    setSearchParams(params);
  };

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Shop</span>
          <h1 className="section-heading">{category || "All Products"}</h1>
        </div>
      </div>

      <div className="shop-layout">
        {!isMobile && <FilterSidebar filters={filters} onChange={setFilters} showCategory={!category} />}

        <div>
          <div className="toolbar">
            <span className="toolbar__count">{visibleProducts.length} Products</span>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {isMobile && (
                <Button variant="secondary" size="sm" onClick={() => setFiltersOpen(true)}>
                  Filters
                </Button>
              )}
              <div className="toolbar__sort">
                <select value={sort} onChange={handleSortChange} aria-label="Sort products">
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? <ProductGridSkeleton /> : <ProductGrid products={visibleProducts} emptyMessage="Try adjusting your filters." />}
        </div>
      </div>

      {isMobile && (
        <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
          <FilterSidebar filters={filters} onChange={setFilters} showCategory={!category} />
          <Button variant="primary" full style={{ marginTop: "20px" }} onClick={() => setFiltersOpen(false)}>
            Show {visibleProducts.length} Results
          </Button>
        </Modal>
      )}
    </div>
  );
}
