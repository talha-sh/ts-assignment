// main.ts
import { CrudRepository } from './repository';
import { Product, User } from './interfaces';

const productRepository = new CrudRepository<Product>('https://fakestoreapi.com/products');
const userRepository = new CrudRepository<User>('https://fakestoreapi.com/users');

async function fetchProducts() {
  try {
    const products = await productRepository.getAll();
    console.log('Products:', products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

async function fetchUsers() {
  try {
    const users = await userRepository.getAll();
    console.log('Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function addProduct(newProduct: Product) {
  try {
    const product = await productRepository.create(newProduct);
    console.log('Product added:', product);
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

async function updateProduct(id: number, updatedProduct: Product) {
  try {
    const product = await productRepository.update(id, updatedProduct);
    if (product) {
      console.log('Product updated:', product);
    } else {
      console.error('Product not found for updating.');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

async function deleteProduct(id: number) {
  try {
    const success = await productRepository.delete(id);
    if (success) {
      console.log(`Product with ID ${id} deleted successfully.`);
    } else {
      console.error('Product not found for deletion.');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

(async () => {
  await console.log(fetchProducts());
  await console.log(fetchUsers());

  const newProduct: Product = {
    id: 0,
    title: 'New Product',
    price: 29.99,
    description: 'A new product for testing',
    category: 'test-category',
    image: 'https://via.placeholder.com/150'
  };
  await addProduct(newProduct);

  const updatedProduct: Product = {
    id: 0,
    title: 'Updated Product',
    price: 39.99,
    description: 'An updated product for testing',
    category: 'updated-category',
    image: 'https://via.placeholder.com/150'
  };
  await updateProduct(1, updatedProduct);

  await deleteProduct(1);
})();
