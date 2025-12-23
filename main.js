// ================================
// LOGIN & AUTHENTICATION
// ================================

// Login validation + redirect (with Admin login)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    let isValid = true;

    // Check for Admin login
    if (email === 'Admin' && password === 'Admin') {
      localStorage.setItem('userEmail', 'admin@marketpro.com');
      localStorage.setItem('userName', 'Administrator');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'admin-dashboard.html';
      return;
    }
    

    if (!email) {
      emailError.textContent = 'Email is required';
      emailError.classList.add('show');
      emailInput.classList.add('error');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = 'Please enter a valid email';
      emailError.classList.add('show');
      emailInput.classList.add('error');
      isValid = false;
    } else {
      emailError.classList.remove('show');
      emailInput.classList.remove('error');
    }

    if (!password) {
      passwordError.textContent = 'Password is required';
      passwordError.classList.add('show');
      passInput.classList.add('error');
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = 'Password must be at least 6 characters';
      passwordError.classList.add('show');
      passInput.classList.add('error');
      isValid = false;
    } else {
      passwordError.classList.remove('show');
      passInput.classList.remove('error');
    }

    if (isValid) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', email.split('@')[0]);
      localStorage.setItem('userRole', 'vendor');
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'dashboard.html';
    }
  });
}

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    document
      .querySelectorAll('#signupForm input')
      .forEach(inp => inp.classList.remove('error'));

    let errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const addError = (id, msg) => {
      document.getElementById(id).classList.add('error');
      errors.push(msg);
    };

    if (!name) addError('name', 'Please enter your name');
    if (!surname) addError('surname', 'Please enter your surname');

    if (!email) addError('signupEmail', 'Email is required');
    else if (!emailRegex.test(email))
      addError('signupEmail', 'Please enter a valid email');

    if (!password) addError('signupPassword', 'Password is required');
    else if (password.length < 6)
      addError('signupPassword', 'Password must be at least 6 characters');

    if (!confirmPassword) addError('confirmPassword', 'Please confirm your password');
    else if (password !== confirmPassword)
      addError('confirmPassword', 'Passwords do not match');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    const userRole = document.querySelector('input[name="role"]:checked').value;
    localStorage.setItem('userName', name + ' ' + surname);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'home.html';
  });
}

// ================================
// USER INFO & LOGOUT
// ================================

function updateUserInfo() {
  const nameEl = document.getElementById('userName');
  const emailEl = document.getElementById('userEmail');
  const avatarEl = document.getElementById('userAvatar');

  if (!nameEl || !emailEl || !avatarEl) return;

  const userName = localStorage.getItem('userName') || 'Jane Doe';
  const userEmail = localStorage.getItem('userEmail') || 'jane@marketpro.com';

  nameEl.textContent = userName;
  emailEl.textContent = userEmail;
  avatarEl.textContent = userName.charAt(0).toUpperCase();
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    localStorage.clear();
    window.location.href = 'login.html';
  });
}

// ================================
// HOME PAGE LOGIC
// ================================

if (document.getElementById('homePage')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else {
    updateUserInfo();
  }
}

// Favorites / Commodities tabs
const menuCommodities = document.getElementById('menuCommodities');
const menuFavorites = document.getElementById('menuFavorites');
const sectionTitle = document.getElementById('sectionTitle');
const cardsContainer = document.getElementById('cardsContainer');

if (menuCommodities && menuFavorites) {
  menuCommodities.addEventListener('click', function () {
    menuCommodities.classList.add('active');
    menuFavorites.classList.remove('active');
    sectionTitle.textContent = 'Commoditis';
    cardsContainer.innerHTML = `
      <div class="card"></div>
      <div class="card"></div>
      <div class="card"></div>
    `;
  });

  menuFavorites.addEventListener('click', function () {
    menuFavorites.classList.add('active');
    menuCommodities.classList.remove('active');
    sectionTitle.textContent = 'Favorites';
    loadFavorites();
  });
}

// Products navigation
const menuProducts = document.getElementById('menuProducts');
if (menuProducts) {
  menuProducts.addEventListener('click', function () {
    window.location.href = 'products.html';
  });
}

// ================================
// PRODUCTS PAGE LOGIC
// ================================

if (document.getElementById('productsPage')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else {
    updateUserInfo();

    const filterSelect = document.getElementById('filterCategory');
    if (filterSelect) {
      filterSelect.addEventListener('change', loadProducts);
    }

    loadProducts();

    const userRole = localStorage.getItem('userRole');
    const vendorProfile = localStorage.getItem('vendorProfile');

    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn && userRole === 'vendor') {
      addProductBtn.style.display = 'flex';

      addProductBtn.addEventListener('click', function () {
        openAddProductModal();
      });

      if (!vendorProfile) {
        setTimeout(() => {
          openVendorProfileModal();
        }, 800);
      }
    }
  }
}

