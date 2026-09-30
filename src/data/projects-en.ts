import { CaseStudy } from '../types';

export const caseStudiesEn: Record<string, CaseStudy> = {
  'brunn-studio': {
    id: 'brunn-studio',
    title: 'BRÜNN STUDIO',
    subtitle: 'Architecture studio',
    year: '2025',
    chapterNumber: '01',
    tagline: 'A conceptual demo that reimagines how an architecture studio communicates its criteria, methodology, and processes.',
    type: 'personal',
    url: 'https://brnn-demoarq.vercel.app/',
    pointOfDeparture: `I developed BRÜNN STUDIO as a conceptual demo for UXnicorp. The idea wasn't to make another "pretty" architecture website — it was to research the industry and understand how to present a studio in a clearer, more useful, and more distinctive way. I wanted to build something that conveyed criteria, not just aesthetics.`,
    investigation: `I analyzed numerous architecture studio websites and many shared the same problem: they looked good but explained very little.
I found:

- Huge galleries with no context.
- Confusing navigation.
- Portfolios that looked like photography studios.
- An excess of aesthetics.
- Very little clarity.
- Overly generic contact forms.
- Sites that were visually attractive but difficult to understand from a UX standpoint.

I also noticed something important: many websites showcased projects, but didn't help anyone understand how the studio actually worked. It wasn't clear what approach they had, what type of projects they did, what the process was like, or even whether they were the right studio for that particular client.`,
    insight: `The problem wasn't just visual. Most studios already had "beautiful" websites. The problem was they weren't conveying criteria. They showed results without explaining decisions. It felt like someone could visit, see some nice images, and leave without truly understanding what the studio did or whether it was what they needed. So I decided to focus on clarity, context, and methodology — not just aesthetics.`,
    options: [
      { title: 'Traditional visual gallery', text: 'Visually attractive, but poorly differentiated and with little context about the studio.' },
      { title: 'Highly experimental layouts', text: 'Greater visual impact, but worse clarity and navigation.' },
      { title: 'Prioritize explanation and structure', text: 'Less immediate spectacle, but far better real understanding of the studio.' },
      { title: 'Pack the site with animations and effects', text: 'More eye-catching, but worse performance and more distraction.' }
    ],
    decision: `I designed an experience that tries to explain how the studio thinks, not just show finished work. That's why I structured the site around philosophy, methodology, process, project criteria, and the context of each project. The projects aren't presented just as images — they're presented as explained architectural decisions. I also avoided overloading the site with unnecessary animations or experimental elements. The idea was for the project to breathe, feel clear, and make it easy to quickly understand whether the studio was the right fit for the visitor. Even the contact form was designed through that lens, since an architectural consultation needs more context than just "name, email, and message."`,
    workedWell: `The project managed to convey a much clearer identity than many of the references I had analyzed. The combination of structure, content, whitespace, typography, and contextual explanation helped the site feel more human and understandable, without losing its contemporary and elegant focus. The balance between aesthetics and performance also worked well: I aimed to maintain an attractive visual experience without relying on heavy animations or unnecessary resources.`,
    tradeoffs: `The gallery prioritizes visual experience and narrative over advanced exploration. That helped keep the experience cleaner and more editorial, but sacrificed things like filters, deeper categorization, direct navigation between project types, and individual pages optimized for SEO. I also chose not to experiment too much outside the gallery. I preferred to maintain clarity and consistency over adding unnecessary visual complexity. Additionally, as a conceptual demo, many decisions were born from research and criteria, but haven't yet been validated with real users or usage metrics.`,
    differentToday: `I would better separate each project into individual pages to improve exploration, scalability, and SEO. I would also rethink part of the gallery to maintain the visual experience while making it easier to find specific projects. And I would probably go even deeper into the process and decision-making sections, because that's exactly what ended up most differentiating this project.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'Showing work isn\'t enough. Conveying how a studio thinks is what turns a visit into a client.',
    repoFront: 'https://github.com/DanielVega1221/BR-NN-STUDIO---DEMOARQUITECTURA',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla']
  },
  'lumen': {
    id: 'lumen',
    title: 'LÜMEN',
    subtitle: 'Interior design studio',
    year: '2025',
    chapterNumber: '02',
    tagline: 'A case study on emotional design and digital habitability brought to the website of an interior design studio.',
    type: 'personal',
    url: 'https://lumen-indol-theta.vercel.app/',
    pointOfDeparture: `LÜMEN initially came about as a demo for a real interior design studio that ultimately decided not to move forward with the project. Still, I felt there was something very compelling about the direction it had taken — the way it communicated, the tone, the overall feeling, and the idea of thinking about interior design from the perspective of how a space is inhabited, not just how it looks. That's why I decided to reframe and transform it into a conceptual case study for UXnicorp, keeping the project's foundation but going much deeper into the emotional and experiential approach.`,
    investigation: `I analyzed numerous interior design websites and detected several repeated patterns. Many projects were built almost exclusively around the visual — pleasant galleries, polished renders, "Instagrammable" spaces. But once again, the same problem appeared: there was very little explanation behind the decisions. Everything felt very decorative, but not very livable. I also found a very strong tendency to show inspiration but not process, criteria, or methodology. In many cases: all projects felt the same, there was no clear studio identity, the content seemed put together just to look good, and the experiences ended up feeling cold or impersonal.`,
    insight: `In architecture, the focus had been on explaining structure, methodology, and clarity. In interior design, it was different. This wasn't just about designing functional spaces — it was about conveying how it feels to inhabit them. I understood that the website experience itself also needed to feel inhabitable. The rhythm, the whitespace, the navigation, the tone of the text, and the way you moved through the page all had to generate calmness, sensitivity, and warmth. I didn't want the site to just look good. I wanted it to feel pleasant to move through.`,
    options: [
      { title: 'Traditional visual portfolio', text: 'Simpler to build, but too similar to most references and lacking real differentiation.' },
      { title: 'Extremely minimalist approach', text: 'Visually elegant, but too cold for the type of emotional experience I was seeking.' },
      { title: 'Prioritize storytelling and atmosphere', text: 'Less information density, but a more coherent and emotional experience.' },
      { title: 'Design each project with a completely different visual identity', text: 'More individual personality, but risked breaking the studio\'s overall coherence.' }
    ],
    decision: `I designed an experience focused more on habitability and sensation than on immediate visual impact. The goal was for the site to maintain an overall calm and coherent mood, while each project could feel distinct without breaking the studio's identity. That's why I prioritized clean navigation, relaxed visual rhythm, approachable language, simple layouts, ample breathing room, and a frictionless experience. I also rethought important aspects compared to BRÜNN. For instance, the contact form stopped being so technical and structured. In architecture, requesting a lot of information upfront made sense. In interior design, I felt a simpler, more human, and warmer approach worked better. The idea was to spark a conversation, not a technical evaluation.`,
    workedWell: `The project managed to convey a much warmer and more inhabitable feeling than many of the references I had researched. The visual rhythm, the sense of calm while navigating, the hero section, the consistency of the language, and the relationship between whitespace, typography, and content all worked especially well. I also felt the site achieved something important: making the design feel not just decorative, but thoughtfully crafted around how someone inhabits a space.`,
    tradeoffs: `I prioritized atmosphere and sensation over information density. That helped keep the experience cleaner and more pleasant, but also meant some parts of the site have less technical depth or advanced exploration. Another significant limitation was that the projects still didn't have a sufficiently personalized visual identity. The original idea was for each project to have its own palette and internal mood, without breaking the studio's overall mood. That would have deepened the sense of habitability and differentiation enormously, but it remained pending because it depended on final visual material that was never developed. I also chose to keep layouts relatively conservative so as not to disrupt the site's overall calm. I prioritized emotional coherence over excessive visual experimentation.`,
    differentToday: `I would work much more on the individual identity of each project, especially through color, atmosphere, and visual direction. I would also go even deeper into the idea of "inhabiting" as an emotional experience, because it turned out to be a much harder aspect to resolve than I expected. In this project, I learned something important: in emotional design, small changes in rhythm, tone, or composition can completely break the feeling you're trying to build. And I would probably explore more subtle forms of visual customization so that each space has its own identity without losing coherence with the rest of the site.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'In interior design, a website isn\'t just looked at. It\'s inhabited. Every pixel adds to or subtracts from the feeling of the space.',
    repoFront: 'https://github.com/DanielVega1221/Lumen',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla']
  },
  'marea': {
    id: 'marea',
    title: 'MAREA',
    subtitle: 'Coffee, cuisine & bar',
    year: '2025',
    chapterNumber: '03',
    tagline: 'Research and design on how to translate the experience and daily transformation of a hybrid gastronomic space to the web.',
    type: 'personal',
    url: 'https://marea-nine.vercel.app/',
    pointOfDeparture: `I developed MAREA as a conceptual demo for UXnicorp with the goal of researching the gastronomic industry and understanding how to build more useful digital experiences for restaurants, cafés, and bars. During the research, I found many businesses that had no website at all, relied almost exclusively on Instagram, or existed digitally only through Google Maps. I felt that severely limited how they could present themselves. The idea behind MAREA was to create a space of its own — a site that doesn't just inform, but conveys the identity, rhythm, and experience of the place. I didn't want to just design a website for "checking the menu." I wanted to build a digital experience that made you feel what it's like to be at MAREA, even before arriving.`,
    investigation: `I analyzed numerous gastronomic sites — cafés, restaurants, bars, and hybrid concepts. I found several recurring problems:

- Menus that were hard to read.
- Confusing mobile navigation.
- Excessive dependence on Instagram.
- Unclear opening hours.
- An oversaturation of unnecessary animations.
- Visually attractive but uncomfortable-to-use experiences.

I also noticed something important: the sites showed food, but very few managed to convey the experience of the place. They felt like catalogs, not living spaces. Moreover, most treated all the business's experiences as one single thing, when in reality many places change completely depending on the time of day.`,
    insight: `The project shifted when I understood that MAREA shouldn't feel like "a restaurant." It had to feel like a space that transforms. It wasn't just coffee, cuisine, or bar. It was three distinct experiences sharing the same space. And that completely impacted the structure, the storytelling, the navigation, the visual tone, and the overall site experience. I also understood that the site shouldn't replace the physical experience — it should complement it. The website had to function as an extension of the real space, not a digital brochure with pretty photos.`,
    options: [
      { title: 'Traditional gastronomic website', text: 'Simpler and more familiar, but poorly differentiated and it didn\'t communicate the daily transformation.' },
      { title: 'Prioritize visual impact exclusively', text: 'More initially striking, but less usable and clear.' },
      { title: 'Build an atmospheric editorial experience', text: 'More identity and personality, but greater visual and conceptual complexity.' },
      { title: 'Dynamic system with a time-based backend', text: 'Variable experiences based on server time, but too complex for a conceptual demo.' }
    ],
    decision: `I designed MAREA as a hybrid experience: part branding, part gastronomic exploration, and part digital extension of the physical space. The structure was organized around the moments of the day, the experiences, the events, the products, and the atmosphere. That's why I clearly separated café, cuisine, and bar as distinct identities within the same ecosystem. I also made very deliberate visual choices — editorial layouts, large cards, clean navigation, elegant typography, a measured visual rhythm, and a contemporary aesthetic without tipping into excessive luxury. I included tools like "Build Your Order" not to replace waitstaff or turn the site into a delivery platform, but to complement the in-person experience and reduce friction when ordering.`,
    workedWell: `What worked best was the overall feeling of the project. The site manages to convey that MAREA isn't just a place to eat — it's an experience that changes depending on the time of day. The separation of the three experiences, the event calendar, the editorial visual system, the scroll rhythm, the clear navigation, and the presentation of products and spaces all worked especially well. The visual approach helped the experience feel more premium and polished without losing warmth or approachability.`,
    tradeoffs: `The biggest tradeoff was keeping the project as a conceptual demo without a real backend. That made it possible to build a simple, clear, and easy-to-explore experience, but limited many ideas that could have taken the concept much further: automatic visual changes based on time of day, dynamic product rendering, live events, or real-time manageable content. I also prioritized atmosphere and visual experience over complex functionalities typical of e-commerce or delivery, because the intention was never to compete with ordering apps, but to build a digital experience coherent with the physical space. And to be honest, the concept of "time-based transformation" ended up being more suggested than actually implemented. In the current demo, the three experiences coexist visually, but they don't dynamically mutate the way I originally envisioned.`,
    differentToday: `I would develop a much more dynamic version of the project. I'd love to explore a system where the site genuinely changes depending on the time of day: different colors, dynamically highlighted experiences, contextual events, and a more living visual identity. I would also go even deeper into the idea of "transformation" as the core of the project, because it ended up being the strongest concept of the entire experience and I feel I only got halfway in executing it.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'A restaurant isn\'t a digital menu. It\'s a place that changes with the hour. The website has to breathe that rhythm.',
    repoFront: 'https://github.com/DanielVega1221/Marea',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla', 'Lucide React']
  },
  'stro-atelier': {
    id: 'stro-atelier',
    title: 'STRØ ATELIER',
    subtitle: 'Author architecture studio',
    year: '2025',
    chapterNumber: '04',
    tagline: 'How to translate the sophistication, visual silence, and inevitable character of contemporary author architecture into a digital language.',
    type: 'personal',
    url: 'https://stro-vert.vercel.app/',
    pointOfDeparture: `After developing a project like BRÜNN, I started noticing that many contemporary architecture studios tried to convey sophistication but ended up looking like interchangeable minimalist templates. They were visually correct, but they didn't manage to convey presence.

So STRØ ATELIER emerged as a different kind of conceptual exploration... how do you design a website for a studio that doesn't want to look "modern," but exclusive? The idea was to move completely away from the "real estate portfolio" logic and closer to an editorial, contemplative, almost artistic experience. I wanted to research how to translate author architecture into a digital language without turning it into a cold or pretentious gallery.`,
    investigation: `I analyzed European architecture and interior design studios, especially references from Spain, Portugal, Belgium, and Japanese minimalist studios. I found very repetitive patterns:

- Extremely generic minimalism.
- An excess of renders without narrative.
- Rigid and predictable grids.
- An overly corporate tone.
- Sites that looked like render catalogs.
- Cold and distant interfaces, with projects shown as visual assets rather than architectural decisions.

I also found another problem: many tried to look "premium" by adding unnecessary complexity — exaggerated transitions, experimental scrolls, hard-to-navigate layouts, barely legible typography. It felt like the website design was competing against the architecture instead of supporting it.`,
    insight: `I understood that to convey author architecture, you didn't need to overdesign. You needed control. Visual silence. Rhythm. Restraint. Hierarchy. Spaces that breathe. The experience had to feel precise, almost like an architectural editorial publication.
I also understood something important: contemporary architecture isn't sold just by showing the final result. It's sold by showing criteria. That's why the project started revolving around decisions, materiality, process, intention, architectural direction, and spatial narrative — not just beautiful images.`,
    options: [
      { title: 'Ultra-minimalist experience', text: 'Conveyed sophistication and visual silence, but risked feeling empty or inaccessible.' },
      { title: 'Much more experimental design', text: 'Generated immediate visual impact, but hurt clarity, navigation, and readability.' },
      { title: 'Architectural editorial aesthetic', text: 'Less explosive impact, but far more coherence, identity, and presence.' },
      { title: 'Traditional grid-based portfolio', text: 'Simpler and more functional, but lost personality and differentiation.' }
    ],
    decision: `I decided to build an extremely restrained and controlled experience. Every aspect of the project was thought out to convey calm, precision, presence, criteria, and quiet sophistication.
That's why I made choices like: ample whitespace, editorial layouts, slow and contemplative navigation, typography with presence, more philosophical and reflective texts, strongly marked visual hierarchies, a monochromatic palette with subdued contrast, and an almost manifesto-like architectural language.
Even the projects were structured as "architectural cases" rather than visual galleries. That's why you see strategic decisions, material criteria, constructive logic, spatial concepts, work references, and technical sheets. The idea was for each work to feel thought through, not just presented.`,
    workedWell: `I feel STRØ managed to convey a much more solid and authorial identity than many real studios I researched. The visual control, the reading rhythm, the editorial sensation, the art direction, the coherence between architecture and UI, and the contemplative narrative all worked especially well.
I really liked how the site manages to feel premium without relying on exaggerated effects. The experience leans much more on composition, spacing, tone, hierarchy, and structure than on animations or visual artifices. Besides, I think it was one of the first projects where I truly understood that designing is also about knowing how to hold back.`,
    tradeoffs: `The pursuit of sophistication and visual silence came at a cost. At times, the site prioritizes atmosphere over exploration speed. The navigation isn't optimized for fast consumption — it's designed to be moved through calmly.
I also sacrificed more commercial functionalities like advanced filters, search, fast project exploration, aggressive CTAs, and high information density. Another tradeoff was the tone: the philosophical and contemplative language helps enormously to build identity, but it also means the project speaks to a very specific type of client. I feel I still could have explored more how to combine editorial brutalism and contemporary UX without losing clarity.`,
    differentToday: `I would work even more on the interactive dimension of the project. I'd love to explore more architectural transitions, micro-interactions related to space and materiality, more immersive navigation, subtle rhythm changes between sections, and motion more integrated into the narrative.
I would also go deeper into the visual system for projects, so each work has even more individual identity without breaking the studio's global coherence. And I would probably reconsider some aspects of accessibility and readability, because part of the aesthetic pursuit pushed certain contrasts and typographic sizes to the limit.`,
    demonstrates: `STRØ demonstrates my ability to design sophisticated editorial experiences with extreme visual restraint, controlling rhythm, hierarchy, and atmosphere through composition, typography, and silence. It also demonstrates my understanding that designing isn't about adding — it's about deciding what won't appear — and my skill at translating analog disciplines like author architecture into digital language without trivializing them or turning them into generic templates.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'Designing for author architecture is designing with silence. Fewer elements, more presence.',
    repoFront: 'https://github.com/DanielVega1221/STRO',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla', 'Lenis']
  },
  'zabira-studio': {
    id: 'zabira-studio',
    title: 'Zabira Studio',
    subtitle: 'Management platform and digital experience for a premium pilates studio',
    year: '2026',
    chapterNumber: '05',
    tagline: 'Replacing an external fitness management platform with a custom system that combines premium branding with an atomic booking engine and optimized concurrency.',
    type: 'personal',
    url: 'https://zabira-theta.vercel.app/',
    pointOfDeparture: `Zabira started as a project for a pilates studio that contacted us because they wanted to break free from external fitness management platforms. The client couldn't continue due to budget reasons, but the research we had done and the architecture we had already built held a lot of value. Instead of leaving it there, I decided to turn that foundation into a complete, well-polished conceptual demo, with everything the original proposal wouldn't have had. The idea was to showcase the type of system we could build — with premium branding, atomic bookings, roles, and MercadoPago. Something that would help commercialize what we had worked on and improved.`,
    investigation: `Existing platforms solved operational management, but created several problems:

- Slow and unintuitive interfaces
- Generic experience with no brand identity
- Low flexibility
- Overloaded dashboards
- Third-party dependency
- Friction when booking classes

The studio was looking for its own platform where the experience felt aligned with the physical space, clients could easily self-manage, instructors had simple tools, and the entire operation was centralized. I analyzed fitness booking systems, admin dashboards, and client onboarding flows. I also understood that Zabira didn't compete on price — it competed on experience, perception, and exclusivity.`,
    insight: `The most important decision was to completely separate two experiences: the public landing page (focused on branding, trust, and premium perception) and the internal dashboard (focused on clarity, speed, and pure functionality). This avoided a very common mistake: making dashboards "too visual" but uncomfortable for daily operation. The landing page could be emotional, elegant, and narrative, while the internal system had to be fast, understandable, and highly operational. I also understood that booking a class wasn't just a transaction — it was also a moment of anxiety for the client who wanted to secure their spot. If the system failed at that instant, the entire premium perception would collapse.`,
    options: [
      { title: 'Stick with the external platform', text: 'No development cost, but it kept limiting brand identity and the client experience.' },
      { title: 'Simple booking system + separate landing page', text: 'Faster to develop, but the disconnect between both experiences would create friction and loss of context.' },
      { title: 'Custom integrated platform', text: 'Higher initial investment, but absolute control over the experience, the brand, the operation, and the business\'s data.' }
    ],
    decision: `I designed the public landing page as a brand experience before an informational one — explaining the emotional benefit, simplifying onboarding, and reducing friction. The narrative sold calmness and well-being through sections like "Conscious Pilates" or "One plan, all classes." For the internal system, I defined a clear role architecture: Clients, Instructors, Administrators, and Superadmin. On the technical side, I solved booking concurrency through an atomic booking system using MongoDB atomic operations ($expr, findOneAndUpdate, and embedded subdocuments). This avoided locks, queues, and complex transactions. I integrated MercadoPago membership logic through webhooks and unique references for automatic activation and access control. For security, I implemented JWT authentication with securely stored tokens.`,
    workedWell: `The public landing page ended up being one of the strongest points — conveying exclusivity and calm without falling into generic fitness aesthetics. The role architecture and permission separation was extremely solid and scalable, allowing each user to see only what was relevant and actionable. The responsive experience also worked exceptionally well, since the entire platform was designed mobile-first from scratch rather than simply adapted.`,
    tradeoffs: `The dashboards were designed strictly prioritizing clarity, speed, and usability over animations, visual complexity, or experimental aesthetics. It was a conscious product decision. On the technical side, the project's main debt was the absence of TypeScript in the backend and the lack of automated testing — especially integration tests for auth, payment, and concurrent booking logic. While it worked correctly, it required exhaustive manual testing in staging environments. We also sacrificed features like native push notifications or automatic reminders, which would have improved the client experience but fell outside the initial scope.`,
    differentToday: `I would migrate the backend entirely to TypeScript. I would add automated integration tests from the start. I would modularize the MercadoPago payment logic further to decouple it from membership logic. I would substantially improve observability and logging to more easily monitor production errors. And I would probably explore a notification and automated reminder architecture to further reduce client friction.`,
    criteriaLevel: 'Sistema en Producción',
    criteriaInsight: 'A landing page sells. A dashboard operates. Connected, they enhance the final experience.',
    repoFront: 'https://github.com/DanielVega1221/Zabira',
    repoBack: 'https://github.com/DanielVega1221/ZabiraBack',
    tools: ['React', 'Vite', 'React Router', 'Node.js', 'Express', 'MongoDB', 'MercadoPago SDK', 'JWT', 'CSS vanilla']
  },
  'content-studio': {
    id: 'content-studio',
    title: 'Content Studio',
    subtitle: 'Template engine and internal composition system',
    year: '2026',
    chapterNumber: '06',
    tagline: 'A small code-based content operating system that lets you create, render in an isolated iframe, and export carousels and images without leaving the client.',
    type: 'tool',
    pointOfDeparture: `UXnicorp needed to produce social media content consistently, quickly, and in a reusable way. The existing workflow depended on multiple separate tools: Canva for design, documents for copy, loose sheets for ideas, manual metrics, and scattered assets. The real problem wasn't creating a post. It was sustaining a coherent content system over the long term. Each publication meant rebuilding layouts, manually copying styles, duplicating work, losing visual consistency, and having no performance traceability. The need ended up being much closer to building a small "content operating system" than creating a simple visual editor.`,
    investigation: `I analyzed tools like Canva, Buffer, Later, Figma, visual HTML editors, and template systems. I detected that design wasn't truly reusable: the tools reused "slides," not systems. Duplicating required manual intervention. Visual content and copy were separated, fragmenting the creative flow. Templates were extremely rigid, limiting validation, typing, or automatic data-driven form generation. And the tools prioritized non-technical users, limiting fine control over layout, CSS, and export. I understood that the real problem wasn't "creating images" — it was building a system capable of producing consistent content without constantly redoing work.`,
    insight: `The core insight was that scalable content works very similarly to software. Design had to be parameterizable, layouts reusable, content structured, and the system had to understand variables and presets. I realized that Canva solves one-off creation but not systematic production. Buffer solves scheduling but not visual creation. And Figma solves design but not automated export. The tool we needed didn't exist in any of those categories. It was at the intersection of all three.`,
    options: [
      { title: 'Keep using Canva + scattered tools', text: 'Advantage: no development cost. Disadvantage: duplicated work, visual inconsistency, no performance traceability or real reusability.' },
      { title: 'Pure visual editor (internal Canva-like)', text: 'Advantage: simpler UX for non-technical users. Disadvantage: very hard to achieve real reusability and fine control over layouts and CSS.' },
      { title: 'Typed templates + HTML/CSS rendering + code editor', text: 'Advantage: maximum flexibility, real reusability, absolute control over rendering and export. Disadvantage: more complex architecture to build and maintain.' }
    ],
    decision: `I built a hybrid system that combines a visual editor, code editor, typed templates, isolated rendering, and client-side export. At the architecture level: 1) Isolated iframe rendering using srcdoc and sandboxing to avoid global style contamination and guarantee fidelity between preview and export. 2) Monaco Editor integration as the core for a professional DX (syntax highlighting, undo stack, shortcuts). 3) Typed template system where each template declares variables, types, defaults, and validations, dynamically generating the editing form. 4) Full client-side export using html-to-image, canvas, and JSZip, avoiding servers with Puppeteer or remote processing.`,
    workedWell: `The template system was a resounding success, transforming static layouts into fully configurable structures. The fluid blend between visual editor and code delivered excellent creative speed with absolute technical control. The export pipeline was extremely precise, completely eliminating the typical problems of inconsistent rendering between preview and download. The slide system made creating carousels natural, and the typed templates prevented configuration errors that were previously common.`,
    tradeoffs: `The initial bundle was extremely heavy due to Monaco Editor and the rendering libraries, which was acceptable for an internal tool but would require code splitting for public use. HTML/CSS parsing through html-to-image is fragile on certain mobile or restrictive browsers. SQLite as preset storage limited growth and real multi-user collaboration. And the system lacked native authentication as it was for internal use, which prevented any remote scenario.`,
    differentToday: `I would separate the rendering engine more clearly from the visual editor to build a fully decoupled core with plugins and adapters. I would implement a hybrid rendering solution: keeping client-side export for speed, but adding optional support with Puppeteer and backend queues for low-resource devices. I would scale the database to PostgreSQL and implement authentication to open the tool to multiple remote users. And I would improve the real-time preview system so code changes are reflected instantly without losing form state.`,
    criteriaLevel: 'Herramienta Interna',
    criteriaInsight: 'Scaling content isn\'t designing faster. It\'s stopping designing from scratch every time.',
    repoFront: 'https://github.com/DanielVega1221/Content-Studio',
    tools: ['React', 'Vite', 'TypeScript', 'Express', 'Drizzle ORM', 'libSQL', 'Monaco Editor', 'html-to-image', 'JSZip', 'Zustand', '@dnd-kit', 'Tailwind CSS']
  },
  'uxnicorp-academy': {
    id: 'uxnicorp-academy',
    title: 'UXnicorp Academy',
    subtitle: 'Building a modern web development course with Astro',
    year: '2025',
    chapterNumber: '07',
    tagline: 'A performance-oriented educational platform that demonstrates, through its own architecture, the principles of speed, simplicity, and Zero-JS that it teaches.',
    type: 'career',
    url: 'https://astro-curso-u-xnicorp.vercel.app/',
    pointOfDeparture: `Most web development courses in Spanish shared several problems: outdated content, too much passive theory, poor performance, and extremely heavy platforms loaded with JavaScript that penalized Core Web Vitals. At UXnicorp, they needed a consistent way to onboard developers, document their working stack, and teach their product-centered design methodology. I decided to build a top-quality educational resource — designed for the team but open to anyone who wanted to learn. No logins, no payments, no barriers. If it helped someone else too, all the better.`,
    investigation: `I analyzed platforms like freeCodeCamp, Udemy, Coursera, MDN, and YouTube tutorials. I observed four main problems:

- Too much passive video, which reduces retention and makes quick reference to concepts difficult.
- Ignored performance: educational platforms that used heavy SPAs while, paradoxically, teaching good frontend practices.
- Static or non-editable examples, drastically separating theory from practice.
- Early abstraction: courses that taught React before explaining HTML, the DOM, or how a browser actually works.

I understood that the course had to feel fast, clear, progressive, and interactive. And technically, the product had to be a reflection of what it taught: if you teach performance, the website has to load instantly.`,
    insight: `I defined key principles: Zero-JS where it's not needed (without loading heavy SPAs for static text), progressive interactivity (React only where it adds value: playgrounds, demos, theme toggle), content-first, and non-linear learning without unnecessary backend. The project made something evident that I had already been thinking about: architecture also communicates criteria. You can't teach good performance practices on a slow website.`,
    options: [
      { title: 'Next.js (App Router)', text: 'Advantage: excellent ecosystem and mature SSR. Disadvantage: too much overhead and unnecessary JavaScript for a static content site.' },
      { title: 'Gatsby', text: 'Advantage: content-oriented. Disadvantage: less modern DX and extremely slow build times.' },
      { title: 'Astro (Islands Architecture)', text: 'Advantage: renders static HTML, eliminates unnecessary JS, excellent performance, and perfect for educational content. Disadvantage: newer ecosystem and certain limitations with complex interactivity.' }
    ],
    decision: `I chose Astro as the core of the project. This allowed me to create ultra-fast static content and add encapsulated interactivity through "React Islands" in playgrounds and interactive components like the theme toggle or code viewer. To avoid an unnecessary backend, I kept the site fully static with Astro in SSG mode, without databases or external APIs. The decision not to have auth or a backend wasn't just technical: I wanted anyone to be able to enter and learn without friction. Search, progress tracking, and authentication were left out of the initial scope to prioritize deployment speed and simplicity. Later on, I migrated the content to MDX + Content Collections, separating content from structure and making the project more maintainable.`,
    workedWell: `Astro + Islands was the right call. The site is blazing fast, the interactive demos add value without making it heavy, and having no auth or backend doesn't just simplify everything — it leaves it open for anyone who wants to learn.`,
    tradeoffs: `Without a backend, progress tracking across devices is lost.`,
    differentToday: `I'd like to add more interactive demos in other modules, not just in CSS.`,
    criteriaLevel: 'Recurso Abierto',
    criteriaInsight: 'If you teach performance, your website has to be proof that what you say works.',
    repoFront: 'https://github.com/DanielVega1221/AstroCursoUXnicorp',
    tools: ['Astro', 'React', 'Tailwind CSS', 'Lucide React', 'MDX']
  },
  'la-pagina-de-uxnicorp': {
    id: 'la-pagina-de-uxnicorp',
    title: 'La Página de UXnicorp',
    subtitle: 'The website that sells exactly what we do',
    year: '2026',
    chapterNumber: '08',
    tagline: 'A custom-built platform that acts as a permanent demonstration of our criteria, speed, and commercial transparency.',
    type: 'career',
    url: 'https://www.uxnicorp.com.ar/',
    pointOfDeparture: `UXnicorp is a web development agency. The problem was curious: we needed to sell landing pages, e-commerce, and custom systems, but we still didn't have a website that demonstrated how we worked. The page couldn't just be a business card. It had to become a real demonstration of our criteria, process, technical quality, and way of designing experiences. If someone hired us, they should be able to imagine the end result by looking at our own site. So I built the agency's website myself.`,
    investigation: `I analyzed sites of development agencies, design studios, senior freelancers, and product studios. I found three repeated patterns:

- They all looked too similar: corporate blue, generic dark backgrounds, stock 3D renders, and empty slogans. It was impossible to tell them apart.
- A lot of talk and little evidence: they spoke of "digital transformation" or "incredible experiences" but showed very little actual, structured work.
- Almost nobody showed how they worked: you could see what they did or how much it cost, but rarely the technical reasoning or how they made architectural decisions.

I understood that the site shouldn't act like a brochure — it should act as a demonstration. Every section had to prove something: the case studies proved expertise, the pricing transparency filtered leads, and the UX Score demonstrated our methodology.`,
    insight: `I wanted to convey approachability, criteria, honesty, technical capability, and a focus on results. The entire architecture, performance, and commercial clarity had to be an exact reflection of what we sell. I made an uncommon decision for development agencies: showing prices transparently on the website. Not as a generic "plans" table, but by explaining exactly what each type of project includes, how much it costs, and why. The hypothesis was that this would naturally filter incoming prospects — those just looking for a cheap price would self-select out, and those who valued quality would arrive with aligned expectations.`,
    options: [
      { title: 'No-Code platforms (Webflow, Wix)', text: 'Advantage: shorter development time. Disadvantage: contradiction that\'s hard to justify (selling custom development using a third-party visual builder) and technical limitations for interactive tools like the UX Score.' },
      { title: 'Next.js with custom development', text: 'Advantage: total technical control, dogfooding our own stack, extreme optimization, and absolute freedom to create interactive tools. Disadvantage: longer development and maintenance time.' }
    ],
    decision: `I built the entire site from scratch using Next.js, React, TypeScript, and Tailwind CSS. To set us apart from other agencies, I designed the UX Score: an interactive questionnaire where the visitor answers guided questions about their website's speed, clarity, and objectives, and receives a diagnosis with a score, recommendations, and improvement priorities. This not only demonstrated our technical knowledge but generated a natural and genuinely useful lead magnet. For scroll and transitions, I incorporated Framer Motion and Lenis, exhaustively optimizing assets and bundle size. The page's architecture was designed as a narrative funnel: each section builds on the previous one, guiding the visitor from "who are they?" to "I want to work with them."`,
    workedWell: `The website became our best calling card, proving that we apply what we advise. The UX Score brought us some quality leads: people came to the conversation with a diagnosis in hand and prior context, which greatly improved the quality of initial talks. The pricing transparency reduced unproductive meetings with out-of-budget clients to zero. And the page itself functioned as a living portfolio: every visit to the site was already experiencing our work.`,
    tradeoffs: `Developing and maintaining a custom site consumed more design and coding time than a no-code solution. The animations with Framer Motion and Lenis smooth scroll added to the initial bundle weight, requiring extra optimization to keep good Lighthouse scores. Manual internationalization required structured maintenance. And the UX Score, being so visible on the page, required constant attention to avoid becoming outdated.`,
    differentToday: `I would improve the internal analytics system to more precisely measure user behavior within the UX Score funnel. I would design a dynamic content system to add a blog or technical notes without manual deploys. I would refactor the translation structure to support more languages in a modular way. And I would probably reconsider some animation decisions to reduce dependency on external libraries in sections where pure CSS would suffice.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'Showing your prices filters better than any form. Transparency is the best lead magnet.',
    repoFront: 'https://github.com/DanielVega1221/PortafolioUXnicorp',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lenis', 'Lucide React']
  }
};
