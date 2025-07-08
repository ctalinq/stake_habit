import "vitest";
import { AccountStatus, Address, Cell, Transaction } from "@ton/core";

interface CustomMatchers<R = unknown> {
  toHaveTransaction: ({
    from,
    to,
    success,
    deploy,
    exitCode,
  }: {
    from: Address;
    to: Address;
    success: boolean;
    deploy?: boolean;
    exitCode?: number;
  }) => R;
}

declare module "vitest" {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
