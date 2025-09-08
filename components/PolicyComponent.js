"use client";

import {useEffect, useState} from "react";
import {PortableText} from "@portabletext/react";
import {getPolicyByType} from "@/sanity/getSanity/getPolicy";
import Layout from "@/components/Layout";

export default function PolicyComponent({type = "privacyPolicy"}) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const components = {
        block: {
            h1: ({children}) => <h1 className="text-3xl font-semibold leading-tight mb-4">{children}</h1>,
            h2: ({children}) => <h2 className="text-2xl font-semibold leading-tight mt-8 mb-3">{children}</h2>,
            h3: ({children}) => <h3 className="text-xl font-semibold leading-tight mt-6 mb-2">{children}</h3>,
            h4: ({children}) => <h4 className="text-lg font-semibold leading-tight mt-5 mb-2">{children}</h4>,
            normal: ({children}) => <p className="leading-relaxed mb-4">{children}</p>,
            blockquote: ({children}) => (
                <blockquote className="border-l-4 pl-4 italic opacity-90 my-4">{children}</blockquote>
            ),
        },
        list: {
            bullet: ({children}) => <ul className="list-disc pl-6 space-y-2 mb-4">{children}</ul>,
            number: ({children}) => <ol className="list-decimal pl-6 space-y-2 mb-4">{children}</ol>,
            checkmarks: ({children}) => <ul className="pl-6 space-y-2 mb-4">{children}</ul>,
        },
        listItem: {
            bullet: ({children}) => <li className="leading-relaxed">{children}</li>,
            number: ({children}) => <li className="leading-relaxed">{children}</li>,
            checkmarks: ({children}) => <li className="leading-relaxed">✅ {children}</li>,
        },
        marks: {
            strong: ({children}) => <strong>{children}</strong>,
            em: ({children}) => <em>{children}</em>,
            underline: ({children}) => <span className="underline">{children}</span>,
            code: ({children}) => (
                <code className="px-1 py-0.5 rounded bg-neutral-100">{children}</code>
            ),
            link: ({value, children}) => {
                const href = value?.href || "#";
                const isExternal = href?.startsWith("http");
                return (
                    <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="underline underline-offset-2 hover:opacity-80"
                    >
                        {children}
                    </a>
                );
            },
        },
    };

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await getPolicyByType(type);
                if (!cancelled) {
                    setContent(res?.content || null);
                }
            } catch (e) {
                if (!cancelled) {
                    setError("Nie udało się pobrać danych. Spróbuj ponownie później.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [type]);

    if (loading) {
        return (
            <div role="status" aria-live="polite" className="py-10">
                <p className="opacity-70">Ładowanie treści…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="py-10 text-red-600">
                {error}
            </div>
        );
    }

    if (!content || content.length === 0) {
        return (
            <div className="py-10 opacity-70">
                Brak treści dla tego typu polityki.
            </div>
        );
    }

    return (
        <Layout>
            <article className="">
                <PortableText value={content} components={components}/>
            </article>
        </Layout>

    );
}
