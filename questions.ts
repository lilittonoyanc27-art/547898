import { FootballQuestion } from './types.ts';

export const FOOTBALL_QUESTIONS: FootballQuestion[] = [
  {
    id: 1,
    letter: 'E',
    questionEs: '¿Quién dirige al equipo durante los entrenamientos?',
    questionArm: 'Ո՞վ է ղեկավարում թիմը մարզումների ժամանակ։',
    answerEs: 'Entrenador',
    answerArm: 'Մարզիչ',
    aliases: ['entrenador', 'el entrenador', 'entrenadora', 'dt', 'director tecnico'],
    categoryEs: 'Puesto / Personal',
    categoryArm: 'Պաշտոն / Անձնակազմ',
    phoneticArm: 'Էնտրենադոր',
    explanationEs: 'Es la persona encargada de la preparación táctica, física y mental de los jugadores.',
    explanationArm: 'Այն անձն է, ով պատասխանատու է խաղացողների մարտավարական, ֆիզիկական և հոգեբանական պատրաստվածության համար:'
  },
  {
    id: 2,
    letter: 'P',
    questionEs: '¿Cómo se llama el jugador que protege la portería?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը պաշտպանում է դարպասը։',
    answerEs: 'Portero',
    answerArm: 'Դարպասապահ',
    aliases: ['portero', 'el portero', 'arquero', 'guardameta', 'golero'],
    categoryEs: 'Posición',
    categoryArm: 'Դիրք',
    phoneticArm: 'Պորտերո',
    explanationEs: 'Único jugador de campo autorizado para tocar el balón con las manos dentro de su área.',
    explanationArm: 'Միակ խաղացողը, ում թույլատրվում է ձեռքով խաղալ իր տուգանային հրապարակում:'
  },
  {
    id: 3,
    letter: 'S',
    questionEs: '¿Qué utiliza el árbitro para detener el juego?',
    questionArm: 'Ի՞նչ է օգտագործում մրցավարը խաղը կանգնեցնելու համար։',
    answerEs: 'Silbato',
    answerArm: 'Սուլիչ',
    aliases: ['silbato', 'el silbato', 'pito'],
    categoryEs: 'Equipamiento arbitral',
    categoryArm: 'Մրցավարական հանդերձանք',
    phoneticArm: 'Սիլբատո',
    explanationEs: 'Instrumento sonoro que emplea el colegiado para señalar faltas, fueras de juego o pausas.',
    explanationArm: 'Ձայնային գործիք, որը մրցավարն օգտագործում է խախտումները և դադարները ազդարարելու համար:'
  },
  {
    id: 4,
    letter: 'P',
    questionEs: '¿Cómo se llama la acción de enviar el balón a un compañero?',
    questionArm: 'Ինչպե՞ս է կոչվում գնդակը թիմակցին փոխանցելու գործողությունը։',
    answerEs: 'Pase',
    answerArm: 'Փոխանցում',
    aliases: ['pase', 'el pase', 'pasar'],
    categoryEs: 'Técnica',
    categoryArm: 'Տեխնիկա',
    phoneticArm: 'Պասե',
    explanationEs: 'Acción fundamental de entrega del balón a otro jugador del mismo equipo.',
    explanationArm: 'Գնդակը նույն թիմի այլ խաղացողին փոխանցելու հիմնարար գործողություն:'
  },
  {
    id: 5,
    letter: 'D',
    questionEs: '¿Cómo se llama el jugador que intenta marcar goles?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը փորձում է գոլեր խփել։',
    answerEs: 'Delantero',
    answerArm: 'Հարձակվող',
    aliases: ['delantero', 'el delantero', 'atacante', 'ariete', 'punta'],
    categoryEs: 'Posición',
    categoryArm: 'Դիրք',
    phoneticArm: 'Դելանտերո',
    explanationEs: 'Jugador ubicado en la línea ofensiva cuyo objetivo principal es anotar tantos.',
    explanationArm: 'Հարձակման գծի խաղացող, որի գլխավոր նպատակը գոլեր խփելն է:'
  },
  {
    id: 6,
    letter: 'E',
    questionEs: '¿Qué recibe un jugador cuando el árbitro le muestra una tarjeta roja?',
    questionArm: 'Ի՞նչ է ստանում խաղացողը, երբ մրցավարը կարմիր քարտ է ցույց տալիս։',
    answerEs: 'Expulsión',
    answerArm: 'Հեռացում',
    aliases: ['expulsion', 'expulsión', 'la expulsion', 'la expulsión', 'tarjeta roja'],
    categoryEs: 'Regla disciplinaria',
    categoryArm: 'Կարգապահական կանոն',
    phoneticArm: 'Էքսպուլսիոն',
    explanationEs: 'Sanción que obliga al futbolista a abandonar el terreno de juego por falta grave.',
    explanationArm: 'Պատիժ, որը ստիպում է ֆուտբոլիստին լքել խաղադաշտը կոպիտ խախտման համար:'
  },
  {
    id: 7,
    letter: 'C',
    questionEs: '¿Cómo se llama el lanzamiento desde la esquina del campo?',
    questionArm: 'Ինչպե՞ս է կոչվում խաղադաշտի անկյունից կատարվող հարվածը։',
    answerEs: 'Córner',
    answerArm: 'Անկյունային',
    aliases: ['corner', 'córner', 'el corner', 'el córner', 'tiro de esquina', 'saque de esquina'],
    categoryEs: 'Reanudación del juego',
    categoryArm: 'Խաղի վերսկսում',
    phoneticArm: 'Կոռներ',
    explanationEs: 'Saque que se realiza desde el cuadrante de esquina cuando el balón sale tras tocar a un defensor.',
    explanationArm: 'Խաղադաշտի անկյունից հարված, երբ գնդակը դուրս է գալիս պաշտպանվող թիմի խաղացողից:'
  },
  {
    id: 8,
    letter: 'H',
    questionEs: '¿Qué palabra utilizamos cuando un jugador marca tres goles en un partido?',
    questionArm: 'Ի՞նչ բառ ենք օգտագործում, երբ ֆուտբոլիստը մեկ խաղում երեք գոլ է խփում։',
    answerEs: 'Hat-trick',
    answerArm: 'Հեթ-տրիկ',
    aliases: ['hat-trick', 'hat trick', 'hattrick', 'triplete'],
    categoryEs: 'Logro deportivo',
    categoryArm: 'Մարզական նվաճում',
    phoneticArm: 'Հաթ-թրիկ',
    explanationEs: 'Hazaña deportiva consistente en anotar tres goles en un solo encuentro.',
    explanationArm: 'Մեկ խաղում երեք գոլի հեղինակ դառնալու նշանակալի նվաճում:'
  },
  {
    id: 9,
    letter: 'C',
    questionEs: '¿Cómo se llama el jugador que lleva el brazalete y representa al equipo?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը կրում է թևկապ և ներկայացնում թիմը։',
    answerEs: 'Capitán',
    answerArm: 'Ավագ',
    aliases: ['capitan', 'capitán', 'el capitan', 'el capitán'],
    categoryEs: 'Liderazgo',
    categoryArm: 'Առաջնորդություն',
    phoneticArm: 'Կապիտան',
    explanationEs: 'Líder en el campo que porta el brazalete distintivo y dialoga con el colegiado.',
    explanationArm: 'Խաղադաշտի առաջնորդը, ով կրում է ավագի թևկապը և ներկայացնում թիմը:'
  },
  {
    id: 10,
    letter: 'E',
    questionEs: '¿Qué palabra significa que dos equipos terminan con el mismo resultado?',
    questionArm: 'Ո՞ր բառն է նշանակում, որ երկու թիմերն ավարտում են խաղը հավասար հաշվով։',
    answerEs: 'Empate',
    answerArm: 'Ոչ-ոքի',
    aliases: ['empate', 'el empate', 'igualdad', 'tablas'],
    categoryEs: 'Resultado',
    categoryArm: 'Արդյունք',
    phoneticArm: 'Էմպատե',
    explanationEs: 'Resultado final o parcial en el cual ambos contendientes tienen los mismos goles.',
    explanationArm: 'Արդյունք, երբ երկու մրցակիցներն էլ ունեն նույն քանակությամբ գոլեր:'
  },
  {
    id: 11,
    letter: 'D',
    questionEs: '¿Cómo se llama el jugador que protege su portería y frena los ataques rivales?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը պաշտպանում է իր դարպասը և կանգնեցնում մրցակցի գրոհները։',
    answerEs: 'Defensa',
    answerArm: 'Պաշտպան',
    aliases: ['defensa', 'el defensa', 'defensor', 'zaguero'],
    categoryEs: 'Posición',
    categoryArm: 'Դիրք',
    phoneticArm: 'Դեֆենսա',
    explanationEs: 'Jugador cuya función primordial es neutralizar la ofensiva contraria.',
    explanationArm: 'Խաղացող, ում առաջնային խնդիրն է չեզոքացնել մրցակցի հարձակումը:'
  },
  {
    id: 12,
    letter: 'R',
    questionEs: '¿Qué palabra significa quitarle el balón a un rival?',
    questionArm: 'Ո՞ր բառն է նշանակում մրցակցից գնդակը խլել։',
    answerEs: 'Robar',
    answerArm: 'Խլել',
    aliases: ['robar', 'robo', 'recuperar', 'recuperacion', 'recuperación', 'robar el balon', 'robar el balón', 'interceptar'],
    categoryEs: 'Acción defensiva',
    categoryArm: 'Պաշտպանական գործողություն',
    phoneticArm: 'Ռոբար',
    explanationEs: 'Acción de despojar reglamentariamente al oponente de la posesión del esférico.',
    explanationArm: 'Մրցակցից գնդակի տիրապետումը կանոնների սահմանում խլելը:'
  },
  {
    id: 13,
    letter: 'R',
    questionEs: '¿Cómo se llama un disparo hacia la portería?',
    questionArm: 'Ինչպե՞ս է կոչվում դեպի դարպասը կատարվող հարվածը։',
    answerEs: 'Remate',
    answerArm: 'Հարված',
    aliases: ['remate', 'el remate', 'tiro', 'disparo'],
    categoryEs: 'Técnica de finalización',
    categoryArm: 'Եզրափակիչ հարված',
    phoneticArm: 'Ռեմատե',
    explanationEs: 'Lanzamiento directo hacia la meta contraria con el pie o la cabeza buscando el gol.',
    explanationArm: 'Ուղիղ հարված դեպի մրցակցի դարպասը՝ ոտքով կամ գլխով:'
  },
  {
    id: 14,
    letter: 'R',
    questionEs: '¿Qué necesita un jugador para correr durante todo el partido sin cansarse rápidamente?',
    questionArm: 'Ի՞նչ է անհրաժեշտ խաղացողին ամբողջ խաղի ընթացքում վազելու և արագ չհոգնելու համար։',
    answerEs: 'Resistencia',
    answerArm: 'Դիմացկունություն',
    aliases: ['resistencia', 'la resistencia', 'fondo fisico', 'aguante', 'resistencia fisica'],
    categoryEs: 'Cualidad física',
    categoryArm: 'Ֆիզիկական որակ',
    phoneticArm: 'Ռեսիստենսիա',
    explanationEs: 'Capacidad psicofísica de soportar la fatiga en un esfuerzo prolongado de 90 minutos o más.',
    explanationArm: 'Հոգեֆիզիկական ունակություն՝ դիմակայելու հոգնածությանը երկարատև ծանրաբեռնվածության ժամանակ:'
  },
  {
    id: 15,
    letter: 'C',
    questionEs: '¿Cómo se llama el jugador que organiza el juego desde el centro del campo?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը կազմակերպում է խաղը դաշտի կենտրոնից։',
    answerEs: 'Centrocampista',
    answerArm: 'Կիսապաշտպան',
    aliases: ['centrocampista', 'el centrocampista', 'mediocampista', 'medio', 'volante', 'medio centro'],
    categoryEs: 'Posición',
    categoryArm: 'Դիրք',
    phoneticArm: 'Սենտրոկամպիստա',
    explanationEs: 'Eje del equipo que conecta defensa y delantera, distribuyendo el juego.',
    explanationArm: 'Թիմի շարժիչ ուժը, ով կապում է պաշտպանությունն ու հարձակումը՝ բաշխելով գնդակը:'
  },
  {
    id: 16,
    letter: 'R',
    questionEs: '¿Qué hace un jugador cuando supera a un rival controlando el balón?',
    questionArm: 'Ի՞նչ է անում խաղացողը, երբ գնդակը վերահսկելով անցնում է մրցակցի կողքով։',
    answerEs: 'Regatear',
    answerArm: 'Շրջանցել',
    aliases: ['regatear', 'regate', 'driblar', 'drible', 'hacer regate', 'el regate'],
    categoryEs: 'Habilidad / Regate',
    categoryArm: 'Հնարք / Դրիբլինգ',
    phoneticArm: 'Ռեգատեար',
    explanationEs: 'Maniobra con la que un futbolista sobrepasa a un adversario sin perder el control del balón.',
    explanationArm: 'Հնարք, որով ֆուտբոլիստը գնդակով շրջանցում է մրցակցին առանց գնդակը կորցնելու:'
  },
  {
    id: 17,
    letter: 'F',
    questionEs: '¿Cómo se llama la decisión del árbitro cuando un atacante está en posición ilegal al recibir un pase?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խախտումը, երբ հարձակվողը փոխանցման պահին խաղից դուրս վիճակում է և մասնակցում է խաղին։',
    answerEs: 'Fuera de juego',
    answerArm: 'Խաղից դուրս',
    aliases: ['fuera de juego', 'el fuera de juego', 'offside', 'posicion adelantada', 'fuera de lugar'],
    categoryEs: 'Regla del juego',
    categoryArm: 'Խաղի կանոն',
    phoneticArm: 'Ֆուերա դե խուեգո',
    explanationEs: 'Infracción reglamentaria cuando un jugador receptor está más adelantado que el penúltimo rival.',
    explanationArm: 'Կանոնների խախտում, երբ հարձակվողը փոխանցման պահին ավելի մոտ է դարպասին, քան նախավերջին մրցակիցը:'
  },
  {
    id: 18,
    letter: 'V',
    questionEs: '¿Qué palabra significa ganar un partido?',
    questionArm: 'Ո՞ր բառն է նշանակում հաղթել խաղում։',
    answerEs: 'Vencer',
    answerArm: 'Հաղթել',
    aliases: ['vencer', 'ganar', 'triunfar', 'victoria'],
    categoryEs: 'Verbo / Éxito',
    categoryArm: 'Բայ / Հաջողություն',
    phoneticArm: 'Վենսեր',
    explanationEs: 'Lograr la victoria sobre el adversario obteniendo mayor tanteo al final del tiempo reglamentario.',
    explanationArm: 'Հաղթանակ տանել մրցակցի նկատմամբ հիմնական ժամանակում:'
  },
  {
    id: 19,
    letter: 'S',
    questionEs: '¿Cómo se llama el jugador que entra al campo para reemplazar a otro?',
    questionArm: 'Ինչպե՞ս է կոչվում այն խաղացողը, որը խաղադաշտ է մտնում մեկ ուրիշին փոխարինելու համար։',
    answerEs: 'Suplente',
    answerArm: 'Պահեստային',
    aliases: ['suplente', 'el suplente', 'sustituto', 'reemplazo', 'cambio'],
    categoryEs: 'Rol del equipo',
    categoryArm: 'Թիմի դեր',
    phoneticArm: 'Սուպլենտե',
    explanationEs: 'Futbolista que espera en el banquillo para ingresar durante el transcurso del encuentro.',
    explanationArm: 'Ֆուտբոլիստ, որը սպասում է պահեստայինների նստարանին խաղադաշտ մտնելու համար:'
  },
  {
    id: 20,
    letter: 'P',
    questionEs: '¿Qué acción realiza un portero cuando detiene un disparo?',
    questionArm: 'Ի՞նչ գործողություն է կատարում դարպասապահը, երբ կանգնեցնում է հարվածը։',
    answerEs: 'Parada',
    answerArm: 'Սեյվ',
    aliases: ['parada', 'la parada', 'atajada', 'paradon', 'paradón', 'salvada', 'desvio'],
    categoryEs: 'Acción del portero',
    categoryArm: 'Դարպասապահի գործողություն',
    phoneticArm: 'Պարադա',
    explanationEs: 'Intervención exitosa del arquero que evita que un remate acabe en gol.',
    explanationArm: 'Դարպասապահի հաջող միջամտությունը, որը կանխում է գոլը:'
  },
  {
    id: 21,
    letter: 'B',
    questionEs: '¿Cómo se llama el lugar donde se sientan los jugadores suplentes?',
    questionArm: 'Ինչպե՞ս է կոչվում այն վայրը, որտեղ նստում են պահեստային խաղացողները։',
    answerEs: 'Banquillo',
    answerArm: 'Պահեստայինների նստարան',
    aliases: ['banquillo', 'el banquillo', 'banca', 'banco'],
    categoryEs: 'Instalación',
    categoryArm: 'Խաղադաշտի գոտի',
    phoneticArm: 'Բանկիլյո',
    explanationEs: 'Zona técnica al borde del terreno de juego con asientos para cuerpo técnico y reservas.',
    explanationArm: 'Տեխնիկական գոտի դաշտի եզրին՝ մարզիչների և պահեստայինների համար:'
  },
  {
    id: 22,
    letter: 'D',
    questionEs: '¿Cómo se llama el movimiento de un jugador para quedar libre y recibir un pase?',
    questionArm: 'Ինչպե՞ս է կոչվում խաղացողի շարժումը, որի միջոցով նա ազատվում է պաշտպանից՝ փոխանցում ստանալու համար։',
    answerEs: 'Desmarque',
    answerArm: 'Ազատ գոտի դուրս գալ',
    aliases: ['desmarque', 'el desmarque', 'desmarcarse', 'desmarque de apoyo', 'desmarque de ruptura'],
    categoryEs: 'Táctica individual',
    categoryArm: 'Անհատական մարտավարություն',
    phoneticArm: 'Դեսմարկե',
    explanationEs: 'Desplazamiento inteligente para zafarse del marcaje del defensor y recibir con ventaja.',
    explanationArm: 'Խելացի տեղաշարժ պաշտպանի հսկողությունից ազատվելու և փոխանցում ստանալու համար:'
  },
  {
    id: 23,
    letter: 'C',
    questionEs: '¿Qué palabra describe la colaboración entre los jugadores de un equipo?',
    questionArm: 'Ո՞ր բառն է նկարագրում թիմի խաղացողների համագործակցությունը։',
    answerEs: 'Cooperación',
    answerArm: 'Համագործակցություն',
    aliases: ['cooperacion', 'cooperación', 'la cooperacion', 'trabajo en equipo', 'companerismo', 'compañerismo'],
    categoryEs: 'Valores / Dinámica',
    categoryArm: 'Արժեքներ / Թիմային ոգի',
    phoneticArm: 'Կոոպերասիոն',
    explanationEs: 'Trabajo conjunto y sincronizado de todos los miembros para alcanzar el objetivo común.',
    explanationArm: 'Բոլոր անդամների համատեղ աշխատանքը ընդհանուր նպատակին հասնելու համար:'
  },
  {
    id: 24,
    letter: 'P',
    questionEs: '¿Cómo se llama el disparo desde los once metros?',
    questionArm: 'Ինչպե՞ս է կոչվում տասնմեկ մետրից կատարվող հարվածը։',
    answerEs: 'Penalti',
    answerArm: 'Տասնմեկմետրանոց',
    aliases: ['penalti', 'el penalti', 'penal', 'el penal', 'tiro penal', 'penalty'],
    categoryEs: 'Sanción máxima',
    categoryArm: 'Տուգանային հարված',
    phoneticArm: 'Պենալտի',
    explanationEs: 'Tiro libre directo concedido por falta en el área propia, ejecutado desde el punto de penal (11 metros).',
    explanationArm: 'Ուղիղ հարված տուգանային հրապարակում կատարված խախտման համար՝ 11 մետր նշակետից:'
  },
  {
    id: 25,
    letter: 'E',
    questionEs: '¿Qué palabra significa practicar para mejorar el rendimiento deportivo?',
    questionArm: 'Ո՞ր բառն է նշանակում մարզվել՝ մարզական արդյունքները բարելավելու համար։',
    answerEs: 'Entrenar',
    answerArm: 'Մարզվել',
    aliases: ['entrenar', 'entrenamiento', 'practicar', 'ejercitar'],
    categoryEs: 'Preparación deportiva',
    categoryArm: 'Մարզական պատրաստություն',
    phoneticArm: 'Էնտրենար',
    explanationEs: 'Realizar ejercicios físicos y tácticos planificados para perfeccionar habilidades y condición.',
    explanationArm: 'Կանոնավոր ֆիզիկական և մարտավարական վարժություններ կատարելը հմտությունները կատարելագործելու համար:'
  },
  {
    id: 26,
    letter: 'R',
    questionEs: '¿Cómo se llama la capacidad de reaccionar rápidamente ante una situación?',
    questionArm: 'Ինչպե՞ս է կոչվում իրավիճակին արագ արձագանքելու կարողությունը։',
    answerEs: 'Reflejos',
    answerArm: 'Ռեֆլեքսներ',
    aliases: ['reflejos', 'los reflejos', 'reflejo', 'reaccion', 'reacción', 'velocidad de reaccion'],
    categoryEs: 'Capacidad perceptiva',
    categoryArm: 'Արձագանքման ունակություն',
    phoneticArm: 'Ռեֆլեխոս',
    explanationEs: 'Respuesta neuromuscular veloz e involuntaria, clave para porteros y situaciones de rebote.',
    explanationArm: 'Արագ նյարդամկանային արձագանք, որը հատկապես վճռորոշ է դարպասապահների համար:'
  },
  {
    id: 27,
    letter: 'O',
    questionEs: '¿Cómo se llama el sentimiento de satisfacción después de conseguir un objetivo importante?',
    questionArm: 'Ինչպե՞ս է կոչվում այն զգացումը, երբ կարևոր նպատակին հասնելուց հետո գոհունակություն ես զգում։',
    answerEs: 'Orgullo',
    answerArm: 'Հպարտություն',
    aliases: ['orgullo', 'el orgullo', 'satisfaccion', 'satisfacción', 'gloria'],
    categoryEs: 'Emoción / Sentimiento',
    categoryArm: 'Զգացմունք / Էմոցիա',
    phoneticArm: 'Օրգուլյո',
    explanationEs: 'Sentimiento de digna estimación y júbilo tras conquistar un título o culminar un gran logro.',
    explanationArm: 'Արժանապատիվ գոհունակության և ցնծության զգացում մեծ հաղթանակից կամ նպատակին հասնելուց հետո:'
  }
];

export function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]/g, '');      // keep only alphanumeric
}

export function checkAnswer(userInput: string, question: FootballQuestion): boolean {
  const normUser = normalizeAnswer(userInput);
  if (!normUser) return false;

  const targetNorm = normalizeAnswer(question.answerEs);
  if (normUser === targetNorm) return true;

  // Also check aliases
  if (question.aliases && question.aliases.some(alias => normalizeAnswer(alias) === normUser)) {
    return true;
  }

  // Also check Armenian answer if user typed in Armenian!
  const armClean = question.answerArm.trim().toLowerCase().replace(/[^ա-ֆ0-9]/gi, '');
  const userArmClean = userInput.trim().toLowerCase().replace(/[^ա-ֆ0-9]/gi, '');
  if (armClean && userArmClean && armClean === userArmClean) {
    return true;
  }

  return false;
}
