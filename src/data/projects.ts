import { CaseStudy } from '../types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'brunn-studio',
    title: 'BRÜNN STUDIO',
    subtitle: 'Estudio de arquitectura',
    year: '2025',
    chapterNumber: '01',
    tagline: 'Una demo conceptual para rediseñar cómo un estudio de arquitectura comunica su criterio, metodología y procesos.',
    type: 'personal',
    url: 'https://brnn-demoarq.vercel.app/',
    pointOfDeparture: `Desarrollé BRÜNN STUDIO como una demo conceptual para UXnicorp. La idea no era hacer otra web "linda" de arquitectura, sino investigar el rubro y entender cómo presentar un estudio de forma más clara, útil y diferenciada. Quería construir algo que transmitiera criterio, no solamente estética.`,
    investigation: `Analicé numerosos sitios de estudios de arquitectura y muchos compartían el mismo problema: se veían bien, pero explicaban muy poco. 
Encontraba:

- Galerías enormes sin contexto.
- Navegación confusa.
- Portfolios que parecían estudios de fotografía.
- Exceso de estética.
- Poca claridad.
- Formularios demasiado genéricos.
- Sitios visualmente atractivos pero difíciles de entender desde UX. 

También noté algo importante: muchas webs mostraban obras, pero no ayudaban a entender cómo trabajaba realmente el estudio. No quedaba claro qué enfoque tenían, qué tipo de proyectos hacían, cómo era el proceso o incluso si eran el estudio correcto para ese cliente.`,
    insight: `El problema no era solamente visual. La mayoría de los estudios ya tenían sitios "bonitos". El problema era que no transmitían criterio. Mostraban resultados, pero no explicaban decisiones. Sentía que alguien podía entrar, ver imágenes agradables e irse sin entender realmente qué hacía el estudio o si era lo que necesitaba. Entonces decidí enfocarme en claridad, contexto y metodología, no solamente en estética.`,
    options: [
      { title: 'Galería visual tradicional', text: 'Atractiva visualmente, pero poco diferenciada y con poco contexto sobre el estudio.' },
      { title: 'Layouts muy experimentales', text: 'Más impacto visual, pero peor claridad y navegación.' },
      { title: 'Priorizar explicación y estructura', text: 'Menos espectacularidad inmediata, pero más entendimiento real del estudio.' },
      { title: 'Llenar el sitio de animaciones y efectos', text: 'Más llamativo, pero peor rendimiento y más distracción.' }
    ],
    decision: `Diseñé una experiencia que intenta explicar cómo piensa el estudio, no solamente mostrar obras terminadas. Por eso estructuré el sitio alrededor de filosofía, metodología, proceso, criterios de proyecto y el contexto de cada obra. Las obras no se presentan solamente como imágenes, sino como decisiones arquitectónicas explicadas. También evité sobrecargar el sitio con animaciones o elementos experimentales innecesarios. La idea era que el proyecto respire, se sienta claro y permita entender rápidamente si ese estudio era o no adecuado para quien lo visitaba. Incluso el formulario de contacto fue pensado desde esa lógica ya que una consulta arquitectónica necesita más contexto que un simple "nombre, mail y mensaje".`,
    workedWell: `El proyecto logró transmitir una identidad mucho más clara que muchas de las referencias que había analizado. La combinación entre estructura, contenido, whitespace, tipografía y explicación contextual ayudó a que el sitio se sintiera más humano y entendible, sin perder el enfoque contemporáneo y elegante. También funcionó bien el equilibrio entre estética y rendimiento: intenté mantener una experiencia visual atractiva sin depender de animaciones pesadas o recursos innecesarios.`,
    tradeoffs: `La galería prioriza experiencia visual y narrativa por encima de exploración avanzada. Eso ayudó a mantener una experiencia más limpia y editorial, pero sacrificó cosas como filtros, categorización más profunda, navegación directa entre tipos de proyectos y páginas individuales optimizadas para SEO. También decidí no experimentar demasiado fuera de la galería. Preferí mantener claridad y consistencia antes que agregar complejidad visual innecesaria. Además, al ser una demo conceptual, muchas decisiones nacieron desde investigación y criterio, pero no fueron validadas todavía con usuarios reales o métricas de uso.`,
    differentToday: `Separaría mejor cada proyecto en páginas individuales para mejorar exploración, escalabilidad y SEO. También replantearía parte de la galería para mantener la experiencia visual, pero permitiendo encontrar proyectos específicos más fácilmente. Y probablemente profundizaría todavía más la parte de proceso y toma de decisiones, porque fue justamente eso lo que terminó diferenciando más al proyecto.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'Mostrar obras no alcanza. Transmitir cómo piensa un estudio es lo que convierte una visita en un cliente.',
    repoFront: 'https://github.com/DanielVega1221/BR-NN-STUDIO---DEMOARQUITECTURA',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla']
  },
  {
    id: 'lumen',
    title: 'LÜMEN',
    subtitle: 'Estudio de interiorismo',
    year: '2025',
    chapterNumber: '02',
    tagline: 'Un caso de estudio sobre diseño emocional y habitabilidad digital llevado a la web de un estudio de interiores.',
    type: 'personal',
    url: 'https://lumen-indol-theta.vercel.app/',
    pointOfDeparture: `LÜMEN surgió inicialmente como una demo para un estudio real de interiorismo que finalmente decidió no continuar con el proyecto. Aun así, sentía que había algo muy interesante en la dirección que había tomado como la forma de comunicar, el tono, la sensación general y la idea de pensar el interiorismo desde cómo se habita un espacio y no solamente desde cómo se ve. Por eso decidí replantearlo y convertirlo en un caso conceptual para UXnicorp, manteniendo la base del proyecto, pero profundizando mucho más el enfoque emocional y experiencial.`,
    investigation: `Analicé numerosos sitios de interiorismo y detecté varios patrones repetidos. Muchos proyectos estaban construidos casi exclusivamente desde lo visual como galerías agradables, renders cuidados, espacios "instagrammeables". Pero otra vez aparecía el mismo problema: había muy poca explicación detrás de las decisiones. Todo se sentía muy decorativo, pero poco habitable. También encontré una tendencia muy fuerte a mostrar inspiración, pero no proceso, criterio o forma de trabajo. En muchos casos: todos los proyectos se sentían iguales, no existía una identidad clara del estudio, el contenido parecía armado solamente para verse bien y las experiencias terminaban sintiéndose frías o impersonales.`,
    insight: `En arquitectura el foco estaba en explicar estructura, metodología y claridad. En interiorismo era distinto. Acá no se trataba solamente de diseñar espacios funcionales, sino de transmitir cómo se siente vivirlos. Entendí que la experiencia del sitio también tenía que sentirse habitable. El ritmo, el whitespace, la navegación, el tono de los textos y la forma de recorrer la página tenían que generar calma, sensibilidad y cercanía. No quería que el sitio solamente se vea bien. Quería que se sienta agradable de recorrer.`,
    options: [
      { title: 'Portfolio visual tradicional', text: 'Más simple de construir, pero muy parecido a la mayoría de referencias y sin diferenciación real.' },
      { title: 'Enfoque extremadamente minimalista', text: 'Visualmente elegante, pero demasiado frío para el tipo de experiencia emocional que buscaba.' },
      { title: 'Priorizar storytelling y atmósfera', text: 'Menos densidad de información, pero una experiencia más coherente y emocional.' },
      { title: 'Diseñar cada proyecto con identidad visual completamente distinta', text: 'Más personalidad individual, pero riesgo de romper la coherencia general del estudio.' }
    ],
    decision: `Diseñé una experiencia enfocada más en habitabilidad y sensación que en impacto visual inmediato. El objetivo era que el sitio mantuviera un mood general tranquilo y coherente, mientras cada proyecto pudiera sentirse distinto sin romper la identidad del estudio. Por eso prioricé navegación limpia, ritmo visual relajado, lenguaje cercano, layouts simples, mucho espacio respirando y una experiencia sin fricción. También replanteé partes importantes respecto a BRÜNN. Por ejemplo, el formulario de contacto dejó de ser tan técnico y estructurado. En arquitectura tenía sentido pedir mucha información desde el inicio. En interiorismo sentía que un enfoque más simple, humano y cercano funcionaba mejor. La idea era generar una conversación, no una evaluación técnica.`,
    workedWell: `El proyecto logró transmitir una sensación mucho más cálida y habitable que muchas de las referencias que había investigado. Funcionó especialmente bien el ritmo visual, la sensación de calma al navegar, el hero, la coherencia del lenguaje y la relación entre whitespace, tipografía y contenido. También sentí que el sitio consiguió algo importante: hacer que el diseño no se perciba solamente decorativo, sino pensado desde cómo vive alguien un espacio.`,
    tradeoffs: `Prioricé atmósfera y sensación por encima de densidad de información. Eso ayudó a mantener una experiencia más limpia y agradable, pero también hizo que algunas partes del sitio tengan menos profundidad técnica o exploración avanzada. Otra limitación importante fue que los proyectos todavía no tenían una identidad visual suficientemente personalizada. La idea original era que cada proyecto tenga su propia paleta y mood interno, sin romper el mood general del estudio. Eso iba a profundizar muchísimo más la sensación de habitabilidad y diferenciación, pero quedó pendiente porque dependía de material visual final que nunca llegó a desarrollarse. También decidí mantener layouts relativamente conservadores para no romper la calma general del sitio. Preferí coherencia emocional antes que experimentar visualmente de más.`,
    differentToday: `Trabajaría mucho más la identidad individual de cada proyecto, especialmente desde color, atmósfera y dirección visual. También profundizaría todavía más la idea de "habitar" como experiencia emocional, porque fue una parte mucho más difícil de resolver de lo que esperaba. En este proyecto entendí algo importante: en diseño emocional, pequeños cambios de ritmo, tono o composición pueden romper completamente la sensación que intentás construir. Y probablemente exploraría formas más sutiles de personalización visual para que cada espacio tenga una identidad propia sin perder coherencia con el resto del sitio.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'En diseño de interiores, la web no solo se mira. Se habita. Cada píxel suma o resta a la sensación del espacio.',
    repoFront: 'https://github.com/DanielVega1221/Lumen',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla']
  },
  {
    id: 'marea',
    title: 'MAREA',
    subtitle: 'Café, cocina y bar',
    year: '2025',
    chapterNumber: '03',
    tagline: 'Investigación y diseño sobre cómo trasladar la experiencia y la transformación horaria de un espacio gastronómico híbrido a la web.',
    type: 'personal',
    url: 'https://marea-nine.vercel.app/',
    pointOfDeparture: `Desarrollé MAREA como una demo conceptual para UXnicorp con el objetivo de investigar el rubro gastronómico y entender cómo construir experiencias digitales más útiles para restaurantes, cafés y bares. Durante la investigación encontré muchos negocios que no tenían sitio web, dependían casi exclusivamente de Instagram o existían digitalmente solo a través de Google Maps. Sentía que eso limitaba muchísimo cómo podían mostrarse. La idea detrás de MAREA era crear un espacio propio, que sea un sitio que no solamente informe, sino que transmita la identidad, el ritmo y la experiencia del lugar. No quería diseñar simplemente una web para "ver el menú". Quería construir una experiencia digital que hiciera sentir cómo es estar en MAREA incluso antes de llegar.`,
    investigation: `Analicé numerosos sitios gastronómicos como cafés, restaurantes, bares y conceptos híbridos. Encontré varios problemas repetidos: 

    - Menús difíciles de leer.
    - Navegación confusa en mobile.
    - Demasiada dependencia de Instagram.
    - Horarios poco claros.
    - Exceso de animaciones innecesarias.
    - Experiencias visualmente atractivas pero incómodas de usar. 

    También noté algo importante que es que los sitios mostraban comida, pero muy pocos lograban transmitir la experiencia del lugar. Se sentían como catálogos, no como espacios vivos. Además, la mayoría trataba todas las experiencias del negocio como una sola cosa, cuando en realidad muchos lugares cambian completamente según el momento del día.`,

    insight: `El proyecto cambió cuando entendí que MAREA no debía sentirse como "un restaurante". Tenía que sentirse como un espacio que se transforma. No era solamente café, cocina o bar. Eran tres experiencias distintas compartiendo el mismo espacio. Y eso impactaba completamente en la estructura, el storytelling, la navegación, el tono visual y la experiencia general del sitio. También entendí que el sitio no debía reemplazar la experiencia física, sino complementarla. La web tenía que funcionar como una extensión del espacio real, no como un folleto digital con fotos lindas.`,
    options: [
      { title: 'Sitio gastronómico tradicional', text: 'Más simple y familiar, pero poco diferenciador y no comunicaba la transformación horaria.' },
      { title: 'Priorizar únicamente impacto visual', text: 'Más atractivo inicialmente, pero menos usable y claro.' },
      { title: 'Construir experiencia editorial atmosférica', text: 'Más identidad y personalidad, pero mayor complejidad visual y conceptual.' },
      { title: 'Sistema dinámico con backend horario', text: 'Experiencias variables según el horario del servidor, pero demasiado complejo para una demo conceptual.' }
    ],
    decision: `Diseñé MAREA como una experiencia híbrida: parte branding, parte exploración gastronómica y parte extensión digital del espacio físico. La estructura se organizó alrededor de los momentos del día, las experiencias, los eventos, los productos y el ambiente. Por eso separé claramente cafetería, cocina y bar como identidades distintas dentro del mismo ecosistema. También tomé decisiones visuales muy deliberadas como layouts editoriales, cards grandes, navegación limpia, tipografía elegante, ritmo visual pausado y una estética contemporánea sin caer en lujo excesivo. Incluí herramientas como "Arma tu pedido" no para reemplazar mozos o convertir el sitio en delivery, sino para complementar la experiencia presencial y reducir la fricción al momento de pedir.`,
    workedWell: `Lo que mejor funcionó fue la sensación general del proyecto. El sitio logra transmitir que MAREA no es solamente un lugar para comer, sino una experiencia que cambia según el momento del día. Funcionó especialmente bien la separación de las tres experiencias, la agenda de eventos, el sistema visual editorial, el ritmo del scroll, la navegación clara y la presentación de productos y espacios. El enfoque visual ayudó a que la experiencia se sintiera más premium y cuidada sin perder cercanía ni calidez.`,
    tradeoffs: `El mayor tradeoff fue mantener el proyecto como una demo conceptual sin backend real. Eso permitió construir una experiencia simple, clara y fácil de explorar, pero limitó muchas ideas que podrían haber llevado el concepto mucho más lejos: cambios visuales automáticos según horario, renderizado dinámico de productos, eventos vivos o contenido administrable en tiempo real. También prioricé la atmósfera y la experiencia visual por encima de funcionalidades complejas típicas de e-commerce o delivery, porque la intención nunca fue competir con apps de pedidos, sino construir una experiencia digital coherente con el espacio físico. Y siendo honesto, el concepto de "transformación horaria" quedó más sugerido que realmente implementado. En la demo actual, las tres experiencias conviven visualmente, pero no mutan de forma dinámica como imaginé originalmente.`,
    differentToday: `Desarrollaría una versión mucho más dinámica del proyecto. Me gustaría explorar un sistema donde el sitio realmente cambie según el horario: colores distintos, experiencias destacadas dinámicamente, eventos contextuales y una identidad visual más viva. También profundizaría todavía más la idea de "transformación" como núcleo del proyecto, porque terminó siendo el concepto más fuerte de toda la experiencia y siento que me quedé a mitad de camino en ejecutarlo.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'Un restaurante no es un menú digital. Es un lugar que cambia según la hora. La web debe respirar ese ritmo.',
    repoFront: 'https://github.com/DanielVega1221/Marea',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla', 'Lucide React']
  },
  {
    id: 'stro-atelier',
    title: 'STRØ ATELIER',
    subtitle: 'Estudio de arquitectura de autor',
    year: '2025',
    chapterNumber: '04',
    tagline: 'Cómo traducir la sofisticación, el silencio visual y el carácter inevitable de la arquitectura contemporánea de autor a un lenguaje digital.',
    type: 'personal',
    url: 'https://stro-vert.vercel.app/',
    pointOfDeparture: `Después de desarrollar un proyecto como BRÜNN, empecé a notar que muchos estudios de arquitectura contemporánea intentaban transmitir sofisticación, pero terminaban pareciendo plantillas minimalistas intercambiables. Visualmente eran correctos, pero no lograban transmitir presencia.

    Entonces surgió STRØ ATELIER como una exploración conceptual distinta... ¿cómo se diseña una web para un estudio que no quiere verse "moderno", sino exclusivo? La idea era alejarse completamente de la lógica de "portfolio inmobiliario" y acercarse más a una experiencia editorial, contemplativa y casi artística. Quería investigar cómo traducir la arquitectura de autor al lenguaje digital sin convertirla en una galería fría o pretenciosa.`,
    investigation: `Analicé estudios europeos de arquitectura e interiorismo contemporáneo, especialmente referencias de España, Portugal, Bélgica y estudios minimalistas japoneses. Encontré patrones muy repetidos:

- Minimalismo extremadamente genérico.
- Exceso de renders sin narrativa.
- Grids rígidos y previsibles.
- Tono demasiado corporativo.
- Sitios que parecían catálogos de renders.
- Interfaces frías y distantes, con proyectos mostrados como assets visuales y no como decisiones arquitectónicas.

También encontré otro problema: muchos intentaban verse "premium" agregando complejidad innecesaria (transiciones exageradas, scrolls experimentales, layouts difíciles de navegar, tipografía poco legible). Sentía que el diseño de la web competía contra la arquitectura en lugar de acompañarla.`,
    insight: `Entendí que para transmitir arquitectura de autor no hacía falta sobrediseñar. Hacía falta control. Silencio visual. Ritmo. Contención. Jerarquía. Espacios que respiren. La experiencia tenía que sentirse precisa, casi como una publicación editorial de arquitectura.
También entendí algo importante: la arquitectura contemporánea no se vende solamente mostrando el resultado final. Se vende mostrando criterio. Por eso el proyecto empezó a girar alrededor de decisiones, materialidad, proceso, intención, dirección arquitectónica y narrativa espacial, y no solamente alrededor de imágenes bonitas.`,
    options: [
      { title: 'Experiencia ultra minimalista', text: 'Transmitía sofisticación y silencio visual, pero corría el riesgo de sentirse vacía o inaccesible.' },
      { title: 'Diseño mucho más experimental', text: 'Generaba impacto visual inmediato, pero perjudicaba la claridad, la navegación y la lectura.' },
      { title: 'Estética editorial arquitectónica', text: 'Menos impacto explosivo, pero mucho más coherencia, identidad y presencia.' },
      { title: 'Portfolio tradicional basado en grillas', text: 'Más simple y funcional, pero perdía personalidad y diferenciación.' }
    ],
    decision: `Decidí construir una experiencia extremadamente contenida y controlada. Todo el proyecto fue pensado para transmitir calma, precisión, presencia, criterio y sofisticación silenciosa.
    Por eso tomé decisiones como mucho whitespace, layouts editoriales, navegación lenta y contemplativa, tipografía con presencia, textos más filosóficos y reflexivos, jerarquías visuales muy marcadas, paleta monocromática con contraste contenido y un lenguaje arquitectónico casi manifiesto.
    Incluso los proyectos fueron estructurados como "casos arquitectónicos" más que como galerías visuales. Por eso aparecen decisiones de dirección, criterio material, lógica constructiva, concepto espacial, referencias de obra y fichas técnicas. La idea era que cada obra se sintiera pensada, no solamente presentada.`,
    workedWell: `Siento que STRØ logró transmitir una identidad muchísimo más sólida y autoral que muchos estudios reales que investigué. Especialmente funcionó el control visual, el ritmo de lectura, la sensación editorial, la dirección de arte, la coherencia entre arquitectura y UI, y la narrativa contemplativa.
Me gustó mucho cómo el sitio logra sentirse premium sin depender de efectos exagerados. La experiencia se apoya mucho más en composición, spacing, tono, jerarquía y estructura que en animaciones o artificios visuales. Además, creo que fue uno de los primeros proyectos donde realmente entendí que diseñar también es saber contenerse.`,
    tradeoffs: `La búsqueda de sofisticación y silencio visual tuvo costos. Por momentos el sitio prioriza la atmósfera por encima de la velocidad de exploración. La navegación no está optimizada para consumo rápido, está diseñada para recorrerse con calma.
También sacrifiqué funcionalidades más comerciales como filtros avanzados, búsqueda, exploración rápida de proyectos, CTAs agresivos y alta densidad de información. Otro tradeoff fue el tono, el lenguaje filosófico y contemplativo ayuda muchísimo a construir identidad, pero también hace que el proyecto se dirija a un tipo de cliente muy específico. Siento que todavía podría haber explorado más cómo combinar brutalismo editorial y UX contemporánea sin perder claridad.`,
    differentToday: `Trabajaría todavía más la dimensión interactiva del proyecto. Me gustaría explorar transiciones más arquitectónicas, microinteracciones relacionadas al espacio y la materialidad, una navegación más inmersiva, cambios sutiles de ritmo entre secciones y motion más integrado a la narrativa.
También profundizaría más el sistema visual de proyectos, para que cada obra tenga todavía más identidad propia sin romper la coherencia global del estudio. Y probablemente replantearía algunos aspectos de accesibilidad y legibilidad, porque parte de la búsqueda estética llevó ciertos contrastes y tamaños tipográficos al límite.`,
    demonstrates: `STRØ demuestra mi capacidad para diseñar experiencias editoriales sofisticadas con extrema contención visual, controlando ritmo, jerarquía y atmósfera a través de composición, tipografía y silencio. También evidencia mi entendimiento de que diseñar no es agregar. Es decidir qué no va a aparecer y mi habilidad para traducir disciplinas analógicas como la arquitectura de autor al lenguaje digital sin trivializarlas ni convertirlas en plantillas genéricas.`,
    criteriaLevel: 'Demo Conceptual',
    criteriaInsight: 'Diseñar para arquitectura de autor es diseñar con silencio. Menos elementos, más presencia.',
    repoFront: 'https://github.com/DanielVega1221/STRO',
    tools: ['React', 'Vite', 'React Router', 'CSS vanilla', 'Lenis']
  },
  {
    id: 'zabira-studio',
    title: 'Zabira Studio',
    subtitle: 'Plataforma de gestión y experiencia digital para estudio de pilates premium',
    year: '2026',
    chapterNumber: '05',
    tagline: 'Sustitución de una plataforma externa de gestión fitness por un sistema propio que combina branding premium con un motor de reservas atómico y concurrencia optimizada.',
    type: 'personal',
    url: 'https://zabira-theta.vercel.app/',
    pointOfDeparture: `Zabira arrancó como un proyecto para un estudio de pilates que nos contactó porque quería independizarse de las plataformas externas de gestión fitness. El cliente no pudo seguir por motivos de presupuesto, pero la investigación que hicimos y la arquitectura que ya teníamos armada tenían mucho valor. En lugar de dejarlo ahí, decidí convertir esa base en una demo conceptual completa y bien pulida, con todo lo que la propuesta original no iba a tener. La idea era mostrar el tipo de sistema que podíamos construir con branding premium, reservas atómicas, roles y MercadoPago. Algo que sirviera para comercializar lo que habíamos trabajado y mejorado.`,
    investigation: `Las plataformas existentes resolvían la gestión operativa, pero generaban varios problemas: 
    
    - Interfaces lentas y poco intuitivas
    - Experiencia genérica sin identidad de marca
    - Poca flexibilidad
    - Dashboards sobrecargados
    - Dependencia de terceros 
    - Fricción para reservar clases 
    
    El estudio buscaba una plataforma propia donde la experiencia se sintiera alineada al espacio físico, los clientes pudieran autogestionarse fácilmente, los instructores tuvieran herramientas simples y toda la operación estuviera centralizada. Analicé sistemas de booking fitness, dashboards administrativos y flujos de onboarding de clientes. También entendí que Zabira no competía por precio, sino por experiencia, percepción y exclusividad.`,
    insight: `La decisión más importante fue separar completamente dos experiencias: la landing pública (enfocada en branding, confianza y percepción premium) y el dashboard interno (enfocado en claridad, velocidad y funcionalidad pura). Esto evitó un error muy común: hacer dashboards "demasiado visuales" pero incómodos para operar diariamente. La landing sí podía ser emocional, elegante y narrativa, mientras que el sistema interno debía ser rápido, entendible y sumamente operativo. También entendí que la reserva de clases no era solamente una transacción sino que tambien era un momento de ansiedad para el cliente que quería asegurar su lugar. Si el sistema fallaba en ese instante, toda la percepción premium se venía abajo.`,
    options: [
      { title: 'Seguir con la plataforma externa', text: 'Sin costo de desarrollo, pero seguía limitando la identidad de marca y la experiencia del cliente.' },
      { title: 'Sistema de reservas simple + landing separada', text: 'Más rápido de desarrollar, pero la desconexión entre ambas experiencias iba a generar fricción y pérdida de contexto.' },
      { title: 'Plataforma integral propia', text: 'Mayor inversión inicial, pero control absoluto de la experiencia, la marca, la operación y los datos del negocio.' }
    ],
    decision: `Diseñé la landing pública como una experiencia de marca antes que informativa, explicando el beneficio emocional, simplificando el onboarding y reduciendo la fricción. La narrativa vendía tranquilidad y bienestar bajo secciones como "Pilates consciente" o "Un solo plan, todas las clases". Para el sistema interno, definí una arquitectura de roles clara: Clientes, Instructores, Administradores y Superadmin. A nivel técnico, resolví la concurrencia del booking mediante un sistema de reservas atómico usando operaciones atómicas en MongoDB ($expr, findOneAndUpdate y subdocumentos embebidos). Esto evitó locks, colas y transacciones complejas. Integré la lógica de membresías de Mercado Pago mediante webhooks y referencias únicas para la activación automática y control de acceso. Para la seguridad, implementé autenticación JWT con tokens almacenados de forma segura.`,
    workedWell: `La landing pública terminó siendo uno de los puntos más fuertes, transmitiendo exclusividad y calma sin caer en la estética fitness genérica. La arquitectura de roles y separación de permisos fue sumamente sólida y escalable, permitiendo que cada usuario viera solo lo relevante y accionable. También funcionó de manera excelente la experiencia responsive, ya que toda la plataforma fue pensada desde cero para mobile y no simplemente adaptada.`,
    tradeoffs: `Los dashboards fueron diseñados priorizando estrictamente la claridad, rapidez y usabilidad por encima de animaciones, complejidad visual o estética experimental. Fue una decisión de producto consciente. A nivel técnico, la principal deuda del proyecto fue la ausencia de TypeScript en el backend y la falta de testing automatizado, especialmente de integración para la lógica de auth, pagos y booking concurrente. Aunque funcionaba correctamente, requería testing manual exhaustivo en entornos de prueba. También sacrificamos funcionalidades como notificaciones push nativas o recordatorios automáticos, que hubieran mejorado la experiencia del cliente pero quedaron fuera del alcance inicial.`,
     differentToday: `Migraría el backend completamente a TypeScript. Agregaría tests automatizados de integración desde el inicio. Modularizaría más la lógica de pagos de Mercado Pago para independizarla de la lógica de membresías. Mejoraría sustancialmente la observabilidad y el logging para monitorizar errores en producción con mayor facilidad. Y probablemente exploraría una arquitectura de notificaciones y recordatorios automatizados para reducir aún más la fricción del cliente.`,
    criteriaLevel: 'Sistema en Producción',
    criteriaInsight: 'Una landing vende. Un dashboard opera. Conectados, potencian la experiencia final.',
    repoFront: 'https://github.com/DanielVega1221/Zabira',
    repoBack: 'https://github.com/DanielVega1221/ZabiraBack',
    tools: ['React', 'Vite', 'React Router', 'Node.js', 'Express', 'MongoDB', 'MercadoPago SDK', 'JWT', 'CSS vanilla']
  },
  {
    id: 'content-studio',
    title: 'Content Studio',
    subtitle: 'Motor de plantillas y sistema de composición interna',
    year: '2026',
    chapterNumber: '06',
    tagline: 'Un pequeño sistema operativo de contenido basado en código que permite crear, renderizar en iframe aislado y exportar carruseles e imágenes sin salir del cliente.',
    type: 'tool',
    pointOfDeparture: `UXnicorp necesitaba producir contenido para redes de forma consistente, rápida y reutilizable. El flujo existente dependía de múltiples herramientas separadas: Canva para diseño, documentos para copies, hojas sueltas para ideas, métricas manuales y assets dispersos. El verdadero problema no era crear un post. Era sostener un sistema de contenido coherente a largo plazo. Cada publicación implicaba rehacer layouts, copiar estilos manualmente, duplicar trabajo, perder consistencia visual y no tener trazabilidad de rendimiento. La necesidad terminó siendo mucho más cercana a construir un pequeño "content operating system" que a crear un simple editor visual.`,
    investigation: `Analicé herramientas como Canva, Buffer, Later, Figma, editores HTML visuales y sistemas de templates. Detecté que el diseño no era reutilizable de verdad: las herramientas reutilizaban "slides", no sistemas. Duplicar requería intervención manual. El contenido visual y el copy estaban separados, fragmentando el flujo creativo. Los templates eran sumamente rígidos, limitando la validación, el tipado o la generación automática de formularios basados en datos. Y las herramientas priorizaban usuarios no técnicos, limitando el control fino sobre el layout, CSS y exportación. Entendí que el verdadero problema no era "crear imágenes", sino construir un sistema capaz de producir contenido consistente sin rehacer trabajo constantemente.`,
    insight: `El insight principal fue que el contenido escalable funciona de manera muy similar al software. El diseño debía ser parametrizable, los layouts reutilizables, el contenido estructurado y el sistema debía entender variables y presets. Comprendí que Canva resuelve la creación puntual pero no la producción sistemática. Buffer resuelve la programación pero no la creación visual. Y Figma resuelve el diseño pero no la exportación automatizada. La herramienta que necesitábamos no existía en ninguna de esas categorías. Estaba en la intersección de las tres.`,
    options: [
      { title: 'Seguir usando Canva + herramientas sueltas', text: 'Ventaja: sin costo de desarrollo. Desventaja: trabajo duplicado, inconsistencia visual, sin trazabilidad de rendimiento ni reutilización real.' },
      { title: 'Editor visual puro (tipo Canva interno)', text: 'Ventaja: UX más simple para usuarios no técnicos. Desventaja: muy difícil lograr reutilización real y control fino sobre layouts y CSS.' },
      { title: 'Templates tipados + renderizado HTML/CSS + editor de código', text: 'Ventaja: máxima flexibilidad, reutilización real, control absoluto sobre el rendering y la exportación. Desventaja: arquitectura más compleja de construir y mantener.' }
    ],
    decision: `Construí un sistema híbrido que combina editor visual, editor de código, templates tipados, renderizado aislado y exportación en el cliente. A nivel de arquitectura: 1) Renderizado en iframe aislado usando srcdoc y sandboxing para evitar contaminación de estilos globales y garantizar fidelidad entre preview y exportación. 2) Integración de Monaco Editor como core para una DX profesional (syntax highlighting, undo stack, shortcuts). 3) Sistema de templates tipados donde cada plantilla declara variables, tipos, defaults y validaciones, generando el formulario de edición dinámicamente. 4) Exportación client-side total utilizando html-to-image, canvas y JSZip, evitando servidores con Puppeteer o procesamiento remoto.`,
    workedWell: `El sistema de templates fue un acierto rotundo, transformando layouts estáticos en estructuras totalmente configurables. La mezcla fluida entre editor visual y código dio una velocidad creativa excelente con absoluto control técnico. El pipeline de exportación fue sumamente preciso, eliminando por completo los problemas típicos de renderizado inconsistente entre preview y descarga. El sistema de slides facilitó la creación de carruseles de forma natural y el tipado de templates evitó errores de configuración que antes eran comunes.`,
    tradeoffs: `El bundle inicial resultó sumamente pesado debido a Monaco Editor y las librerías de rendering, lo cual era aceptable al ser una herramienta interna pero requeriría code splitting para uso público. El parsing HTML/CSS a través de html-to-image es frágil en ciertos navegadores móviles o restrictivos. SQLite como almacenamiento de presets limitaba el crecimiento y la colaboración real multiusuario. Y el sistema carecía de autenticación nativa por ser de uso interno, lo que impedía cualquier escenario remoto.`,
    differentToday: `Separaría más claramente el motor de rendering del editor visual para construir un core completamente desacoplado con plugins y adaptadores. Implementaría una solución híbrida de renderizado: manteniendo la exportación en cliente por velocidad, pero agregando soporte opcional con Puppeteer y colas en el backend para dispositivos con pocos recursos. Escalaría la base de datos a PostgreSQL implementando autenticación para abrir la herramienta a múltiples usuarios de forma remota. Y mejoraría el sistema de preview en tiempo real para que los cambios en el código se reflejen instantáneamente sin perder estado del formulario.`,
    criteriaLevel: 'Herramienta Interna',
    criteriaInsight: 'Escalar contenido no es diseñar más rápido. Es dejar de diseñar desde cero cada vez.',
    repoFront: 'https://github.com/DanielVega1221/Content-Studio',
    tools: ['React', 'Vite', 'TypeScript', 'Express', 'Drizzle ORM', 'libSQL', 'Monaco Editor', 'html-to-image', 'JSZip', 'Zustand', '@dnd-kit', 'Tailwind CSS']
  },
  {
    id: 'uxnicorp-academy',
    title: 'UXnicorp Academy',
    subtitle: 'Construyendo un curso moderno de desarrollo web con Astro',
    year: '2025',
    chapterNumber: '07',
    tagline: 'Una plataforma educativa orientada a performance que demuestra con su propia arquitectura los principios de velocidad, simplicidad y Zero-JS que enseña.',
    type: 'career',
    url: 'https://astro-curso-u-xnicorp.vercel.app/',
    pointOfDeparture: `La mayoría de los cursos de desarrollo web en español compartían varios problemas: contenido desactualizado, demasiada teoría pasiva, malas performances y plataformas sumamente pesadas cargadas de JavaScript que penalizaban Core Web Vitals. En UXnicorp necesitaban una forma consistente de onboardear desarrolladores, documentar su stack de trabajo y enseñar su metodología de diseño centrado en producto. Decidí construir un recurso educativo de altísima calidad, pensado para el equipo pero abierto a cualquiera que quisiera aprender. Sin logins, sin pagos, sin trabas. Si a alguien más le servía, mejor.`,
    investigation: `Analicé plataformas como freeCodeCamp, Udemy, Coursera, MDN y tutoriales de YouTube. Observé cuatro problemas principales:

    - Demasiado video pasivo, lo que reduce la retención y dificulta la consulta rápida de conceptos. 
    - Performance ignorada: plataformas educativas que usaban SPAs pesadas enseñando, paradójicamente, buenas prácticas frontend. 
    - Ejemplos estáticos o no editables, separando drásticamente la teoría de la práctica. 
    - Abstracción temprana: cursos que enseñaban React antes de explicar HTML, el DOM o cómo funciona realmente un navegador.

    Entendí que el curso tenía que sentirse rápido, claro, progresivo e interactivo. Y técnicamente, el producto debía ser el reflejo de sus enseñanzas: si enseñás performance, la web debe cargar instantáneamente.`,
    insight: `Definí principios clave: Zero-JS donde no haga falta (sin cargar SPAs pesadas para texto estático), interactividad progresiva (React únicamente donde aporte valor: playgrounds, demos, toggle de temas), contenido primero y aprendizaje no lineal sin backend innecesario. El proyecto hizo evidente algo que ya venía pensando y es que la arquitectura también comunica criterio. No podés enseñar buenas prácticas de rendimiento en una web lenta.`,
    options: [
      { title: 'Next.js (App Router)', text: 'Ventaja: excelente ecosistema y SSR maduro. Desventaja: demasiado overhead y JavaScript innecesario para un sitio de contenido estático.' },
      { title: 'Gatsby', text: 'Ventaja: orientado a contenido. Desventaja: DX menos moderna y tiempos de build sumamente lentos.' },
      { title: 'Astro (Islands Architecture)', text: 'Ventaja: renderiza HTML estático, elimina JS innecesario, performance excelente y perfecto para contenido educativo. Desventaja: ecosistema más nuevo y ciertas limitaciones en interactividad compleja.' }
    ],
    decision: `Elegí Astro como el core del proyecto. Esto me permitió crear contenido estático ultrarrápido y añadir interactividad encapsulada a través de "React Islands" en playgrounds y componentes interactivos como el toggle de tema o el visor de código. Para evitar un backend innecesario, mantuve el sitio completamente estático con Astro en modo SSG, sin base de datos ni APIs externas. La decisión de no tener auth ni backend no fue solo técnica: quería que cualquiera pudiera entrar y aprender sin fricción. La búsqueda, el progreso y la autenticación quedaron fuera del alcance inicial para priorizar la velocidad y simplicidad del deploy. Tiempo después migré el contenido a MDX + Content Collections, separando el contenido de la estructura y haciendo el proyecto más mantenible.`,
    workedWell: `Astro + Islands fue la decisión correcta. El sitio es rapidísimo, las demos interactivas suman sin hacerlo pesado, y no tener auth ni backend no solo simplifica todo sino que lo deja abierto para cualquiera que quiera aprender.`,
    tradeoffs: `Sin backend se pierde seguimiento de progreso entre dispositivos.`,
    differentToday: `Me gustaría agregar más demos interactivas en otros módulos, no solo en CSS.`,
    criteriaLevel: 'Recurso Abierto',
    criteriaInsight: 'Si enseñás performance, tu web debe ser la prueba de que lo que decís funciona.',
    repoFront: 'https://github.com/DanielVega1221/AstroCursoUXnicorp',
    tools: ['Astro', 'React', 'Tailwind CSS', 'Lucide React', 'MDX']
  },
  {
    id: 'la-pagina-de-uxnicorp',
    title: 'La Página de UXnicorp',
    subtitle: 'El sitio web que vende exactamente lo que hacemos',
    year: '2026',
    chapterNumber: '08',
    tagline: 'Una plataforma diseñada a medida que actúa como demostración permanente de nuestro criterio, velocidad y transparencia comercial.',
    type: 'career',
    url: 'https://www.uxnicorp.com.ar/',
    pointOfDeparture: `UXnicorp es una agencia de desarrollo web. El problema era curioso: necesitábamos vender landing pages, e-commerce y sistemas a medida, pero todavía no teníamos una web que demostrara cómo trabajábamos. La página no podía ser solamente una tarjeta de presentación. Tenía que convertirse en una demostración real de nuestro criterio, proceso, calidad técnica y forma de diseñar experiencias. Si alguien nos contrataba, debía poder imaginar el resultado final viendo nuestro propio sitio. Así que construí la web de la agencia yo mismo.`,
    investigation: `Analicé sitios de agencias de desarrollo, estudios de diseño, freelancers senior y product studios. Encontré tres patrones repetidos: 

