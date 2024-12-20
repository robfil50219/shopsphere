import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Productpage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0); // User's rating
  const [ratings, setRatings] = useState([]); // All ratings

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", id); // Debug: Log the product ID
      try {
        const response = await fetch(`https://v2.api.noroff.dev/online-shop/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product with ID: ${id}`);
        }
        const data = await response.json();
        console.log("Fetched Product:", data); // Debug: Log the fetched product
        setProduct(data.data); // Extract the `data` property
        setRatings(data.data?.reviews || []); // Set existing ratings (if any)
      } catch (err) {
        console.error("Error fetching product:", err.message); // Debug: Log error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (userRating < 1 || userRating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }
    const newRating = { rating: userRating };
    setRatings((prevRatings) => [...prevRatings, newRating]); // Add the new rating
    setUserRating(0); // Reset the input field
  };

  const calculateAverageRating = () => {
    if (ratings.length === 0) return "No ratings yet";
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  // Handle adding product to cart
  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productInCart = existingCart.find((item) => item.id === product.id);

    if (productInCart) {
      // Update the quantity if product already in the cart
      productInCart.quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({ ...product, quantity: 1 });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Product added to cart!");
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{product.title}</h1>

      {/* Flexbox container for image and rating */}
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        
        {/* Image Container */}
        <div style={{ flex: "1", maxWidth: "400px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={product.image?.url || "https://via.placeholder.com/300"}
            alt={product.image?.alt || product.title || "Product Image"}
            style={{
              width: "300px",
              height: "auto",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Product Details Section (including Ratings) */}
        <div style={{ flex: "1", maxWidth: "400px", textAlign: "left" }}>
          <p style={{ fontSize: "1.2rem", margin: "10px 0" }}>
            Price: ${product.discountedPrice?.toFixed(2) || "N/A"}
          </p>
          {product.price !== product.discountedPrice && (
            <p style={{ fontSize: "1rem", color: "red" }}>
              Discount: {Math.round(
                ((product.price - product.discountedPrice) / product.price) * 100
              )}
              % off
            </p>
          )}
          <p>{product.description || "No description available."}</p>

          {/* Buy Now Button */}
          <button
            onClick={() => addToCart(product)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              backgroundColor: "#00A0A0",
              color: "white",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              marginTop: "20px",
              fontSize: "16px",
            }}
          >
            <i
              className="fas fa-shopping-cart" // FontAwesome cart icon
              style={{ marginRight: "10px", fontSize: "18px" }}
            ></i>
            Buy Now
          </button>
        </div>
      </div>

      {/* Ratings Section */}
      <div style={{ marginTop: "20px" }}>
        <h2>Average Rating: {calculateAverageRating()}</h2>
        <form onSubmit={handleRatingSubmit} style={{ marginTop: "10px" }}>
          <label htmlFor="rating">Your Rating (1-5): </label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={userRating}
            onChange={(e) => setUserRating(Number(e.target.value))}
            style={{
              width: "50px",
              textAlign: "center",
              marginRight: "10px",
            }}
          />
          <button
            type="submit"
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#00A0A0",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
      </div>

      {/* List of Ratings */}
      {ratings.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Customer Ratings:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {ratings.map((r, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                Rating: {r.rating} ⭐
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Productpage;






