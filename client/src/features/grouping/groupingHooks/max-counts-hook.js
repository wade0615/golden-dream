import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo
} from 'react';

const MaxCountsContext = createContext();
export const useMaxCountsContext = () => useContext(MaxCountsContext);
export function MaxCountsProvider({
  maxCounts = 10,
  defaultCounts = 0,
  children
}) {
  const [currentCounts, setCurrentCounts] = useState(defaultCounts);
  const [disabledAdd, setDisabledAdd] = useState(false);
  const [disabledMinus, setDisabledMinus] = useState(false);

  useEffect(() => {
    setCurrentCounts(defaultCounts);
  }, [defaultCounts]);

  useEffect(() => {
    if (currentCounts >= maxCounts) {
      setDisabledAdd(true);
    } else {
      setDisabledAdd(false);
    }
    if (currentCounts <= 0) {
      setDisabledMinus(true);
    } else {
      setDisabledMinus(false);
    }
  }, [currentCounts, maxCounts]);
  const addCounts = useCallback((count = 1) => {
    setCurrentCounts((prev) => prev + count);
  }, []);

  const minusCounts = useCallback((count = 1) => {
    setCurrentCounts((prev) => prev - count);
  }, []);

  const contextValue = useMemo(
    () => ({
      maxCounts, // 預設數量
      disabledAdd, //新增按鈕disabled
      disabledMinus,
      currentCounts, //目前條件次數
      addCounts, //新增條件
      minusCounts //刪除條件
    }),
    [
      currentCounts,
      disabledAdd,
      addCounts,
      minusCounts,
      maxCounts,
      disabledMinus
    ]
  );

  return (
    <MaxCountsContext.Provider value={contextValue}>
      {children(contextValue)}
    </MaxCountsContext.Provider>
  );
}
