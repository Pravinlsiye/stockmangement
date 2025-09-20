// Create database and user for the application
db = db.getSiblingDB('supermarket_stock');

db.createUser({
  user: 'stockapp',
  pwd: 'stockpass123',
  roles: [
    {
      role: 'readWrite',
      db: 'supermarket_stock'
    }
  ]
});

// Create initial collections
db.createCollection('categories');
db.createCollection('suppliers');
db.createCollection('products');
db.createCollection('product_suppliers');
db.createCollection('purchase_orders');
db.createCollection('transactions');

print('Database initialized successfully!');
print('Collections created: categories, suppliers, products, product_suppliers, purchase_orders, transactions');
