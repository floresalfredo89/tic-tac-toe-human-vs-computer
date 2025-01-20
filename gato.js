const casillas = [['V','V','V'],['V','V','V'],['V','V','V']];
let turno = 1;
let jugando = true;
let resultado_element = document.getElementById('resultado');
let dificil = false;

/**
 * Ejecuta una jugada en el tablero del juego tras un clic en uno de los botones HTML.
 *
 * Esta función es llamada cada vez que un jugador realiza un movimiento. Verifica si la casilla 
 * seleccionada está vacía y si el juego aún está activo ('jugando' es true). Marca la casilla con
 * el símbolo del jugador actual ('X' o 'O'). Si el jugador actual es 'X', cambia el turno al bot
 * para que realice su jugada. Finalmente, actualiza el contador de turnos.
 *
 * @param {number} fila - El índice de la fila donde se quiere realizar la jugada en el tablero.
 * @param {number} columna - El índice de la columna donde se quiere realizar la jugada en el tablero.
 * @param {string} boton - El ID del elemento botón HTML que representa la casilla seleccionada.
 * @param {string} [jugador='O'] - El nombre o símbolo del jugador actual. Por defecto es 'O'.
 * 
 * @returns {boolean} true si la jugada fue válida y se realizó correctamente, false en caso contrario.
 */
function accion(fila, columna, boton, jugador = 'O'){
    
    if(revisarValidezJugada(fila,columna) && jugando){

        casillas[fila][columna] = jugador;

        marcarCasilla(boton,jugador);
        
        if(jugador == 'X'){
            turno++;
            accionBot();
            return;
        }

        turno++;

        return true;
        
    } else {
        return false;
    }
}

/**
 * Verifica si una casilla específica en el tablero está vacía.
 *
 * Esta función revisa la validez de un movimiento en un tablero de juego,
 * asegurando que la casilla especificada esté vacía (indicado por 'V'). 
 * Esto es crucial para determinar si se puede realizar una jugada en esa posición.
 *
 * @param {number} fila - El índice de la fila del tablero donde se desea verificar la casilla.
 * @param {number} columna - El índice de la columna del tablero donde se desea verificar la casilla.
 * @returns {boolean} true si la casilla está vacía, false en caso contrario.
 */
function revisarValidezJugada(fila,columna){
    if(casillas[fila][columna] == 'V'){
        return true;
    }
    return false;
}

/**
 * Marca una casilla en el tablero con el signo del jugador actual y verifica si hay un ganador.
 *
 * Esta función toma el identificador de un botón HTML que representa la casilla a marcar 
 * y el nombre o símbolo del jugador. Inserta el símbolo en la casilla y luego evalúa
 * el estado del juego para actualizar el resultado mostrado al usuario.
 *
 * @param {string} boton - El ID del elemento botón HTML que representa la casilla a marcar.
 * @param {string} jugador - El nombre o símbolo del jugador actual (por ejemplo, 'X' o 'O').
 */
function marcarCasilla(boton,jugador){
    const casilla = document.getElementById(boton);
    let signo = document.createElement('h3');
    signo.innerHTML = jugador;
    casilla.appendChild(signo);

    switch(revisarGanador()){
        case 1:
            resultado_element.innerText = '¡Ganaste!';
            break;
        case 2:
            resultado_element.innerText = '¡Perdiste!';
            break;
        case 3:
            resultado_element.innerText = '¡Empate!';
            break;
    }
}

/**
 * Ejecuta la jugada del bot con o sin inteligencia, dependiendo de la dificultad definida por la variable 'dificil'.
 *
 * Esta función controla el comportamiento del bot durante su turno. Si la dificultad
 * está configurada como no difícil ('dificil' es false), hay una probabilidad de que
 * el bot realice un movimiento aleatorio en lugar de uno estratégico. De lo contrario,
 * intenta primero realizar jugadas ofensivas y, si ninguna es viable, defensivas.
 *
 * @returns {void}
 */
function accionBot(){

    let inteligente = true;

    if(!dificil){
        if(Math.random() < 0.3){
            inteligente = false;
        }
    }

    if(inteligente){
        // El bot tiene inteligencia y realiza jugadas en base a estrategia
        if(jugadaOfensivaBot()){
            return;
        }

        if(tiroDefensivoBot()){
            return;
        }
    }

    // El bot no tiene inteligencia y realiza juagadas aleatorias
    realiazarJugadaAleatoria();
    
}

