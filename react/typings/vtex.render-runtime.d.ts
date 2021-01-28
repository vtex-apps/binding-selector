/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'vtex.render-runtime' {
  interface BindingContext {
    canonicalBaseAddress: string
    id: string
  }

  interface RenderContext {
    binding: BindingContext
  }

  export const useRuntime: () => RenderContext
}
