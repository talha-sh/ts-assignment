import { GenericApi } from './genericApiCall';
import { Product, User, CartItem, Order } from './interfaces';
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const productRepository = new GenericApi<Product>('https://fakestoreapi.com/products');
const userRepository = new GenericApi<User>('https://fakestoreapi.com/users');

async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await productRepository.getAll();
    return products;
  } catch (error) {
    console.error('Fetch products error:', error);
    return [];
  }
}

async function fetchUsers(): Promise<User[]> {
  try {
    const users = await userRepository.getAll();
    return users;
  } catch (error) {
    console.error('Fetch users error:', error);
    return [];
  }
}

async function addProduct(newProduct: Product): Promise<Product | null> {
  try {
    const product = await productRepository.create(newProduct);
    return product;
  } catch (error) {
    console.error('Add product error:', error);
    return null;
  }
}

async function updateProduct(id: number, updatedProduct: Product): Promise<Product | null> {
  try {
    const product = await productRepository.update(id, updatedProduct);
    return product;
  } catch (error) {
    console.error('Update product error:', error);
    return null;
  }
}

async function deleteProduct(id: number): Promise<boolean> {
  try {
    const success = await productRepository.delete(id);
    return success;
  } catch (error) {
    console.error('Delete product error:', error);
    return false;
  }
}

const cart: CartItem[] = [];

function addToCart(product: Product, quantity: number) {
  const existingItem = cart.find(item => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  console.log(`${quantity} of ${product.title} added to cart.`);
}

function simulateCheckout(): Order {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const order: Order = { items: cart, total };
  return order;
}

function promptUser(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
  const option = await promptUser(`Select an option\n1: View all products\n2: View all users\n3: Add a product\n4: Update a product\n5: Delete a product\n`);
  switch (option) {
    case "1":
      const products = await fetchProducts();
      console.log(products);
      const productId = await promptUser('Enter product ID to add to cart: ');
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        const quantity = await promptUser('Enter quantity: ');
        addToCart(product, parseInt(quantity));
        const answer = await promptUser('Do you want to checkout? (yes/no): ');
        if (answer.toLowerCase() === 'yes') {
          const order = simulateCheckout();
          console.log('Order:', order);
        }
      } else {
        console.log('Product not found.');
      }
      rl.close();
      break;
    case "2":
      const users = await fetchUsers();
      console.log(users);
      rl.close();
      break;
    case "3":
      const newProduct: Product = {
        id: 0,
        title: 'New Product',
        price: 29.99,
        description: 'A new product for testing',
        category: 'test-category',
        image: 'https://via.placeholder.com/150'
      };
      const addedProduct = await addProduct(newProduct);
      console.log('Product added:', addedProduct);
      rl.close();
      break;
    case "4":
      const updatedProduct: Product = {
        id: 0,
        title: 'Updated Product',
        price: 39.99,
        description: 'An updated product for testing',
        category: 'updated-category',
        image: 'https://via.placeholder.com/150'
      };
      const productToUpdate = await updateProduct(1, updatedProduct);
      console.log('Product updated:', productToUpdate);
      rl.close();
      break;
    case "5":
      const success = await deleteProduct(1);
      console.log(success ? 'Product deleted.' : 'Delete error.');
      rl.close();
      break;
    default:
      console.log("Invalid Input");
      rl.close();
  }
})();
