import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { getAllRoutes, getRouteMeta } from "./lib/routes";
import { generateFeed, generateSitemap } from "./lib/staticFiles";
import "./styles.css";

export function render(pathname: string) {
  return renderToString(<App pathname={pathname} />);
}

export function routes() {
  return getAllRoutes();
}

export function metadata(pathname: string) {
  return getRouteMeta(pathname);
}

export { generateFeed, generateSitemap };
