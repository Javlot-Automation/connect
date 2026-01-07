// Connect Flow - UI Management
import { state } from './state.js';
import { applyTranslations } from './i18n.js';
import { initStepListeners } from './listeners.js';

// Expose for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;

export async function loadStepContent(stepNumber) {
    const container = document.getElementById('main-step-container');
    const filePath = `steps/step${stepNumber}.html`;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load step${stepNumber}.html`);
        const html = await response.text();
        container.innerHTML = html;

        // Add 'active' class to make the step content visible
        const stepContent = container.querySelector('.step-content');
        if (stepContent) {
            stepContent.classList.add('active');
        }

        applyTranslations();
        initStepListeners(stepNumber);
    } catch (error) {
        console.error('Error loading step content:', error);
        container.innerHTML = `<div class="error-message">Error loading content. Please refresh the page.</div>`;
    }
}

export async function updateStep(newStep) {
    state.currentStep = newStep;
    const sidebar = document.querySelector('.sidebar-steps');

    // Hide sidebar on welcome page (step 0)
    if (sidebar) {
        sidebar.style.display = newStep === 0 ? 'none' : 'flex';
    }

    await loadStepContent(newStep);
    updateSidebarProgress();
}

export function updateSidebarProgress() {
    const currentStep = state.currentStep;
    const indicators = document.querySelectorAll('.step-indicator');
    const progressFill = document.getElementById('progressFill');

    indicators.forEach(indicator => {
        const step = parseInt(indicator.getAttribute('data-step'));
        indicator.classList.remove('active', 'completed');

        if (step < currentStep) {
            indicator.classList.add('completed');
        } else if (step === currentStep) {
            indicator.classList.add('active');
        }
    });

    // Progress bar calculation (steps 1-3)
    if (progressFill && currentStep >= 1) {
        const progress = ((currentStep - 1) / (state.totalSteps - 1)) * 100;
        progressFill.style.height = `${Math.min(progress, 100)}%`;
    }
}

export function validateStep(stepNumber) {
    if (stepNumber === 1) {
        return state.selectedBroker !== null;
    }
    if (stepNumber === 2) {
        // Check if capital is valid
        const capitalInput = document.getElementById('jp-capital-input');
        if (capitalInput) {
            const val = parseFloat(capitalInput.value.replace(/\s/g, '').replace(',', '.'));
            return !isNaN(val) && val >= 1000 && val <= 250000;
        }
        return true;
    }
    return true;
}

export function nextStep() {
    const currentStep = state.currentStep;

    // Welcome page (step 0) always proceeds
    if (currentStep === 0) {
        updateStep(1);
        return;
    }

    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep < state.totalSteps) {
        updateStep(currentStep + 1);
    }
}

export function prevStep() {
    if (state.currentStep > 0) {
        updateStep(state.currentStep - 1);
    }
}

export function updateStep1Button() {
    const btn = document.getElementById('step1ContinueBtn');
    if (btn) {
        btn.disabled = !state.selectedBroker;
    }
}

export function updateStep2Button() {
    const btn = document.getElementById('step2ContinueBtn');
    if (btn) {
        btn.disabled = !validateStep(2);
    }
}

// Lightbox functions
export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-close')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

export function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    if (lightbox && lightboxImage) {
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

export function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
