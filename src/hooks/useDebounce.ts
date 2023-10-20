import { type Signal, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const useDebounce = (inputSig: Signal) => {
  const debouncedSig = useSignal("");

  useVisibleTask$(({ track, cleanup }) => {
    track(() => inputSig.value);

    const debounced = setTimeout(() => {
      // 2. Update the signal
      debouncedSig.value = inputSig.value;
    }, 300);
    cleanup(() => clearTimeout(debounced));
  });

  return debouncedSig;
};
