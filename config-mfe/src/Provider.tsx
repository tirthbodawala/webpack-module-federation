import { FC, ReactNode, useContext } from "react";
import context from "./Context";

const ConfigProvider: FC<{ children: ReactNode, value?: { name: string} }> = ({
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
export default ConfigProvider;