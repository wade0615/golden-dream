import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 自定義 Hook：監聽路由變化並將視窗回歸頂部
 * 當路由路徑發生變化時，自動將頁面滾動到頂部
 */
const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // 當路由路徑變化時，將視窗滾動到頂部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 使用平滑滾動效果
    });
  }, [location.pathname]); // 依賴於路徑變化
};

export default useScrollToTop; 