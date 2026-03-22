import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useDismiss,
  useInteractions,
  type FloatingContext,
  type Placement,
} from "@floating-ui/react";

interface UsePopoverOptions {
  placement?: Placement;
}

export interface UsePopoverReturn<TData> {
  isOpen: boolean;
  data: TData;
  open: (anchor: HTMLElement, data: TData) => void;
  close: () => void;
  popoverProps: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  arrowRef: (node: SVGSVGElement | null) => void;
  context: FloatingContext;
  getFloatingProps: (
    props?: React.HTMLProps<HTMLElement>,
  ) => Record<string, unknown>;
}

export function usePopover<TData = unknown>(
  options: UsePopoverOptions = {},
): UsePopoverReturn<TData> {
  const [isOpen, setIsOpen] = useState(false);
  const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const floating = useFloating<HTMLElement>({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        setIsOpen(false);
        setData(null);
      }
    },
    placement: options.placement ?? "bottom-start",
    strategy: "absolute",
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({ element: arrowEl, padding: 5 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(floating.context, {
    outsidePress: false,
    escapeKey: true,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  const open = (anchor: HTMLElement, nextData: TData) => {
    floating.refs.setReference(anchor);
    setData(nextData);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  const popoverProps = {
    ref: floating.refs.setFloating,
    style: {
      ...floating.floatingStyles,
      zIndex: 1000,
    },
  };

  return {
    isOpen,
    data: data as TData,
    open,
    close,
    popoverProps,
    arrowRef: setArrowEl,
    context: floating.context,
    getFloatingProps,
  };
}
