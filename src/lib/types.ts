export type FrontmatterValue = string | boolean | number | string[] | undefined;

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  body: string;
};

export type RouteMeta = {
  title: string;
  description: string;
  canonicalPath: string;
};