/**
 * Analiza si hay oportunidades ofensivas en una configuración dada del tablero.
 *
 * Esta función determina si existe una jugada ofensiva viable que permita al bot ganar,
 * evaluando diferentes patrones de casillas. Los patrones válidos para la jugada ofensiva
 * están representados por combinaciones específicas de 'V' (vacío), 'O' (jugador bot).
 *
 * @param {string} lectura - Una cadena que representa el estado actual de una fila,
 *                           columna o diagonal del tablero.
 * @returns {number} La posición en la que el bot debe actuar para completar
 *                   una línea y ganar, si es posible. Los valores retornados 
 *                   representan diferentes estrategias ofensivas para intentar 
 *                   ganar la partida:
 *                   - 0: Realizar jugada en la primera posición de la lectura.
 *                   - 1: Realizar jugada en la segunda posición de la lectura.
 *                   - 2: Realizar jugada en la tercera posición de la lectura.
 *                   - 9: No hay jugada ofensiva posible.
 */
function analisisJugadaOfensiva(lectura){
    switch(lectura){
        case 'VOO':
            return 0;
        case 'OVO':
            return 1;
        case 'OOV':
            return 2;
        default:
            return 9;
    }
}

/**
 * Analiza si hay amenazas defensivas que el bot debe contrarrestar.
 *
 * Esta función determina si existe una jugada defensiva necesaria para evitar
 * la victoria del oponente, evaluando diferentes patrones de casillas. Los patrones
 * válidos para la jugada defensiva están representados por combinaciones específicas 
 * de 'V' (vacío) y 'X' (jugador humano).
 *
 * @param {string} lectura - Una cadena que representa el estado actual de una fila,
 *                           columna o diagonal del tablero.
 * @returns {number} La acción defensiva necesaria para contrarrestar la jugada
 *                   del oponente. Los valores retornados representan diferentes 
 *                   estrategias defensivas:
 *                   - 0: Bloquear en primera posición de la lectura.
 *                   - 1: Bloquear en segunda posición de la lectura.
 *                   - 2: Bloquear en tercera posición de la lectura.
 *                   - 3: Otra estrategia defensiva para 'OXX'.
 *                   - 4: Estrategia especial para patrones largos 'XVX' y 'VXV'.
 *                   - 5: Similar a 4, pero en un orden de casillas diferente.
 *                   - 6: Otra estrategia defensiva para tirar en esquinas.
 *                   - 9: No hay jugada defensiva posible.
 */
function analisisJugadaDefensiva(lectura){
    switch(lectura){
        case 'VXX':
            return 0;
        case 'XVX':
            return 1;
        case 'XXV':
            return 2;
        case 'OXX':
            return 3;
        case 'XVVVOVVVX':
            return 4;
        case 'VVXVOVXVV':
            return 5;
        case 'XX':
            return 6;
        default:
            return 9;
    }
}

/**
 * Realiza una jugada ofensiva para el bot.
 *
 * Esta función evalúa las posibles oportunidades del bot para completar una línea (horizontal, vertical o diagonal) y ejecuta movimientos ofensivos necesarios. La estrategia se centra en maximizar las chances de ganancia al analizar configuraciones del tablero donde solo falta un espacio ('V' significa "vacio" y 'X' sería el marcador del bot). Si encuentra una oportunidad válida, ejecuta la acción que completa la línea.
 *
 * @returns {boolean} Retorna `true` si se realizó una jugada ofensiva exitosa; de lo contrario, retorna 'false'.
 */
