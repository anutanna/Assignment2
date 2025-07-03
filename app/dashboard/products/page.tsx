"use client";
import { useState, useEffect } from "react";

export default function ProductManagement() {

    interface Business {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [selectedBusiness, setSelectedBusiness] = useState("");
const [selectedBrand, setSelectedBrand] = useState("");
const [businesses, setBusinesses] = useState<Business[]>([]);
const [brands, setBrands] = useState<Brand[]>([]);
const [stock, setStock] = useState(0);
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    stock: number;
  }


  
useEffect(() => {
    fetchProducts();
    fetchBusinesses();
    fetchBrands();
  }, []);
  
 const fetchBusinesses = async () => {
  const res = await fetch("/api/businesses");
  const data = await res.json();
  setBusinesses(data as Business[]);
};

const fetchBrands = async () => {
  const res = await fetch("/api/brands");
  const data = await res.json();
  setBrands(data as Brand[]);
};


  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data as Product[]);
  };


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

  const handleEdit = (product: Product) => {
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
  <label htmlFor="productName" className="sr-only">Product Name</label>
  <input
    id="productName"
    type="text"
    placeholder="Product Name"
    className="input input-bordered w-full"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <label htmlFor="productPrice" className="sr-only">Product Price</label>
  <input
    id="productPrice"
    type="number"
    placeholder="Price"
    className="input input-bordered w-full"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    required
  />

  <label htmlFor="productDescription" className="sr-only">Product Description</label>
  <textarea
    id="productDescription"
    placeholder="Description"
    className="textarea textarea-bordered w-full"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />

  <label htmlFor="productStock" className="sr-only">Stock quantity</label>
  <input
    id="productStock"
    type="number"
    placeholder="Stock quantity"
    className="input input-bordered w-full"
    value={stock}
    onChange={(e) => setStock(Number(e.target.value))}
    required
  />

  <label htmlFor="businessSelect" className="sr-only">Select Business</label>
  <select
    id="businessSelect"
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

  <label htmlFor="brandSelect" className="sr-only">Select Brand</label>
  <select
    id="brandSelect"
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
              placeholder="Price"
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
            {products.map((p) => (
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
