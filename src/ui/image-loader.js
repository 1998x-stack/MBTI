/**
 * Swap picture sources with locally generated responsive assets.
 * Source mode (without a build) falls back to the original profile PNG.
 */
export function setResultArtwork(image,profile,asset) {
 const picture=image.parentElement;
 if(picture?.tagName==="PICTURE"){
  for(const source of picture.querySelectorAll("source"))source.remove();
  if(asset){
   for(const [type,srcset] of [["image/avif",asset.avif],["image/webp",asset.webp]]){
    if(!srcset)continue;
    const source=document.createElement("source");
    source.type=type;source.srcset=srcset;source.sizes="(max-width: 600px) 190px, 305px";
    picture.insertBefore(source,image);
   }
  }
 }
 image.width=360;image.height=360;
 image.decoding="async";
 image.alt=profile?profile.animal+"趣味人格角色插画":"多种人格角色插画合照";
 image.src=asset?.fallback||profile?.image||"./assets/images/all-animals_resized.png";
}
