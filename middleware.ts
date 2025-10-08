import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createI18nMiddleware } from "next-international/middleware";
import { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/locales/_index";
import Negotiator from 'negotiator';
import {match as matchLocale} from '@formatjs/intl-localematcher';

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewriteDefault',
  resolveLocaleFromRequest: (request: NextRequest) => {
    const headers = Object.fromEntries(request.headers.entries());
    const negotiator = new Negotiator({ headers });
    const acceptedLanguages = negotiator.languages();
    const requestedLocales = acceptedLanguages.includes('*')
      ? locales
      : acceptedLanguages;
    const defaultLocale = locales.includes(acceptedLanguages[0])
      ? acceptedLanguages[0]
      : 'en';

    const matchedLocale = matchLocale(requestedLocales, locales, defaultLocale);

    return matchedLocale;
  },
})

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
  
  // Skip Next.js internals and all static files
  if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api")) {
    return;
  }
  return I18nMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|json|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  runtime: 'nodejs', // Now stable!
};
