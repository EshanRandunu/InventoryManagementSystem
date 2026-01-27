import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateItem() {
    const { id } = useParams(); // get item id from URL
    const navigate = useNavigate();

    const [item, setItem] = useState({
        itemName: "",
        itemCategory: "",
        itemQty: "",
        itemDetails: ""
    });

    const [imageFile, setImageFile] = useState(null);

    // 1️⃣ Load item data when page opens
    useEffect(() => {
        loadItem();
    }, []);

    const loadItem = async () => {
        const result = await axios.get(`http://localhost:8080/inventory/${id}`);
        setItem(result.data);
    };

    // 2️⃣ Handle text change
    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        });
    };

    // 3️⃣ Handle image change
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // 4️⃣ Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append(
            "itemDetails",
            new Blob([JSON.stringify(item)], { type: "application/json" })
        );

        if (imageFile) {
            formData.append("file", imageFile);
        }

        await axios.put(`http://localhost:8080/inventory/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        alert("Item updated successfully");
        navigate("/");
    };

    return (
        <div>
            <h2>Update Item</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="itemName"
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
                </select>

                <input
                    type="number"
                    name="itemQty"
                    value={item.itemQty}
                    onChange={handleChange}
                />

                <textarea
                    name="itemDetails"
                    value={item.itemDetails}
                    onChange={handleChange}
                />

                <input type="file" onChange={handleImageChange} />

                <button type="submit">Update Item</button>
            </form>
        </div>
    );
}

export default UpdateItem;
