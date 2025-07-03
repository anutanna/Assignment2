import {
  FaDollarSign,
  FaUndo,
  FaShoppingCart,
  FaShoppingBasket,
} from 'react-icons/fa';
import MiniHero from '@/lib/ui/dashboard/MiniHero';
import VendorHeader from '@/lib/ui/dashboard/VendorHeader';
import PerformanceCard from '@/lib/ui/dashboard/PerformanceCard';
import OrdersTable from '@/lib/ui/dashboard/OrdersTable';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  // Performance summary: keep mock data for demo
  const performanceData = [
    { title: 'Revenue', value: '$12,426', change: 3.5, icon: <FaDollarSign size={20} /> },
    { title: 'Refunds', value: '$892', change: -1.2, icon: <FaUndo size={20} />, inverted: true },
    { title: 'Orders', value: '1,247', change: 8.3, icon: <FaShoppingCart size={20} /> },
    { title: 'Basket Size', value: '$53.40', change: 2.1, icon: <FaShoppingBasket size={20} /> },
  ];

  // Fetch current logged-in user info using your /api/auth/me endpoint:
  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/me`,
    {
      headers: { cookie: cookies().toString() },
      cache: "no-store",
    }
  );

  if (!meRes.ok) {
    // User is not logged in; redirect to login page
    redirect("/login");
  }

  const currentUserData = await meRes.json();
  const userId = currentUserData.user.id;  // Get real user ID

  // Fetch real orders for the logged-in user
  const ordersRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders?userId=${userId}`,
    { cache: "no-store" }
  );
  const ordersData = await ordersRes.json();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mini Hero Section */}
      <MiniHero
        title="Vendor Dashboard"
        backgroundImage="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop"
      />

      {/* Vendor Header with Logo and Tabs */}
      <VendorHeader
        vendorName="Shopizon"
        vendorLogo="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop"
        activeTab="Dashboard"
      />

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 pb-8">

        {/* Performance Summary Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-base-content mb-4">Performance Summary</h2>
            <div className="divider"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((data, index) => (
              <PerformanceCard
                key={index}
                title={data.title}
                value={data.value}
                change={data.change}
                icon={data.icon}
                inverted={data.inverted}
              />
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-base-content mb-4">Orders</h2>
            <div className="divider"></div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-gray-300">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <select className="select select-bordered w-full sm:w-auto">
                    <option>All Status</option>
                    <option>Complete</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Cancelled</option>
                  </select>
                </div>
              </div>

              <OrdersTable orders={ordersData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
