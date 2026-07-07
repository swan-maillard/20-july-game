/* Minimal type shim for `headbreaker` (the package ships no .d.ts).
   Only the surface we use is declared. */
declare module 'headbreaker' {
  export class Canvas {
    constructor(id: string | HTMLElement, options: Record<string, unknown>)
    autogenerate(options?: Record<string, unknown>): void
    shuffle(farness?: number): void
    draw(): void
    resize(width: number, height: number): void
    adjustImagesToPuzzleHeight(): void
    adjustImagesToPuzzleWidth(): void
    attachSolvedValidator(): void
    attachRelativePositionValidator(): void
    onValid(callback: () => void): void
    readonly valid: boolean
    [key: string]: unknown
  }
  export const painters: {
    Konva: new () => unknown
    Dummy: new () => unknown
  }
}
