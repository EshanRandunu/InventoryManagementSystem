import React, { useState } from "react";
import axios from "axios";

function AddItem() {
    const [item, setItem] = useState({
        itemId: "",
        itemImage: "",
        itemName: "",
        itemCategory: "",
        itemQty: "",
        itemDetails: ""
    });

    const [imageFile, setImageFile] = useState(null);

    // handle text inputs
    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        });
    };

    // handle image selection
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!item.itemId || !item.itemName || !item.itemCategory || !item.itemQty) {
            alert("Please fill in all required fields.");
            return;
        }
        if (isNaN(item.itemQty) || parseInt(item.itemQty) <= 0) {
            alert("Quantity must be a positive number.");
            return;
        }

        try {
            let imageName = "";

            // 1️⃣ Upload image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const imgRes = await axios.post(
                    "http://localhost:8080/inventory/itemImg",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                imageName = imgRes.data; // backend returns image name
            }

            // 2️⃣ Save item data (ensure itemQty is string)
            const newItem = {
                ...item,
                itemQty: item.itemQty.toString(), // Convert to string
                itemImage: imageName
            };

            await axios.post("http://localhost:8080/inventory", newItem);

            alert("Item added successfully");
            // Reset form after success
            setItem({
                itemId: "",
                itemImage: "",
                itemName: "",
                itemCategory: "",
                itemQty: "",
                itemDetails: ""
            });
            setImageFile(null);

        } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
            alert(`Error adding item: ${error.response?.data?.message || error.message}`);
        }
    };

    

    return (
        <div>
            <p className="auth_topic">Add Item Page</p>

            <div className="forme_vontiner">
                <div className="form_sub_coon">

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="itemId"
                            placeholder="Item ID"
                            value={item.itemId}
                            onChange={handleChange}
                        />

                        <input
                            type="file"
                            name="itemImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <input
                            type="text"
                            name="itemName"
                            placeholder="Item Name"
                            value={item.itemName}
                            onChange={handleChange}
                        />

                        <select
                            name="itemCategory"
                            value={item.itemCategory}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Stationery">Stationery</option>
                        </select>

                        <input
                            type="text"
                            name="itemQty"
                            placeholder="Quantity"
                            value={item.itemQty}
                            onChange={handleChange}
                        />

                        <textarea
                            name="itemDetails"
                            placeholder="Item Details"
                            value={item.itemDetails}
                            onChange={handleChange}
                        />

                        <button type="submit">Add Item</button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default AddItem;