function jugadaOfensivaBot(){

    let lecturas = [];
    let resultado = false;

    // Verifica si el centro del tablero está vacío para marcar dicha casilla, ya marcarla que presenta una ventaja
    if(casillas[1][1] == 'V'){
        accion(1,1,'11');
        return true;
    }

    // Verifica las filas para completar una línea con tres 'O'
    lecturas = leerCasillasHorizontal();
    for(let i = 0; i < 3; i++){
        resultado = analisisJugadaOfensiva(lecturas[i])
        if(resultado<3){
            accion(i,resultado,`${i}${resultado}`);
            return true;
        }
    }

    // Verifica las columnas para completar una línea con tres 'O'
    lecturas = leerCasillasVertical();
    for(let i = 0; i < 3; i++){
        resultado = analisisJugadaOfensiva(lecturas[i]);
        if(resultado<3){
            accion(resultado,i,`${resultado}${i}`);
            return true;
        }
    }

    // Verifica la diagonal invertida para completar una línea con tres 'O'
    resultado = analisisJugadaOfensiva(leerCasillasDiagonalInvertida());
    if(resultado<3){
        accion(resultado, resultado,`${resultado}${resultado}`);
        return true;
    }

    // Verifica la diagonal principal para completar una línea con tres 'O'
    resultado = analisisJugadaOfensiva(leerCasillasDiagonal());
    if(resultado<3){
        switch(resultado){
            case 0:
                accion(0,2,'02');
                return true;
            case 1:
                accion(1,1,'11');
                return true;
            case 2:
                accion(2,0,'20');
                return true;
        }
    }

    // Si no se encontró ninguna jugada ofensiva posible
    return false;
}

/**
 * Realiza una jugada defensiva para el bot.
 *
 * Esta función evalúa las posibles amenazas del oponente y ejecuta movimientos defensivos necesarios para prevenir que el adversario gane. El algoritmo sigue un conjunto específico de reglas basadas en turnos y configuraciones del tablero, intentando bloquear líneas completadas por el oponente (casillas con 'X'). La función busca primero en posiciones clave, como el centro, diagonales e índices horizontales y verticales. Si encuentra una amenaza válida, ejecuta un movimiento defensivo.
 *
 * @returns {boolean} Retorna 'true' si se realizó una acción defensiva exitosa; de lo contrario, retorna 'false'.
 */
function tiroDefensivoBot(){
    let lecturas = [];

    // Verifica la jugada inicial en el centro del tablero
    if(turno == 2 && casillas[1][1] == 'X'){
        accion(0,2,'02');
        return true;
    }

    // Verifica posiciones defensivas específicas para el cuarto turno
    if(turno == 4){
        analisis = analisisJugadaDefensiva(leerCasillasTodas());
        if(analisis == 4 || analisis == 5){
            accion(1,0,'10');
            return true;
        }
        
        analisis = analisisJugadaDefensiva(leerCasillasDiagonalInvertida());
        if(analisis == 3){
            accion(0,2,'02');
            return true;
        }
        
        analisis = analisisJugadaDefensiva(leerCasillasDiagonal());
        if(analisis == 3){
            accion(0,0,'00');
            return true;
        }
        
        // Verifica bloques [[_,X,_],[X,_,X],[_,X,_]] para reazlizar jugadas en las esquinas del campo
        lecturas = leerCasillasRombo();
        for(let i = 0; i < 4; i++){
            analisis = analisisJugadaDefensiva(lecturas[i]);
            if(analisis == 6){
                switch(i){
                    case 0:
                        accion(0,0,'00');
                        return true;
                    case 1:
                        accion(0,2,'02');
                        return true;
                    case 2:
                        accion(2,2,'22');
                        return true;
                    case 3:
                        accion(2,0,'20');
                        return true;
                }
            }
        }
    }

    // Verifica filas
    lecturas = leerCasillasHorizontal();
    for(let i = 0; i < 3; i++){
        analisis = analisisJugadaDefensiva(lecturas[i]);
        if(analisis<3){
            accion(i,analisis,`${i}${analisis}`);
            return true;
        }
    }
    
    // Verifica columnas
    lecturas = leerCasillasVertical();
    for(let i = 0; i < 3; i++){
        analisis = analisisJugadaDefensiva(lecturas[i]);
        if(analisis<3){
            accion(analisis,i,`${analisis}${i}`);
            return true;
        }
    }
    
    // Verifica la diagonal invertida para bloquear posibles jugadas de victoria del jugador
    analisis = analisisJugadaDefensiva(leerCasillasDiagonalInvertida());
    if(analisis<3){
        accion(analisis, analisis,`${analisis}${analisis}`);
        return true;
    }

    // Verifica la diagonal principal para bloquear posibles jugadas de victoria del jugador
    analisis = analisisJugadaDefensiva(leerCasillasDiagonal());
    if(analisis<3){
        switch(analisis){
            case 0:
                accion(0,2,'02');
                return true;
            case 1:
                accion(1,1,'11');
                return true;
            case 2:
                accion(2,0,'20');
                return true;
        }
    }

    // Si no se encontró ninguna jugada defensiva necesaria
    return false;
}

