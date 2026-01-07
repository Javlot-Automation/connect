// Connect Flow - Main Application Entry Point
import { initLanguage, setLanguage } from './i18n.js';
import { updateStep, initLightbox } from './ui.js';

// Make functions globally available
window.setLanguage = setLanguage;

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initLightbox();
    updateStep(0); // Start at welcome page
});
