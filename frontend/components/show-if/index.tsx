'use client';

import type React from "react";

export interface ShowIfProps {
  children: React.ReactNode;
  condition: boolean;
}

export const ShowIf: React.FC<ShowIfProps> = (props) => {
  const { children, condition } = props;

  if (condition) return <>{children}</>;

  return null;
};

export default ShowIf;
