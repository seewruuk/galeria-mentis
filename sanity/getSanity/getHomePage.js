import groq from "groq";
import {client} from "../lib/client";


export async function getHomePage() {
    return client.fetch(
        groq`*[_type == "homepage"]{ 
         heroSection[]{
         ...,
         "backgroundImage": backgroundImage.asset->url,
         },
         featuredProducts[]->{
         "images": images[].asset->url,
            name,
            "slug" : slug.current,
            productCategory->{
                title,
            },
            price,
            artist->{
            "slug" : slug.current,
                name,
            },
         },
         highlightedArtists[]{
           artist->{
            name,
            "slug" : slug.current,
            "avatar": avatar.asset->url,
            location,
           },
           works[]->{
            "images": images[].asset->url,
            name,
            "slug" : slug.current,
            productCategory->{
                title,
            },
            price,
            artist->{
            "slug" : slug.current,
                name,
            },
           }
           
         },
         benefitsSection[]{
            ...,
            "icon": icon.asset->url,
         },
         "benefitsSection_backgroundImage": benefitsSection_backgroundImage.asset->url,
         

          
        }[0]`
    )
}

