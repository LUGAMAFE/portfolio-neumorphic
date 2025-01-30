import type { FloatingArrowProps, Middleware, Placement } from '@floating-ui/react';
import {
  autoUpdate,
  FloatingArrow,
  FloatingPortal,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';

export interface HandleTriggerClickParams {
  open: boolean;
  setOpen: (open: boolean) => void;
}
/**
 * TooltipOptions defines all configuration for your Tooltip hook.
 */
export interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  middlewares?: Array<Middleware | null | undefined | false>;

  /**
   * If true, the tooltip respects nested logic:
   * - Clicking on a child tooltip closes the parent.
   * - We only open/close if we detect a click in the current trigger,
   *   not in a nested child container or other non-trigger areas.
   */
  nested?: boolean;

  /**
   * When `nested` is true, nestedAllowClicks determines
   * if we call children.props.onClick and the <TooltipTrigger> onClick.
   */
  nestedAllowClicks?: boolean;

  /**
   * Optional custom handler for click events on the trigger.
   * If provided, you can decide under which conditions
   * the tooltip should open or close (e.g. ctrl+click).
   *
   * This function is called AFTER the internal nested logic checks
   * if the click belongs to a parent/child container. If that logic
   * determines "this is my container", then we call `triggerClickHandler`.
   * If it determines "child container", we close the parent. If it's outside container,
   * we do nothing or let useDismiss handle it.
   */
  triggerClickHandler?: (ev: React.MouseEvent<HTMLElement>, ctx: HandleTriggerClickParams) => void;
}

/**
 * useTooltip sets up open state, positioning, and interactions.
 */
export function useTooltip({
  initialOpen = false,
  placement = 'bottom',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  middlewares,
  nested = false,
  nestedAllowClicks = true,
  triggerClickHandler,
}: TooltipOptions) {
  // Uncontrolled state if 'open' is not provided
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  // Floating UI main logic
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: middlewares,
  });

  // Setting up hover/focus/dismiss/role interactions
  const context = data.context;
  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null, // only if not controlled
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  // Expose everything via a memo
  return React.useMemo(
    () => ({
      open,
      setOpen,
      nested,
      nestedAllowClicks,
      triggerClickHandler,
      ...interactions,
      ...data,
    }),
    [open, setOpen, nested, nestedAllowClicks, triggerClickHandler, interactions, data]
  );
}

/** Type for the context value or null if not within <Tooltip>. */
type ContextType = ReturnType<typeof useTooltip> | null;

/** TooltipContext to provide data to child components. */
const TooltipContext = React.createContext<ContextType>(null);

/** Hook to consume the TooltipContext. Throws if used outside <Tooltip>. */
export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }
  return context;
};

/**
 * <Tooltip> sets up the context that child components need.
 */
export function Tooltip({ children, ...options }: React.PropsWithChildren<TooltipOptions>) {
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

/**
 * TooltipTrigger is the element that, when interacted with, shows/hides the tooltip.
 */
export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, onClick, ...props }, propRef) {
  const context = useTooltipContext();
  const { open, setOpen, nested, nestedAllowClicks, triggerClickHandler, refs, getReferenceProps } =
    context;

  // Merge refs for Floating UI
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([refs.setReference, propRef, childrenRef]);

  /**
   * If "nested" is true, we handle the logic that detects if the click
   * happened on a child tooltip container. If so, close parent.
   * If there's no container at all, skip toggling (avoid opening the parent).
   */
  const handleNestedLogic = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      const current = ev.currentTarget;
      const target = ev.target as HTMLElement;
      const closestContainer = target.closest('[data-tooltip-container]');

      // If there's NO container => user likely clicked floating content or elsewhere
      // => skip toggling the parent
      if (!closestContainer) {
        return false; // do not toggle
      }

      // If it's a child container => close this parent
      if (closestContainer !== current) {
        setOpen(false);
        return false;
      }

      // If it's our own container => proceed
      return true;
    },
    [setOpen]
  );

  /**
   * Main onClick that merges:
   * 1) The user's original onClick (TooltipTrigger prop).
   * 2) The child's onClick if `asChild` is used.
   * 3) Nested logic if `nested` is true.
   * 4) A custom `triggerClickHandler` if provided.
   */
  const handleClick = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      // Decide if we should call user-provided onClick functions
      // based on nestedAllowClicks and nested.
      const shouldCallUserOnClicks = !nested || nestedAllowClicks;

      // 1) Call child's onClick if it exists
      if (shouldCallUserOnClicks && typeof children?.props?.onClick === 'function') {
        children.props.onClick(ev);
      }
      // 2) Call user's onClick if passed to <TooltipTrigger ... onClick={...} />
      if (shouldCallUserOnClicks && typeof onClick === 'function') {
        onClick(ev);
      }

      // If not nested, just do custom handler or toggle
      if (!nested) {
        if (triggerClickHandler) {
          triggerClickHandler(ev, { open, setOpen });
        } else {
          setOpen(!open);
        }
        return;
      }

      // If nested, run the nested logic check
      const isThisContainer = handleNestedLogic(ev);

      // If parent was closed or the click is outside container => do not proceed
      if (!isThisContainer) {
        return;
      }

      // If it is our container, call custom handler or do toggle
      if (triggerClickHandler) {
        triggerClickHandler(ev, { open, setOpen });
      } else {
        setOpen(!open);
      }
    },
    [
      children,
      onClick,
      nested,
      nestedAllowClicks,
      triggerClickHandler,
      open,
      setOpen,
      handleNestedLogic,
    ]
  );

  // If asChild => clone the child element to inject props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...props,
      ...getReferenceProps({
        'data-tooltip-container': nested ? 'true' : undefined,
        'data-state': open ? 'open' : 'closed',
        onClick: handleClick,
      }),
    });
  }

  // Otherwise, we render a button by default
  return (
    <button
      ref={ref}
      data-tooltip-container={nested ? 'true' : undefined}
      data-state={open ? 'open' : 'closed'}
      onClick={handleClick}
      {...getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

/**
 * TooltipContent represents the floating container that appears when open = true.
 */
export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function TooltipContent({ style, ...props }, propRef) {
    const context = useTooltipContext();
    const { open, refs, floatingStyles, getFloatingProps } = context;

    const ref = useMergeRefs([refs.setFloating, propRef]);

    if (!open) return null;

    return (
      <FloatingPortal>
        <div
          ref={ref}
          style={{
            ...floatingStyles,
            ...style,
          }}
          {...getFloatingProps(props)}
        />
      </FloatingPortal>
    );
  }
);

/**
 * TooltipArrow renders the arrow element using Floating UI's <FloatingArrow>.
 */
export const TooltipArrow = React.forwardRef<SVGSVGElement, Omit<FloatingArrowProps, 'context'>>(
  function TooltipArrow(props, ref) {
    const { context } = useTooltipContext();
    return <FloatingArrow ref={ref} {...props} context={context} />;
  }
);
