"use client";
export default function BuyNowButton({ productId, businessId }: { productId: string, businessId: string }) {
  return (
    <button
      className="btn btn-primary mt-4"
      onClick={async () => {
        try {
          const jwt = localStorage.getItem("jwt");
          if (!jwt) {
            alert("You are not logged in!");
            return;
          }

          const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`, // ✅ send your token!
            },
            body: JSON.stringify({
              shippingAddress: "123 Test Street",
              businessId,                    // ✅ include businessId
              items: [{ productId, quantity: 1 }],
            }),
          });
          const data = await res.json();
          if (res.ok) {
            alert("Order placed successfully!");
          } else {
            alert("Failed to place order: " + data.error);
          }
        } catch (error) {
            console.error("Error:", error);
          alert("An error occurred placing the order.");
        }
      }}
    >
      Buy Now
    </button>
  );
}
