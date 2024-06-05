import { createContext, useContext, useState, useMemo } from 'react';

const GroupingContext = createContext();
export const useGroupingContext = () => useContext(GroupingContext);
export function GroupingProvider({ children }) {
  const [disabled, setDisabled] = useState(false);
  const [actionType, setActionType] = useState('');

  const contextValue = useMemo(
    () => ({
      disabled,
      setDisabled,
      actionType,
      setActionType
    }),
    [disabled, setDisabled, actionType, setActionType]
  );

  return (
    <GroupingContext.Provider value={contextValue}>
      {children}
    </GroupingContext.Provider>
  );
}
