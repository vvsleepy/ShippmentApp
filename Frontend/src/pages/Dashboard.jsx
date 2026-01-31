import React, { useState, useEffect } from 'react';
import { 
    Package, 
    Truck, 
    Search,
    MoreHorizontal,
    Plus,
    Minus,
    TrendingUp,
    Clock,
    CheckCircle2,
    Eye,
    Loader2
} from 'lucide-react';
import LiveMap from '../components/LiveMap';
import { adminService, packageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [fleetStats, setFleetStats] = useState({ agents: 0, hubs: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      let dashboardStats;
      if (user?.role === 'ADMIN') {
        const statsRes = await adminService.getStats();
        dashboardStats = [
          { label: 'Total Shipments', value: statsRes.data.totalPackages.toLocaleString(), change: '+12%', icon: Package, color: 'pink' },
          { label: 'In Transit', value: statsRes.data.inTransitPackages.toLocaleString(), change: '+8%', icon: Truck, color: 'blue' },
          { label: 'Delivered', value: statsRes.data.deliveredPackages.toLocaleString(), change: '+24%', icon: CheckCircle2, color: 'green' },
          { label: 'Created', value: statsRes.data.createdPackages.toLocaleString(), change: '-5%', icon: Clock, color: 'orange' },
        ];

        const packagesRes = await packageService.getAllPackages({ size: 5 });
        setOrders(packagesRes.data.content);
        setFleetStats({
          agents: statsRes.data.totalCouriers,
          hubs: 5
        });
      } else {
        const myPackagesRes = await packageService.getMyPackages();
        const myPkgs = myPackagesRes.data;
        dashboardStats = [
          { label: 'My Shipments', value: myPkgs.length.toLocaleString(), icon: Package, color: 'pink' },
          { label: 'In Transit', value: myPkgs.filter(p => p.status === 'IN_TRANSIT').length.toLocaleString(), icon: Truck, color: 'blue' },
          { label: 'Delivered', value: myPkgs.filter(p => p.status === 'DELIVERED').length.toLocaleString(), icon: CheckCircle2, color: 'green' },
          { label: 'Pending', value: myPkgs.filter(p => p.status === 'CREATED').length.toLocaleString(), icon: Clock, color: 'orange' },
        ];
        setOrders(myPkgs.slice(0, 5));
      }
      
      setStats(dashboardStats);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'IN_TRANSIT': return 'bg-pink-400/10 text-pink-400 border-pink-400/20';
      case 'PICKED_UP': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CANCELLED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-pink-400 animate-spin" />
          <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <Link to="/shipments" className="btn btn-primary shadow-lg shadow-pink-400/20 gap-2">
          <Plus size={18} />
          <span>New Shipment</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/80 border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${stat.color === 'pink' ? 'bg-pink-400/10' : ''}
                ${stat.color === 'blue' ? 'bg-blue-500/10' : ''}
                ${stat.color === 'green' ? 'bg-green-500/10' : ''}
                ${stat.color === 'orange' ? 'bg-orange-500/10' : ''}
              `}>
                <stat.icon 
                  size={20}
                  className={`
                    ${stat.color === 'pink' ? 'text-pink-400' : ''}
                    ${stat.color === 'blue' ? 'text-blue-400' : ''}
                    ${stat.color === 'green' ? 'text-green-400' : ''}
                    ${stat.color === 'orange' ? 'text-orange-400' : ''}
                  `}
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Live Feed */}
      <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-5 mb-6">
        <h3 className="text-white font-semibold mb-4">Live Feed</h3>
        {orders.slice(0, 3).map((order, idx) => (
          <div key={idx} className="flex gap-3 mb-3">
            <span className="w-2 h-2 mt-2 rounded-full bg-pink-400 animate-pulse"></span>
            <div>
              <p className="text-sm text-white">{order.trackingNumber}</p>
              <p className="text-xs text-gray-500">{order.status.replace('_',' ')}</p>
            </div>
          </div>
        ))}
        <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-[72%] bg-gradient-to-r from-pink-400 to-pink-300"></div>
        </div>
      </div>

      {/* Map */}
      <div className="h-96 rounded-3xl overflow-hidden border border-white/5">
        <LiveMap center={[20.5937, 78.9629]} zoom={5} height="100%" />
      </div>
    </div>
  );
};

export default Dashboard;
