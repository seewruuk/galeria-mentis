import groq from "groq";
import {client} from "../lib/client";

export async function getHomePage() {
    return client.fetch(
        groq`*[_type == "homepage"]{ 
          heroSection[]{
            title,
            text,
            button{
              label,
              mode,
              ariaLabel,
              anchorId,
             "routeHref": select(
  mode == "route" && defined(internalPath) && string::startsWith(internalPath, "/") => internalPath,
  mode == "route" && defined(internalPath) => "/" + internalPath
),

"anchorHref": select(
  mode == "anchor" && defined(anchorId) && string::startsWith(anchorId, "#") => anchorId,
  mode == "anchor" && defined(anchorId) => "#" + anchorId
),
              url,
              newTab,
              smoothScroll,
              scrollOffset
            },
            "backgroundImage": backgroundImage.asset->url
          },
          featuredProducts[]->{
            "thumbnail": thumbnail.asset->url,
            "images": images[].asset->url,
            name,
            "slug" : slug.current,
            productCategory->{ title },
            price,
            artist->{ "slug" : slug.current, name }
          },
          highlightedArtists[]->{
            "slug" : slug.current,
            _id,
            name,
            "avatar": avatar.asset->url,
            location,
            description
          },
          benefitsSection[]{ ..., "icon": icon.asset->url },
          "benefitsSection_backgroundImage": benefitsSection_backgroundImage.asset->url,
          seo
        }[0]`
    );
}
