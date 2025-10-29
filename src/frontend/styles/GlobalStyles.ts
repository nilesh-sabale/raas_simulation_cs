import { createGlobalStyle } from 'styled-components'
import { cssVariables } from './theme'

export const GlobalStyles = createGlobalStyle`
  ${cssVariables}

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Performance optimizations */
  * {
    will-change: auto;
  }

  .gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Disable expensive animations on low-end devices */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Optimize rendering */
  .optimized {
    contain: layout style paint;
    content-visibility: auto;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--gradient-bg);
    color: var(--text-primary);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--gradient-mesh);
      opacity: 0.03;
      z-index: -2;
      animation: meshRotate 20s linear infinite;
    }
    
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--gradient-glow);
      z-index: -1;
      animation: glowPulse 8s ease-in-out infinite;
    }
  }
  
  @keyframes meshRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes glowPulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.2; }
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-primary);
  }

  /* Selection Styling */
  ::selection {
    background: rgba(0, 255, 136, 0.3);
    color: var(--text-primary);
  }

  /* Focus Styling */
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  h5 {
    font-size: 1.125rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1em;
  }

  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  a:hover {
    color: var(--color-secondary);
  }

  /* Form Elements */
  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
  }

  input, textarea, select {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-sm);
    transition: var(--transition-normal);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
  }

  /* Utility Classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .loading {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .updated {
    animation: highlight 0.6s ease-out;
  }

  @keyframes highlight {
    0% { background-color: rgba(0, 255, 136, 0.3); }
    100% { background-color: transparent; }
  }

  /* Modern Background Effects */
  .modern-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 70%);
    z-index: -1;
    animation: backgroundShift 15s ease-in-out infinite;
  }
  
  @keyframes backgroundShift {
    0%, 100% { 
      transform: scale(1) rotate(0deg);
      opacity: 0.8;
    }
    50% { 
      transform: scale(1.1) rotate(180deg);
      opacity: 1;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 13px;
    }

    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }

  /* Animation Keyframes */
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes logoGlow {
    from { 
      text-shadow: 0 0 20px var(--color-primary); 
    }
    to { 
      text-shadow: 0 0 30px var(--color-primary), 0 0 40px var(--color-primary); 
    }
  }

  @keyframes statusPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes tickerScroll {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  /* Modern Animations */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes modernGlow {
    0%, 100% { 
      box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.2);
    }
    50% { 
      box-shadow: var(--shadow-xl), 0 0 30px rgba(99, 102, 241, 0.4);
    }
  }

  @keyframes dataFlow {
    0% { transform: translateX(-100%) scaleX(0); }
    50% { transform: translateX(0) scaleX(1); }
    100% { transform: translateX(100%) scaleX(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes modernPulse {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes slideInUp {
    0% { 
      transform: translateY(30px); 
      opacity: 0; 
    }
    100% { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }

  @keyframes fadeInScale {
    0% { 
      transform: scale(0.9); 
      opacity: 0; 
    }
    100% { 
      transform: scale(1); 
      opacity: 1; 
    }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  /* Modern UI Classes */
  .glass-card {
    background: var(--gradient-card);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
  }

  .modern-button {
    background: var(--gradient-primary);
    border: none;
    border-radius: var(--radius-md);
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    transition: var(--transition-normal);
    box-shadow: var(--shadow-md);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .gradient-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
  }

  .modern-card-hover {
    transition: var(--transition-normal);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: var(--color-primary);
    }
  }

  /* Smooth scrolling for better performance */
  html {
    scroll-behavior: smooth;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`