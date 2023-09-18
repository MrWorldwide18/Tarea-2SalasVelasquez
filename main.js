const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.nextProductId = 1;
    this.products = [];
    this.loadProductsFromFile();
  }

  addProduct(productData) {
      // Mencionado en la entrega pasada "Faltaría agregar el manejo de errores al agregar dos productos con la misma propiedad 'code'"
  const existingProduct = this.products.find((product) => product.code === productData.code);

  if (existingProduct) {
    throw new Error('Product code is already in use.');
  }

    const product = {
      id: this.nextProductId++,
      ...productData,
    };
    this.products.push(product);
    this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(id, updatedProductData) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = { ...this.products[productIndex], ...updatedProductData };
      this.saveProductsToFile();
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter((product) => product.id !== id);
    if (this.products.length < initialLength) {
      this.saveProductsToFile();
      return true;
    }
    return false;
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.nextProductId = this.getNextProductId();
    } catch (error) {
      // Si el archivo no existe o hay algun error leyendo, empieza con arreglo vacio.
      this.products = [];
    }
  }

  saveProductsToFile() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  getNextProductId() {
    if (this.products.length === 0) {
      return 1;
    }
    return Math.max(...this.products.map((product) => product.id)) + 1;
  }
}

// Como usar:
const productManager = new ProductManager('products.json');

// Agregar producto
productManager.addProduct({
  title: 'pan con queso',
  description: 'pancon jamon y queso',
  price: 20.88,
  thumbnail: 'pan.jpg',
  code: 'P001',
  stock: 50,
});

// Buscar todos los productos
const allProducts = productManager.getProducts();
console.log(allProducts);

// Bucar producto por ID
const productById = productManager.getProductById(1);
console.log(productById);

// Actualizar el producto
const updated = productManager.updateProduct(1, { price: 12.99 });
if (updated) {
  console.log('Product updated successfully');
} else {
  console.log('Product not found');
}

// Borrar el producto
const deleted = productManager.deleteProduct(1);
if (deleted) {
  console.log('Product deleted successfully');
} else {
  console.log('Product not found');
}