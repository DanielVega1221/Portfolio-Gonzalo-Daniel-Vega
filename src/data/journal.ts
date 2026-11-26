import { JournalEntry } from '../types';

/*
 * CÓMO ESCRIBIR ENTRADAS DEL JOURNAL
 * ===================================
 * Cada entrada es un objeto con esta estructura:
 * {
 *   id: 'slug-unico',            // sin espacios ni caracteres especiales
 *   title: 'Título de la nota',
 *   date: '2026-09-10',         // formato: AAAA-MM-DD (se formatea al renderizar)
 *                                // el tiempo de lectura se calcula solo, no se escribe
 *   category: 'Filosofía de Producto',
 *   tagline: 'Una frase que resuma de qué va la nota.',
 *   content: `...`               // ver guía de formato abajo
 * }
 *
 * FORMATO DEL CONTENIDO (Markdown básico):
 * =========================================
 * - Párrafos: separados por una línea en blanco.
 * - Subtítulos: ### Título de sección
 * - Negrita: **texto en negrita**
 * - Listas: * Elemento de lista (uno por línea)
 * - Citas: > Texto de la cita
 *
 * Las entradas se muestran ordenadas por fecha en el Journal público.
 * Agregá cada nueva entrada al array journalEntries y se reflejará automáticamente.
 */

