

This is a modern, full-stack mini e-commerce web application.

## Technologies Used

### Frontend
- **Language:** JavaScript (ES6+)
- **Library:** React (with hooks and functional components)
- **Styling:** Tailwind CSS for UI and responsive design

### Backend
- **Language:** Node.js
- **Framework:** Express.js

### Database
- **Type:** SQL
- **Engine:** PostgreSQL

## Features

- **Product Browsing:**  
  - View a catalog of products with images, prices, and available stock.
  - Category-based filtering and live search.
  - "No products found" messaging for empty queries.

- **Cart Functionality:**  
  - Add products to your cart from the main view.
  - Real-time, animated feedback and toasts when adding to cart.
  - Mini cart popup with a list of cart items and quantities.
  - View cart and go to a full cart page.

- **User Authentication:**  
  - Login required to add items to the cart.
  - Modal prompts users to log in when necessary.

- **UX/UI:**  
  - Loading spinners and error messages for product fetch requests.
  - Responsive design for desktop and mobile.
  - Accessible button styles and keyboard navigation.

- **Data Handling:**  
  - All product and cart data are fetched from the backend API.
  - Cart and product data persist for logged-in users using PostgreSQL.

## Setup

- Requires Node.js (for both client and server)
- Requires PostgreSQL database instance

## Summary

This project demonstrates full-stack development with a React frontend, Express backend, and PostgreSQL database. It focuses on e-commerce features like product filtering, a persistent cart, user authentication, and smooth UI/UX.