/**
 * Cuba Tattoo Studio - Minimal Loading Screen
 * Simple and clean loading animation
 */

function initMinimalLoadingScreen() {
  var loadingScreen = document.getElementById('loading-screen');
  
  if (!loadingScreen) return;
  
  // Simular carga mínima (1-3 segundos)
  var loadTime = 1500 + Math.random() * 1500;
  
  setTimeout(function() {
    // Fade out suave
    loadingScreen.classList.add('fade-out');
    
    setTimeout(function() {
      loadingScreen.style.display = 'none';
      document.body.classList.add('loaded');
      
      // Disparar evento de carga completa
      window.dispatchEvent(new CustomEvent('loadingComplete'));
    }, 800);
  }, loadTime);
}

// Inicializar pantalla de carga
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMinimalLoadingScreen);
} else {
  initMinimalLoadingScreen();
}
