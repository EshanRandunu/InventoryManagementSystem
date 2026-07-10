# 📦 Inventory Management System

A full-stack **Inventory Management System** built using **Spring Boot** and **React**.  
This application allows users to manage inventory items with image upload, search, update, delete, and PDF reporting features.

---

## 🚀 Features

- ➕ Add new inventory items  
- ✏️ Update existing items (with optional image update)  
- 🗑 Delete items  
- 📋 View all items in a table  
- 🔍 Search items by ID, name, or category  
- 🖼 Upload and display item images  
- 📄 Generate PDF reports  
- ⚡ Real-time UI updates  

---

## 🛠️ Tech Stack

### 🔹 Frontend
- React.js  
- Axios  
- jsPDF  
- jspdf-autotable  

### 🔹 Backend
- Spring Boot  
- Spring Data JPA  
- MySQL  
- REST APIs  

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
```

---

### ✏️ Edit application.properties:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/spring
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```
---

### ⚡ Run backend:
```bash
mvn spring-boot:run
```
-Backend runs on:
```bash
http://localhost:8080
```

### 🔹 Run frontend 
```bash
cd frontend
npm install
npm start
```
-Frontend runs on:
```bash
http://localhost:3000
```