// Load and display products
function loadProducts() {
  const productsContainer = document.getElementById('productsContainer');
  if (!productsContainer) return;

  const filterSelect = document.getElementById('filterCategory');
  const currentFilter = filterSelect ? filterSelect.value : '';

  let products = JSON.parse(localStorage.getItem('products') || '[]');
  const userRole = localStorage.getItem('userRole');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (currentFilter) {
    products = products.filter(p => p.category === currentFilter);
  }

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No products yet</div>
        <div class="empty-state-hint">Add your first product to get started</div>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = '';
  products.forEach((product, index) => {
    const deleteBtn =
      userRole === 'vendor'
        ? `<button class="delete-product-btn" onclick="deleteProduct(${index})">🗑️ Delete</button>`
        : '';

    const categoryLabel =
      product.category === 'grains'
        ? 'Grains (الحبوب)'
        : product.category === 'poultry'
        ? 'Poultry (الدواجن)'
        : product.category === 'vegetables'
        ? 'Vegetables (الخضراوات)'
        : product.category || '';

    const imageStyle = product.image
      ? `style="background-image:url('${product.image}'); background-size:cover; background-position:center;"`
      : '';

    const isFavorite = favorites.includes(index);
    const favoriteClass = isFavorite ? 'active' : '';
    const heartIcon = isFavorite ? '❤️' : '🤍';

    const productCard = `
      <div class="product-card">
        <div class="product-favorite ${favoriteClass}" onclick="toggleFavorite(${index})">
          <span class="product-favorite-icon">${heartIcon}</span>
        </div>
        <div class="product-image" ${imageStyle}></div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-location">${product.location}</div>
          <div class="product-category">${categoryLabel}</div>
          <div class="product-price">${product.price} EGP</div>
          <button class="product-btn">Check price</button>
          ${deleteBtn}
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });
}

// Toggle Favorite
function toggleFavorite(index) {
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  const favIndex = favorites.indexOf(index);
  if (favIndex > -1) {
    favorites.splice(favIndex, 1);
  } else {
    favorites.push(index);
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadProducts();
}

// Load Favorites in Home page
function loadFavorites() {
  const cardsContainer = document.getElementById('cardsContainer');
  if (!cardsContainer) return;

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');

  if (favorites.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💔</div>
        <div class="empty-state-text">No favorites yet</div>
        <div class="empty-state-hint">Add products to your favorites to see them here</div>
      </div>
    `;
    return;
  }

  cardsContainer.innerHTML = '';
  favorites.forEach(favIndex => {
    const product = products[favIndex];
    if (!product) return;

    const categoryLabel =
      product.category === 'grains'
        ? 'Grains (الحبوب)'
        : product.category === 'poultry'
        ? 'Poultry (الدواجن)'
        : product.category === 'vegetables'
        ? 'Vegetables (الخضراوات)'
        : product.category || '';

    const imageStyle = product.image
      ? `style="background-image:url('${product.image}'); background-size:cover; background-position:center;"`
      : '';

    const favoriteCard = `
      <div class="product-card">
        <div class="product-favorite active" onclick="toggleFavoriteFromHome(${favIndex})">
          <span class="product-favorite-icon">❤️</span>
        </div>
        <div class="product-image" ${imageStyle}></div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-location">${product.location}</div>
          <div class="product-category">${categoryLabel}</div>
          <div class="product-price">${product.price} EGP</div>
          <button class="product-btn">Book Now</button>
        </div>
      </div>
    `;
    cardsContainer.innerHTML += favoriteCard;
  });
}

// Toggle favorite from home page
function toggleFavoriteFromHome(index) {
  toggleFavorite(index);
  loadFavorites();
}

// Delete Product
function deleteProduct(index) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  const products = JSON.parse(localStorage.getItem('products') || '[]');
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
  alert('Product deleted successfully! ✅');
}

// ================================
// ADD PRODUCT MODAL
// ================================

const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
  addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const location = document.getElementById('productLocation').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const imageInput = document.getElementById('productImage');
    const imageFile = imageInput.files[0];

    if (!name || !location || !price || !category || !imageFile) {
      alert('يرجى ملء جميع الحقول واختيار القسم وصورة المنتج!');
      return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');

    const reader = new FileReader();
    reader.onload = function (ev) {
      const newProduct = {
        name: name,
        location: location,
        price: price,
        category: category,
        image: ev.target.result,
        addedBy: localStorage.getItem('userName'),
        addedAt: new Date().toISOString()
      };

      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      // 🔔 فحص التنبيهات بعد إضافة المنتج
      checkPriceAlerts();
      
      closeAddProductModal();
      loadProducts();
      alert('Product added successfully with category and image! ✅');
    };
    reader.readAsDataURL(imageFile);
  });
}

function openAddProductModal() {
  const overlay = document.getElementById('addProductOverlay');
  if (overlay) {
    overlay.classList.add('show');
    const nameInput = document.getElementById('productName');
    if (nameInput) nameInput.focus();
  }
}

function closeAddProductModal() {
  const overlay = document.getElementById('addProductOverlay');
  if (overlay) {
    overlay.classList.remove('show');
    const form = document.getElementById('addProductForm');
    if (form) form.reset();
  }
}

// ================================
// VENDOR PROFILE MODAL
// ================================

function openVendorProfileModal() {
  const overlay = document.getElementById('vendorProfileOverlay');
  if (overlay) {
    overlay.classList.add('show');
    const marketName = document.getElementById('marketName');
    if (marketName) marketName.focus();
  }
}

function closeVendorProfileModal() {
  const overlay = document.getElementById('vendorProfileOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

const vendorProfileForm = document.getElementById('vendorProfileForm');
if (vendorProfileForm) {
  vendorProfileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const marketName = document.getElementById('marketName').value.trim();
    const businessAddress = document
      .getElementById('businessAddress')
      .value.trim();
    const businessPhone = document
      .getElementById('businessPhone')
      .value.trim();
    const businessDescription = document
      .getElementById('businessDescription')
      .value.trim();

    if (!marketName || !businessAddress || !businessPhone) {
      alert('Please fill all required fields');
      return;
    }

    const vendorProfile = {
      marketName: marketName,
      address: businessAddress,
      phone: businessPhone,
      description: businessDescription,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('vendorProfile', JSON.stringify(vendorProfile));

    closeVendorProfileModal();
    alert('Profile saved successfully! ✅');
  });
}

// ================================
// FORGOT PASSWORD MODAL
// ================================

function openForgotModal() {
  const overlay = document.getElementById('forgotOverlay');
  if (!overlay) return;
  overlay.classList.add('show');
  const emailInput = document.getElementById('forgotEmail');
  const loginEmail = document.getElementById('email')
    ? document.getElementById('email').value.trim()
    : '';
  if (emailInput) {
    emailInput.value = loginEmail;
    emailInput.focus();
  }
}

function closeForgotModal() {
  const overlay = document.getElementById('forgotOverlay');
  if (overlay) overlay.classList.remove('show');
}

function sendReset() {
  const emailInput = document.getElementById('forgotEmail');
  if (!emailInput) return;
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    alert('Please enter a valid e-mail to reset your password.');
    return;
  }
  alert('Reset link has been sent to: ' + email);
  closeForgotModal();
}

