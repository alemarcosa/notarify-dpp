"use client";
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { ReactNode } from 'react';

export default function SnackbarProvider({ children }: { children: ReactNode }) {
  return <NotistackProvider maxSnack={3}>{children}</NotistackProvider>;
}
