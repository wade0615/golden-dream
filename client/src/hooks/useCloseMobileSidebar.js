import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 自定義 Hook：監聽路由變化並自動關閉手機版側邊欄
 * 當路由路徑發生變化時，自動關閉 Bootstrap Offcanvas 側邊欄
 */
const useCloseMobileSidebar = () => {
  const location = useLocation();

  useEffect(() => {
    // 當路由路徑變化時，關閉所有開啟的 Bootstrap Offcanvas
    const closeAllOffcanvas = () => {
      // 查找所有開啟的 Offcanvas 元素
      const offcanvasElements = document.querySelectorAll('.offcanvas.show');
      
      offcanvasElements.forEach(offcanvas => {
        // 觸發關閉事件
        const closeEvent = new Event('click');
        const closeButton = offcanvas.querySelector('.btn-close');
        if (closeButton) {
          closeButton.dispatchEvent(closeEvent);
        } else {
          // 如果沒有找到關閉按鈕，直接移除 show 類
          offcanvas.classList.remove('show');
          offcanvas.classList.remove('show');
          // 移除 backdrop
          const backdrop = document.querySelector('.offcanvas-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          // 移除 body 的 overflow 限制
          document.body.classList.remove('offcanvas-open');
        }
      });
    };

    // 延遲執行，確保路由變化完成後再關閉側邊欄
    const timeoutId = setTimeout(closeAllOffcanvas, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]); // 依賴於路徑變化
};

export default useCloseMobileSidebar; 