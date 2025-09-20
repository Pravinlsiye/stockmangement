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
db.createCollection('transactions');

print('Database initialized successfully!');
