import { FC, ReactNode, useContext } from "react";
import { context } from "./Context";

export const SharedProvider: FC<{ children: ReactNode, value?: { name: string} }> = ({
  children,
  value,
}) => {
  const defaultValue = useContext(context);
  return (
    <context.Provider value={value ?? defaultValue}>
      {children}
    </context.Provider>
  )
};