export const journalEntries: JournalEntry[] = [
  {
    id: 'salud-mental-y-trabajo',
    title: 'Bajar un cambio también es saber decir "esto no hace falta"',
    titleEn: 'Slowing down also means knowing when to say "this isn\'t needed"',
    date: '2026-11-25',
    category: 'Salud mental',
    categoryEn: 'Mental health',
    tagline:
      'Salud mental y criterio: frenar la cinta que yo aceleraba y decir "esto no hace falta" en un proyecto nos permitió entregar antes.',
    taglineEn:
      'Mental health and judgment: slowing down the treadmill I was accelerating and saying "this isn\'t needed" on a project helped us ship sooner.',
    // Publicada en /journal, pero la home sigue destacando "15 proyectos...".
    homeFeature: false,
    content: `Venía bajando un cambio con todo, y no por una frase linda que leí en internet. Era cansancio. Estaba haciendo las cosas en automático, pendiente de demasiadas cosas al mismo tiempo, con la sensación de que siempre tenía que dar un poco más: un proyecto más, unas horas más, más energía. Y la meta nunca llegaba porque yo la movía cada vez que me acercaba.

La cinta de caminar esa no la puso nadie. La regulaba yo. Cada vez que llegaba a donde quería, subía un poco más la velocidad. Hasta que un día me pregunté para qué estaba corriendo.

No tengo una respuesta elegante. Pero sí una decisión que se me repitió en dos lugares: en mi rutina y en un proyecto que arrancó como una landing simple.

### La cinta la manejaba yo

Durante un tiempo sentí que estar bien era una cuestión de disciplina. Si rendía más, iba a estar mejor. Si terminaba una cosa, ya podía arrancar la otra. Y así, siempre un poco más.

El problema era que la vara no venía de afuera. Nadie me pedía ese ritmo. Yo mismo lo iba subiendo: un proyecto más para el portfolio, una hora más frente a la computadora, una meta más para "cuando termine esto". Cuando lo miraba de lejos, parecía compromiso. De cerca, era cansancio y dificultad para estar presente en lo que estaba haciendo.

Me costó darme cuenta de que podía querer mejorar y, al mismo tiempo, dejar de tratarme como si siempre estuviera en deuda.

### Tres cambios que no eran de rendimiento

**Pausas y límites.** Termino el día a una hora y apago las notificaciones. Fuera de ese horario no reviso el mail ni LinkedIn. El límite es de horario, no de compromiso: si algo se complica, aviso antes.

**Una cosa a la vez.** Antes de empezar decido cuándo doy algo por terminado. Si ya está, lo suelto y paso a lo siguiente. En el portfolio se me vio rápido: dejé de querer sumar proyectos y empecé a explicar para qué existe cada uno. Es el mismo criterio que uso para estimar un trabajo: prefiero decir tres semanas y cumplir, que prometer una y quedar mal.

**Movimiento sin meta.** Salgo a caminar sin contar pasos ni escuchar nada para aprovechar el tiempo. Caminar, simplemente. Es el momento del día en el que menos pienso en rendimiento.

Nada de eso es menos compromiso. Es lo contrario: cuando no estoy agotado, escucho mejor, explico mejor y sostengo mejor lo que me toca hacer.

### El proyecto que se nos fue de alcance

El cambio de "una cosa a la vez" se probó de verdad en ese proyecto. Habíamos acordado una landing simple. Después aparecieron tres pedidos nuevos: un login para que los alumnos accedieran a los programas, esos programas alojados dentro del sitio, y un backend para el formulario de contacto que sanitizara los datos y dejara registro de todo.

Les propusimos dos alternativas mejores: un login real con base de datos y un backend propio con registro persistido. El presupuesto no alcanzaba para ninguna de las dos. Aceptar sin más habría sido dejar que el precio decidiera la arquitectura por nosotros. Preferimos poner el freno antes de que esos cambios dejaran de ser pedidos y se convirtieran en otro proyecto.

> No era decir que no. Era elegir qué problema resolver primero.

### La tercera vía

Los programas quedaron detrás de una contraseña predefinida que llevaba a un Drive. La contraseña no era un login de verdad: era una barrera. El control de acceso real lo tenía el Drive, con sus permisos.

El formulario lo resolvimos con una Vercel Function propia: sanitizaba los datos y los enviaba por mail. El registro quedaba en la casilla, no en una base. Sin instancia de backend, sin base que mantener.

Esa decisión tuvo una razón que no era solo técnica. Un backend propio con pruebas, control y registro nos habría llevado tiempo que el proyecto no tenía. Elegimos salir al público antes que trabajar a contra reloj para entregar algo que todavía no estábamos en condiciones de sostener.

### Lo que ganamos y lo que no

Ganamos tiempo, simplicidad y un alcance que podíamos cumplir. El cliente vio la web publicada y quedó conforme.

Perdimos granularidad: no había usuarios ni permisos por persona, y el registro de consultas vivía en un mail, no en una tabla consultable. Si el proyecto creciera, esa solución se quedaría corta. Está bien decirlo: no era la arquitectura ideal para escalar, era la correcta para ese momento.

### Cómo se lo contamos

Avisamos antes qué quedaba afuera y por qué. No fuimos con un "no se puede": fuimos con las alternativas, el costo de cada una y la decisión que tomamos para no cambiar el tipo de proyecto a mitad de camino. El cliente entendió el recorte porque veía el razonamiento, no solo el resultado.

Es lo mismo que aprendí en mi rutina: el límite no era de compromiso, era de alcance. Saber dónde parar también es una forma de cuidar el trabajo.

### Cómo me cambió en el trabajo

Ahora calculo los tiempos con más calma y cumplo lo que digo. Pregunto antes de pasar una semana en algo que quizá no hace falta. Trabajo con equipos remotos, así que prefiero escribir las cosas con claridad antes que darlas por dichas.

Sigo queriendo ser bueno en esto. Solo que dejé de pensar que para eso tenía que estar agotado, y que un proyecto valiera más cuanto más creciera.`,
    contentEn: `I'd been slowing down with everything, and not because of some nice quote I read online. It was tiredness, plain and simple. I was going through the motions, paying attention to too many things at once, with the feeling that I always had to give a bit more: one more project, a few more hours, more energy. And the goal never arrived because I moved it every time I got close.

Nobody set that treadmill to that speed. I did. Every time I reached where I wanted, I turned it up a little. Until one day I asked myself what I was running for.

I don't have an elegant answer. But I do have one decision that showed up in two places: in my routine and in a project that started as a simple landing page.

### I was the one running the treadmill

For a while I thought being okay was a matter of discipline. If I produced more, I'd feel better. If I finished one thing, I could start the next. And so it went, always a little more.

The thing was, the bar wasn't coming from outside. Nobody was asking me for that pace. I kept raising it myself: one more project for the portfolio, one more hour at the computer, one more goal for "when I'm done with this". From a distance it looked like commitment. Up close, it was tiredness and a hard time being present in what I was doing.

It took me a while to realize I could want to improve and, at the same time, stop treating myself as if I were always behind.

### Three changes that weren't about output

**Breaks and limits.** I end the day at a set time and turn off notifications. Outside those hours I don't check email or LinkedIn. The limit is about hours, not commitment: if something looks like it might slip, I flag it early.

**One thing at a time.** Before I start, I decide when I'll call something done. Once it is, I let it go and move on. In my portfolio it showed up quickly: I stopped trying to add more projects and started explaining what each one exists for. It's the same criterion I use to estimate work: I'd rather say three weeks and deliver than promise one and fall short.

**Movement without a goal.** I go for a walk without counting steps or listening to anything to "make the most of the time". Just walking. It's the part of the day when I think least about performance.

None of that is less commitment. It's the opposite: when I'm not exhausted, I listen better, explain better and follow through better.

### The project that grew out of scope

The "one thing at a time" change got tested for real on that project. We had agreed on a simple landing page. Then three new requests came in: a login so students could reach the programs, those programs hosted inside the site, and a backend for the contact form that would sanitize the data and keep a record of everything.

We proposed two better alternatives: a real login with a database, and our own backend with a persisted record. The budget didn't cover either. Accepting them anyway would have let the price decide the architecture for us. We chose to put the brake on before those requests stopped being requests and turned into a different project.

> It wasn't saying no. It was choosing which problem to solve first.

### The third way

The programs ended up behind a predefined password that led to a Drive. That password wasn't a real login: it was a barrier. Access control lived in the Drive, with its own permissions.

We handled the form with our own Vercel Function: it sanitized the data and sent it by email. The record lived in the inbox, not in a database. No backend instance, no database to maintain.

That decision wasn't only technical. A backend of our own with tests, control and a record would have taken time the project didn't have. We chose to ship rather than work against the clock delivering something we couldn't yet support.

### What we gained and what we didn't

We gained time, simplicity and a scope we could actually meet. The client saw the site published and was happy with it.

We gave up granularity: there were no per-person users or permissions, and the enquiry record lived in an email, not in a queryable table. If the project grew, that solution would fall short. It's fine to say it: it wasn't the ideal architecture for scaling. It was the right one for that moment.

### How we explained it

We flagged it early: what was left out and why. We didn't come with a flat "we can't". We came with the alternatives, the cost of each and the decision we made so the project wouldn't change shape halfway through. The client understood the cut because they could see the reasoning, not just the result.

It's the same thing I learned in my routine: the limit wasn't about commitment, it was about scope. Knowing where to stop is also a way of taking care of the work.

### How it changed my work

Now I estimate timelines more calmly and do what I say. I ask before spending a week on something that may not be needed. I work with remote teams, so I'd rather write things down clearly than assume they're understood.

I still want to be good at this. I just stopped thinking I had to be exhausted to get there, or that a project was worth more the more it grew.`,
  },
  {
    id: 'el-problema-de-terminar',
    title: 'Por qué 15 proyectos bien explicados valen más que 70 demos',
    titleEn: 'Why 15 well-explained projects beat 70 demos',
    date: '2026-09-10',
    category: 'Producto',
    categoryEn: 'Product',
    tagline:
      'En mi portfolio hay demos que nadie pagó y un sistema de reservas con pagos que quedó sin un solo usuario. Esto es lo que aprendí sobre "terminar" un proyecto.',
    taglineEn:
      'My portfolio has demos nobody paid for and a booking system with payments that ended up with zero users. Here\'s what I learned about "finishing" a project.',
    content: `Casi todo el mundo te dice que un junior necesita muchos proyectos para que lo miren. Diez, veinte, cincuenta. Cuantos más, mejor.

Yo tengo quince. Y cuatro de esos son demos conceptuales de arquitectura, interiorismo y un café que nadie me pidió ni pagó. Hay otra que es una plataforma de reservas con pagos de verdad, roles, bases de datos y un sistema de concurrencia que quedó muy bien armado. Esa tampoco tiene un solo usuario, porque el cliente se bajó por presupuesto antes del lanzamiento.

Por un tiempo me obsesioné con eso. Sentía que quince no alcanzaba, que el número quedaba corto, que un recruiter iba a abrir la lista, ver demos lindas de arquitectura y preguntarse qué tenía que ver eso con la programación web.

Después entendí que el problema no era la cantidad. Era que yo no sabía bien para qué existía cada proyecto. Y cuando lo descubrí, todo lo que parecía un fracaso cambió de lado.

### El juego de contar proyectos

Cuando empecé a armar el portfolio hice el ejercicio que hace todo el mundo: contar. Sumar demos, sumar proyectos de la facultad, sumar lo que fuera para que el número subiera.

El número miente. Porque una demo, una herramienta y un producto para un cliente se cuentan igual, pero no pesan igual ni demuestran lo mismo. Una demo demuestra **criterio**. Una herramienta demuestra que **la usás**. Un producto demuestra que **alguien confió, pagó y quedó conforme**. Son tres cosas distintas que el conteo aplasta en una sola unidad.

Y lo peor: cuando contás solo para inflar el número, terminás publicando cosas que vos mismo no sabés por qué están ahí. Esas sí que son señal de humo.

### El día que entendí qué era "terminar"

En mi portfolio cada proyecto tiene una etiqueta: Demo Conceptual, Demo Funcional, Herramienta, Recurso Abierto, Sistema en Producción, Producción Real. Al principio la usé como clasificación técnica, para ordenar la página. Después me di cuenta de que era otra cosa: era mi definición de "terminado".

Porque **terminar no es publicar**. No es que el botón funcione ni que se vea lindo. Terminar es cumplir el objetivo para el que el proyecto existía. Y según cuál sea ese objetivo, "terminado" significa cosas muy distintas.

Una demo está terminada cuando transmite el criterio que querías transmitir, no cuando tiene usuarios. Una herramienta está terminada cuando la usás, aunque la use una sola persona. Un sistema está terminado cuando un cliente real lo usa todos los días para facturar, reservar o coordinar. La página de proyectos lo dice exactamente así.

### Los post-mortems cortos

Cuatro de mis proyectos son demos conceptuales: BRÜNN, un estudio de arquitectura; LÜMEN, uno de interiorismo; MAREA, un café, bar y cocina; y STRØ, arquitectura de autor. Nadie las pidió. Ninguna tiene usuarios reales ni métricas de uso. Si contás proyectos para impresionar, son lastre.

Pero no son lastre. Son demos. Su objetivo era investigar un rubro, entender cómo piensa un estudio, aprender a transmitir criterio. Y ese objetivo lo cumplieron. MAREA incluso dejó a mitad de camino el concepto más fuerte que tenía, el del espacio que cambia según el horario. Lo dejé anotado en la ficha del proyecto, sin esconderlo. Eso es lo que hay que mirar de una demo: no la demo en sí, sino que yo sé exactamente hasta dónde llegué y por qué.

El caso que más me enseñó es el que más se parece a un producto real. **Zabira** es una plataforma de reservas para un estudio de pilates: landing premium, dashboard con roles, reservas atómicas sobre una base de datos con concurrencia, membresías activadas por webhooks de Mercado Pago y autenticación con JWT. Es el sistema más completo que armé hasta acá.

No tiene un solo usuario. El cliente se bajó por presupuesto antes del lanzamiento.

Hubo un momento en que me pregunté si esa plataforma había sido una pérdida de tiempo. Después lo vi distinto: el objetivo nunca fue operarla con ese cliente; el objetivo fue demostrar que podíamos construir algo así, y quedó demostrado. Aprendí a pensar la reserva de un turno como un momento de ansiedad para el cliente, a separar una landing que vende de un dashboard que opera, y a trabajar con concurrencia real. Hoy puedo explicarlo. Lo publiqué como una demo completa y pulida, no como un fracaso.

**DuckSale** es otra cosa: una demo de e-commerce que armamos para que un cliente potencial recorriera su tienda como si ya existiera, con carrito, cupones, checkout y panel de administración. No es un producto, es un arma de venta. Y **MyVisor** es un lector de Markdown que uso para mis propios apuntes. Lo usa una persona: yo. Y está perfecto así.

> Terminar no es publicar. Es saber para qué existía cada cosa.

### Lo que dejé de hacer

Lo que cambió mi forma de trabajar fue dejar de contar proyectos y empezar a decidir para qué existe cada uno **antes** de construirlo. Y cuando se termina, etiquetarlo con el criterio que corresponde. Si es una demo, que sea clara como demo. Si es una herramienta, que se note que la uso. Si es un sistema en producción, que tenga usuarios reales.

Esa categoría no está en la web para el recruiter. Está para mí. Es el mecanismo que me dice cuándo parar. Ningún proyecto se "termina de verdad": siempre hay algo que haría distinto hoy, y de hecho todas las fichas de la página lo dicen. Pero se terminan cuando cumplen lo suyo. El resto del tiempo estás puliendo y no te das cuenta de que ya estás apilando señal de humo.

### Cierre

Si estás armando tu portfolio, dejá de hacerte la pregunta equivocada. No preguntes "cuántos proyectos tengo". Preguntate para qué existe cada uno. El día que sepas para qué existe, vas a saber si está terminado.

Y si mirás mi lista y ves demos que nadie pidió y un sistema completo sin usuarios, ahora sabés leerla. No son fracasos. Son, cada uno, exactamente lo que tenían que ser. El único proyecto que no se termina nunca es este journal: hoy publico esto, y mañana seguramente lo complete.`,
    contentEn: `Everyone tells you a junior needs lots of projects to get noticed. Ten, twenty, fifty. The more the better.

I have fifteen. Four of them are conceptual demos of architecture, interior design and a café that nobody asked me for or paid for. Another one is a booking platform with real payments, roles, databases and a concurrency system that turned out really well built. That one doesn't have a single user either, because the client walked away over budget before launch.

For a while I was obsessed with that. I felt fifteen wasn't enough, that the number fell short, that a recruiter would open the list, see pretty architecture demos and wonder what that had to do with web development.

Then I understood the problem wasn't the quantity. It was that I didn't really know what each project existed for. And once I figured that out, everything that looked like a failure turned around.

### The project counting game

When I started building my portfolio I did the exercise everyone does: count. Add up demos, add up university assignments, add up anything to make the number go up.

The number lies. Because a demo, a tool and a client product all count the same, but they don't weigh the same and they don't prove the same thing. A demo proves **judgment**. A tool proves **you use it**. A product proves **someone trusted you, paid you and was happy**. Three different things flattened into a single unit by the count.

And the worst part: when you count just to inflate the number, you end up publishing things you don't even know why they're there. Those are actual smoke signals.

### The day I understood what "finishing" meant

In my portfolio every project has a label: Conceptual Demo, Functional Demo, Tool, Open Resource, System in Production, Real Production. At first I used it as a technical classification, to organize the page. Then I realized it was something else: it was my definition of "finished".

Because **finishing isn't publishing**. It's not that the button works or that it looks nice. Finishing is fulfilling the goal the project existed for. And depending on what that goal is, "finished" means very different things.

A demo is finished when it communicates the judgment you wanted to communicate, not when it has users. A tool is finished when you use it, even if a single person does. A system is finished when a real client uses it every day to invoice, book or coordinate. The projects page says exactly that.

### The short post-mortems

Four of my projects are conceptual demos: BRÜNN, an architecture studio; LÜMEN, an interior design one; MAREA, a café, bar and kitchen; and STRØ, author architecture. Nobody asked for them. None of them has real users or usage metrics. If you're counting projects to impress, they're dead weight.

But they're not dead weight. They're demos. Their goal was to research an industry, understand how a studio thinks, learn to communicate judgment. And they fulfilled that goal. MAREA even left halfway its strongest concept, the space that changes depending on the time of day. I wrote it down on the project's page, without hiding it. That's what you should look at in a demo: not the demo itself, but that I know exactly how far I got and why.

The case that taught me the most is the one that looks most like a real product. **Zabira** is a booking platform for a pilates studio: premium landing, dashboard with roles, atomic bookings on a database with concurrency, memberships activated by Mercado Pago webhooks and JWT authentication. It's the most complete system I've built so far.

It has zero users. The client walked away over budget before launch.

There was a moment when I wondered if that platform had been a waste of time. Then I saw it differently: the goal was never to run it with that client; the goal was to prove we could build something like it, and it was proven. I learned to think of booking a class as a moment of anxiety for the client, to separate a landing that sells from a dashboard that operates, and to work with real concurrency. Today I can explain it. I published it as a complete, polished demo, not as a failure.

**DuckSale** is something else: an e-commerce demo we built so a potential client could walk through their store as if it already existed, with cart, coupons, checkout and an admin panel. It's not a product, it's a sales weapon. And **MyVisor** is a Markdown reader I use for my own notes. One person uses it: me. And it's perfect that way.

> Finishing isn't publishing. It's knowing what each thing existed for.

### What I stopped doing

What changed how I work was stopping to count projects and starting to decide what each one exists for **before** building it. And when it's done, labeling it with the right criterion. If it's a demo, let it be clearly a demo. If it's a tool, let it show that I use it. If it's a system in production, let it have real users.

That label isn't on the website for the recruiter. It's for me. It's the mechanism that tells me when to stop. No project is ever "truly finished": there's always something I'd do differently today, and in fact every project page says so. But they're finished when they fulfill their purpose. The rest of the time you're polishing and you don't realize you're already stacking smoke signals.

### Closing

If you're building your portfolio, stop asking yourself the wrong question. Don't ask "how many projects do I have". Ask yourself what each one exists for. The day you know what it exists for, you'll know if it's finished.

And if you look at my list and see demos nobody asked for and a complete system with no users, now you know how to read it. They're not failures. They're, each one, exactly what they needed to be. The only project that never finishes is this journal: today I publish this, and tomorrow I'll probably complete it.`,
  },
  {
    id: 'como-empece-a-programar',
    title: 'Cómo empecé a programar (y por qué no paré)',
    titleEn: 'How I started coding (and why I never stopped)',
    date: '2025-12-01',
    category: 'Historia Personal',
    categoryEn: 'Personal Story',
    tagline:
      'De ver a un amigo programar a crear nuestra propia agencia. La historia de cómo me metí en el desarrollo web sin planearlo demasiado.',
    taglineEn:
      'From watching a friend code to building our own agency. The story of how I got into web development without planning too much.',
    content: `Arranqué sin querer, en realidad.

A finales de 2024 yo estaba en los primeros años de Ingeniería en Informática y lo único que había visto era Java de escritorio. Nada de front, nada de back, nada de frameworks. Un día veo a Mauro, un amigo, programando cosas web. Se la pasaba todo el día haciendo proyectos, todo el día, todos los días. Era divertido verlo, aunque yo no entendía nada. Me quedaba al lado tratando de descifrar qué hacía mientras él iba y venía entre archivos.

Con el tiempo empecé a entender algunas cosas sueltas. Él me propuso enseñarme a programar web, y fue rapidísimo. Tuvimos que ver todo corriendo porque él estaba ocupado con otras partes del proyecto y necesitaba ayuda. Así que me dio un módulo para que yo hiciera. Nada complejo, ver y editar unos registros nomás. Pero para mí fue enorme. No sabía casi nada y terminé armándolo con HTML, CSS, JavaScript, React y Bootstrap. Me divertí muchísimo, tanto haciéndolo como aprendiendo a hacerlo.

Con el tiempo creamos UXnicorp, nuestra pequeña agencia de desarrollo web. Empezaron a llegar clientes. Empecé a aprender tecnologías nuevas, metodologías nuevas. Empezó a aparecer gente nueva en el equipo. Todo creció de a poco y casi sin darnos cuenta.

Y después de todo ese camino, acá estoy. Armando este portfolio. No porque alguien me lo pidió, sino porque un día me desperté y me di cuenta de algo, ya no era el pibe que no podía centrar un texto con CSS. Ya no era el que no entendía cómo conectar el front con el back. Ya tenía varios proyectos, de clientes reales, de herramientas, de decisiones de arquitectura, de aprendizajes. Había crecido.

Hacer este portfolio fue como mirar para atrás y decir "che, todo esto hice". Fue para darme cuenta de que podía mostrarme como profesional, no como alguien que recién empieza. Porque ya no estoy empezando. Ya pasé por demos, por clientes reales, por sistemas complejos, por proyectos que salieron mal y por otros que salieron mejor de lo que esperaba.

Hoy me acuerdo de esos primeros días y me río. De las veces que no podía centrar un texto y Mauro me cargaba. De cuando el back no se conectaba con el front porque puse mal una letra. De esas madrugadas aprendiendo React con Bootstrap sin saber muy bien qué estaba haciendo. Pero sobre todo me acuerdo de que fue divertido. Empezar así, riendo entre amigos, hizo que programar nunca se sintiera como trabajo.

Y si estás leyendo esto, capaz estás en ese mismo lugar donde yo estaba. Sin entender nada. Viendo a alguien más programar. Con ganas de aprender pero sin saber por dónde arrancar. Seguí. Vale la pena.`,
    contentEn: `I started without meaning to, really.

By late 2024 I was in my first years of Computer Engineering and the only thing I had seen was desktop Java. No frontend, no backend, no frameworks. One day I see Mauro, a friend, coding web stuff. He spent all day building projects, every day, all day. It was fun to watch, even though I understood nothing. I'd sit next to him trying to figure out what he was doing while he jumped back and forth between files.

Over time I started to understand a few scattered things. He offered to teach me web development, and it went lightning fast. We had to rush through everything because he was busy with other parts of a project and needed help. So he gave me a module to build myself. Nothing complex, just viewing and editing some records. But for me it was enormous. I barely knew anything and I ended up building it with HTML, CSS, JavaScript, React, and Bootstrap. I had a blast, both building it and learning how to build it.

Over time we created UXnicorp, our tiny web development agency. Clients started coming in. I started learning new technologies, new methodologies. New people started joining the team. Everything grew little by little, almost without us noticing.

And after that whole journey, here I am. Building this portfolio. Not because someone asked me to, but because one day I woke up and realized something, I was no longer the kid who couldn't center text with CSS. I was no longer the one who couldn't figure out how to connect the frontend to the backend. I had several projects, real clients, tools, architectural decisions, learnings. I had grown.

Building this portfolio was like looking back and saying "wow, I did all this." It was to realize I could show myself as a professional, not as someone just starting out. Because I'm not starting anymore. I've been through demos, real clients, complex systems, projects that went wrong and others that turned out better than I expected.

Today I remember those first days and laugh. The times I couldn't center text and Mauro teased me. When the backend wouldn't connect to the frontend because I mistyped one letter. Those late nights learning React with Bootstrap without really knowing what I was doing. But above all I remember it was fun. Starting like that, laughing with friends, made coding never feel like work.

And if you're reading this, maybe you're in that same place I was. Understanding nothing. Watching someone else code. Wanting to learn but not knowing where to start. Keep going. It's worth it.`,
  },
  {
    id: 'de-la-facultad-a-productos',
    title: 'Cómo pasé de hacer TPs de la facultad a productos que facturan',
    titleEn: 'How I went from university assignments to products that make money',
    date: '2026-02-01',
    category: 'Carrera',
    categoryEn: 'Career',
    tagline: 'No tengo título todavía, pero esto es lo que aprendí en el camino.',
    taglineEn: "I don't have a degree yet, but here's what I learned along the way.",
    content: `Arranqué programando en Java de escritorio para la facultad. Entrada de datos por consola, menús con números, cero interfaz gráfica. Eran ejercicios, no productos. No había usuarios reales. No había consecuencias si algo fallaba.

### Lo que la facultad me dio

La UNCA me enseñó a pensar los problemas antes de resolverlos. A dudar de la primera solución que se me ocurría. A preguntarme si realmente entendía lo que me estaban pidiendo. Eso no te lo da un tutorial de YouTube.

Pero lo que no me dio fue contacto con la realidad. Nunca tuve un cliente enojado porque algo no funcionaba. Nunca tuve que estimar cuánto me iba a llevar un proyecto y cumplirlo. Nunca tuve que explicarle a alguien no técnico por qué elegí una tecnología y no otra.

### El salto a UXnicorp

Cuando Mauro y yo creamos UXnicorp, todo cambió. De golpe tenía clientes reales, plazos reales, plata de por medio. El primer proyecto con un cliente fue un cachetazo. No alcanzaba con que el código funcionara. Tenía que entender qué necesitaba el cliente, por qué lo necesitaba, y cómo explicarle lo que estábamos haciendo sin que se durmiera.

Aprendí a diseñar interfaces porque alguien tenía que hacerlo. Aprendí a hablar con clientes porque no había un departamento de ventas. Aprendí a decir "esto no hace falta" porque a veces el cliente pide cosas que no necesita y parte de mi trabajo es ayudarlo a verlo.

    ### Lo que aprendí fuera de la facultad

**Estimar tiempos.** Al principio siempre calculaba de menos, obvio. Después de varios proyectos aprendí a ser honesto conmigo y con el cliente. Prefiero decir "esto lleva tres semanas" y cumplir que prometer una y fallar.

**Decir que no** también es parte del trabajo. Cuando el presupuesto no alcanza, cuando el plazo es ridículo. Al principio me daba vergüenza. Después entendí que el cliente valora más la honestidad que el entusiasmo ciego.

**Explicar sin tecnicismos.** Algo que no te enseñan en la facultad. Si no puedo contarle a un cliente por qué tomé una decisión, probablemente no la entendí bien yo. Y si no la entendí, no debería estar tomándola.

**Cobrar por el valor, no por las horas.** Esto es lo más importante de todo. El cliente no paga por líneas de código. Paga por el problema que le resolvés.

Todavía no tengo el título. Y está bien. Lo que tengo son quince proyectos que hice mientras estudiaba. Eso dice más de mí que cualquier papel.`,
    contentEn: `I started coding desktop Java for university. Console input, numbered menus, zero graphical interface. They were exercises, not products. No real users. No consequences if something broke.

### What university gave me

UNCA taught me to think about problems before solving them. To doubt the first solution that came to mind. To ask myself if I really understood what was being asked of me. You don't get that from a YouTube tutorial.

But what it didn't give me was contact with reality. I never had an angry client because something didn't work. I never had to estimate how long a project would take and deliver on it. I never had to explain to a non-technical person why I chose one technology over another.

### The leap to UXnicorp

When Mauro and I created UXnicorp, everything changed. Suddenly I had real clients, real deadlines, real money at stake. The first project with a client was a wake-up call: it wasn't enough for the code to work. I had to understand what the client needed, why they needed it, and how to explain what we were doing without putting them to sleep.

I learned to design interfaces because someone had to do it. I learned to talk to clients because there was no sales department. I learned to say "this isn't necessary" because sometimes clients ask for things they don't need and part of my job is helping them see that.

    ### What I learned outside university

**Estimating time.** At first I always underestimated, obviously. After several projects I learned to be honest with myself and with the client. I'd rather say "this takes three weeks" and deliver than promise one and fail.

**Saying no** is also part of the job. When the budget isn't enough, when the deadline is ridiculous. At first it embarrassed me. Then I understood that clients value honesty more than blind enthusiasm.

**Explaining without jargon.** Something they don't teach you in university. If I can't tell a client why I made a decision, I probably didn't understand it well myself. And if I didn't understand it, I shouldn't be making it.

**Charging for value, not hours.** This is the most important one. The client doesn't pay for lines of code. They pay for the problem you solve.

I don't have the degree yet. And that's fine. What I have is fifteen projects I built while studying. That says more about me than any piece of paper.`,
  },
  {
    id: 'hablar-con-clientes',
    title: 'Lo que aprendí hablando con clientes sin ser vendedor',
    titleEn: 'What I learned talking to clients without being a salesperson',
    date: '2026-03-01',
    category: 'Negocio',
    categoryEn: 'Business',
    tagline: 'El código es el 50%. El otro 50% es entender qué necesita el cliente.',
    taglineEn: 'Code is 50%. The other 50% is understanding what the client actually needs.',
    content: `En la facultad no te enseñan a hablar con clientes. Te enseñan patrones de diseño, complejidad algorítmica y normalización de bases de datos. Pero el día que te sentás frente a alguien que te paga por resolverle un problema, todo eso pasa a segundo plano.

La primera vez que hablé con un cliente no sabía ni qué preguntar. Él hablaba de su negocio, yo pensaba en tecnologías. Él quería vender más, yo pensaba en qué stack usar. Tuvimos que aprender a la fuerza.

### Escuchar antes de proponer

Lo más importante que aprendí es que mi trabajo no empieza cuando escribo código. Empieza cuando escucho. A veces lo que el cliente dice que necesita no es lo que realmente necesita. Mi trabajo es hurgar un poco más, hacer preguntas que parecen obvias, y llegar al problema real.

> El cliente no siempre sabe lo que necesita. Pero sabe cosas de su negocio que vos no tenés ni idea.

### El caso ElectroPower

ElectroPower es una empresa de servicios eléctricos industriales. Cuando llegaron me pidieron "una página web". Podría haberles hecho un sitio genérico con formulario de contacto y fue. Pero escuchando entendí que **todo su negocio pasaba por WhatsApp**. No usaban email. No usaban formularios. No usaban nada más que el teléfono.

Entonces la web no debía reemplazar WhatsApp. Debía **alimentarlo**. La diseñé para que cada sección derivara naturalmente al chat, con el cliente ya informado. El resultado: adoptaron la web de inmediato porque no les cambió la forma de trabajar. Solo la mejoró.

### Decir "esto no hace falta"

Una de las cosas más difíciles de aprender fue decirle a un cliente que algo que él pide no es necesario. Da miedo. Pensás que va a pensar que no sabés hacerlo, o que otro se lo va a hacer. Pero cuando se lo explicás con honestidad, **ganás credibilidad**.

Me pasó con más de un cliente. Llegaban pidiendo un e-commerce completo, y después de hablar entendíamos que con una landing + WhatsApp ya resolvían el 90% de lo que necesitaban. Cobré menos en el momento, pero gané un cliente que volvió y me recomendó.

    ### Lo que me llevo

**El cliente no habla tu idioma.** No esperes que entienda de stacks ni de frameworks. Tu trabajo es traducir.

**Las preguntas obvias son las más importantes.** "¿Cómo hacés esto hoy?" te dice más que cualquier brief de 20 páginas.

**Ser honesto rinde más que vender de más.** A mí me funcionó. Los clientes vuelven y te recomiendan.

**No vendas código. Vendé soluciones.** Si el cliente te pide un e-commerce pero con una landing y WhatsApp resuelve el 90%, decíselo. Cobrás menos hoy, ganás más mañana.`,
    contentEn: `University doesn't teach you how to talk to clients. They teach you design patterns, algorithmic complexity, and database normalization. But the day you sit in front of someone paying you to solve their problem, all of that takes a back seat.

The first time I talked to a client I didn't even know what to ask. He talked about his business, I thought about technologies. He wanted to sell more, I thought about which stack to use. We had to learn the hard way.

### Listen before proposing

The most important thing I learned is that my job doesn't start when I write code. It starts when I listen. Sometimes what the client says they need isn't what they actually need. My job is to dig a little deeper, ask questions that seem obvious, and get to the real problem.

> The client doesn't always know what they need. But they know things about their business that you have no clue about.

### The ElectroPower case

ElectroPower is an industrial electrical services company. When they came to me they asked for "a website." I could have built them a generic site with a contact form and called it a day. But listening closely I understood that **their entire business ran through WhatsApp**. They didn't use email. They didn't use forms. They used nothing but their phones.

So the website shouldn't replace WhatsApp. It should **feed it**. I designed it so every section naturally led to the chat, with the client already informed. The result: they adopted the site immediately because it didn't change how they worked. It only improved it.

### Saying "you don't need this"

One of the hardest things to learn was telling a client that something they're asking for isn't necessary. It's scary. You think they'll assume you can't do it, or that someone else will. But when you explain it honestly, **you gain credibility**.

It happened with more than one client. They'd come asking for a full e-commerce, and after talking we'd realize a landing page + WhatsApp already solved 90% of what they needed. I charged less in the moment, but gained a client who came back and recommended me.

    ### What I take away

**The client doesn't speak your language.** Don't expect them to understand stacks or frameworks. Your job is to translate.

**The obvious questions are the most important.** "How do you do this today?" tells you more than any 20-page brief.

**Being honest pays off more than overselling.** It worked for me. Clients come back and recommend you.

**Don't sell code. Sell solutions.** If the client asks for an e-commerce but a landing page and WhatsApp solves 90%, tell them. You charge less today, you earn more tomorrow.`,
  },
];
