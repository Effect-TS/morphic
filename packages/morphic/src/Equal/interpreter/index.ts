// tracing: off

import type { AnyEnv } from "../../HKT"
import { memo, merge } from "../../Utils"
import { eqExtensionsInterpreter } from "./extensions"
import { eqIntersectionInterpreter } from "./intersection"
import { eqNewtypeInterpreter } from "./newtype"
import { eqObjectInterpreter } from "./object"
import { eqPrimitiveInterpreter } from "./primitives"
import { eqRecordMapInterpreter } from "./record"
import { eqRecursiveInterpreter } from "./recursive"
import { eqRefinedInterpreter } from "./refined"
import { eqSetInterpreter } from "./set"
import { eqTaggedUnionInterpreter } from "./tagged-union"
import { eqUnionInterpreter } from "./union"
import { eqUnknownInterpreter } from "./unknown"

export const allModelEq = <Env extends AnyEnv>() =>
  merge(
    eqRefinedInterpreter<Env>(),
    eqNewtypeInterpreter<Env>(),
    eqUnknownInterpreter<Env>(),
    eqPrimitiveInterpreter<Env>(),
    eqIntersectionInterpreter<Env>(),
    eqObjectInterpreter<Env>(),
    eqTaggedUnionInterpreter<Env>(),
    eqRecursiveInterpreter<Env>(),
    eqRecordMapInterpreter<Env>(),
    eqSetInterpreter<Env>(),
    eqUnionInterpreter<Env>(),
    eqExtensionsInterpreter<Env>()
  )

export const modelEqInterpreter = memo(allModelEq) as typeof allModelEq

export { eqIntersectionInterpreter } from "./intersection"
export { eqNewtypeInterpreter } from "./newtype"
export { eqObjectInterpreter } from "./object"
export { eqPrimitiveInterpreter } from "./primitives"
export { eqRecordMapInterpreter } from "./record"
export { eqRecursiveInterpreter } from "./recursive"
export { eqRefinedInterpreter } from "./refined"
export { eqSetInterpreter } from "./set"
export { eqTaggedUnionInterpreter } from "./tagged-union"
export { eqUnionInterpreter } from "./union"
export { eqUnknownInterpreter } from "./unknown"
export { eqExtensionsInterpreter, eqExtension } from "./extensions"
