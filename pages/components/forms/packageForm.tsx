import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

const PackageForm = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [packageTypes, setPackageTypes] = useState([]);
    const [selectedPackageType, setSelectedPackageType] = useState("");
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/Packages', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    warehouse_id: selectedWarehouse,
                    customer_id: selectedCustomer,
                    package_type_id: selectedPackageType
                }),
              });
              if (response.ok) {
                const responseData = await response.json();
                toast.success(responseData.message);
                setModalIsOpen(false);
              } else {
                const responseData = await response.json();
                toast.error(responseData.error);
              }
        } catch (error) {
            toast.error(error);
        }
    };

    useEffect(() => {
        async function fetchPackageTypes() {
            try {
                const response = await fetch("/api/PackageTypes");
                if (response.ok) {
                    const responseData = await response.json();
                    setPackageTypes(responseData);
                } else {
                    console.error("Error fetching package types");
                }
            } catch (error) {
                console.error("Error fetching package types:", error);
            }
        }
        async function fetchWarehouses() {
            try {
                const response = await fetch("/api/Warehouse");
                if (response.ok) {
                    const responseData = await response.json();
                    const uniqueWarehouseIds = new Set();
                    const uniqueWarehouses = responseData.filter(
                        (warehouse) => {
                            if (
                                !uniqueWarehouseIds.has(warehouse.warehouse_id)
                            ) {
                                uniqueWarehouseIds.add(warehouse.warehouse_id);
                                return true;
                            }
                            return false;
                        }
                    );

                    setWarehouses(uniqueWarehouses);
                } else {
                    console.error("Error fetching warehouse");
                }
            } catch (error) {
                console.error("Error fetching warehouse", error);
            }
        }
        async function fetchCustomers() {
            try {
                const response = await fetch("/api/Customer");
                if (response.ok) {
                    const responseData = await response.json();
                    setCustomers(responseData);
                } else {
                    console.error("Error fetching customers");
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        }
        fetchPackageTypes();
        fetchWarehouses();
        fetchCustomers();
    }, []);

    useEffect(() => {
        async function fetchWarehousePackageTypes() {
            try {
                const response = await fetch(
                    `/api/PackageTypes?warehouse_id=${selectedWarehouse}`
                );
                if (response.ok) {
                    const responseData = await response.json();
                    const filteredPackageTypes = responseData.filter(
                        (packageType) => packageType.available_capacity !== 0
                    );
                    console.log(filteredPackageTypes);
                    setPackageTypes(filteredPackageTypes);
                } else {
                    console.error("Error fetching package types");
                }
            } catch (error) {
                console.error("Error fetching package types:", error);
            }
        }
        fetchWarehousePackageTypes();
    }, [selectedWarehouse]);

    return (
        <div>
            <button
                onClick={() => setModalIsOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Store Package
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Package Form Modal"
                className="bg-white rounded-lg p-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-blue-300"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                    content: {
                        width: "80%",
                        maxWidth: "600px",
                    },
                }}
            >
                <h2 className="text-2xl mb-4">Package Form</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Customer:</label>
                        <select
                            required
                            value={selectedCustomer}
                            onChange={(e) =>
                                setSelectedCustomer(e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.first_name +
                                        "    " +
                                        customer.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block">Warehouse:</label>
                        <select
                            required
                            value={selectedWarehouse}
                            onChange={(e) =>
                                setSelectedWarehouse(e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a warehouse</option>
                            {warehouses.map((warehouse) => (
                                <option
                                    key={warehouse.warehouse_id}
                                    value={warehouse.warehouse_id}
                                >
                                    {warehouse.warehouse_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block">Package Type:</label>
                        <select
                            required
                            value={selectedPackageType}
                            onChange={(e) =>
                                setSelectedPackageType(e.target.value)
                            }
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a package type</option>
                            {packageTypes.map((packageType) => (
                                <option
                                    key={packageType.id || packageType.package_type_id}
                                    value={packageType.id || packageType.package_type_id}
                                >
                                    {packageType.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setModalIsOpen(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PackageForm;
