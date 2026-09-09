import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/product/ProductGrid";
import ProductGridSkeleton from "../../components/product/ProductGridSkeleton";
import * as productService from "../../services/productService";
import "../pages.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService.searchProducts(query).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="container page-section">
      <div className="section-header">
        <div>
          <span className="eyebrow">// Search</span>
          <h1 className="section-heading">Results for &ldquo;{query}&rdquo;</h1>
          <p>{loading ? "Searching..." : `${results.length} products found`}</p>
        </div>
      </div>
      {loading ? <ProductGridSkeleton /> : <ProductGrid products={results} emptyMessage="Try a different search term." />}
    </div>
  );
}
