const axios = require('axios');

const logAction = async (product_id, shop_id, action, quantity) => {
    try {
      await axios.post('http://localhost:3001/api/actions', {
        product_id,
        shop_id,
        action,
        quantity,
      });
      console.log('Action logged successfully');
    } catch (err) {
      console.error('Failed to log action', err.message);
    }
  };

module.exports = logAction;