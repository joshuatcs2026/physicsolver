# Universal File Viewer

`universal-file-viewer.html` is a standalone, offline-first file viewer intended for embedding in Google Sites or hosting from GitHub Pages.

## Modes

- **PDF:** opens a locally-created Blob URL in a new `about:blank` viewer.
- **EPUB:** parses the EPUB ZIP package locally in the browser and renders spine documents without a CDN.
- **Text:** displays common text/source formats in a generalized viewer with search, wrapping, and copy support.

## Offline design

There are no external JavaScript libraries, CDN dependencies, API calls, upload endpoints, or remote file-processing services in this page. Selected files are processed in browser memory.

The EPUB implementation uses browser APIs (`File`, `ArrayBuffer`, `DataView`, `DOMParser`, `DecompressionStream`, and Blob URLs). Modern Chromium-based browsers are the primary target.

## Security model

Text files are displayed as text rather than executed. EPUB script/object/embed/iframe/form elements are removed before display. This viewer should still be treated as a local utility, not a full EPUB security sandbox, and future iterations should add stronger attribute/URL sanitization and resource lifecycle management.

## Google Sites

Host this file on GitHub Pages and embed the resulting page in Google Sites. Keep the path relative so it remains compatible with GitHub Pages subpaths.

## Known next improvements

1. Strong EPUB URL/attribute sanitization.
2. Correct relative asset resolution for nested EPUB folders.
3. EPUB table of contents and chapter picker.
4. EPUB persistent reading position.
5. EPUB keyboard navigation and page-style pagination.
6. PDF zoom/fullscreen/download controls.
7. Text line numbers, encoding selection, and large-file streaming.
8. More specialized handlers without weakening the generic text fallback.
