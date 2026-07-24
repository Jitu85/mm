declare module "next/types.js" {
  import type { Metadata } from "next";
  import type { Viewport } from "next";
  export type ResolvingMetadata = () => Promise<Metadata>;
  export type ResolvingViewport = () => Promise<Viewport>;
}

declare module "next/server.js" {
  export { NextRequest } from "next/server";
}
