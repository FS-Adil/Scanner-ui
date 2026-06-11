import { create } from 'zustand';

export const useScanStore = create((set) => ({
  isScanning: false,
  lastResult: null, // SUCCESS, ERROR, WARNING
  lastScannedCode: null,
  scannedItems: [],
  
  startScanning: () => set({ isScanning: true }),
  
  stopScanning: () => set({ isScanning: false }),
  
  addScannedItem: (labelCode, result) => 
    set(state => ({
      lastResult: result.status,
      lastScannedCode: labelCode,
      scannedItems: [
        { labelCode, result, timestamp: Date.now() },
        ...state.scannedItems
      ].slice(0, 50) // Храним последние 50 сканов
    })),
  
  clearLastResult: () => set({ lastResult: null, lastScannedCode: null })
}));