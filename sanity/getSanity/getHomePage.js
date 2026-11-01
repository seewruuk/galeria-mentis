import groq from "groq";
import "server-only";
import {fetchPublic} from "@/lib/server/sanity";

export async function getHomePage() {
    return fetchPublic(
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
            _id,
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
            description,
            "artworks": *[_type == "product" && artist._ref == ^._id][0...3]{
            _id,
            name,
            "slug": slug.current,
            "thumbnail": thumbnail.asset->url,
            "images": images[].asset->url,
            artist->{
                name,
                "slug": slug.current,
            },
            productCategory->{
                title,
                "slug": slug.current,
            },
            price,
        },
          },
          benefitsSection[]{ ..., "icon": icon.asset->url },
          "benefitsSection_backgroundImage": benefitsSection_backgroundImage.asset->url,
          seo{
            ...,
            "ogImage": ogImage.asset->url
          }
        }[0]`
    );
}
