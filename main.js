/* ==========================================================================
   Mova Software - Interactive Scripting
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 2. Navbar Scroll Style
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load to show elements already in viewport
    revealOnScroll();

    // 4. Dynamic Active Link Highlight
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset for fixed header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});

// 5. Inject Product Choice into Form
function setSubject(productName) {
    const select = document.getElementById('interest');
    if (select) {
        select.value = productName;
    }
}

// 6. Contact Form Submission (Web3Forms Email Integration)
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value;
    
    // Chave de acesso do Web3Forms
    const accessKey = "a9b6a3ff-71c9-4db4-9de8-5f19d4d5e13e"; 
    
    // Desabilita o botão e exibe carregamento
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                access_key: accessKey,
                name: name,
                phone: phone,
                interest: interest,
                message: message,
                subject: `Novo Lead do Site - ${name}`
            })
        });

        const result = await response.json();
        
        if (result.success) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
        } else {
            alert("Houve um erro ao enviar. Por favor, tente novamente.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    } catch (error) {
        console.error("Erro de envio:", error);
        alert("Erro de conexão. Por favor, verifique sua internet e tente novamente.");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}