// ================================
// PROFILE MODAL
// ================================

const myProfileBtn = document.getElementById('myProfileBtn');

function openProfileModal() {
  const name = localStorage.getItem('userName') || 'User';
  const email = localStorage.getItem('userEmail') || 'user@mail.com';
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const avatarEl = document.getElementById('profileAvatar');
  if (nameEl) nameEl.textContent = name;
  if (emailEl) emailEl.textContent = email;
  if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
  const overlay = document.getElementById('profileOverlay');
  if (overlay) overlay.classList.add('show');
}

function closeProfileModal() {
  const overlay = document.getElementById('profileOverlay');
  if (overlay) overlay.classList.remove('show');
}

if (myProfileBtn) {
  myProfileBtn.addEventListener('click', openProfileModal);
}

// ================================
// CATEGORY FILTER DROPDOWN
// ================================

const categoryFilterBtn = document.getElementById('categoryFilterBtn');
const categoryDropdown = document.getElementById('categoryDropdown');

if (categoryFilterBtn && categoryDropdown) {
  let currentCategory = '';
  
  categoryFilterBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    categoryDropdown.classList.toggle('show');
  });
  
  const categoryOptions = categoryDropdown.querySelectorAll('.category-option');
  categoryOptions.forEach(option => {
    option.addEventListener('click', function() {
      const value = this.getAttribute('data-value');
      const text = this.textContent;
      
      currentCategory = value;
      categoryFilterBtn.textContent = text + ' ▼';
      
      categoryOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      categoryDropdown.classList.remove('show');
      
      loadProductsByCategory(currentCategory);
    });
  });
  
  document.addEventListener('click', function() {
    categoryDropdown.classList.remove('show');
  });
}