/**
 * Ejecuta una jugada aleatoria en el tablero.
 *
 * Esta función verifica si hay casillas vacías disponibles y si se continúa jugando (indicado por la variable 'jugando'). 
 * Si se cumplen estas condiciones, selecciona una jugada aleatoria y realiza la acción correspondiente. La acción intentará colocar un 'O' en la posición seleccionada. 
 * Si no tiene éxito debido a alguna condición específica (como que el lugar ya esté ocupado), repetirá el proceso hasta encontrar una casilla válida.
 *
 * @returns {void} No devuelve ningún valor.
 */
function realiazarJugadaAleatoria(){
    if(casillas.find((arreglo) => arreglo.find(element => element == 'V')) && jugando){
        let {fila, columna, boton} = obtenerJugadaAleatoria();
        while(!accion(fila, columna, boton, "O")){
            ({fila, columna, boton} = obtenerJugadaAleatoria());
        }
    }
}

/**
 * Obtiene una jugada aleatoria para el tablero.
 *
 * Genera coordenadas aleatorias dentro del rango del tablero (0-2) para las filas y columnas, creando así un identificador único de botón que combina estas dos coordenadas. 
 * La función devuelve un objeto con la fila, columna y el identificador de botón.
 *
 * @returns {{fila: number, columna: number, boton: string}} Un objeto conteniendo las coordenadas aleatorias y su representación como cadena para identificar el botón en el tablero.
 */
function obtenerJugadaAleatoria(){
    const fila = Math.floor(Math.random() * 3);
    const columna = Math.floor(Math.random() * 3);
    const boton = fila.toString() + columna.toString();
    return {fila, columna, boton};
}

/**
 * Lee todas las casillas del tablero en orden de filas.
 *
 * Recorre cada elemento en el tablero y concatena los valores de las casillas en una sola cadena que representa el estado completo del tablero, fila por fila.
 *
 * @returns {string} Una cadena con todos los elementos del tablero en su orden actual, fila tras fila.
 */
function leerCasillasTodas(){
    // Todas las casillas en orden de filas
    let lectura = '';
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            lectura += casillas[f][c];
        } 
    }

    return lectura;
}

/**
 * Lee el estado actual de las filas del tablero.
 * 
 * La función recorre cada fila del array bidimensional 'casillas' y une sus elementos en una cadena para formar una representación horizontal de cada fila.
 *
 * @returns {string[]} Un array con tres cadenas, donde cada cadena representa la secuencia de símbolos ('X', 'O', o 'V') en cada fila del tablero.
 */
function leerCasillasHorizontal(){
    let lecturas = ['','',''];
    for (let f = 0; f < 3; f++) {
        lecturas[f] = casillas[f].join('');   
    }
    return lecturas;
}

/**
 * Lee el estado actual de las columnas del tablero.
 * 
 * La función recorre cada columna y fila del array bidimensional `casillas`, concatenando los elementos en la misma columna para formar una representación vertical.
 *
 * @returns {string[]} Un array con tres cadenas, donde cada cadena representa la secuencia de símbolos ('X', 'O', o 'V') en cada columna del tablero.
 */
function leerCasillasVertical(){
    let lecturas = ['','',''];
    for (let c = 0; c < 3; c++) {
        for (let f = 0; f < 3; f++) {
            lecturas[c] += casillas[f][c];
        }
    }
    return lecturas;
}

/**
 * Lee la secuencia de símbolos en la diagonal invertida del tablero.
 * 
 * La función recorre la diagonal principal que va desde la esquina superior derecha hasta la inferior izquierda, concatenando los símbolos encontrados.
 *
 * @returns {string} Una cadena representativa de los símbolos ('X', 'O', o 'V') en la diagonal invertida del tablero.
 */
function leerCasillasDiagonalInvertida(){
    let lectura = '';
    // Lee en diagonales
    for (let i = 0; i < 3; i++) {
        lectura += casillas[i][i];
    }

    return lectura;
}

