// tracing: off

import type { Dictionary } from "@effect-ts/core/Dictionary"

import type { AnyEnv, ConfigsForType, InterpreterURIS, Kind, Named } from "../../HKT"

export type Keys = Dictionary<null>

export const UnknownURI = "UnknownURI" as const

export type UnknownURI = typeof UnknownURI

export interface UnknownConfig {}

export interface AlgebraUnknown<F extends InterpreterURIS, Env extends AnyEnv> {
  _F: F
  unknown(
    config?: Named<ConfigsForType<Env, unknown, unknown, UnknownConfig>>
  ): Kind<F, Env, unknown, unknown>
}
