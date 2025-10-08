"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseDebounceOptions =
  | {
      delay?: number;
      expire?: number | null;
    }
  | number;

type UseDebounceCallback = (...args: never[]) => void;

type Truthy = boolean | Record<string, boolean> | boolean[];
function checkTruthy(val: Truthy): boolean {
  if (typeof val === "boolean") return !!val;
  if (Array.isArray(val)) return val.every(v => !!v);
  if (typeof val === "object" && val !== null) return Object.values(val).every(v => !!v);
  return false;
}

type UseDebounceReturn<T extends UseDebounceCallback> = {
  debounce: (...args: Parameters<T>) => void,
  setDebounceDelay: Dispatch<SetStateAction<number>>,
  clearDebounce: (truthy?: Truthy) => void,
};

export function useDebounce<T extends UseDebounceCallback>(
  callback: T,
  options: UseDebounceOptions = {},
  deps: any[] = []
): UseDebounceReturn<T> {
  const { delay = 500, expire = null } =
    typeof options === "number"
      ? {
          delay: options,
        }
      : options;
  const [debounceDelay, setDebounceDelay] = useState<number>(delay);
  const timer = useRef<number | null>(null);

  const debouncedCallback = useCallback(callback, [
    expire,
    JSON.stringify(deps),
  ]);

  const clearDebounce = useCallback((truthy?: Truthy) => {
    if(typeof truthy === "undefined" || checkTruthy(truthy)) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    }
  }, []);

  const debounce = useCallback(
    (...args: Parameters<T>) => {
      clearDebounce()

      if (expire !== null) {
        timer.current = window.setTimeout(() => {
          debouncedCallback(...args);
        }, expire);
      } else {
        timer.current = window.setTimeout(() => {
          debouncedCallback(...args);
        }, debounceDelay);
      }
    },
    [debounceDelay, expire, debouncedCallback]
  );

  useEffect(() => {
    return () => {
      clearDebounce()
    };
  }, []);

  return { debounce, setDebounceDelay, clearDebounce } as const;
}