// Load products by category
function loadProductsByCategory(category) {
  const productsContainer = document.getElementById('productsContainer');
  if (!productsContainer) return;

  let products = JSON.parse(localStorage.getItem('products') || '[]');
  const userRole = localStorage.getItem('userRole');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (category) {
    products = products.filter(p => p.category === category);
  }

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <div class="empty-state-text">No products yet</div>
        <div class="empty-state-hint">Add your first product to get started</div>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = '';
  products.forEach((product, index) => {
    const deleteBtn =
      userRole === 'vendor'
        ? `<button class="delete-product-btn" onclick="deleteProduct(${index})">🗑️ Delete</button>`
        : '';

    const categoryLabel =
      product.category === 'grains'
        ? 'Grains (الحبوب)'
        : product.category === 'poultry'
        ? 'Poultry (الدواجن)'
        : product.category === 'vegetables'
        ? 'Vegetables (الخضراوات)'
        : product.category || '';

    const imageStyle = product.image
      ? `style="background-image:url('${product.image}'); background-size:cover; background-position:center;"`
      : '';

    const isFavorite = favorites.includes(index);
    const favoriteClass = isFavorite ? 'active' : '';
    const heartIcon = isFavorite ? '❤️' : '🤍';

    const productCard = `
      <div class="product-card">
        <div class="product-favorite ${favoriteClass}" onclick="toggleFavorite(${index})">
          <span class="product-favorite-icon">${heartIcon}</span>
        </div>
        <div class="product-image" ${imageStyle}></div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-location">${product.location}</div>
          <div class="product-category">${categoryLabel}</div>
          <div class="product-price">${product.price} EGP</div>
          <button class="product-btn">Book Now</button>
          ${deleteBtn}
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });
}

// ================================
// VENDORS PAGE LOGIC
// ================================

if (document.getElementById('vendorsPage')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else {
    updateUserInfo();
    loadVendors('all');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-category');
        loadVendors(category);
      });
    });
  }
}

function loadVendors(filterCategory) {
  const vendorsContainer = document.getElementById('vendorsContainer');
  if (!vendorsContainer) return;

  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  if (products.length === 0) {
    vendorsContainer.innerHTML = 
      '<div class="no-vendors">' +
      '<div class="no-vendors-icon">🏪</div>' +
      '<div class="no-vendors-text">No vendors yet</div>' +
      '<div class="no-vendors-hint">Vendors will appear here once they add products</div>' +
      '</div>';
    return;
  }

  const vendorMap = {};
  products.forEach((product, index) => {
    const vendorName = product.addedBy || 'Unknown Vendor';
    if (!vendorMap[vendorName]) {
      vendorMap[vendorName] = [];
    }
    vendorMap[vendorName].push({...product, index: index});
  });

  let vendorsHTML = '';
  Object.keys(vendorMap).forEach(vendorName => {
    let vendorProducts = vendorMap[vendorName];
    
    if (filterCategory !== 'all') {
      vendorProducts = vendorProducts.filter(p => p.category === filterCategory);
    }

    if (vendorProducts.length === 0) return;

    const categoryLabel = (cat) => {
      if (cat === 'grains') return 'Grains (الحبوب)';
      if (cat === 'poultry') return 'Poultry (الدواجن)';
      if (cat === 'vegetables') return 'Vegetables (الخضراوات)';
      return cat;
    };

    const vendorInitial = vendorName.charAt(0).toUpperCase();
    
    vendorsHTML += '<div class="vendor-section">';
    vendorsHTML += '<div class="vendor-header">';
    vendorsHTML += '<div class="vendor-info">';
    vendorsHTML += '<div class="vendor-avatar">' + vendorInitial + '</div>';
    vendorsHTML += '<div class="vendor-details">';
    vendorsHTML += '<h3>' + vendorName + '</h3>';
    vendorsHTML += '<p>Active Vendor</p>';
    vendorsHTML += '</div>';
    vendorsHTML += '</div>';
    vendorsHTML += '<div class="vendor-stats">';
    vendorsHTML += '<div class="vendor-count">' + vendorProducts.length + '</div>';
    vendorsHTML += '<div class="vendor-label">Products</div>';
    vendorsHTML += '</div>';
    vendorsHTML += '</div>';
    vendorsHTML += '<div class="vendor-products">';

    vendorProducts.forEach(product => {
      vendorsHTML += '<div class="vendor-product-card">';
      vendorsHTML += '<div class="vendor-product-name">' + product.name + '</div>';
      vendorsHTML += '<div class="vendor-product-category">' + categoryLabel(product.category) + '</div>';
      vendorsHTML += '<div class="vendor-product-price">' + product.price + ' EGP</div>';
      vendorsHTML += '<div class="vendor-product-location">' + product.location + '</div>';
      vendorsHTML += '</div>';
    });

    vendorsHTML += '</div>';
    vendorsHTML += '</div>';
  });

  if (vendorsHTML === '') {
    vendorsContainer.innerHTML = 
      '<div class="no-vendors">' +
      '<div class="no-vendors-icon">🔍</div>' +
      '<div class="no-vendors-text">No vendors in this category</div>' +
      '<div class="no-vendors-hint">Try selecting a different category</div>' +
      '</div>';
  } else {
    vendorsContainer.innerHTML = vendorsHTML;
  }
}

// ================================
// DASHBOARD PAGE (VENDOR)
// ================================

if (document.getElementById('dashboardPage')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'vendor') {
      alert('Dashboard is only available for vendors!');
      window.location.href = 'home.html';
    } else {
      updateUserInfo();
      loadDashboardStats();
    }
  }
}

function loadDashboardStats() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const userName = localStorage.getItem('userName');

  const myProducts = products.filter(p => p.addedBy === userName);

  const welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    welcomeMsg.textContent = 'Welcome back, ' + userName + '! 👋';
  }

  const totalProductsEl = document.getElementById('totalProducts');
  if (totalProductsEl) {
    totalProductsEl.textContent = myProducts.length;
  }

  let myFavoritesCount = 0;
  favorites.forEach(favIndex => {
    if (products[favIndex] && products[favIndex].addedBy === userName) {
      myFavoritesCount++;
    }
  });
  const totalFavoritesEl = document.getElementById('totalFavorites');
  if (totalFavoritesEl) {
    totalFavoritesEl.textContent = myFavoritesCount;
  }

  const categoryCounts = {};
  myProducts.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  let topCategory = '-';
  let maxCount = 0;
  Object.keys(categoryCounts).forEach(cat => {
    if (categoryCounts[cat] > maxCount) {
      maxCount = categoryCounts[cat];
      topCategory = cat;
    }
  });
  const categoryLabels = {
    'grains': 'Grains',
    'poultry': 'Poultry',
    'vegetables': 'Vegetables'
  };
  const topCategoryEl = document.getElementById('topCategory');
  if (topCategoryEl) {
    topCategoryEl.textContent = categoryLabels[topCategory] || topCategory;
  }

  let totalPrice = 0;
  myProducts.forEach(p => {
    totalPrice += parseFloat(p.price) || 0;
  });
  const avgPrice = myProducts.length > 0 ? (totalPrice / myProducts.length).toFixed(0) : 0;
  const avgPriceEl = document.getElementById('avgPrice');
  if (avgPriceEl) {
    avgPriceEl.textContent = avgPrice + ' EGP';
  }

  loadRecentProducts(myProducts);
  loadCategoryBreakdown(myProducts, categoryCounts);
}

function loadRecentProducts(myProducts) {
  const container = document.getElementById('recentProductsGrid');
  if (!container) return;

  const recentProducts = myProducts.slice(-3).reverse();

  if (recentProducts.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-text">No products yet</div></div>';
    return;
  }

  container.innerHTML = '';
  recentProducts.forEach(product => {
    const categoryLabels = {
      'grains': 'Grains (الحبوب)',
      'poultry': 'Poultry (الدواجن)',
      'vegetables': 'Vegetables (الخضراوات)'
    };

    const imageStyle = product.image
      ? 'style="background-image:url(\'' + product.image + '\'); background-size:cover; background-position:center;"'
      : '';

    const card = '<div class="recent-product-card" onclick="window.location.href=\'products.html\'">' +
      '<div class="recent-product-image" ' + imageStyle + '></div>' +
      '<div class="recent-product-info">' +
      '<div class="recent-product-name">' + product.name + '</div>' +
      '<div class="recent-product-price">' + product.price + ' EGP</div>' +
      '<div class="recent-product-category">' + (categoryLabels[product.category] || product.category) + '</div>' +
      '</div>' +
      '</div>';

    container.innerHTML += card;
  });
}

function loadCategoryBreakdown(myProducts, categoryCounts) {
  const container = document.getElementById('categoryBreakdown');
  if (!container) return;

  const categoryLabels = {
    'grains': 'Grains (الحبوب)',
    'poultry': 'Poultry (الدواجن)',
    'vegetables': 'Vegetables (الخضراوات)'
  };

  const totalProducts = myProducts.length;

  if (totalProducts === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-text">No products to analyze</div></div>';
    return;
  }

  container.innerHTML = '';
  Object.keys(categoryCounts).forEach(category => {
    const count = categoryCounts[category];
    const percentage = ((count / totalProducts) * 100).toFixed(0);

    const bar = '<div class="category-bar">' +
      '<div class="category-bar-header">' +
      '<div class="category-bar-name">' + (categoryLabels[category] || category) + '</div>' +
      '<div class="category-bar-count">' + count + ' products (' + percentage + '%)</div>' +
      '</div>' +
      '<div class="category-bar-fill">' +
      '<div class="category-bar-progress" style="width:' + percentage + '%"></div>' +
      '</div>' +
      '</div>';

    container.innerHTML += bar;
  });
}

// ================================
// ADMIN DASHBOARD
// ================================

if (document.getElementById('adminDashboardPage')) {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');
  
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  } else if (userRole !== 'admin') {
    alert('Access denied! Admin only.');
    window.location.href = 'home.html';
  } else {
    updateAdminInfo();
    loadAdminStats();
    loadAdminRecentProducts();
    loadAdminTopVendors();
  }
}

function updateAdminInfo() {
  const userName = localStorage.getItem('userName') || 'Administrator';
  const userEmail = localStorage.getItem('userEmail') || 'admin@marketpro.com';
  
  const nameEl = document.getElementById('adminName');
  const emailEl = document.getElementById('adminEmail');
  const avatarEl = document.getElementById('adminAvatar');
  
  if (nameEl) nameEl.textContent = userName;
  if (emailEl) emailEl.textContent = userEmail;
  if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
}

function loadAdminStats() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  const vendors = new Set();
  products.forEach(p => {
    if (p.addedBy) vendors.add(p.addedBy);
  });
  
  const totalVendorsEl = document.getElementById('adminTotalVendors');
  if (totalVendorsEl) {
    totalVendorsEl.textContent = vendors.size;
  }
  
  const totalProductsEl = document.getElementById('adminTotalProducts');
  if (totalProductsEl) {
    totalProductsEl.textContent = products.length;
  }
  
  const totalCustomersEl = document.getElementById('adminTotalCustomers');
  if (totalCustomersEl) {
    totalCustomersEl.textContent = vendors.size;
  }
}

function loadAdminRecentProducts() {
  const container = document.getElementById('adminRecentProducts');
  if (!container) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const recentProducts = products.slice(-6).reverse();
  
  if (recentProducts.length === 0) {
    container.innerHTML = '<div class="empty-admin-state"><div class="empty-admin-icon">📦</div><div class="empty-admin-text">No products yet</div><div class="empty-admin-hint">Products will appear here once vendors add them</div></div>';
    return;
  }
  
  container.innerHTML = '';
  recentProducts.forEach(product => {
    const categoryLabels = {
      'grains': 'Grains (الحبوب)',
      'poultry': 'Poultry (الدواجن)',
      'vegetables': 'Vegetables (الخضراوات)'
    };
    
    const imageStyle = product.image
      ? 'style="background-image:url(\'' + product.image + '\'); background-size:cover; background-position:center;"'
      : '';
    
    const card = '<div class="recent-product-card">' +
      '<div class="recent-product-image" ' + imageStyle + '></div>' +
      '<div class="recent-product-info">' +
      '<div class="recent-product-name">' + product.name + '</div>' +
      '<div class="admin-product-vendor">By: ' + (product.addedBy || 'Unknown') + '</div>' +
      '<div class="recent-product-price">' + product.price + ' EGP</div>' +
      '<div class="recent-product-category">' + (categoryLabels[product.category] || product.category) + '</div>' +
      '</div>' +
      '</div>';
    
    container.innerHTML += card;
  });
}

function loadAdminTopVendors() {
  const container = document.getElementById('adminTopVendors');
  if (!container) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  const vendorCounts = {};
  products.forEach(p => {
    const vendor = p.addedBy || 'Unknown Vendor';
    vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
  });
  
  const sortedVendors = Object.entries(vendorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  if (sortedVendors.length === 0) {
    container.innerHTML = '<div class="empty-admin-state"><div class="empty-admin-icon">👥</div><div class="empty-admin-text">No vendors yet</div></div>';
    return;
  }
  
  const maxCount = sortedVendors[0][1];
  
  container.innerHTML = '';
  sortedVendors.forEach(([vendor, count]) => {
    const percentage = ((count / maxCount) * 100).toFixed(0);
    
    const bar = '<div class="category-bar">' +
      '<div class="category-bar-header">' +
      '<div class="category-bar-name">' + vendor + '</div>' +
      '<div class="category-bar-count">' + count + ' products</div>' +
      '</div>' +
      '<div class="category-bar-fill">' +
      '<div class="category-bar-progress" style="width:' + percentage + '%"></div>' +
      '</div>' +
      '</div>';
    
    container.innerHTML += bar;
  });
}

function showAdminSection(section) {
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(s => s.style.display = 'none');
  
  if (section === 'vendors') {
    document.getElementById('vendorsSection').style.display = 'block';
    loadAdminVendorsList();
  } else if (section === 'products') {
    document.getElementById('productsSection').style.display = 'block';
    loadAdminProductsList();
  } else if (section === 'categories') {
    document.getElementById('categoriesSection').style.display = 'block';
    loadAdminCategoriesList();
  } else {
    document.getElementById('overviewSection').style.display = 'block';
  }
}

function loadAdminVendorsList() {
  const container = document.getElementById('adminVendorsList');
  if (!container) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  const vendorMap = {};
  products.forEach(p => {
    const vendor = p.addedBy || 'Unknown Vendor';
    if (!vendorMap[vendor]) {
      vendorMap[vendor] = [];
    }
    vendorMap[vendor].push(p);
  });
  
  if (Object.keys(vendorMap).length === 0) {
    container.innerHTML = '<div class="empty-admin-state"><div class="empty-admin-icon">👥</div><div class="empty-admin-text">No vendors yet</div></div>';
    return;
  }
  
  container.innerHTML = '';
  Object.entries(vendorMap).forEach(([vendor, vendorProducts]) => {
    const initial = vendor.charAt(0).toUpperCase();
    
    const card = '<div class="admin-vendor-card">' +
      '<div class="admin-vendor-info">' +
      '<div class="admin-vendor-avatar">' + initial + '</div>' +
      '<div class="admin-vendor-details">' +
      '<h4>' + vendor + '</h4>' +
      '<p>Active Vendor</p>' +
      '</div>' +
      '</div>' +
      '<div class="admin-vendor-stats">' +
      '<div class="admin-stat-item">' +
      '<div class="admin-stat-number">' + vendorProducts.length + '</div>' +
      '<div class="admin-stat-label">Products</div>' +
      '</div>' +
      '</div>' +
      '<div class="admin-vendor-actions">' +
      '<button class="admin-action-btn view" onclick="alert(\'View vendor: ' + vendor + '\')">View</button>' +
      '<button class="admin-action-btn delete" onclick="deleteVendorProducts(\'' + vendor + '\')">Delete All</button>' +
      '</div>' +
      '</div>';
    
    container.innerHTML += card;
  });
}

function loadAdminProductsList() {
  const container = document.getElementById('adminProductsList');
  if (!container) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  if (products.length === 0) {
    container.innerHTML = '<div class="empty-admin-state"><div class="empty-admin-icon">📦</div><div class="empty-admin-text">No products yet</div></div>';
    return;
  }
  
  container.innerHTML = '';
  products.forEach((product, index) => {
    const categoryLabels = {
      'grains': 'Grains',
      'poultry': 'Poultry',
      'vegetables': 'Vegetables'
    };
    
    const imageStyle = product.image
      ? 'style="background-image:url(\'' + product.image + '\'); background-size:cover; background-position:center;"'
      : '';
    
    const card = '<div class="admin-product-card">' +
      '<div class="admin-product-badge">' + (categoryLabels[product.category] || product.category) + '</div>' +
      '<div class="admin-product-image" ' + imageStyle + '></div>' +
      '<div class="admin-product-info">' +
      '<div class="admin-product-name">' + product.name + '</div>' +
      '<div class="admin-product-vendor">By: ' + (product.addedBy || 'Unknown') + '</div>' +
      '<div class="admin-product-price">' + product.price + ' EGP</div>' +
      '<div class="admin-product-actions">' +
      '<button class="admin-product-btn delete" onclick="adminDeleteProduct(' + index + ')">Delete</button>' +
      '</div>' +
      '</div>' +
      '</div>';
    
    container.innerHTML += card;
  });
}

function loadAdminCategoriesList() {
  const container = document.getElementById('adminCategoriesList');
  if (!container) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  const categoryCounts = {
    'grains': 0,
    'poultry': 0,
    'vegetables': 0
  };
  
  products.forEach(p => {
    if (categoryCounts.hasOwnProperty(p.category)) {
      categoryCounts[p.category]++;
    }
  });
  
  const categoryLabels = {
    'grains': 'Grains (الحبوب)',
    'poultry': 'Poultry (الدواجن)',
    'vegetables': 'Vegetables (الخضراوات)'
  };
  
  const totalProducts = products.length;
  
  if (totalProducts === 0) {
    container.innerHTML = '<div class="empty-admin-state"><div class="empty-admin-icon">📂</div><div class="empty-admin-text">No products to categorize</div></div>';
    return;
  }
  
  container.innerHTML = '';
  Object.entries(categoryCounts).forEach(([category, count]) => {
    const percentage = totalProducts > 0 ? ((count / totalProducts) * 100).toFixed(0) : 0;
    
    const bar = '<div class="category-bar">' +
      '<div class="category-bar-header">' +
      '<div class="category-bar-name">' + categoryLabels[category] + '</div>' +
      '<div class="category-bar-count">' + count + ' products (' + percentage + '%)</div>' +
      '</div>' +
      '<div class="category-bar-fill">' +
      '<div class="category-bar-progress" style="width:' + percentage + '%"></div>' +
      '</div>' +
      '</div>';
    
    container.innerHTML += bar;
  });
}

function adminDeleteProduct(index) {
  if (!confirm('Delete this product?')) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  
  loadAdminProductsList();
  loadAdminStats();
  alert('Product deleted! ✅');
}

function deleteVendorProducts(vendorName) {
  if (!confirm('Delete all products from ' + vendorName + '?')) return;
  
  let products = JSON.parse(localStorage.getItem('products') || '[]');
  products = products.filter(p => p.addedBy !== vendorName);
  localStorage.setItem('products', JSON.stringify(products));
  
  loadAdminVendorsList();
  loadAdminStats();
  alert('All products deleted! ✅');
}

function clearAllData() {
  if (!confirm('⚠️ This will delete ALL data! Continue?')) return;
  
  localStorage.removeItem('products');
  localStorage.removeItem('favorites');
  localStorage.removeItem('priceAlarms');
  
  alert('All data cleared! ✅');
  location.reload();
}

function confirmExit() {
  if (confirm('Exit admin panel?')) {
    window.location.href = 'login.html';
  }
}

// ================================
// 🔔 PRICE ALERT SYSTEM
// ================================

// فتح Modal التنبيهات
function openAlarmModal() {
  const overlay = document.getElementById('alarmOverlay');
  if (overlay) {
    overlay.classList.add('show');
    loadAlarmsList();
    loadProductsForAlarm();
  }
}

// إغلاق Modal
function closeAlarmModal() {
  const overlay = document.getElementById('alarmOverlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// تحميل قائمة التنبيهات
function loadAlarmsList() {
  const container = document.getElementById('alarmList');
  if (!container) return;
  
  const alarms = JSON.parse(localStorage.getItem('priceAlarms') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  if (alarms.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:30px;">
        <div class="empty-state-icon">🔕</div>
        <div class="empty-state-text">No price alerts yet</div>
        <div class="empty-state-hint">Add your first alert below</div>
      </div>
    `;
    updateAlarmBadge(0);
    return;
  }
  
  container.innerHTML = '';
  alarms.forEach((alarm, index) => {
    const product = products[alarm.productIndex];
    if (!product) return;
    
    const currentPrice = parseFloat(product.price);
    const targetPrice = parseFloat(alarm.targetPrice);
    const priceStatus = currentPrice <= targetPrice 
      ? `🎉 Target reached! Current: ${currentPrice} EGP` 
      : `Current: ${currentPrice} EGP`;
    
    const alarmCard = `
      <div class="alarm-item">
        <div class="alarm-item-info">
          <div class="alarm-item-name">${product.name}</div>
          <div class="alarm-item-price">${priceStatus}</div>
          <div class="alarm-item-target">🎯 Target: ${targetPrice} EGP</div>
        </div>
        <button class="alarm-remove-btn" onclick="removeAlarm(${index})">
          Remove
        </button>
      </div>
    `;
    container.innerHTML += alarmCard;
  });
  
  updateAlarmBadge(alarms.length);
}

// تحميل المنتجات في Select
function loadProductsForAlarm() {
  const select = document.getElementById('alarmProductSelect');
  if (!select) return;
  
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  select.innerHTML = '<option value="">Select a product...</option>';
  products.forEach((product, index) => {
    select.innerHTML += `
      <option value="${index}">
        ${product.name} - Current: ${product.price} EGP
      </option>
    `;
  });
}

// إضافة تنبيه جديد
function addPriceAlert() {
  const productSelect = document.getElementById('alarmProductSelect');
  const targetPriceInput = document.getElementById('alarmTargetPrice');
  
  if (!productSelect || !targetPriceInput) return;
  
  const productIndex = productSelect.value;
  const targetPrice = targetPriceInput.value.trim();
  
  if (!productIndex || !targetPrice) {
    alert('⚠️ Please select a product and enter target price!');
    return;
  }
  
  if (parseFloat(targetPrice) <= 0) {
    alert('⚠️ Target price must be greater than 0!');
    return;
  }
  
  const alarms = JSON.parse(localStorage.getItem('priceAlarms') || '[]');
  
  // تحقق من وجود تنبيه لنفس المنتج
  const existingAlarm = alarms.find(a => a.productIndex === parseInt(productIndex));
  if (existingAlarm) {
    if (confirm('You already have an alert for this product. Update target price?')) {
      existingAlarm.targetPrice = parseFloat(targetPrice);
      localStorage.setItem('priceAlarms', JSON.stringify(alarms));
      loadAlarmsList();
      productSelect.value = '';
      targetPriceInput.value = '';
      alert('✅ Alert updated successfully!');
      checkPriceAlerts();
      return;
    }
    return;
  }
  
  const newAlarm = {
    productIndex: parseInt(productIndex),
    targetPrice: parseFloat(targetPrice),
    createdAt: new Date().toISOString()
  };
  
  alarms.push(newAlarm);
  localStorage.setItem('priceAlarms', JSON.stringify(alarms));
  
  loadAlarmsList();
  productSelect.value = '';
  targetPriceInput.value = '';
  
  alert('✅ Price alert added successfully! 🔔');
  checkPriceAlerts();
}

// حذف تنبيه
function removeAlarm(index) {
  if (!confirm('❌ Remove this price alert?')) return;
  
  const alarms = JSON.parse(localStorage.getItem('priceAlarms') || '[]');
  alarms.splice(index, 1);
  localStorage.setItem('priceAlarms', JSON.stringify(alarms));
  
  loadAlarmsList();
  alert('✅ Alert removed successfully!');
}

// تحديث Badge عدد التنبيهات
function updateAlarmBadge(count) {
  const badge = document.getElementById('alarmBadge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

// فحص التنبيهات (يتم استدعاؤها عند تحديث المنتجات)
function checkPriceAlerts() {
  const alarms = JSON.parse(localStorage.getItem('priceAlarms') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  let notificationCount = 0;
  
  alarms.forEach(alarm => {
    const product = products[alarm.productIndex];
    if (!product) return;
    
    const currentPrice = parseFloat(product.price);
    const targetPrice = parseFloat(alarm.targetPrice);
    
    if (currentPrice <= targetPrice) {
      notificationCount++;
      
      // إرسال إشعار
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Price Alert - Market Pro!', {
          body: `${product.name} is now ${currentPrice} EGP!\nYour target was ${targetPrice} EGP.`,
          icon: product.image || 'images/logo.png',
          badge: 'images/logo.png',
          tag: 'price-alert-' + alarm.productIndex,
          requireInteraction: true
        });
      } else {
        setTimeout(() => {
          alert(`🎉 PRICE ALERT!\n\n${product.name} reached your target price!\n\nCurrent Price: ${currentPrice} EGP\nYour Target: ${targetPrice} EGP`);
        }, 500);
      }
    }
  });
  
  if (notificationCount > 0) {
    console.log(`✅ ${notificationCount} price alert(s) triggered!`);
  }
}

// طلب إذن الإشعارات عند تحميل الصفحة
if ('Notification' in window && Notification.permission === 'default') {
  setTimeout(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('✅ Notifications enabled for Price Alerts!');
      }
    });
  }, 2000);
}

