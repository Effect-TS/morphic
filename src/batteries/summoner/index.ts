import type { BaseFC } from "../../fc/config"
import { reportFailure } from "../../model/codec"
import { ModelURI } from "../../model/hkt"
import {
  modelNonStrictInterpreter,
  modelStrictInterpreter,
  modelPreciseInterpreter
} from "../../model/interpreter"
import { InterpreterURI, validationErrors } from "../interpreter"
import type { ProgramURI } from "../program"
import type { Materialized } from "../usage/materializer"
import { ProgramType } from "../usage/program-type"
import {
  AnyConfigEnv,
  ExtractEnv,
  makeSummoner,
  SummonerOps,
  Summoners
} from "../usage/summoner"

import * as T from "@matechs/core/Effect"
import type { AnyEnv } from "@matechs/morphic-alg/config"
import { cacheUnaryFunction } from "@matechs/morphic-alg/utils/core"

export interface M<R, L, A> extends Materialized<R, L, A, ProgramURI, InterpreterURI> {}

export type M_<R, A> = M<R, {}, A>

export const AsOpaque = <E, A>() => <X extends M<any, E, A>>(
  x: X
): M<Parameters<X["_R"]>[0], E, A> => x

export const AsUOpaque = <A>() => <X extends M_<any, A>>(
  x: X
): M_<Parameters<X["_R"]>[0], A> => x

export interface Summoner<R> extends Summoners<ProgramURI, InterpreterURI, R> {
  <L, A>(F: ProgramType<R, L, A>[ProgramURI]): M<R, L, A>
}

export const summonFor: <R extends AnyEnv = {}>(
  env: ExtractEnv<R, ModelURI>
) => SummonerOps<Summoner<R & BaseFC>> = <R extends AnyConfigEnv = {}>(
  env: ExtractEnv<R, ModelURI>
) =>
  makeSummoner<Summoner<R & BaseFC>>(cacheUnaryFunction, (program) => {
    const { codec } = program(modelNonStrictInterpreter<NonNullable<R & BaseFC>>())(env)
    const strict = program(modelStrictInterpreter<NonNullable<R & BaseFC>>())(env).codec
    const precise = program(modelPreciseInterpreter<NonNullable<R & BaseFC>>())(env)
      .codec

    const getCodec = (s?: "strict" | "classic" | "precise") =>
      s === "strict" ? strict : s === "precise" ? precise : codec

    return {
      build: (a) => a,
      decode: (i, s) => getCodec(s).decode(i),
      encode: (i, s) => getCodec(s).encode(i),
      create: (a, s) => getCodec(s).decode(getCodec("classic").encode(a)) as any,
      encodeT: (a, s) => T.sync(() => getCodec(s).encode(a)),
      decodeT: (i, s) =>
        T.mapLeft_(T.encaseEither(getCodec(s).decode(i)), (e) =>
          validationErrors(reportFailure(e))
        ),
      createT: (a, s) =>
        T.mapLeft_(
          T.encaseEither(getCodec(s).decode(getCodec("classic").encode(a))),
          (e) => validationErrors(reportFailure(e))
        ) as any
    }
  })
