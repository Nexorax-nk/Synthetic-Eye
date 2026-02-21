const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Chaos Mode Middleware
app.use((req, res, next) => {
    const chaos = req.headers['x-chaos-trigger'];

    if (chaos === 'latency') {
        console.log('⚠️ Chaos Mode: Injecting 10s latency');
        setTimeout(next, 10000);
    } else if (chaos === 'crash' && req.path === '/api/auth/login') {
        console.log('⚠️ Chaos Mode: Simulating 500 Crash');
        res.status(500).json({ error: 'Internal Server Error (Chaos Mode)' });
    } else if (chaos === 'corrupt') {
        console.log('⚠️ Chaos Mode: Simulating Data Corruption');
        // Sending invalid JSON to break frontend parsing
        res.status(200).send('{ "status": "ok", "products": [ { "id": 1, "name": "Broken Data" ');
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.send('ShopNow API Server is running. Access endpoints via /api');
});

// Mock Products Data (Sync with frontend data)
const PRODUCTS = [
    {
        id: 1,
        name: 'Pro Wireless Headphones',
        brand: 'SoundCore',
        category: 'Audio',
        price: 79.99,
        originalPrice: 119.99,
        rating: 4.5,
        reviews: 2841,
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        description: 'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and foldable design. Ideal for commuters and remote workers.',
        features: ['Active Noise Cancellation', '30h Battery', 'Bluetooth 5.2', 'Foldable Design'],
    },
    {
        id: 2,
        name: 'Mechanical Keyboard TKL',
        brand: 'KeyForge',
        category: 'Input Devices',
        price: 54.99,
        originalPrice: 79.99,
        rating: 4.7,
        reviews: 1563,
        badge: 'Top Rated',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        description: 'Tenkeyless mechanical keyboard with tactile brown switches, per-key RGB backlighting, and a sturdy aluminium top plate. Compatible with Windows and macOS.',
        features: ['RGB Backlit', 'Aluminium Frame', 'Brown Switches', 'TKL Layout'],
    },
    {
        id: 3,
        name: 'Ergonomic USB-C Mouse',
        brand: 'GlidePro',
        category: 'Input Devices',
        price: 34.99,
        originalPrice: 49.99,
        rating: 4.3,
        reviews: 987,
        badge: null,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
        description: 'Lightweight ergonomic mouse with USB-C charging, 8000 DPI optical sensor, programmable side buttons, and 60-hour battery life.',
        features: ['8000 DPI Sensor', '60h Battery', 'USB-C Charging', 'Programmable Buttons'],
    },
    {
        id: 4,
        name: '27" 4K IPS Monitor',
        brand: 'ViewCraft',
        category: 'Display',
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.6,
        reviews: 3210,
        badge: 'Deal',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        description: '27-inch 4K UHD IPS display with 99% sRGB coverage, HDR400 support, USB-C 65W power delivery, and ultra-thin bezels. Perfect for creative and productivity workflows.',
        features: ['4K UHD 3840×2160', '99% sRGB', 'HDR 400', 'USB-C 65W'],
    },
    {
        id: 5,
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'Mobiles',
        price: 999.00,
        originalPrice: 1099.00,
        rating: 4.9,
        reviews: 8742,
        badge: 'Top Seller',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
        description: 'Titanium design, A17 Pro chip, customizable Action button, and a more versatile Pro camera system.',
        features: ['Titanium Frame', 'A17 Pro Chip', '48MP Main Camera', 'USB-C'],
    },
    {
        id: 6,
        name: 'Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'Mobiles',
        price: 1199.99,
        originalPrice: 1299.99,
        rating: 4.8,
        reviews: 5421,
        badge: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
        description: 'The ultimate Galaxy Ultra experience with Galaxy AI, a built-in S Pen, and a massive 200MP camera.',
        features: ['Galaxy AI', 'S Pen Included', '200MP Camera', 'Snapdragon 8 Gen 3'],
    },
    {
        id: 7,
        name: 'MacBook Air M3',
        brand: 'Apple',
        category: 'Laptops',
        price: 1099.00,
        originalPrice: 1199.00,
        rating: 4.9,
        reviews: 2314,
        badge: 'New',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        description: 'Supremely capable, Mac-friendly, and more portable than ever with the M3 chip.',
        features: ['M3 Chip', '18h Battery Life', 'Liquid Retina Display', 'MagSafe 3'],
    },
    {
        id: 8,
        name: 'WH-1000XM5 Headphones',
        brand: 'Sony',
        category: 'Audio',
        price: 348.00,
        originalPrice: 399.99,
        rating: 4.7,
        reviews: 12450,
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        description: 'Industry-leading noise cancellation, exceptional sound quality, and crystal-clear calls.',
        features: ['NC Optimizer', '30h Battery', 'Multipoint Connection', 'Speak-to-Chat'],
    },
    {
        id: 9,
        name: 'Nintendo Switch OLED',
        brand: 'Nintendo',
        category: 'Gaming',
        price: 349.99,
        originalPrice: 349.99,
        rating: 4.8,
        reviews: 15420,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1578303372216-81415914659e?w=600&q=80',
        description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen.',
        features: ['OLED Screen', '64GB Storage', 'Enhanced Audio', 'Wired LAN Port'],
    },
    {
        id: 10,
        name: 'MX Master 3S Mouse',
        brand: 'Logitech',
        category: 'Input Devices',
        price: 99.00,
        originalPrice: 99.00,
        rating: 4.8,
        reviews: 8450,
        badge: 'Pro Choice',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
        description: 'An icon remastered. Feel every moment of your workflow with even more precision and silence.',
        features: ['8K DPI Tracking', 'Quiet Clicks', 'MagSpeed Scrolling', 'Multi-Device'],
    },
    {
        id: 11,
        name: 'Kindle Paperwhite',
        brand: 'Amazon',
        category: 'E-Readers',
        price: 139.99,
        originalPrice: 149.99,
        rating: 4.7,
        reviews: 42100,
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1594980596247-87c52a347cfb?w=600&q=80',
        description: 'Now with a 6.8" display and thinner borders, adjustable warm light, up to 10 weeks of battery life.',
        features: ['6.8" Display', 'Adjustable Warm Light', 'Waterproof', 'USB-C'],
    },
    {
        id: 12,
        name: 'Razer BlackWidow V4',
        brand: 'Razer',
        category: 'Gaming',
        price: 169.99,
        originalPrice: 189.99,
        rating: 4.6,
        reviews: 2140,
        badge: 'Clearance',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        description: 'Full-blown mechanical gaming keyboard with Razer Chroma RGB and dedicated macro keys.',
        features: ['Green Switches', 'Chroma RGB', 'Macro Keys', 'Wrist Rest'],
    },
    {
        id: 13,
        name: 'DJI Mavic 3 Pro',
        brand: 'DJI',
        category: 'Drones',
        price: 2199.00,
        originalPrice: 2399.00,
        rating: 4.9,
        reviews: 840,
        badge: 'Professional',
        image: 'https://images.unsplash.com/photo-1473963342623-0cp02c29a4c2?w=600&q=80',
        description: 'Triple-camera flagship drone with 43-min flight time and 15km video transmission.',
        features: ['Triple Camera System', '43m Flight Time', 'APAS 5.0', 'ActiveTrack 5.0'],
    },
    {
        id: 14,
        name: 'QuietComfort Ultra',
        brand: 'Bose',
        category: 'Audio',
        price: 429.00,
        originalPrice: 429.00,
        rating: 4.8,
        reviews: 3200,
        badge: 'Premium',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        description: 'World-class noise cancellation, quieter than ever before. Breakthrough spatialized audio.',
        features: ['CustomTune technology', 'Aware Mode', '24h Battery', 'Bluetooth 5.3'],
    },
    {
        id: 15,
        name: 'Odyssey G9 OLED',
        brand: 'Samsung',
        category: 'Display',
        price: 1299.99,
        originalPrice: 1799.99,
        rating: 4.7,
        reviews: 1120,
        badge: 'Deal',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        description: '49-inch curved gaming monitor with 240Hz refresh rate and 0.03ms response time.',
        features: ['Dual QHD', '240Hz Refresh', '0.03ms Response', 'Neo Quantum Processor Pro'],
    },
    {
        id: 16,
        name: 'Surface Pro 9',
        brand: 'Microsoft',
        category: 'Laptops',
        price: 899.00,
        originalPrice: 999.00,
        rating: 4.6,
        reviews: 4500,
        badge: 'Mobile Pro',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        description: 'The most powerful Surface Pro ever. Tablet portability, laptop performance.',
        features: ['12th Gen Intel Core', '13" PixelSense Flow', 'Thunderbolt 4', '5MP Front Camera'],
    },
    {
        id: 17,
        name: 'Razer Blade 16',
        brand: 'Razer',
        category: 'Laptops',
        price: 3599.99,
        originalPrice: 3599.99,
        rating: 4.8,
        reviews: 320,
        badge: 'Elite',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        description: 'The world\'s first dual-mode Mini-LED display gaming laptop with NVIDIA RTX 4090.',
        features: ['RTX 4090', 'Intel i9-13950HX', 'Mini-LED Display', 'CNC Aluminum Chassis'],
    },
    {
        id: 18,
        name: 'Echo Pop',
        brand: 'Amazon',
        category: 'Smart Home',
        price: 39.99,
        originalPrice: 39.99,
        rating: 4.5,
        reviews: 12500,
        badge: 'Compact',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80',
        description: 'Full sound compact smart speaker with Alexa for any small space.',
        features: ['Alexa Built-in', 'Compact Design', 'Bluetooth Support', 'Privacy Controls'],
    },
    {
        id: 19,
        name: 'iPad Pro M4',
        brand: 'Apple',
        category: 'Tablets',
        price: 999.00,
        originalPrice: 1099.00,
        rating: 4.9,
        reviews: 1240,
        badge: 'Top Pick',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        description: 'Thin logic. Powered by M4. Ultra Retina XDR display with ProMotion technology.',
        features: ['Apple M4 Chip', 'OLED Display', 'Face ID', 'Apple Pencil Pro Support'],
    },
    {
        id: 20,
        name: 'Pixel 8 Pro',
        brand: 'Google',
        category: 'Mobiles',
        price: 749.00,
        originalPrice: 999.00,
        rating: 4.7,
        reviews: 8900,
        badge: 'Deal',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
        description: 'The all-pro phone engineered by Google. It’s sleek, sophisticated, and has a powerful camera.',
        features: ['Google Tensor G3', 'Best-in-class Camera', '7 Years of Updates', 'Magic Editor'],
    },
    {
        id: 21,
        name: 'Insta360 X3',
        brand: 'Insta360',
        category: 'Cameras',
        price: 449.99,
        originalPrice: 449.99,
        rating: 4.8,
        reviews: 2100,
        badge: 'Popular',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        description: 'Capture everything. Reframing makes it simple to post to any platform.',
        features: ['5.7K 360 Video', 'FlowState Stabilization', 'Waterproof to 10m', 'Active HDR'],
    },
    {
        id: 22,
        name: 'Sonos Move 2',
        brand: 'Sonos',
        category: 'Audio',
        price: 449.00,
        originalPrice: 449.00,
        rating: 4.8,
        reviews: 1200,
        badge: 'Premium',
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&q=80',
        description: 'The powerful, portable speaker with up to 24 hours of continuous playback.',
        features: ['24h Battery', 'Weather Resistant', 'Wi-Fi & Bluetooth', 'Automatic Trueplay'],
    },
    {
        id: 23,
        name: 'PlayStation 5 Slim',
        brand: 'Sony',
        category: 'Gaming',
        price: 499.99,
        originalPrice: 499.99,
        rating: 4.9,
        reviews: 25000,
        badge: 'In Stock',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
        description: 'Experience lightning-fast loading with an ultra-high-speed SSD and deeper immersion.',
        features: ['Ultra-High Speed SSD', 'Ray Tracing', '4K-TV Gaming', 'DualSense Support'],
    },
    {
        id: 24,
        name: 'Steam Deck OLED',
        brand: 'Valve',
        category: 'Gaming',
        price: 549.00,
        originalPrice: 549.00,
        rating: 4.9,
        reviews: 15000,
        badge: 'Must Have',
        image: 'https://images.unsplash.com/photo-1578303372216-81415914659e?w=600&q=80',
        description: 'Portable PC gaming on a beautiful 7.4" HDR OLED display.',
        features: ['90Hz OLED Display', '50Wh Battery', 'Wi-Fi 6E', 'Premium Carrying Case'],
    },
    {
        id: 25,
        name: 'Logitech C920e',
        brand: 'Logitech',
        category: 'Accessories',
        price: 69.99,
        originalPrice: 79.99,
        rating: 4.6,
        reviews: 32000,
        badge: 'Work from Home',
        image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80',
        description: 'The standard for video conferencing. Sharp-focused Pro HD 1080p video.',
        features: ['1080p Full HD', 'Autofocus', 'Dual Mics', 'Universal Clip'],
    },
    {
        id: 26,
        name: 'MagSafe Wireless Charger',
        brand: 'Generic',
        category: 'Accessories',
        price: 19.99,
        originalPrice: 29.99,
        rating: 4.4,
        reviews: 5400,
        badge: 'Budget Pick',
        image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80',
        description: 'Fast wireless charging with strong magnetic alignment for all compatible smartphones.',
        features: ['15W Fast Charge', 'Strong Magnets', 'Type-C Input', 'Compact Size'],
    },
    {
        id: 27,
        name: 'Aluminum Laptop Stand',
        brand: 'DeskMate',
        category: 'Accessories',
        price: 24.50,
        originalPrice: 34.99,
        rating: 4.8,
        reviews: 8200,
        badge: 'Top Seller',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
        description: 'Ergonomic foldable laptop riser made of premium aluminum alloy for better cooling.',
        features: ['Adjustable Height', 'Anti-slip Pads', 'Heat Dissipation', 'Foldable'],
    },
    {
        id: 28,
        name: 'USB-C 7-in-1 Hub',
        brand: 'LinkUp',
        category: 'Accessories',
        price: 42.99,
        originalPrice: 59.99,
        rating: 4.6,
        reviews: 3100,
        badge: 'Essential',
        image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80',
        description: 'Expand your laptop connectivity with 4K HDMI, USB 3.0 ports, and SD card slots.',
        features: ['4K HDMI', '60W PD Charging', 'SD/TF Slots', 'High Speed Data'],
    },
    {
        id: 29,
        name: 'Smart WiFi Bulb XL',
        brand: 'Lumina',
        category: 'Smart Home',
        price: 15.99,
        originalPrice: 24.99,
        rating: 4.5,
        reviews: 1200,
        badge: 'Eco',
        image: 'https://images.unsplash.com/photo-1550524513-3151b3346824?w=600&q=80',
        description: 'Multi-color smart bulb compatible with Alexa and Google Home. Set schedules and themes.',
        features: ['16M Colors', 'Voice Control', 'App Integration', 'Energy Efficient'],
    },
    {
        id: 30,
        name: 'GoPro Hero 12',
        brand: 'GoPro',
        category: 'Cameras',
        price: 399.00,
        originalPrice: 449.00,
        rating: 4.9,
        reviews: 5600,
        badge: 'Action',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        description: 'The ultimate action camera with HyperSmooth 6.0 stabilization and incredible 5.3K video quality.',
        features: ['5.3K60 Video', 'HyperSmooth 6.0', 'Waterproof 33ft', 'HDR Video'],
    }
];

// In-memory Cart and Orders (for demo purposes)
let cart = [];
let orders = [];

// Auth Endpoint
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    if (email === 'admin@hack.com' && password === '12345') {
        res.json({ success: true, token: 'demo-jwt-token', user: { email, name: 'Admin User' } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Products Endpoints
app.get('/api/products', (req, res) => {
    const { search, category, minPrice, maxPrice, filter } = req.query;
    let filtered = [...PRODUCTS];

    if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category === category);
    }

    if (minPrice) {
        filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (filter) {
        if (filter === 'Top Offers' || filter === 'Deal') {
            filtered = filtered.filter(p => p.badge === 'Deal' || p.price < p.originalPrice);
        } else if (filter === 'New Arrivals' || filter === 'New') {
            filtered = filtered.filter(p => p.badge === 'New' || p.badge === 'New Arrival' || p.id > 4);
        } else if (filter === 'Clearance') {
            filtered = filtered.filter(p => p.badge === 'Clearance');
        } else if (filter === 'Electronics') {
            filtered = filtered.filter(p => ['Mobiles', 'Laptops', 'Display', 'Drones'].includes(p.category));
        } else if (filter === 'Accessories') {
            filtered = filtered.filter(p => ['Audio', 'Input Devices', 'E-Readers', 'Smart Home'].includes(p.category));
        }
    }

    if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query)
        );
    }

    res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
    const product = PRODUCTS.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// User & Orders Endpoints
app.get('/api/user/profile', (req, res) => {
    // Mock user profile
    res.json({
        name: 'Admin User',
        email: 'admin@hack.com',
        memberSince: 'Feb 2026',
        plusMember: true,
        superCoins: 450,
    });
});

app.get('/api/orders', (req, res) => {
    // Return orders in reverse chronological order
    res.json([...orders].reverse());
});

// Cart Endpoints
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart', (req, res) => {
    const { productId, qty = 1 } = req.body;
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingIdx = cart.findIndex(item => item.id === productId);
    if (existingIdx > -1) {
        cart[existingIdx].qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    res.json(cart);
});

app.put('/api/cart/:id', (req, res) => {
    const { qty } = req.body;
    const productId = parseInt(req.params.id);
    const existingIdx = cart.findIndex(item => item.id === productId);

    if (existingIdx > -1) {
        if (qty <= 0) {
            cart = cart.filter(item => item.id !== productId);
        } else {
            cart[existingIdx].qty = qty;
        }
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Item not in cart' });
    }
});

app.delete('/api/cart/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    cart = cart.filter(item => item.id !== productId);
    res.json(cart);
});

// Orders Endpoint
app.post('/api/orders', (req, res) => {
    if (cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const order = {
        id: uuidv4().substring(0, 8).toUpperCase(),
        items: [...cart],
        total: cart.reduce((acc, item) => acc + (item.price * item.qty), 0),
        status: 'Success',
        date: new Date().toISOString()
    };

    orders.push(order);
    cart = []; // Clear cart on success

    res.status(201).json(order);
});

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
