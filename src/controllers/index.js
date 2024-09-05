const pool = require('../config/db');
const logAction = require('../function/logAction');


exports.createProduct = async (req, res) => {
    const {plu, name} = req.body;
    try {
        const result = await pool.query("INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *", 
            [plu, name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createStock = async (req, res) => {
    const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body;
    try {
        const result = await pool.query("INSERT INTO stock (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES ($1, $2, $3, $4) RETURNING *", 
            [product_id, shop_id, quantity_on_shelf, quantity_in_order]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.patchIncreaseStock = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
      const result = await pool.query(
        'UPDATE stock SET quantity_on_shelf = quantity_on_shelf + $1 WHERE id = $2 RETURNING *',
        [quantity, id]
      );
      const stock = result.rows[0];
      await logAction(stock.product_id, stock.shop_id, 'increase', quantity)
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

exports.patchDecreaseStock = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
      const result = await pool.query(
        'UPDATE stock SET quantity_on_shelf = quantity_on_shelf - $1 WHERE id = $2 RETURNING *',
        [quantity, id]
      );
      const stock = result.rows[0];
      await logAction(stock.product_id, stock.shop_id, 'decrease', quantity)
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

exports.getStockFiltered = async (req, res) => {
    const { plu, shop_id, min_quantity_on_shelf, max_quantity_on_shelf, min_quantity_in_order, max_quantity_in_order } = req.query;
    let query = 'SELECT * FROM stock WHERE 1=1';
    const params = [];
    if (plu) {
      query += ' AND product_id IN (SELECT id FROM products WHERE plu = $1)';
      params.push(plu);
    }
    if (shop_id) {
      query += ' AND shop_id = $2';
      params.push(shop_id);
    }
    if (min_quantity_on_shelf) {
      query += ' AND quantity_on_shelf >= $3';
      params.push(min_quantity_on_shelf);
    }
    if (max_quantity_on_shelf) {
      query += ' AND quantity_on_shelf <= $4';
      params.push(max_quantity_on_shelf);
    }
    if (min_quantity_in_order) {
      query += ' AND quantity_in_order >= $5';
      params.push(min_quantity_in_order);
    }
    if (max_quantity_in_order) {
      query += ' AND quantity_in_order <= $6';
      params.push(max_quantity_in_order);
    }
  
    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

}

exports.getProductsFiltered = async (req, res) => {
    const { name, plu } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    if (name) {
      query += ' AND name ILIKE $1';
      params.push(`%${name}%`);
    }
    if (plu) {
      query += ' AND plu = $2';
      params.push(plu);
    }

    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

}