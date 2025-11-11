import React, { createContext, useContext, useState, Children, cloneElement } from "react";

const TabsCtx = createContext(null);

function Tabs({ defaultValue, value: valueProp, onValueChange, children, className = "", ...props }) {
  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp ?? internal;

  const setValue = (v) => {
    setInternal(v);
    onValueChange?.(v);
  };

  return (
    <TabsCtx.Provider value={{ value, setValue }}>
      <div className={className} {...props}>{children}</div>
    </TabsCtx.Provider>
  );
}

function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex gap-2 border-b mb-2 ${className}`} {...props}>
      {Children.map(children, (child) => child)}
    </div>
  );
}

function TabsTrigger({ value, children, className = "", ...props }) {
  const ctx = useContext(TabsCtx);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={`px-3 py-2 ${active ? "border-b-2 border-black font-medium" : "text-gray-500"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className = "", ...props }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return (
    <div className={className} {...props}>
      {Children.map(children, (child) => {
        // garante que filhos funcionem normalmente
        return React.isValidElement(child) ? cloneElement(child) : child;
      })}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
