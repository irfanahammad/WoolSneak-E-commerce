// Initialize Splide carousel and setup
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the carousel
    new Splide('#featured-carousel', {
        perPage: 3,
        gap: '2rem',
        breakpoints: {
            768: {
                perPage: 1,
            }
        }
    }).mount();
    
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('woolsneak_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

    // Initialize scroll reveal animations
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
});

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('nav-sticky');
    } else {
        navbar.classList.remove('nav-sticky');
    }
});

// Cart functionality
let cart = [];
let cartOpen = false;

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (cartOpen) {
        drawer.style.transform = 'translateX(100%)';
        overlay.classList.remove('opacity-100', 'visible');
        overlay.classList.add('opacity-0', 'invisible');
    } else {
        drawer.style.transform = 'translateX(0)';
        overlay.classList.remove('opacity-0', 'invisible');
        overlay.classList.add('opacity-100', 'visible');
    }
    
    cartOpen = !cartOpen;
}

function addToCart(id, name, price, imageUrl) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-soft-charcoal text-warm-white px-6 py-3 rounded-lg shadow-lg transform translate-y-full opacity-0 transition-all duration-300';
    toast.style.zIndex = '9999';
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
        toast.textContent = `Added another ${name} to your cart`;
    } else {
        cart.push({
            id,
            name,
            price,
            imageUrl,
            quantity: 1
        });
        toast.textContent = `${name} added to your cart`;
    }
    
    document.body.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.remove('translate-y-full', 'opacity-0');
    }, 100);
    
    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    updateCart();
    
    // Show cart drawer
    if (!cartOpen) {
        toggleCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.classList.toggle('hidden', totalItems === 0);
    
    // Show/hide empty cart message
    emptyCart.style.display = cart.length === 0 ? 'block' : 'none';
    
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 p-4 bg-white rounded-xl">
            <img src="${item.imageUrl}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover">
            <div class="flex-1">
                <h4 class="font-inter font-semibold text-soft-charcoal">${item.name}</h4>
                <div class="flex items-center justify-between mt-2">
                    <span class="font-inter font-bold text-soft-charcoal">$${item.price}</span>
                    <div class="flex items-center gap-2">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="w-8 h-8 flex items-center justify-center rounded-lg bg-oat text-soft-charcoal">
                            -
                        </button>
                        <span class="font-inter font-medium text-soft-charcoal">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})"
                                class="w-8 h-8 flex items-center justify-center rounded-lg bg-oat text-soft-charcoal">
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total}`;
    
    // Save cart to localStorage
    localStorage.setItem('woolsneak_cart', JSON.stringify(cart));
}

function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    
    updateCart();
}

function proceedToCheckout() {
    // Create success page content
    const mainContent = document.body.innerHTML;
    const cartItems = cart.map(item => `
        <div class="flex items-center gap-4 p-4 bg-white rounded-xl">
            <img src="${item.imageUrl}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover">
            <div class="flex-1">
                <h4 class="font-inter font-semibold text-soft-charcoal">${item.name}</h4>
                <div class="flex items-center justify-between mt-2">
                    <span class="font-inter font-bold text-soft-charcoal">$${item.price}</span>
                    <span class="font-inter text-soft-charcoal">Quantity: ${item.quantity}</span>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderNumber = Math.floor(Math.random() * 1000000);

    document.body.innerHTML = `
        <div class="min-h-screen bg-warm-white py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-8">
                    <svg class="mx-auto h-16 w-16 text-muted-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h2 class="mt-4 text-4xl font-bold font-inter text-soft-charcoal">Order Successful!</h2>
                    <p class="mt-2 text-lg text-soft-charcoal/70 font-source">Order #${orderNumber}</p>
                    <p class="mt-4 text-soft-charcoal/70 font-source">Thank you for shopping with WoolSneak. Your order will be delivered in 3-4 business days.</p>
                </div>

                <div class="bg-oat/30 rounded-2xl p-6 mb-8">
                    <h3 class="text-xl font-inter font-semibold text-soft-charcoal mb-4">Order Summary</h3>
                    <div class="space-y-4 mb-6">
                        ${cartItems}
                    </div>
                    <div class="border-t border-mist-grey/30 pt-4">
                        <div class="flex justify-between items-center">
                            <span class="font-inter font-semibold text-soft-charcoal">Total:</span>
                            <span class="text-2xl font-inter font-bold text-soft-charcoal">$${total}</span>
                        </div>
                    </div>
                </div>

                <div class="text-center space-y-4">
                    <p class="text-soft-charcoal/70 font-source">You will receive an order confirmation email shortly.</p>
                    <button onclick="window.location.href='index.html'" class="btn-primary px-8 py-4 rounded-xl font-inter font-semibold text-lg">
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    `;

    // Clear the cart
    cart = [];
    localStorage.removeItem('woolsneak_cart');
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing! We'll send your 10% discount code to ${email}`);
    event.target.reset();
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.hidden.md\\:flex');
    nav.classList.toggle('hidden');
    nav.classList.toggle('flex');
    nav.classList.toggle('flex-col');
    nav.classList.toggle('absolute');
    nav.classList.toggle('top-full');
    nav.classList.toggle('left-0');
    nav.classList.toggle('w-full');
    nav.classList.toggle('bg-warm-white');
    nav.classList.toggle('p-4');
    nav.classList.toggle('shadow-lg');
}