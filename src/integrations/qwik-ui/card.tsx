import { component$, Slot, type HTMLAttributes } from "@builder.io/qwik";
import { cn } from "~/lib/utils";

export type DivProps = HTMLAttributes<HTMLElement>;

const SdnCard = component$((props: DivProps) => {
  return (
    <div
      class={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        props.class,
      )}
      {...props}
    >
      <Slot />
    </div>
  );
});

const SdnCardHeader = component$((props: DivProps) => (
  <div class={cn("flex flex-col space-y-1.5 p-6", props.class)} {...props}>
    <Slot />
  </div>
));

const SdnCardTitle = component$((props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    class={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      props.class,
    )}
    {...props}
  >
    <Slot />
  </h3>
));

const SdnCardDescription = component$(
  (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p class={cn("text-sm text-muted-foreground", props.class)} {...props}>
      <Slot />
    </p>
  ),
);

const SdnCardContent = component$((props: DivProps) => (
  <div class={cn("p-6 pt-0", props.class)} {...props}>
    <Slot />
  </div>
));

const SdnCardFooter = component$((props: DivProps) => (
  <div class={cn("flex items-center p-6 pt-0", props.class)} {...props}>
    <Slot />
  </div>
));

export {
  SdnCard,
  SdnCardHeader,
  SdnCardFooter,
  SdnCardTitle,
  SdnCardDescription,
  SdnCardContent,
};
