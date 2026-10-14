# Fonts

`archivo-variable.woff2` is Archivo (SIL Open Font License 1.1, see `OFL.txt`), self-hosted through
`next/font/local` in `lib/fonts.ts`. It is the Google Fonts variable font reduced to what the site uses:

- axes limited to weight 400–700 and width 100–125 % (fontTools `instancer`);
- Latin-1 (U+0020–007E, U+00A0–00FF) plus typographic punctuation – — ‘ ’ “ ” • … € ™ ← → −;
- layout features kern, liga, calt, ccmp, locl, mark, mkmk, tnum, lnum, case.

88 KB → 46 KB compared with the full-range Google Fonts file. Characters outside the subset (rare
accented letters) fall back to the system sans-serif. IBM Plex Sans Arabic still loads through
`next/font/google`.
