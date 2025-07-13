'use client';

import type { FC, ReactNode, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncProps extends HTMLAttributes<HTMLElement> {
  request: () => Promise<unknown> | undefined;
  cleanup?: () => void;
  immediate?: boolean;
  deps?: unknown[];
  cacheFirst?: boolean;
  skeleton?: ReactNode;
  emptyState?: ReactNode;
  errorRender?: (err: Error) => ReactNode;
}

export const Async: FC<AsyncProps> = ({
  className,
  style,
  request,
  cleanup,
  immediate = true,
  deps = [],
  cacheFirst = false,
  skeleton,
  emptyState,
  errorRender,
  children,
}) => {
  const isExecuted = useRef(false);

  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [result, setResult] = useState<unknown>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus("pending");
    setError(null);


    const promise = request();

    if (typeof (promise as Promise<unknown>)?.then === "function") {
      (promise as Promise<unknown>)
        .then((data: unknown) => {
          setResult(data);
          setStatus("success");
        })
        .catch((err: Error) => {
          setError(err);
          setStatus("error");
          console.error(err);
        });
    } else {
      setResult(true);
      setStatus("success");
    }
  }, [request]);

  useEffect(() => {
    if (immediate && !isExecuted.current) {
      execute();
      isExecuted.current = true;
    }

    if (cleanup) return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.concat(immediate));

  return (
    <div className={className} style={style}>
      {status === "idle" && cacheFirst && children}
      {status === "pending" && (!cacheFirst ? skeleton : children)}
      {status === "error" && (error && errorRender ? errorRender(error) : children)}
      {status === "success" && (!result && emptyState ? emptyState : children)}
    </div>
  );
};
