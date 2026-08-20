// Banco de dados em memória
const properties = [
    {
        id: "IM001",
        type: "venda",
        typeLabel: "Venda",
        title: "Casa de Alto Padrão em Condomínio",
        location: "Alphaville Flamboyant, Goiânia - GO",
        price: "R$ 3.500.000",
        features: {
            area: "450m²",
            beds: 4,
            baths: 5,
            parking: 4
        },
        description: "Maravilhosa casa em condomínio fechado com fachada imponente, pé direito duplo e acabamento premium. Área de lazer completa com piscina aquecida, churrasqueira gourmet e integração total com a sala de estar.",
        // Placeholder images
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607687931-cebf0746e898?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607687644-aac4c15cecb1?w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "IM002",
        type: "aluguel",
        typeLabel: "Aluguel",
        title: "Apartamento Luxo 3 Suítes",
        location: "Setor Bueno, Goiânia - GO",
        price: "R$ 6.500 / mês",
        features: {
            area: "140m²",
            beds: 3,
            baths: 4,
            parking: 2
        },
        description: "Apartamento semi-mobiliado no coração do Bueno, andar alto, nascente. Repleto de armários, varanda gourmet envidraçada e projeto luminotécnico. Lazer completo no prédio.",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1e52d15461?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "IM003",
        type: "venda",
        typeLabel: "Venda",
        title: "Cobertura Duplex Exclusiva",
        location: "Setor Marista, Goiânia - GO",
        price: "R$ 4.200.000",
        features: {
            area: "320m²",
            beds: 4,
            baths: 6,
            parking: 4
        },
        description: "Cobertura espetacular com piscina privativa, espaço gourmet e vista definitiva para o parque. Acabamento em mármore, automação residencial e elevador privativo.",
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop"
        ]
    },
    {
        id: "IM004",
        type: "aluguel",
        typeLabel: "Aluguel",
        title: "Studio Moderno Mobiliado",
        location: "Jardim Goiás, Goiânia - GO",
        price: "R$ 3.200 / mês",
        features: {
            area: "45m²",
            beds: 1,
            baths: 1,
            parking: 1
        },
        description: "Studio decorado e 100% mobiliado. Cama queen, ar condicionado, TV Smart, cozinha completa. Condomínio com coworking, academia moderna e piscina no rooftop.",
        images: [
            "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop"
        ]
    }
];

let activeFilter = 'todos';
let searchQuery = '';

// DOM Elements
const grid = document.getElementById('properties-grid');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.tab');

// Modal Elements
const modal = document.getElementById('property-modal');
const closeModal = document.getElementById('close-modal');
let currentImageIndex = 0;
let currentPropertyImages = [];

// Init
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    renderProperties();
    setupListeners();
});

function setupListeners() {
    // Tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            activeFilter = e.target.dataset.type;
            renderProperties();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProperties();
    });

    // Modal close
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Modal gallery nav
    document.getElementById('prev-img').addEventListener('click', () => navigateGallery(-1));
    document.getElementById('next-img').addEventListener('click', () => navigateGallery(1));
}

function renderProperties() {
    grid.innerHTML = '';
    
    const filtered = properties.filter(prop => {
        const matchesFilter = activeFilter === 'todos' || prop.type === activeFilter;
        const searchString = `${prop.title} ${prop.location} ${prop.typeLabel}`.toLowerCase();
        const matchesSearch = searchString.includes(searchQuery);
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    filtered.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.onclick = () => openModal(prop.id);

        card.innerHTML = `
            <div class="card-img-wrapper">
                <div class="card-badge ${prop.type}">${prop.typeLabel}</div>
                <img src="${prop.images[0]}" alt="${prop.title}">
            </div>
            <div class="card-content">
                <div class="card-price">${prop.price}</div>
                <h3 class="card-title">${prop.title}</h3>
                <div class="card-location"><i class="ph-fill ph-map-pin"></i> ${prop.location}</div>
                <div class="card-features">
                    <div class="feature" title="Área"><i class="ph-fill ph-square"></i> ${prop.features.area}</div>
                    <div class="feature" title="Quartos"><i class="ph-fill ph-bed"></i> ${prop.features.beds}</div>
                    <div class="feature" title="Banheiros"><i class="ph-fill ph-shower"></i> ${prop.features.baths}</div>
                    <div class="feature" title="Vagas"><i class="ph-fill ph-car"></i> ${prop.features.parking}</div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function openModal(id) {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;

    document.getElementById('modal-title').textContent = prop.title;
    document.getElementById('modal-location').innerHTML = `<i class="ph-fill ph-map-pin"></i> ${prop.location}`;
    document.getElementById('modal-price').textContent = prop.price;
    document.getElementById('modal-description').textContent = prop.description;
    
    const badge = document.getElementById('modal-type');
    badge.textContent = prop.typeLabel;
    badge.className = `badge ${prop.type}`;

    // Features
    const featuresHtml = `
        <div class="feature-item">
            <i class="ph ph-square"></i>
            <div class="feature-text">
                <span class="feature-label">Área Total</span>
                <span class="feature-value">${prop.features.area}</span>
            </div>
        </div>
        <div class="feature-item">
            <i class="ph ph-bed"></i>
            <div class="feature-text">
                <span class="feature-label">Quartos</span>
                <span class="feature-value">${prop.features.beds} Suítes</span>
            </div>
        </div>
        <div class="feature-item">
            <i class="ph ph-shower"></i>
            <div class="feature-text">
                <span class="feature-label">Banheiros</span>
                <span class="feature-value">${prop.features.baths}</span>
            </div>
        </div>
        <div class="feature-item">
            <i class="ph ph-car"></i>
            <div class="feature-text">
                <span class="feature-label">Vagas</span>
                <span class="feature-value">${prop.features.parking}</span>
            </div>
        </div>
    `;
    document.getElementById('modal-features').innerHTML = featuresHtml;

    // Gallery
    currentPropertyImages = prop.images;
    currentImageIndex = 0;
    updateGallery();

    // WhatsApp Link
    const phone = "5511999999999"; // Replace with real number
    const text = `Olá! Tenho interesse no imóvel da Ref: #${prop.id}\n\n*${prop.title}*\n${prop.location}\nValor: ${prop.price}\n\nGostaria de mais informações.`;
    document.getElementById('whatsapp-btn').href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    modal.classList.add('active');
}

function updateGallery() {
    const mainImg = document.getElementById('modal-main-img');
    const thumbList = document.getElementById('thumbnail-list');
    
    mainImg.src = currentPropertyImages[currentImageIndex];
    
    thumbList.innerHTML = currentPropertyImages.map((src, index) => `
        <img src="${src}" class="thumb ${index === currentImageIndex ? 'active' : ''}" 
             onclick="setMainImage(${index})" alt="Miniatura">
    `).join('');
}

function setMainImage(index) {
    currentImageIndex = index;
    updateGallery();
}

function navigateGallery(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentPropertyImages.length - 1;
    if (currentImageIndex >= currentPropertyImages.length) currentImageIndex = 0;
    updateGallery();
}
