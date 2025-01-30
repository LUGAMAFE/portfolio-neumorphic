import type { Middleware, Placement } from '@floating-ui/react';
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

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  middlewares?: Array<Middleware | null | undefined | false>;
  nested?: boolean;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  middlewares,
  nested = false,
}: TooltipOptions) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: middlewares,
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      nested,
      ...interactions,
      ...data,
    }),
    [open, setOpen, nested, interactions, data]
  );
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = React.createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export function Tooltip({ children, ...options }: React.PropsWithChildren<TooltipOptions>) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, onClick, ...props }, propRef) {
  const context = useTooltipContext();
  const { open, setOpen, nested } = context;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childrenRef = (children as any)?.ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  const handleClickNested = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      const current = ev.currentTarget;
      const target = ev.target as HTMLElement;
      const closestContainer = target.closest('[data-tooltip-container]');
      if (closestContainer && closestContainer !== current /*el padre*/) {
        setOpen(false);
        return;
      }
      setOpen(!open);
    },
    [open, setOpen]
  );

  const handleClick = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      // Llamar siempre a onClick del hijo y del propio TooltipTrigger:
      if (typeof children?.props?.onClick === 'function') {
        children.props.onClick(ev);
      }
      if (typeof onClick === 'function') {
        onClick(ev);
      }

      if (!nested) {
        // Si no es "nested", haz la lógica normal (ej. toggle a tu gusto)
        setOpen(!open);
        return;
      }

      // Ahora, si es nested:
      const current = ev.currentTarget; // Trigger del padre
      const target = ev.target as HTMLElement;
      const closestContainer = target.closest('[data-tooltip-container]');

      if (closestContainer === current) {
        // => Click en este contenedor (en mi trigger)
        setOpen(!open);
      } else if (closestContainer) {
        // => Click en un contenedor hijo => cierro mi tooltip
        setOpen(false);
      } else {
        // => No hay contenedor => click completamente "fuera"
        //   Normalmente, let useDismiss handle it.
        //   O si quieres cerrar inmediatamente:
        // setOpen(false);
      }
    },
    [onClick, children, nested, open, setOpen]
  );

  // `asChild` -> clonamos el hijo para inyectar props
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      ...props,
      ...context.getReferenceProps({
        'data-tooltip-container': nested ? 'true' : undefined,
        'data-state': open ? 'open' : 'closed',
        onClick: handleClick,
      }),
    });
  }

  // Versión sin asChild
  return (
    <button
      ref={ref}
      data-tooltip-container={nested ? 'true' : undefined}
      data-state={open ? 'open' : 'closed'}
      onClick={handleClick}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function TooltipContent({ style, ...props }, propRef) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);

    if (!context.open) return null;

    return (
      <FloatingPortal>
        <div
          ref={ref}
          style={{
            ...context.floatingStyles,
            ...style,
          }}
          {...context.getFloatingProps(props)}
        />
      </FloatingPortal>
    );
  }
);

export const TooltipArrow = ({ ...props }) => {
  const { context } = useTooltipContext();
  return <FloatingArrow {...props} context={context} />;
};