/**
 * Lee la secuencia de símbolos en la diagonal principal del tablero.
 * 
 * La función recorre la diagonal que va desde la esquina superior izquierda hasta la inferior derecha, concatenando los símbolos encontrados.
 *
 * @returns {string} Una cadena representativa de los símbolos ('X', 'O', o 'V') en la diagonal principal del tablero.
 */
function leerCasillasDiagonal(){
    let lectura = '';
    let c = 2
    for (let f = 0; f < 3; f++) {
        lectura += casillas[f][c];
        c--;
    }
    return lectura;
}

/**
 * Lee las secuencias de símbolos en la forma de rombo del tablero.
 * 
 * La función extrae los símbolos que forman el rombo central, recorriendo específicamente sus cuatro posiciones definidas: dos arriba y abajo, izquierda y derecha del centro.
 *
 * @returns {string[]} Un array con cuatro cadenas, cada una representando la secuencia de símbolos ('X', 'O', o 'V') que forman el rombo del tablero.
 */
function leerCasillasRombo(){
    let lecturas = [];

    lecturas[0] = casillas[1][0] + casillas[0][1];
    lecturas[1] = casillas[0][1] + casillas[1][2];
    lecturas[2] = casillas[1][2] + casillas[2][1];
    lecturas[3] = casillas[2][1] + casillas[1][0];

    return lecturas;
}

/**
 * Revisa si hay un ganador en el juego al evaluar todas las posibles combinaciones 
 * que podrían indicar una victoria (horizontal, vertical y diagonales).
 *
 * @returns {number} El resultado de la evaluación:
 *                   0 = No hay ganador ni empate
 *                   1 = Jugador ha ganado
 *                   2 = Bot ha ganado
 *                   3 = Empate (todas las casillas llenadas sin un ganador)
 */

function revisarGanador(){
    let analisis = 0;
    let lecturas = [];

    /**
     * Revisa cada fila horizontal para determinar si hay una línea completa 
     * de 'X' o 'O', lo que indicaría un ganador.
     */
    lecturas = leerCasillasHorizontal();
    for(let i = 0; i < 3; i++){
        analisis = analisisSituacionGanador(lecturas[i]);
        if(analisis!=0){
            return analisis;
        }
    }
    
    lecturas = leerCasillasVertical();
    for(let i = 0; i < 3; i++){
        analisis = analisisSituacionGanador(lecturas[i]);
        if(analisis!=0){
            return analisis;
        }
    }
    
    analisis = analisisSituacionGanador(leerCasillasDiagonalInvertida());
    if(analisis!=0){
        return analisis;
    }

    analisis = analisisSituacionGanador(leerCasillasDiagonal());
    if(analisis!=0){
        return analisis;
    }

    /**
     * Si no hay ganador y se han jugado todas las casillas, entonces es un empate.
     * La variable `turno` representa el número de movimientos realizados. 
     * En Tic-Tac-Toe con un tablero 3x3, si turno == 9, significa que
     * todas las casillas están llenas sin ningún ganador.
     */
    if(analisis == 0 && turno == 9){
        return 3;
    }

    // Retorno por defecto si no se encuentra un ganador ni empate
    return 0;

}

/**
 * Analiza si hay un ganador en el juego basado en el estado actual del tablero.
 *
 * @param {string} lectura - Una cadena que representa el estado del tablero. 
 *                           Por ejemplo, "XXX" o "OOO".
 * @returns {number} El resultado de la evaluación:
 *                   0 = No hay ganador
 *                   1 = Jugador ha ganado
 *                   2 = Bot ha ganado
 */

function analisisSituacionGanador(lectura){
    /**
     * Este switch evalúa el estado del tablero:
     * - Si la lectura es 'XXX', significa que el jugador ha ganado.
     *   En este caso, se detiene el juego y devuelve 1.
     * - Si la lectura es 'OOO', indica que el bot ha ganado.
     *   Aquí también se detiene el juego y devuelve 2.
     *
     * Si ninguna de estas condiciones se cumple, no hay un ganador claro,
     * por lo que la función devuelve 0 indicando "Sin ganador".
     */
    switch(lectura){
        case 'XXX':
            // jugador es el ganador
            jugando = false;
            return 1;
        case 'OOO':
            // bot es el ganador
            jugando = false;
            return 2;
    }   
    
    // Retorno por defecto si no se cumple ninguna condición de victoria
    return 0;
}