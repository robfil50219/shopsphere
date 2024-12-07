import React, { useEffect, useState } from "react";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://v2.api.noroff.dev/online-shop");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>ShopSphere</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
              width: "200px",
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{ width: "100%", height: "auto" }}
            />
            <h3>{product.title}</h3>
            <p>
              Price: ${product.discountedPrice.toFixed(2)}
              {product.price !== product.discountedPrice && (
                <span style={{ color: "red" }}>
                  {" "}
                  ({Math.round(
                    ((product.price - product.discountedPrice) / product.price) *
                      100
                  )}
                  % off)
                </span>
              )}
            </p>
            <button>View Product</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
