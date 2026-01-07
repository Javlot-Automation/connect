// Simplified state for Connect flow (Reconnection)
// Steps: 0 (Welcome) -> 1 (Broker) -> 2 (Risk) -> 3 (MT5)

export const state = {
    currentStep: 0,
    totalSteps: 3,
    selectedBroker: null,
    riskLevel: 30,
    currentLang: 'en'
};