- Todos se parecían demasiado: azul corporativo, fondos oscuros genéricos, renders 3D de stock y slogans vacíos. Era imposible diferenciarlas. 
- Mucho discurso y poca evidencia: hablaban de "transformación digital" o "experiencias increíbles" pero mostraban muy poco trabajo real estructurado. 
- Casi nadie enseñaba cómo trabajaba: se veía qué hacían o cuánto costaba, pero rara vez la lógica técnica o cómo tomaban decisiones de arquitectura. 

Entendí que el sitio no debía actuar como un folleto, sino como una demostración. Cada sección tenía que probar algo: los casos probaban experiencia, la transparencia de precios filtraba leads y el UX Score demostraba nuestra metodología.`,
    insight: `Quería transmitir cercanía, criterio, honestidad, capacidad técnica y foco en resultados. Toda la arquitectura, performance y claridad comercial debía ser un reflejo exacto de lo que vendemos. Tomé una decisión poco común en agencias de desarrollo la cual fue mostrar los precios de forma transparente en la web. No como una tabla de "planes" genéricos, sino explicando exactamente qué incluye cada tipo de proyecto, cuánto cuesta y por qué. La hipótesis era que esto filtraría naturalmente a los prospectos que llegaban, los que solo buscan precio barato se van solos y los que valoran la calidad llegan con expectativas alineadas.`,
    options: [
      { title: 'Plataformas No-Code (Webflow, Wix)', text: 'Ventaja: menor tiempo de desarrollo. Desventaja: contradicción difícil de justificar (vender desarrollo a medida usando un builder visual de terceros) y limitaciones técnicas para herramientas interactivas como el UX Score.' },
      { title: 'Next.js con desarrollo propio a medida', text: 'Ventaja: control técnico total, dogfooding de nuestro stack, optimización extrema y libertad absoluta para crear herramientas interactivas. Desventaja: mayor tiempo de desarrollo y mantenimiento.' }
    ],
    decision: `Construí el sitio completo desde cero utilizando Next.js, React, TypeScript y Tailwind CSS. Para diferenciarnos de otras agencias, diseñé el UX Score: un cuestionario interactivo donde el visitante responde preguntas guiadas sobre velocidad, claridad y objetivos de su web, y recibe un diagnóstico con puntuación, recomendaciones y prioridades de mejora. Esto no solo demostraba nuestro conocimiento técnico, sino que generaba un lead magnet natural y genuinamente útil. Para el scroll y las transiciones incorporé Framer Motion y Lenis, optimizando de forma exhaustiva assets y bundle. La arquitectura de la página fue pensada como un embudo narrativo: cada sección construye sobre la anterior, guiando al visitante desde "¿quiénes son?" hasta "quiero trabajar con ellos".`,
    workedWell: `El sitio web se convirtió en nuestra mejor carta de presentación, demostrando que aplicamos lo que aconsejamos. El UX Score nos trajo algunos leads de calidad: la gente llegaba a la conversación con un diagnóstico en mano y un contexto previo, lo que mejoró mucho el nivel de las primeras charlas. La transparencia de precios redujo a cero las reuniones improductivas con clientes fuera de presupuesto. Y la página en sí misma funcionó como portafolio viviente: cada visita al sitio ya estaba experimentando nuestro trabajo.`,
    tradeoffs: `Desarrollar y mantener el sitio a medida consumió más tiempo de diseño y código que una solución no-code. Las animaciones con Framer Motion y el smooth scroll de Lenis aumentaron el peso inicial, requiriendo optimización extra para mantener buenas puntuaciones en Lighthouse. La internacionalización manual requirió mantenimiento estructurado. Y el UX Score, al estar tan visible en la página, requería atención constante para no quedar desactualizado.`,
    differentToday: `Mejoraría el sistema de analíticas internas para medir con mayor precisión el comportamiento de usuarios en el embudo del UX Score. Diseñaría un sistema dinámico de contenido para incorporar blog o notas técnicas sin deploys manuales. Refactorizaría la estructura de traducción para soportar más idiomas de forma modular. Y probablemente replantearía algunas decisiones de animación para reducir dependencia de librerías externas en secciones donde CSS puro sería suficiente.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'Mostrar los precios filtra mejor que cualquier formulario. La transparencia es el mejor lead magnet.',
    repoFront: 'https://github.com/DanielVega1221/PortafolioUXnicorp',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lenis', 'Lucide React']
  },
  {
    id: 'myvisor',
    title: 'MyVisor',
    subtitle: 'Lector Markdown centrado en la experiencia de lectura',
    year: '2026',
    chapterNumber: '09',
    tagline: 'Un lector de Markdown deployado como web app. Permite leer documentos desde una biblioteca pública sin registro, o abrir archivos locales con la File System Access API. Experiencia editorial, privada y sin fricción.',
    type: 'tool',
    url: 'https://my-visor.vercel.app/',
    pointOfDeparture: `Gran parte de las herramientas que usan Markdown fueron diseñadas estrictamente para escribir, no para leer de forma prolongada. Obsidian, Notion, VS Code y Typora funcionan, pero comparten los mismos problemas: interfaces sumamente cargadas, demasiados controles visuales que distraen, foco excesivo en la edición de código y poca atención a la ergonomía de lectura. Yo quería poder leer mis apuntes de programación desde cualquier dispositivo sin instalar nada. Entrar a una URL, ver mis notas, y que la experiencia de lectura fuera tan cómoda como un libro. Y de paso, si alguien más llegaba al link y le servía, que aprenda.`,
    investigation: `Revisé alternativas como Obsidian, Typora, Notion, VitePress, Docusaurus y lectores de EPUB. Observé que la lectura era siempre una función secundaria frente al editor de texto. Casi todas las soluciones almacenaban datos en servidores externos o requerían telemetría. Y el diseño visual de los lectores Markdown era sumamente genérico: fondos blancos planos, tipografías estándar y layouts rígidos. Entendí que el problema no era Markdown, sino la experiencia de lectura. Quería construir algo que tratara al texto con el respeto visual de una publicación editorial.`,
    insight: `Cuando el producto existe para consumir contenido, el diseño deja de ser decoración y pasa a ser funcionalidad pura. Decidí diseñar una solución basada en tres principios innegociables: privacidad absoluta (los archivos nunca salen del navegador), lectura ergonómica prolongada (tipografía, ritmo, contraste y ancho de línea controlados) y simplicidad radical (cero backend, cero cuentas, carga instantánea). La experiencia no necesitaba features. Necesitaba atmósfera y foco.`,
    options: [
      { title: 'Opción A: Plugin de Obsidian', text: 'Gran ecosistema, pero el foco de la interfaz está en la edición y tiene telemetría. La lectura seguía sintiéndose como una función secundaria.' },
      { title: 'Opción B: Custom theme de Typora', text: 'Buena experiencia de lectura, pero es de pago y no permite abrir carpetas locales completas para navegación fluida entre documentos.' },
      { title: 'Opción C: Aplicación web propia con Vanilla JS', text: 'Control absoluto del diseño. Privacidad 100% verificable. Experiencia diseñada exclusivamente para lectura. Sin dependencias externas.' }
    ],
    decision: `Construí MyVisor como una SPA en Vanilla JS deployada en Vercel. Para mis propios apuntes de programación armé una biblioteca pública con documentos servidos estáticamente: entro desde cualquier lado y ya estoy leyendo. Para archivos locales usé la File System Access API que permite abrir carpetas directamente desde el navegador. Y para Firefox o Safari, que no soportan esa API, agregué un fallback para subir un archivo .md suelto. A nivel de diseño, adopté una estética editorial clásica: paleta oscura cálida, acentos dorados sutiles, tipografía serif con ancho de línea controlado, márgenes generosos y una barra de progreso sutil que guía la lectura sin distraer. La aplicación completa cabe en poco más de 300 líneas de código y no requiere registro ni configuraciones.`,
    workedWell: `La biblioteca pública logró exactamente lo que buscaba: subo mis apuntes de programación, entro desde el celular o la compu y los leo sin fricción. La performance es instantánea al no cargar runtime de frameworks ni hidrataciones. La barra de progreso, simple pero efectiva, mejoró sustancialmente la experiencia de lectura prolongada. Y el diseño tipográfico con serif y márgenes amplios logró recrear la sensación física de leer un libro, haciendo que sesiones largas de lectura fueran genuinamente placenteras en pantalla.`,
    tradeoffs: `La File System Access API solo funciona en navegadores basados en Chromium (Chrome, Edge, Opera, Brave). Para Firefox y Safari agregué un fallback de archivo suelto, pero no pueden abrir carpetas completas. Al ser JS puro sin framework, no hay enrutamiento profundo, persistencia remota ni tipado estático. La ausencia de TypeScript fue una decisión deliberada para mantener el código mínimo, pero sacrifica robustez. El alcance se limitó exclusivamente a lectura: sin edición, sin búsqueda dentro de documentos, sin sincronización. Y la biblioteca pública requiere regenerar el índice manualmente cada vez que agrego o modifico documentos.`,
    differentToday: `Migraría el código a TypeScript para ganar robustez sin sacrificar lo mínimo del output. Optimizaría Highlight.js para que cargue solo los lenguajes que usa cada documento, bajando el peso del bundle. Y sumaría un modo foco que oculte todo el chrome del navegador para sesiones largas de lectura.`,
    criteriaLevel: 'Herramienta Personal',
    criteriaInsight: 'Cuando el producto es leer, el diseño no es decoración. Es funcionalidad pura.',
    repoFront: 'https://github.com/DanielVega1221/MyVisor',
    tools: ['Vanilla JS', 'Vite', 'File System Access API', 'marked', 'DOMPurify', 'Highlight.js']
  },
  {
    id: 'electropower',
    title: 'ElectroPower',
    subtitle: 'Presencia digital industrial',
    year: '2025',
    chapterNumber: '10',
    tagline: 'Diseño y puesta en marcha de la primera web de una empresa de servicios eléctricos industriales, alineando su presencia digital con su canal natural de comunicación.',
    metric: 'Antes: sin presencia digital. Después: sitio web con posicionamiento local y flujo directo vía WhatsApp.',
    type: 'real',
    url: 'https://www.electropowerok.com.ar/',
    pointOfDeparture: `ElectroPower es una empresa de servicios eléctricos industriales con amplia experiencia prestando servicios a compañías como Edenor, Edesur, YPF y Grupo Galán. A pesar de su trayectoria y del nivel de sus clientes, el negocio prácticamente no existía en internet. No tenían sitio web, ni portfolio, ni presencia profesional propia. Los nuevos clientes llegaban exclusivamente por recomendaciones. Si alguien buscaba servicios de instalaciones eléctricas industriales en su zona, la empresa simplemente no aparecía. Queríamos resolver esto sin imponerles un sistema que no fueran a usar.`,
    investigation: `Analizamos competidores locales, instaladores industriales y servicios técnicos contratistas en Zona Norte. Descubrimos que la mayoría dependía enteramente de redes sociales o usaba plantillas obsoletas de WordPress. Casi nadie mostraba trabajos reales ejecutados: solo listaban servicios de forma teórica. Las interfaces eran lentas, confusas y poco optimizadas para móviles. Pero lo más importante fue entender que el canal real donde ocurría toda la comunicación del negocio (coordinación, presupuestos, consultas) era WhatsApp. Intentar cambiar ese flujo por formularios de tickets o CRMs iba a generar fricción innecesaria. La web no debía reemplazar WhatsApp. Debía alimentarlo con clientes mejor informados.`,
    insight: `En el sector de servicios industriales, el verdadero producto que se vende es la confianza. El cliente no contrata una web: contrata electricistas para trabajar en infraestructura que no puede fallar. La web, entonces, debía funcionar como evidencia empírica. No alcanzaba con decir "somos confiables": había que mostrar las obras ejecutadas y los clientes para los que ya trabajaban (Edenor, Edesur) para generar credibilidad inmediata. WhatsApp era el destino final innegociable de todos los canales de contacto. No tenía sentido luchar contra el flujo natural del negocio.`,
    options: [
      { title: 'Campañas exclusivas en redes sociales', text: 'Ventaja: bajo costo y rápida implementación. Desventaja: sin visibilidad orgánica en Google, sin control sobre los datos y sin presencia institucional propia.' },
      { title: 'WordPress con plantilla genérica', text: 'Ventaja: fácil edición de contenido. Desventaja: nula diferenciación de marca, dependencia de plugins y rendimiento comprometido.' },
      { title: 'Sitio a medida optimizado', text: 'Ventaja: identidad corporativa propia, control absoluto del código, SEO local óptimo y portfolio real estructurado. Desventaja: mayor tiempo de desarrollo inicial.' }
    ],
    decision: `Diseñamos y desarrollamos un sitio web a medida enfocado en generar confianza inmediata. Estructuramos la página alrededor de un catálogo detallado de servicios técnicos (instalaciones, mantenimiento industrial, refrigeración) complementado con un portfolio visual de obras ejecutadas con fotografías reales. Implementamos redirección a WhatsApp desde los CTAs de servicios, el formulario de contacto y un botón flotante persistente. Los botones del Hero guían al usuario hacia las secciones de servicios y contacto, donde la conversación deriva naturalmente a WhatsApp. Para mantener una experiencia visual sólida sin penalizar el rendimiento, aplicamos animaciones discretas con GSAP únicamente en el Hero y la sección de contacto, manteniendo el resto del sitio ligero y rápido. Toda la web fue pensada para cargar velozmente y rankear bien en búsquedas locales.`,
    workedWell: `El sitio transformó drásticamente la percepción del negocio, posicionándolo visualmente al nivel de las grandes empresas a las que ya brindaba servicios. El portfolio de obras ejecutadas demostró ser la sección de mayor conversión: los clientes podían ver la calidad de los trabajos antes de consultar. El flujo hacia WhatsApp fue adoptado inmediatamente sin capacitación necesaria. Y se logró una indexación local excelente que puso a la empresa en el mapa para búsquedas relevantes en su zona.`,
    tradeoffs: `Al construir la web sin CMS, cualquier actualización de portfolio o cambio de textos requiere intervención del desarrollador. Fue una decisión deliberada de simplicidad y rendimiento, pero sacrificó autonomía del cliente. Tampoco integramos scripts de analítica pesados para mantener la performance impecable, lo que limita la recopilación de datos de comportamiento. Y el alcance visual se mantuvo conservador: no quisimos imponer una estética demasiado "de agencia" a un negocio industrial donde la sobriedad y la seriedad son activos.`,
    differentToday: `Implementaría un CMS headless ligero que no penalice la velocidad pero le dé autonomía al cliente para actualizar fotos de obras sin depender de nosotros. Y sumaría un panel simple de analítica enfocada en conversiones a WhatsApp para medir el retorno real sin tracking invasivo.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'En servicios industriales, la web no vende servicios. Vende la tranquilidad de que no va a fallar.',
    repoFront: 'https://github.com/uxnicorp/ElectroPower',
    tools: ['React', 'Vite', 'React Router', 'GSAP', 'CSS vanilla', 'WhatsApp']
  },
  {
    id: 'jimena-vilte',
    title: 'Jimena Vilte Nail Artist',
    subtitle: 'Identidad digital y landing premium para marca personal',
    year: '2026',
    chapterNumber: '11',
    tagline: 'Cómo escapar de la saturación visual de Instagram diseñando una landing page editorial minimalista que eleva la percepción de valor de una marca personal.',
    metric: 'Antes: solo Instagram entre 500 cuentas iguales. Después: landing editorial propia que le permitió subir sus tarifas.',
    type: 'real',
    url: 'https://landing-page-jimena-vitel.vercel.app/',
    pointOfDeparture: `La mayoría de las nail artists en Argentina compite de la misma manera, publican cientos de fotos sin clasificar en Instagram, responden precios por WhatsApp y se adaptan a formatos que no controlan. Jimena Vilte tenía un nivel de servicio, atención y calidad muy superior al promedio, pero online se veía igual que cualquier otra. Su diferencial real, el cuidado, el ambiente del estudio, la experiencia completa, se perdía en un feed de Instagram que premia volumen sobre profundidad. El desafío no eran funcionalidades complejas. Era construir percepción de valor premium antes del primer mensaje.`,
    investigation: `Analicé la competencia en el sector beauty de Argentina. Las profesionales compartían los mismos problemas, como la dependencia total de Instagram que las dejaba a merced del algoritmo, tener que explicar los mismos servicios una y otra vez por WhatsApp, y competir solo por precio porque no había un posicionamiento que las diferenciara. Ahí entendí que el sitio no tenía que competir con Instagram haciendo lo mismo. Las clientas ya veían cientos de fotos de uñas ahí. La web tenía que contar otra cosa, contar cómo es la experiencia del servicio, el cuidado, el ambiente del estudio. Tenía que subir la conversación de "¿cuánto sale?" a "quiero vivir eso".`,
    insight: `Para construir una marca premium hay que saber eliminar. Decidí que la web no debía ser un catálogo ruidoso ni una réplica pobre de Instagram con otro dominio. Debía construirse como una publicación de lifestyle o moda de alta gama, con una paleta de color sumamente controlada (charcoal, off-white y beige, escapando de los rosas y lilas del sector), ritmo visual respirable con mucho whitespace, fotografía editorial de altísima calidad y un tono de comunicación sereno y exclusivo. Instagram pasó a ser la fuente de descubrimiento y el sitio web, el destino de decisión de compra.`,
    decision: `Diseñé y desarrollé una landing page editorial con Next.js, React, TypeScript y Tailwind CSS. Sin CMS, sin e-commerce, sin sistema de turnos. Todo el peso de la experiencia está puesto en transmitir el ritual y la calma del estudio a través de fotografía editorial, tipografía cuidada y scroll fluido con Lenis. Decidí no publicar precios. La idea es que la potencial clienta primero entienda lo que hace Jimena, cómo trabaja, qué ambiente tiene, y recién después pregunte por el costo. Framer Motion lo usé solo para animaciones de entrada muy sutiles, lo justo para dar sensación premium sin exagerar.`,
    workedWell: `El sitio transformó el posicionamiento de Jimena de forma inmediata. Le permitió elevar sus tarifas y captar clientas que llegan valorando la calidad del servicio antes que el descuento. La paleta minimalista y la composición editorial se destacaron radicalmente frente a la saturación visual de la competencia. WhatsApp siguió funcionando como el flujo operativo natural del negocio, pero con una diferencia fundamental, y es que ahora las clientas llegan cualificadas, informadas y con intención de compra clara. El sitio no reemplazó el canal. Lo mejoró.`,
    tradeoffs: `No publicar precios tiene un riesgo, y es perder a la que viene solo a comparar tarifas rápido y se va. Es un filtro, pero también una pérdida potencial. Lenis y Framer Motion suman peso en KB, está optimizado pero en redes lentas se siente. Y mantener el sitio como landing estática, sin blog ni galería actualizable, fue a propósito, pero deja a Jimena dependiendo de nosotros para cualquier cambio.`,
    differentToday: `Exploraría un sistema mínimo de colecciones o lookbooks editoriales para que Jimena pueda mantener el contenido fresco sin depender de nosotros, pero sin romper la simplicidad visual que hace que el sitio funcione. También agregaría una micro-guía visual de técnicas (Gel, Acrílico, Kapping) para resolver de una las preguntas más repetitivas que llegan por WhatsApp.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'Para destacar en un mercado saturado de Instagram, no necesitás más fotos. Necesitás mostrar lo que las fotos no cuentan.',
    options: [
      { title: 'Depender enteramente de Instagram', text: 'Gratuito, de alcance inmediato y ya instalado en el hábito de las clientas. Pero limita el formato a lo que la plataforma permite, diluye el diferencial de marca y deja el negocio a merced de cambios de algoritmo.' },
      { title: 'Sistema de reservas online automatizado', text: 'Muy funcional desde lo operativo: reduciría la carga de coordinar manualmente. Pero añade complejidad técnica innecesaria para un negocio unipersonal que ya funciona fluidamente vía WhatsApp con atención personalizada y cercana.' },
      { title: 'Landing page editorial con foco en marca', text: 'Diferenciación inmediata frente a la competencia, elevación real de la percepción de valor, canal propio innegociable y flujo natural hacia WhatsApp con clientas ya informadas y cualificadas.' },
      { title: 'Publicar precios de forma transparente', text: 'Filtraría rápidamente a quienes no pueden pagar el servicio, ahorrando tiempo. Pero condiciona la conversación al precio antes de que la clienta entienda el valor diferencial de la experiencia, la técnica y el cuidado.' },
      { title: 'Construir un e-commerce con tienda de productos', text: 'Abriría una línea de ingresos adicional con productos físicos o digitales relacionados. Pero desviaría el foco de la propuesta principal (el servicio de nail art premium) y requeriría logística, stock y mantenimiento.' },
      { title: 'Mantener el sitio como galería visual expandida', text: 'Más contenido visual, más densidad de imágenes y más ejemplos de trabajos. Pero replicaría exactamente la función de Instagram (donde las clientas ya consumen ese contenido) sin agregar el diferencial editorial y emocional.' },
      { title: 'Agregar CMS para autonomía de contenido', text: 'Le daría a Jimena la capacidad de actualizar fotos, textos y servicios sin depender del desarrollador. Pero añade complejidad técnica, costos de mantenimiento y riesgo de romper la coherencia visual editorial que hace que el sitio funcione.' }
    ],
    repoFront: 'https://github.com/DanielVega1221/LandingPage-JimenaVitel',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lenis']
  },
  {
    id: 'patagenda',
    title: 'PATAgenda',
    subtitle: 'Agenda de sumarios docentes',
    year: '2026',
    chapterNumber: '12',
    tagline: 'Desarrollo de una agenda full-stack que modela con precisión el lenguaje legal del Ministerio de Educación priorizando la privacidad de datos sensibles.',
    metric: 'Antes: papel y Excel sin trazabilidad. Después: sistema web con cero vencimientos olvidados.',
    type: 'particular',
    url: 'https://patagenda.vercel.app/login',
    pointOfDeparture: `La clienta supervisa expedientes disciplinarios docentes para el Ministerio de Educación. Su trabajo diario implica coordinar sumarios ordinarios, abreviados, mediaciones, incompatibilidades, audiencias y plazos legales con fechas límite que se extienden por meses. Antes de PATAgenda, la información vivía fragmentada entre planillas de Excel dispersas, carpetas de Outlook, archivos físicos y su propia memoria. Ninguna herramienta de productividad estándar (ni Trello, ni Notion, ni Google Calendar) entendía los estados, plazos y requerimientos específicos de un proceso sumarial docente. Además, los expedientes contienen datos sensibles y personales de docentes, así que la privacidad no era negociable. El plan inicial era que todo corriera en la computadora del Ministerio, pero decidimos deployarla online para que pudiera acceder tanto desde la PC como desde el celular cuando estaba fuera de la oficina.`,
    investigation: `Analicé en profundidad el flujo de trabajo diario de la clienta durante varias semanas. Descubrí que la mayoría de los gestores de tareas asumen flujos lineales y abstractos como "to-do", "in progress", "done". Pero un expediente sumarial sigue un ciclo de vida regulado con estados legales específicos y vencimientos fatales que, si se incumplen, tienen consecuencias jurídicas reales. No es un tablero Kanban. Es un calendario de obligaciones legales. Evalué opciones de infraestructura: los servicios cloud como Firebase o Supabase habrían acelerado el desarrollo, pero implicaban almacenar datos disciplinarios en servidores de terceros. La solución tenía que ser deployable pero con acceso restringido y controlado.`,
    insight: `La adopción de software no falla por motivos técnicos. Falla cuando el sistema no representa la forma de pensar del usuario. El modelo de datos debía hablar con precisión el lenguaje del Ministerio de Educación. En lugar de modelar estados abstractos como "pendiente" o "completado", diseñé conceptos de dominio legales reales: Sumario Ordinario, Sumario Abreviado, Mediación, Sobreseimiento, Sanción Grave, cada uno con sus plazos, vencimientos y restricciones específicas. Diseñar para una única usuaria también fue liberador, eliminó la necesidad de gestionar roles complejos o accesos concurrentes, y permitió enfocar toda la energía en pulir un producto que realmente le funciona.`,
    decision: `Desarrollé una aplicación full-stack con React, Vite y TanStack Query en el frontend, y Express, Prisma ORM y PostgreSQL en el backend. La deployamos en Vercel para que la clienta pudiera acceder desde cualquier dispositivo, tanto la PC del Ministerio como el celular. Para la seguridad implementé autenticación con JWT en cookies httpOnly y rate limiting en las rutas de autenticación. El modelo de dominio se diseñó a medida del lenguaje del Ministerio: Sumario Ordinario, Sumario Abreviado, Mediación, Sobreseimiento, Sanción Grave, cada uno con sus plazos y vencimientos específicos.`,
    workedWell: `La adopción de PATAgenda por parte de la clienta fue inmediata y sin fricción, porque el sistema hablaba exactamente su mismo idioma desde el primer día. No hubo curva de aprendizaje forzada ni necesidad de traducir conceptos del dominio legal a abstracciones de software. La eliminación de la dispersión de información, su mayor dolor cotidiano, redujo a cero los olvidos de vencimientos fatales. Y poder acceder desde el celular cuando no estaba en la oficina fue un plus que valoró muchísimo.`,
    tradeoffs: `Al estar deployada en la nube, los datos sensibles ya no residen exclusivamente en el equipo de la clienta, aunque el acceso está restringido por autenticación y las conexiones son sobre HTTPS. El hosting de PostgreSQL y Vercel tiene un costo mensual que antes no existía. Al depender de conexión a internet, si hay cortes de red el sistema queda inaccesible. La aplicación está modelada para una sola persona; escalarla para un equipo de inspectores requeriría reestructurar profundamente el modelo de datos y la gestión de permisos.`,
    differentToday: `Implementaría backups automatizados del PostgreSQL para tener copias de seguridad sin depender de procesos manuales.`,
    criteriaLevel: 'Sistema en Producción',
    criteriaInsight: 'El mejor sistema no es el más poderoso. Es el que habla el mismo idioma que la persona que lo usa.',
    repoFront: 'https://github.com/DanielVega1221/PATAgenda',
    repoBack: 'https://github.com/DanielVega1221/PATagendaBack',
    options: [
      { title: 'Gestores genéricos en la nube (Notion, Trello)', text: 'Rápido de configurar y sin desarrollo. Pero violaba los requisitos de privacidad al quedar datos sensibles en servidores de terceros, y obligaba a la clienta a adaptar procesos legales complejos a abstracciones genéricas que no representan su realidad.' },
      { title: 'Sistema cloud propio (Supabase, Firebase)', text: 'Menor complejidad de infraestructura y backups automatizados. Pero implicaba almacenar información disciplinaria confidencial de docentes en servidores externos, lo cual era inaceptable desde lo normativo y lo ético, independientemente de las promesas de seguridad del proveedor.' },
      { title: 'Aplicación full-stack autohosteada', text: 'Era el plan original. Los datos residirían exclusivamente en el equipo local bajo control directo de la clienta, con cero costos de SaaS. Pero la contra cara era perder acceso remoto y movilidad: solo podría usar el sistema desde esa computadora. Finalmente optamos por deployar en Vercel para ganar flexibilidad.' },
      { title: 'Diseño single-user sin concurrencia', text: 'Simplificó radicalmente la arquitectura eliminando roles, permisos, bloqueos de escritura y conflictos de edición. Permitió enfocar todo el esfuerzo en pulir la experiencia para una usuaria específica. Pero rigidizó el modelo: escalar a múltiples inspectores requeriría cambios estructurales profundos.' },
      { title: 'Seguridad con JWT httpOnly + rate limiting', text: 'Almacenar el token en cookie httpOnly, inaccesible desde JavaScript, mitigó el riesgo de XSS. El rate limiting previno abusos. No se implementó OAuth ni autenticación de dos factores porque, para una aplicación local de un único usuario, habría sido sobrediseñar sin beneficio real de seguridad.' }
    ],
    tools: ['React', 'Vite', 'React Router', 'TanStack Query', 'Express', 'Prisma ORM', 'PostgreSQL', 'JWT httpOnly', 'CSS Modules']
  },
  {
    id: 'ducksale',
    title: 'DuckSale',
    subtitle: 'E-commerce deportivo',
    year: '2026',
    chapterNumber: '13',
    tagline: 'Una demo de e-commerce deportivo funcional de punta a punta, construida para mostrarle a un cliente potencial la calidad de lo que hacemos sin comprometerlo desde el inicio.',
    type: 'personal',
    url: 'https://duck-sale-demo.vercel.app/',
    pointOfDeparture: `Un cliente nos contactó porque quería un e-commerce para su negocio de indumentaria deportiva. En lugar de mandarle un presupuesto abstracto o un PowerPoint, decidimos construir una demo. Que entrara, tocara, recorriera. La idea era simple: que pudiera experimentar su tienda como si ya existiera. Recorrer el catálogo, agregar al carrito, aplicar un cupón, completar el checkout y ver el panel de administración. Que sintiera el producto, no que lo imaginara.`,
    investigation: `Analicé flujos de compra en e-commerce deportivos como Nike, Adidas y tiendas locales argentinas. La mayoría de las demos que vi se quedaban en el catálogo de productos y no llegaban a simular el ciclo completo (carrito, checkout, confirmación, administración). También noté que los clientes suelen subestimar la complejidad de un e-commerce hasta que lo ven funcionando. Las tiendas deportivas tienen necesidades particulares como filtros por talle y color, variantes de producto y promociones por categoría, y un público que espera una experiencia de compra rápida y muy visual.`,
    insight: `Una demo de e-commerce no convence si solo muestra productos lindos. Convence cuando el cliente puede recorrer el flujo completo como si ya fuera su tienda. Incluir un panel de administración funcional fue clave, porque el cliente no solo ve lo que sus usuarios experimentarían sino también cómo gestionaría su negocio día a día. La demo no tenía que ser un catálogo. Tenía que ser una simulación.`,
    options: [
      { title: 'Landing estática con catálogo de productos', text: 'Más rápida de construir pero no mostraba el flujo de compra real. El cliente no iba a dimensionar la complejidad ni la calidad del trabajo final.' },
      { title: 'Shopify o Tiendanube de prueba', text: 'Rápido de configurar pero con identidad genérica. No demostraba nuestra capacidad de desarrollo a medida ni permitía personalizar la experiencia de administración.' },
      { title: 'SPA full-stack con backend real', text: 'Demasiado costoso en tiempo para una demo. Implicaba servidores, base de datos y deployments que el cliente todavía no había aprobado.' },
      { title: 'SPA con simulación completa client-side', text: 'Experiencia de compra real sin costo de infraestructura. Permitía mostrar catálogo, carrito, checkout, cupones y panel admin, todo funcionando sin backend.' }
    ],
    decision: `Construí una SPA en React, TypeScript y Tailwind con routing propio. El catálogo tiene filtros avanzados por categoría, marca, talle, color y precio, con búsqueda y ordenamiento. El carrito aplica cupones de descuento con lógica de vigencia. El checkout simula el proceso completo: datos de contacto, dirección, método de envío y pago con tarjeta. El panel de administración permite CRUD de productos, promociones, cupones y pedidos. Todo persiste en localStorage, simulando la experiencia sin necesidad de backend real.`,
    workedWell: `El catálogo con filtros visuales (talles, colores, precios) y las fichas de producto con galería de imágenes causaron muy buena impresión. Los cupones de descuento con chips pre-cargados hicieron tangible la mecánica promocional. El panel de administración sorprendió: no esperaban ese nivel de control en una demo. El flujo completo, desde elegir un producto hasta la confirmación del pedido, transformó una idea abstracta en algo que el cliente podía tocar y evaluar.`,
    tradeoffs: `Sin backend real, el stock y los pedidos no son persistentes entre sesiones ni entre dispositivos. El enrutamiento sin React Router funciona correctamente pero sacrifica URLs profundas y navegabilidad del historial. Los productos son mock data, no hay integración real de pagos ni cálculo de envíos con APIs de logística. La demo cumple su propósito de mostrar calidad, pero si el cliente aprueba el proyecto, todo el backend y las integraciones reales deben construirse desde cero.`,
    differentToday: `Integraría MercadoPago en modo sandbox para simular pagos reales y hacer la demo todavía más tangible. Migraría el router a React Router para tener URLs canónicas por producto. Y reemplazaría el mock data por una API fake para que la transición a backend sea más directa si el cliente aprueba el proyecto.`,
    criteriaLevel: 'Demo Funcional',
    criteriaInsight: 'Una demo convence cuando deja de ser un catálogo y se convierte en una experiencia de compra real.',
    repoFront: 'https://github.com/DanielVega1221/DuckSaleDemo',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Lucide React', 'Vite']
  },
  {
    id: 'comercial-rio-hondo',
    title: 'Comercial Río Hondo',
    subtitle: 'Cantera · Áridos · Construcción',
    year: '2026',
    chapterNumber: '14',
    tagline: 'Diseño y desarrollo de la primera presencia digital de una cantera santiagueña, conectando su operación real con el canal natural de comunicación del rubro.',
    metric: 'Antes: sin presencia online. Después: primera web con catálogo de productos y posicionamiento local.',
    type: 'real',
    url: 'https://www.comercialriohondo.com.ar/',
    pointOfDeparture: `Comercial Río Hondo es una cantera ubicada en Villa Río Hondo, Santiago del Estero, que produce y comercializa áridos para la construcción desde 2015. A pesar de su trayectoria abasteciendo obras viales, loteos e infraestructura, el negocio no existía en internet. Sin sitio web, sin Google My Business, sin presencia en mapas. Si alguien buscaba materiales pétreos en la zona, la empresa simplemente no aparecía. El canal natural de comunicación siempre fue WhatsApp, y cualquier solución digital debía respetar ese flujo sin imponer procesos nuevos.`,
    investigation: `Analizamos sitios de canteras, corralones y proveedores de materiales de construcción en el norte argentino. La mayoría directamente no tenía web. Los pocos que sí, usaban plantillas genéricas desactualizadas con información incompleta. El rubro es predominantemente analógico: las consultas, cotizaciones y coordinación de entregas se manejan por teléfono o WhatsApp. Entendimos que no tenía sentido imponer un sistema de e-commerce, cotizaciones online o formularios complejos. La web no debía reemplazar WhatsApp. Debía alimentarlo con clientes mejor informados.`,
    insight: `Para una cantera, la web no vende productos. Vende confianza. El cliente necesita verificar que la empresa existe, que tiene operaciones reales y que maneja volúmenes. Una foto de maquinaria pesada trabajando vale más que cualquier descripción técnica. Las imágenes y videos de la cantera en operación activa eran el activo más valioso del proyecto. Además, el SEO local era crítico, la empresa necesitaba aparecer cuando alguien buscara "áridos Santiago del Estero" o "piedra para construcción Río Hondo".`,
    options: [
      { title: 'Sitio multi-página con catálogo y cotizador', text: 'Más completo funcionalmente, pero demasiado complejo para un negocio que resuelve todo por WhatsApp. El cotizador online no iba a usarse.' },
      { title: 'Landing page estática con WhatsApp', text: 'Respetaba el flujo real del negocio, cargaba rápido y cubría la necesidad de presencia digital sin imponer procesos nuevos. La opción más sensata.' },
      { title: 'E-commerce con carrito y pagos', text: 'Técnicamente posible pero completamente desalineado con cómo opera el rubro. Nadie compra áridos por kilo en un carrito online.' }
    ],
    decision: `Diseñamos una landing page de una sola página con scroll narrativo y SEO local agresivo. La estructura cuenta la historia de la empresa de forma progresiva: quiénes son, qué productos ofrecen (5 tipos de áridos con foto real, descripción técnica y aplicaciones), galería con fotos y videos reales de la cantera en operación, y un formulario de contacto que al enviar construye un mensaje pre-formateado con todos los datos del cliente y lo abre directamente en WhatsApp. Implementamos datos estructurados schema.org LocalBusiness, Open Graph, meta tags geo, y verificación de Google Search Console para maximizar la visibilidad en búsquedas locales. Todo construido con React, Vite y CSS vanilla, sin librerías de UI, para mantener la carga en milisegundos.`,
    workedWell: `La integración con WhatsApp fue adoptada inmediatamente, sin capacitación. Las fotos y videos reales de la cantera, sin usar material de stock, generaron credibilidad instantánea. El SEO local funcionó y la empresa pasó de no existir digitalmente a aparecer en búsquedas relevantes de su zona. Los clientes llegan a WhatsApp con el contexto del producto que vieron en la web, lo que agiliza las cotizaciones. La landing carga en menos de un segundo incluso en redes móviles del interior.`,
    tradeoffs: `Al ser una landing sin CMS, cualquier cambio de fotos, productos o textos requiere intervención del desarrollador. Fue una decisión deliberada para priorizar velocidad y simplicidad, pero sacrifica autonomía del cliente. El diseño es sobrio y funcional, sin animaciones ni transiciones elaboradas, lo cual es correcto para el rubro pero menos vistoso que otros proyectos del portfolio. No hay panel de métricas ni seguimiento de conversiones más allá de lo que WhatsApp ofrece nativamente.`,
    differentToday: `Agregaría una sección de obras realizadas con geolocalización en mapa para que potenciales clientes vean la cercanía de los proyectos abastecidos. Y sumaría un sistema simple de métricas de conversión a WhatsApp para medir el retorno real sin tracking invasivo.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'Cuando el negocio ya funciona por WhatsApp, la web no debe reemplazarlo. Debe hacer que cada conversación empiece mejor informada.',
    repoFront: 'https://github.com/uxnicorp/Cantera-Comercial-Rio-Hondo',
    tools: ['React', 'Vite', 'CSS vanilla', 'WhatsApp']
  },
  {
    id: 'isdep',
    title: 'Instituto ISDEP',
    subtitle: 'Instituto Superior de Enseñanza Profesional',
    year: '2025',
    chapterNumber: '15',
    tagline: 'Plataforma educativa multi-página para un instituto de grafología y ciencias forenses, combinando catálogo académico exhaustivo con SEO estructural y una experiencia visual con identidad propia.',
    metric: 'Antes: sin presencia digital. Después: catálogo online de 17 cursos con SEO posicionado en su nicho.',
    type: 'particular',
    url: 'https://www.isdep.com.ar/',
    pointOfDeparture: `El Instituto Superior de Enseñanza Profesional (ISDEP) es una institución educativa privada con más de 20 años de trayectoria, especializada en grafología, criminalística, psicología social y ciencias forenses. Ofrecen más de 15 carreras y cursos, desde seminarios de 2 meses hasta carreras de 3 años, validados por la Cámara Argentina de Comercio y la Asociación Latinoamericana de Grafología. A pesar de su solidez académica, su presencia digital era prácticamente nula. Necesitaban una web que transmitiera seriedad institucional, organizara su oferta educativa de forma clara, y captara nuevos alumnos desde búsquedas orgánicas.`,
    investigation: `Analicé sitios de institutos terciarios, universidades privadas y centros de formación profesional en Argentina. La mayoría compartía los mismos problemas: catálogos de cursos desordenados que obligaban al alumno a preguntar por WhatsApp información básica, fichas de carrera incompletas sin plan de estudios, diseños genéricos que no transmitían identidad institucional y mala experiencia mobile. En el nicho específico de grafología y criminalística, prácticamente ningún competidor directo tenía una web a la altura de su oferta académica real.`,
    insight: `Un instituto educativo no vende cursos. Vende futuro profesional. La web no podía ser un volante digital con una lista de títulos. Cada carrera necesitaba su ficha completa con duración, modalidad, plan de estudios, requisitos de ingreso y salida laboral. El alumno debía poder decidir sin tener que preguntar. En un rubro tan específico como la grafología, la web tenía que educar antes de vender, explicar qué es la disciplina, qué hace un grafólogo, dónde puede trabajar. La intro animada del sitio, con el logo revelándose sobre una tipografía cuidada, buscaba eso: presentar la identidad antes que la oferta.`,
    options: [
      { title: 'Landing page simple con listado de cursos', text: 'Más rápida de construir pero insuficiente para la profundidad de la oferta académica. No resolvía el problema de fondo: la desorganización de la información.' },
      { title: 'Plataforma con backend y sistema de inscripciones', text: 'El cliente exigía backend para gestionar contenidos, carreras y un sistema de envío de mails para inscripciones. Pero levantar un servidor tradicional implicaba costos de hosting y mantenimiento que no se alineaban con el presupuesto disponible.' },
      { title: 'Sitio multi-página estático con servicios serverless', text: 'Organizaba la información en páginas dedicadas, usaba servicios serverless para notificaciones de contacto, y mantenía los costos operativos al mínimo. La mejor relación entre funcionalidad y presupuesto.' }
    ],
    decision: `Construí un sitio multi-página con React Router. La página principal concentra todo el recorrido narrativo: banner animado de inscripciones abiertas, intro animada institucional, carrusel con perfil docente y certificaciones, catálogo de 17 cursos con acordeón y modales de detalle (cada uno con plan de estudios, duración, modalidad y requisitos), sección de equipo docente y formulario de consulta. Tres páginas independientes complementan: metodología de enseñanza, guía de inscripción y código de ética grafológico. Implementé SEO exhaustivo con react-helmet-async, meta tags por página, JSON-LD estructurado con schema.org, Open Graph, sitemap y robots.txt. Para las notificaciones del formulario usamos Resend mediante funciones serverless. Las imágenes se optimizaron y sirven desde Cloudinary.`,
    workedWell: `El catálogo de cursos con fichas detalladas y modales redujo drásticamente las consultas repetitivas por WhatsApp. Los alumnos llegan con la decisión casi tomada porque cada carrera muestra duración, modalidad, plan de estudios y salida laboral sin necesidad de preguntar. El carrusel institucional con el perfil del director académico y las certificaciones generó credibilidad inmediata. El SEO posicionó al instituto para búsquedas de carreras de grafología en Argentina, un nicho con poca competencia digital. La intro animada le dio personalidad sin ser invasiva.`,
    tradeoffs: `El cliente tenía una idea muy clara de lo que necesitaba: backend para gestionar contenidos, carreras y un sistema de envío de mails para inscripciones. En lugar de levantar un servidor tradicional, que implicaba costo de hosting, mantenimiento y tiempo de desarrollo extra, optamos por servicios serverless para las notificaciones y mantuvimos el contenido estático con Cloudinary. La decisión mantuvo los costos al mínimo, algo clave considerando el presupuesto, sin sacrificar funcionalidad real. La intro animada solo se muestra una vez por sesión para no cansar. El diseño prioriza identidad visual, lo cual es apropiado para el rubro educativo pero hace que el sitio se sienta más cargado que otros proyectos del portfolio. La ausencia de TypeScript y la cantidad de assets visuales son deuda técnica a futuro.`,
    differentToday: `Migraría el proyecto a TypeScript para mayor robustez en un sitio con tantas secciones y datos estructurados. Implementaría un sistema de inscripción online con formulario multi-paso. Agregaría una sección de testimonios de egresados, que es lo que más valora un alumno potencial. Y exploraría migrar el catálogo de cursos a un CMS headless para que el instituto pueda actualizar fechas y aranceles sin depender del desarrollador.`,
    criteriaLevel: 'Producción Real',
    criteriaInsight: 'Un instituto no vende cursos. Vende lo que alguien va a ser después de cursarlos. La web tiene que transmitir eso.',
    repoFront: 'https://github.com/DanielVega1221/institutoisdep',
    tools: ['React', 'React Router', 'Framer Motion', 'SwiperJS', 'Cloudinary', 'react-helmet-async', 'Lucide React', 'Resend', 'Vite']
  }
];
