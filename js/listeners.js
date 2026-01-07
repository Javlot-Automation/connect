// Connect Flow - Step Listeners
import { state } from './state.js';
import { updateStep1Button, updateStep2Button, openLightbox } from './ui.js';
import { initRiskConfig, isRiskConfigValid } from './risk_config.js';
import { mt5Init, mt5Submit } from './mt5.js';

export function initStepListeners(stepNumber) {
    switch (stepNumber) {
        case 0:
            // Welcome page - no special listeners needed
            break;
        case 1:
            initBrokerSelection();
            break;
        case 2:
            initRiskConfig();
            break;
        case 3:
            mt5Init();
            initMT5FormListeners();
            break;
    }

    // Initialize clickable images for lightbox
    initClickableImages();
}

function initBrokerSelection() {
    const brokerCards = document.querySelectorAll('.broker-card');

    brokerCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            brokerCards.forEach(c => c.classList.remove('selected'));
            // Add selected to clicked
            card.classList.add('selected');
            // Update state
            state.selectedBroker = card.getAttribute('data-broker');
            updateStep1Button();
        });
    });

    // Restore selection if returning to this step
    if (state.selectedBroker) {
        const selectedCard = document.querySelector(`[data-broker="${state.selectedBroker}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    updateStep1Button();
}

function initMT5FormListeners() {
    const submitBtn = document.getElementById('mt5SubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mt5Submit();
        });
    }
}

function initClickableImages() {
    const images = document.querySelectorAll('.clickable-image, .step-image');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });
}
