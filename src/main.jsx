import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// إخفاء شاشة التحميل التفاعلية المشتقة من شعار نادي أبدع بسلاسة بعد جاهزية الواجهة
if (typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      const splash = document.getElementById('abdaa-splash-loader');
      if (splash) {
        splash.classList.add('hide-splash');
        setTimeout(() => {
          splash.remove();
        }, 480);
      }
    }, 520);
  });
}
