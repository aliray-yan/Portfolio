# Ali Rayyan portfolio and resumes

Completed 17 October 2026.

## Open the portfolio

Extract `Ali-Rayyan-Portfolio.zip` and open `index.html` in a browser. The site is buildless HTML, CSS, and JavaScript. Its relative links support the existing GitHub Pages project path. This delivery updates local files; the live GitHub Pages website has not been published or changed.

The bundle includes the home page, searchable project index, selected authentic images, 14 Forage certificates, and both resume versions in PDF and Word format. It excludes research files, archive contents, temporary proofs, unused concept images, credentials, and local hosting metadata.

## Design and content

The redesign uses navy text, cool off-white surfaces, a restrained coral accent, and Manrope typography. The layout gives selected projects space for a contribution narrative and real screenshots, followed by chronological experience and expandable learning evidence. Selected projects have a brief entrance transition; reduced-motion preferences disable movement.

The project index covers all 19 public repositories in the reviewed GitHub inventory and preserves 8 existing lab projects. Search and category filters can be combined. Prototype limitations and internship, lab, and simulation categories are explicit.

The cybersecurity resume emphasizes Cyberster, Tech Hierarchy, Talosec, Empirical Training, defensive-security projects, and eight cybersecurity simulations. The software engineering resume emphasizes FlyRank, application engineering projects, and six software/technology simulations. Each is two pages, single-column, text-based, with standard headings and no tables, text boxes, icons, or skill charts. These are role-family resumes; a particular vacancy may call for changing the summary and ordering relevant skills.

Job simulations are identified as self-paced exercises rather than employment. Course completions are not represented as vendor examination certifications. Unsupported percentage improvements were removed. The expired Sumo Logic credential is described historically on the site and is not presented as a current certification on the resumes.

## Main files

- `index.html`: identity, selected work, experience, capabilities, learning, and resume downloads.
- `projects.html`: full project index with 27 entries.
- `style.css`: visual tokens, responsive layouts, focus styles, and reduced-motion rules.
- `script.js`: mobile navigation, project search/filter/reset, and copy-email feedback.
- `data/projects.json`: reviewed project inventory.
- `resumes/`: the two application-ready PDF and editable Word versions.
- `certificates/`: selected Forage completion certificates.
- `DESIGN.md`: design decisions and guide references.

The working folder also retains `scripts/build_portfolio.py`, `scripts/build_resumes.py`, and `scripts/validate_deliverables.py`. The builders use local research and source materials and are not needed to run the delivered website. Original site files are preserved in `research/original-site/`.

## Validation performed

- `python scripts/build_portfolio.py`: passed; generated 27 project entries and 14 certificate links.
- `node --check script.js`: passed.
- `python scripts/validate_deliverables.py`: passed; checked 45 local file/anchor references, image descriptions, heading order, repository coverage, eight evidence paths, required resume experience, PDF text extraction, and DOCX structure.
- Main color pairs exceeded 4.5:1 contrast; measured ratios ranged from 5.22:1 to 15.09:1.
- Browser review at 1440, 768, and 390 pixel widths: no horizontal overflow in the inspected layouts. Reviewed introduction, project presentation, experience, resume section, and project index.
- Browser interactions: category filter, successful search, empty results, reset, mobile menu focus, and Escape-to-close passed. No page console errors were recorded during these checks.
- All PDF pages were rendered and visually inspected. Both DOCX files were opened in Microsoft Word, exported to local PDF proofs, rendered to PNG, and visually inspected. The packaged LibreOffice renderer was unavailable; native Word supplied the document-layout verification instead.

The work includes targeted accessibility and functional checks, not a full third-party accessibility certification, Lighthouse audit, or a commercial ATS scoring test. Google Fonts needs an internet connection; the site falls back to Segoe UI or a system sans-serif if it is unavailable. Repository descriptions reflect the reviewed code and documentation and do not imply production deployment.
