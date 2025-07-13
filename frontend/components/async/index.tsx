'use client';

import type { FC, ReactNode,HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncProps extends HTMLAttributes<HTMLElement> {
  request: () => Promise<unknown> | void;
  cleanup?: () => void;
  immediate?: boolean;
  deps?: any[];
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
  const [result, setResult] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(() => {
    setStatus("pending");
    setError(null);

    const promise: any = request();

    if (typeof promise?.then === "function") {
      promise
        .then((data: any) => {
          setResult(data);
          setStatus("success");
        })
        .catch((err: any) => {
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
  }, [...deps, immediate, cleanup, execute]);

  return (
    <div className={className} style={style}>
      {status === "idle" && cacheFirst && children}
      {status === "pending" && (!cacheFirst ? skeleton : children)}
      {status === "error" && (errorRender ? errorRender(error!) : children)}
      {status === "success" && (!result && emptyState ? emptyState : children)}
    </div>
  );
};
