import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, Calendar, Eye, Plus, ArrowUpDown, MoreHorizontal, Package, Loader2, Truck } from 'lucide-react';
import { packageService, adminService } from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Shipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [couriers, setCouriers] = useState([]);
    const [assigningId, setAssigningId] = useState(null);
    const [selectedCourier, setSelectedCourier] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchShipments();
        if (user?.role === 'ADMIN') {
            fetchCouriers();
        }
    }, [user]);

    const fetchCouriers = async () => {
        try {
            const response = await adminService.getAllUsers({ size: 100 });
            setCouriers(response.data.content.filter(u => u.role === 'COURIER'));
        } catch (err) {
            console.error("Failed to fetch couriers", err);
        }
    };

    const fetchShipments = async () => {
        try {
            setLoading(true);
            const response = await packageService.getAllPackages({ size: 100 }); 
            setShipments(response.data.content);
        } catch (err) {
            try {
                const myResp = await packageService.getMyPackages();
                setShipments(myResp.data);
            } catch (e) {
                setError('Failed to fetch shipments');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this shipment?')) return;
        try {
            await packageService.cancelPackage(id);
            fetchShipments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel shipment');
        }
    };

    const handleAssign = async () => {
        if (!selectedCourier || !assigningId) return;
        try {
            await adminService.assignCourier(assigningId, selectedCourier);
            setAssigningId(null);
            setSelectedCourier('');
            fetchShipments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign courier');
        }
    };

    const filteredShipments = shipments.filter(s => 
        s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Shipments</h1>
                    <p className="text-gray-500 text-sm md:text-base">Manage all your deliveries from one place</p>
                </div>
                <Link 
                    to="/shipments/new" 
                    className="w-full md:w-auto h-12 px-6 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> 
                    <span>Create Shipment</span>
                </Link>
            </div>

            {/* Controls Bar */}
            <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by tracking ID, name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20 transition-all text-sm placeholder-gray-600" 
                        />
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Results: {filteredShipments.length}
                    </span>
                </div>
            </div>

            {/* Shipments Table */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                {/* Mobile */}
                <div className="md:hidden divide-y divide-white/5">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-3" />
                            <p className="text-gray-500">Loading shipments...</p>
                        </div>
                    ) : filteredShipments.map((shipment, index) => (
                        <div key={shipment.id || index} className="p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                                        <Package size={18} />
                                    </div>
                                    <div>
                                        <span className="font-mono text-sm text-white font-medium block">
                                            {shipment.trackingNumber}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {shipment.packageType.replace('_', ' ')} • {shipment.weight} kg
                                        </span>
                                    </div>
                                </div>
                                <StatusBadge status={shipment.status} />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="text-gray-400">
                                    <span className="text-gray-600">To:</span> {shipment.receiver?.name}
                                </div>
                                <Link 
                                    to={`/tracking-internal?id=${shipment.trackingNumber}`}
                                    className="text-pink-500 hover:text-pink-400 font-medium text-xs"
                                >
                                    Track →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-white/5">
                            {filteredShipments.map((shipment, index) => (
                                <tr key={shipment.id || index} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center">
                                                <Package size={16} />
                                            </div>
                                            <span className="font-mono text-sm text-white font-medium">
                                                {shipment.trackingNumber}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link 
                                            to={`/tracking-internal?id=${shipment.trackingNumber}`} 
                                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-400 hover:text-pink-500 flex items-center justify-center transition-all"
                                            title="Track"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Modal */}
            {assigningId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Assign Delivery Agent</h3>
                        <select 
                            value={selectedCourier}
                            onChange={(e) => setSelectedCourier(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 text-white p-3 rounded-xl outline-none focus:border-pink-500 transition-all"
                        >
                            <option value="">Select an agent...</option>
                            {couriers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <div className="flex gap-3 pt-6">
                            <button 
                                onClick={() => setAssigningId(null)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAssign}
                                disabled={!selectedCourier}
                                className="flex-1 px-4 py-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-black font-bold transition-all disabled:opacity-50"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shipments;
