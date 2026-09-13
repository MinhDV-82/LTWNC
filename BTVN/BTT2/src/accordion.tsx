import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useId,
  useState,
} from "react";

type AccordionContextValue = {
  openValue: string | null;
  toggleItem: (value: string) => void;
};

type AccordionItemContextValue = {
  value: string;
  triggerId: string;
  panelId: string;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

export interface AccordionRootProps {
  defaultValue?: string | null;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  children?: ReactNode;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

type AccordionPanelProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "Accordion compound components must be inside Accordion.Root",
    );
  }

  return context;
}

function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      "Accordion.Trigger and Accordion.Panel must be inside Accordion.Item",
    );
  }

  return context;
}

function Root({
  defaultValue = null,
  value,
  onValueChange,
  children,
}: AccordionRootProps) {
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue,
  );
  const openValue = value === undefined ? internalValue : value;

  const toggleItem = (itemValue: string) => {
    const nextValue = openValue === itemValue ? null : itemValue;

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  return (
    <AccordionContext.Provider value={{ openValue, toggleItem }}>
      {children}
    </AccordionContext.Provider>
  );
}

function Item({ value, children, ...props }: AccordionItemProps) {
  const id = useId();

  return (
    <AccordionItemContext.Provider
      value={{ value, triggerId: `${id}-trigger`, panelId: `${id}-panel` }}
    >
      <div {...props}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

function Trigger({ children, onClick, ...props }: AccordionTriggerProps) {
  const { openValue, toggleItem } = useAccordionContext();
  const { value, triggerId, panelId } = useAccordionItemContext();
  const isOpen = openValue === value;

  return (
    <button
      {...props}
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={panelId}
      onClick={(event) => {
        toggleItem(value);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}

function Panel({ children, ...props }: AccordionPanelProps) {
  const { openValue } = useAccordionContext();
  const { value, triggerId, panelId } = useAccordionItemContext();
  const isOpen = openValue === value;

  return (
    <div
      {...props}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
    >
      {children}
    </div>
  );
}

export const Accordion = { Root, Item, Trigger, Panel };
