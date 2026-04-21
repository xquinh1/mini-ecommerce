const pool = require("../database/db")

class ProductRepository {
    async getAllProduct() {
        const result = await pool.query(
            "SELECT * FROM products"
        )

        return result.rows
    }

    async getCartByUserId(userId) {
        const result = await pool.query(
            "SELECT * FROM carts WHERE user_id = ($1)",
            [userId]
        )
        return result.rows[0]
    }

    async createCart(userId) {
        const result = await pool.query(
            "INSERT INTO carts (user_id) VALUES ($1)",
            [userId]
        )
        return result.rows[0]
    }

    async getCartItem(cartId, productId) {
        const result = await pool.query(
            "SELECT * FROM cart_items WHERE cart_id = ($1) AND product_id = ($2)",
            [cartId, productId]
        )
        return result.rows[0]
    }

    async updateQuantity(itemId, quantity) {
        const result = await pool.query(
            "UPDATE cart_items SET quantity = quantity + ($1) WHERE id = ($2)",
            [quantity, itemId]
        )
        return result.rows[0]
    }

    async addItem(cartId, productId, quantity) {
        const result = await pool.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)`,
            [cartId, productId, quantity]
        )
        return result.rows[0]
    }

    async getCartItems(userId) {
        const result = await pool.query(
          `SELECT 
            ci.id AS cart_item_id,
            ci.quantity,
            p.id AS product_id,
            p.name,
            p.price,
            p.image_url
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = $1
            ORDER BY ci.id ASC`,
          [userId]
        )
      
        return result.rows
      }

      async updateCartItemQuantity(cartItemId, quantity) {
        const result = await pool.query(
            `UPDATE cart_items
            SET quantity = ($1)
            WHERE id = ($2)
            RETURNING *`,
            [quantity, cartItemId]
        )

        return await result.rows[0]
      }

      async deleteItem(cartItemId) {
        const result = await pool.query(
            `DELETE FROM cart_items
            WHERE id = ($1)
            RETURNING *`,
            [cartItemId]
        )

        return await result.rows[0]
      }

      async createOrder(userId, total) {
        const result = await pool.query(
            `INSERT INTO orders (user_id, total, status)
            VALUES ($1, $2, 'pending')
            RETURNING *`,
            [userId, total]
        )

        return result.rows[0]
      }

      async createOrderItem(orderId, productId, quantity, price) {
        const result = await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, productId, quantity, price]
        )

        return result.rows[0]
      }

    async clearCart(userId) {
        await pool.query(
          `DELETE FROM cart_items
           WHERE cart_id IN (
             SELECT id FROM carts WHERE user_id = $1
           )`,
          [userId]
        )
      }
}

module.exports = { ProductRepository }