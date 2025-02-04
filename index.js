const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());


const readJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return {};
  }
};

const writeJSON = (filePath, data, res, successMsg, errorMsg) => {
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(`Error writing to ${filePath}:`, err);
      return res.status(500).send(errorMsg);
    }
    res.status(200).send(successMsg);
  });
};

// Routes
app.post('/submit-order', (req, res) => {
  const orderData = { ...req.body, timestamp: new Date().toISOString() };
  const ordersFile = path.join(__dirname, 'data', 'orders.json');
  const orders = readJSON(ordersFile);

  orders.push(orderData);
  writeJSON(ordersFile, orders, res, 'Order Submitted Successfully!', 'Error saving order.');
});

app.get('/cart', (req, res) => {
  const cart = readJSON(path.join(__dirname, 'data', 'cart.json'));
  res.json(cart);
});

app.post('/cart', (req, res) => {
  writeJSON(
    path.join(__dirname, 'data', 'cart.json'),
    req.body,
    res,
    'Cart data saved successfully.',
    'Error saving cart data.'
  );
});

app.get('/product/:productName', (req, res) => {
  const products = readJSON(path.join(__dirname, 'data', 'product-details.json'));
  const product = products.find(p => p.displayName.toLowerCase() === req.params.productName.toLowerCase());

  if (!product) return res.status(404).send('Product not found');

  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + product.expectedDelivery);
  const formattedArrivalDate = arrivalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  res.render('productDetail', {
    title: `${product.displayName} - BeanShop`,
    product,
    arrivalDate: formattedArrivalDate
  });
});

app.get('/', (req, res) => res.render('home', { title: 'BeanShop - Home' }));
app.get('/shop', (req, res) => res.render('shop', { title: 'BeanShop - Shop' }));
app.get('/order', (req, res) => res.render('order', { title: 'BeanShop - Order' }));

app.get('/data/product-details.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'product-details.json'));
});

app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
  console.log(`Visit: http://localhost:${port}`);
});
