/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as exercisesAndTrackingPeriods from "../exercisesAndTrackingPeriods.js";
import type * as myFunctions from "../myFunctions.js";
import type * as weeksAndWeight from "../weeksAndWeight.js";
import type * as workoutplan from "../workoutplan.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  exercisesAndTrackingPeriods: typeof exercisesAndTrackingPeriods;
  myFunctions: typeof myFunctions;
  weeksAndWeight: typeof weeksAndWeight;
  workoutplan: typeof workoutplan;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
