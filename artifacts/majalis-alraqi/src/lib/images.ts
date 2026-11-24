// Images shipped with the storefront (artifacts/majalis-alraqi/public/images).
// Self-hosting avoids depending on third-party hotlinks and respects BASE_PATH.
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export const PLACEHOLDER_IMAGE = asset("images/category-majlis.png");

export const HERO_IMAGES = [
  asset("images/hero.png"),
  asset("images/category-majlis.png"),
  asset("images/category-sofa.png"),
  asset("images/category-curtains.png"),
  asset("images/category-decor.png"),
];

export const ABOUT_IMAGE = asset("images/about-craftsman.png");
