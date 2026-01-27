import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';// Ensure to import the autoTable plugin



function DisplayItem() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // fetch data when page loads
    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const result = await axios.get("http://localhost:8080/inventory");
            setInventory(result.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching inventory:", err);
            setError("Failed to load inventory. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            await axios.delete(`http://localhost:8080/inventory/${id}`);
            loadInventory();
        }
    };

    const generatePdf = (inventory) => {
        const doc = new jsPDF();

        doc.text("Inventory Report", 14, 16);
        
        const tableData = inventory.map(item => [
            item.itemId,
            item.itemName,
            item.itemCategory,
            item.itemQty,
            item.itemDetails
        ]);

        // 2. Call the function directly and pass 'doc' as the first argument (Fix)
        autoTable(doc, {
            head: [["Item ID", "Item Name", "Category", "Quantity", "Details"]],
            body: tableData,
            startY: 20
        });

        doc.save("inventory_item_list.pdf");
    };

    const [searchTerm, setSearchTerm] = useState("");



    const updateNavigate = (id) => {
        window.location.href = `/updateItem/${id}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>All Items Page</h1>
            <input
                type="text"
                placeholder="Search by ID, Name or Category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "15px", padding: "8px", width: "300px" }}
            />

            {inventory.length === 0 ? (
                <p>No items found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Item ID</th>
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Item Category</th>
                            <th>Item Quantity</th>
                            <th>Item Details</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.
                            filter((item) =>
                                item.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((item) => (
                            <tr key={item.id || item.itemId}>
                                <td>{item.itemId}</td>
                                <td>
                                    {item.itemImage ? (
                                        <img
                                            src={`http://localhost:8080/uploads/${item.itemImage}`}
                                            alt={item.itemName}
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        <span>No image</span>
                                    )}
                                </td>
                                <td>{item.itemName}</td>
                                <td>{item.itemCategory}</td>
                                <td>{item.itemQty}</td>
                                <td>{item.itemDetails}</td>
                                <td>
                                    <button onClick={() => updateNavigate(item.id)}>Update</button>
                                    <button
                                        style={{ marginLeft: "10px", color: "red" }}
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            )}

            <button onClick={()=>generatePdf(inventory)}>Generate PDF</button>
        </div>
    );
}

export default DisplayItem;

