/**
 * Source mode uses the original image. Production builds provide a responsive
 * manifest so the browser chooses the most appropriate encoded asset.
 */
const FALLBACK_IMAGE = "./assets/images/all-animals_resized.png";

export function setResultArtwork(image, profile, asset) {
  const picture = image.parentElement;
  if (picture?.tagName === "PICTURE") {
    picture.querySelectorAll("source").forEach((node) => node.remove());
    if (asset) {
      for (const [type, srcset] of [["image/avif", asset.avif], ["image/webp", asset.webp]]) {
        if (!srcset) continue;
        const source = document.createElement("source");
        source.type = type;
        source.srcset = srcset;
        source.sizes = "(max-width: 600px) 190px, 305px";
        picture.insertBefore(source, image);
      }
    }
  }
  image.removeAttribute("srcset");
  image.width = 360;
  image.height = 360;
  image.decoding = "async";
  image.alt = profile ? profile.animal + "趣味人格角色插画" : "多种人格角色插画合照";
  image.src = asset?.fallback || profile?.image || FALLBACK_IMAGE;
}

/**
 * A failed AVIF/WebP source stays selected even after setting <img src>.
 * Remove every <source> before switching to the lightweight PNG fallback.
 * Returning false prevents recursive error events when even the fallback fails.
 */
export function handleArtworkFailure(image) {
  const fallbackUrl = new URL(FALLBACK_IMAGE, document.baseURI).href;
  const picture = image.parentElement;
  if (picture?.tagName === "PICTURE") {
    picture.querySelectorAll("source").forEach((node) => node.remove());
  }
  image.removeAttribute("srcset");
  image.removeAttribute("sizes");
  if (image.src === fallbackUrl) return false;
  image.alt = "人格角色合照（备用插画）";
  image.src = FALLBACK_IMAGE;
  return true;
}