// تحديث Badge عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', function() {
  const alarms = JSON.parse(localStorage.getItem('priceAlarms') || '[]');
  updateAlarmBadge(alarms.length);
  
  setTimeout(() => {
    checkPriceAlerts();
  }, 1000);
});
// ================================
// DARK MODE
// ================================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  
  const icon = document.querySelector('.user-link-icon');
  if (icon) {
    icon.textContent = isDark ? '☀️' : '🌙';
  }
  
  showToast(isDark ? 'Dark mode enabled 🌙' : 'Light mode enabled ☀️', 'info');
}

// تطبيق Dark Mode عند تحميل الصفحة
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// ================================
// TOAST NOTIFICATIONS
// ================================
function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? '✅' : 
               type === 'error' ? '❌' : 
               type === 'warning' ? '⚠️' : 'ℹ️';
  
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ================================
// LOADING SKELETON
// ================================
function showLoadingSkeleton() {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
  `;
}

// ================================
// REAL-TIME SEARCH
// ================================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
      loadProducts();
      return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.location.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(filtered);
  });
}

function displaySearchResults(products) {
  const productsContainer = document.getElementById('productsContainer');
  if (!productsContainer) return;

  const userRole = localStorage.getItem('userRole');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No products found</div>
        <div class="empty-state-hint">Try a different search term</div>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = '';
  const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
  
  products.forEach((product) => {
    const index = allProducts.findIndex(p => 
      p.name === product.name && p.price === product.price && p.addedBy === product.addedBy
    );
    
    const deleteBtn = userRole === 'vendor'
      ? `<button class="delete-product-btn" onclick="deleteProduct(${index})">🗑️ Delete</button>`
      : '';

    const categoryLabel =
      product.category === 'grains' ? 'Grains (الحبوب)' :
      product.category === 'poultry' ? 'Poultry (الدواجن)' :
      product.category === 'vegetables' ? 'Vegetables (الخضراوات)' :
      product.category || '';

    const imageStyle = product.image
      ? `style="background-image:url('${product.image}'); background-size:cover; background-position:center;"`
      : '';

    const isFavorite = favorites.includes(index);
    const favoriteClass = isFavorite ? 'active' : '';
    const heartIcon = isFavorite ? '❤️' : '🤍';

    const productCard = `
      <div class="product-card">
        <div class="product-favorite ${favoriteClass}" onclick="toggleFavorite(${index})">
          <span class="product-favorite-icon">${heartIcon}</span>
        </div>
        <div class="product-image" ${imageStyle}></div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-location">${product.location}</div>
          <div class="product-category">${categoryLabel}</div>
          <div class="product-price">${product.price} EGP</div>
          <button class="product-btn">Book Now</button>
          ${deleteBtn}
        </div>
      </div>
    `;
    productsContainer.innerHTML += productCard;
  });
}

// ================================
// SCROLL TO TOP
// ================================
window.addEventListener('scroll', function() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ================================
// PROGRESS BAR
// ================================
function showProgress(duration = 1000) {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  
  bar.style.width = '0%';
  bar.style.display = 'block';
  
  let width = 0;
  const increment = 100 / (duration / 50);
  
  const interval = setInterval(() => {
    width += increment;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        bar.style.display = 'none';
      }, 300);
    }
    bar.style.width = width + '%';
  }, 50);
}

// ================================
// MODAL BLUR EFFECT
// ================================
function openModalWithBlur(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.add('show');
    document.body.classList.add('modal-open');
  }
}

function closeModalWithBlur(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) {
    overlay.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// تحديث الوظائف الموجودة
const originalOpenAddProductModal = openAddProductModal;
openAddProductModal = function() {
  openModalWithBlur('addProductOverlay');
  const nameInput = document.getElementById('productName');
  if (nameInput) nameInput.focus();
};

const originalCloseAddProductModal = closeAddProductModal;
closeAddProductModal = function() {
  closeModalWithBlur('addProductOverlay');
  const form = document.getElementById('addProductForm');
  if (form) form.reset();
};

// ================================
// تحديث وظيفة إضافة المنتج بـ Toast
// ================================
if (document.getElementById('addProductForm')) {
  const form = document.getElementById('addProductForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    showProgress(800);
    
    const name = document.getElementById('productName').value.trim();
    const location = document.getElementById('productLocation').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const imageInput = document.getElementById('productImage');
    const imageFile = imageInput.files[0];

    if (!name || !location || !price || !category || !imageFile) {
      showToast('Please fill all fields!', 'warning');
      return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');

    const reader = new FileReader();
    reader.onload = function (ev) {
      const newProduct = {
        name: name,
        location: location,
        price: price,
        category: category,
        image: ev.target.result,
        addedBy: localStorage.getItem('userName'),
        addedAt: new Date().toISOString()
      };

      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      checkPriceAlerts();
      closeAddProductModal();
      loadProducts();
      
      showToast('Product added successfully! 🎉', 'success');
    };
    reader.readAsDataURL(imageFile);
  });
}

// ================================
// تحديث باقي الـ Alerts بـ Toast
// ================================

// استبدال كل alert() بـ showToast()
// مثال في deleteProduct:
/*
function deleteProduct(index) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  const products = JSON.parse(localStorage.getItem('products') || '[]');
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
  showToast('Product deleted successfully!', 'success');
}
*/

// ================================
// PAGE LOAD ANIMATIONS
// ================================
window.addEventListener('load', function() {
  showProgress(600);
  
  // Fade in products
  setTimeout(() => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      }, index * 100);
    });
  }, 100);
});
