"use client";
import { useState, useEffect } from "react";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState("");
const [selectedBrand, setSelectedBrand] = useState("");
const [businesses, setBusinesses] = useState([]);
const [brands, setBrands] = useState([]);
const [stock, setStock] = useState(0);

useEffect(() => {
    fetchProducts();
    fetchBusinesses();
    fetchBrands();
  }, []);
  
  const fetchBusinesses = async () => {
    const res = await fetch("/api/businesses");
    const data = await res.json();
    setBusinesses(data);
  };
  
  const fetchBrands = async () => {
    const res = await fetch("/api/brands");
    const data = await res.json();
    setBrands(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          description,
          stock, 
          businessId: selectedBusiness,
          brandId: selectedBrand,
        }),
      });
      
    const data = await res.json();
    if (res.ok) {
      setMessage("Product added!");
      setName("");
      setPrice("");
      setDescription("");
      fetchProducts();
    } else {
      setMessage(data.error || "Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Product deleted!");
      fetchProducts();
    } else {
      setMessage("Failed to delete product");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const res = await fetch(`/api/products/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingProduct.name,
        price: parseFloat(editingProduct.price),
        description: editingProduct.description,
      }),
    });
    if (res.ok) {
      setMessage("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } else {
      setMessage("Failed to update product");
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
  <input
    type="text"
    placeholder="Product Name"
    className="input input-bordered w-full"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
  <input
    type="number"
    placeholder="Price"
    className="input input-bordered w-full"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
  />
  <textarea
    placeholder="Description"
    className="textarea textarea-bordered w-full"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

<input
  type="number"
  placeholder="Stock quantity"
  className="input input-bordered w-full"
  value={stock}
  onChange={(e) => setStock(Number(e.target.value))}
  required
/>

  <select
    required
    value={selectedBusiness}
    onChange={(e) => setSelectedBusiness(e.target.value)}
    className="select select-bordered w-full"
  >
    <option value="">Select Business</option>
    {businesses.map((b) => (
      <option key={b.id} value={b.id}>{b.name}</option>
    ))}
  </select>

  <select
    required
    value={selectedBrand}
    onChange={(e) => setSelectedBrand(e.target.value)}
    className="select select-bordered w-full"
  >
    <option value="">Select Brand</option>
    {brands.map((b) => (
      <option key={b.id} value={b.id}>{b.name}</option>
    ))}
  </select>

  <button type="submit" className="btn btn-primary w-full">
    Add Product
  </button>
</form>


      {/* Edit Product Form */}
      {editingProduct && (
        <div className="mb-6 p-4 border border-primary rounded">
          <h2 className="text-lg font-bold mb-2">Edit Product</h2>
          <form onSubmit={handleUpdate} className="space-y-2">
            <input
              type="text"
              className="input input-bordered w-full"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              required
            />
            <input
              type="number"
              className="input input-bordered w-full"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
              required
            />
            <textarea
              className="textarea textarea-bordered w-full"
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />
            <button type="submit" className="btn btn-primary w-full">
              Update Product
            </button>
            <button
              type="button"
              className="btn btn-ghost w-full"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {message && <p className="mb-4 text-success">{message}</p>}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.description}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-info btn-xs"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
