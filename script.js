import { throwConffeti } from "./confetti.js";

dayjs.extend(dayjs_plugin_isSameOrAfter)
dayjs.locale('es');

/**
 *
 * @param {string} selector
 * @returns {Element | null}
 */
const $ = (selector) => document.querySelector(selector);
const today = dayjs();

const language = {
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], // Días de la semana en español
    months: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ], // Meses del año en español
    countdownTitle: '¡Cuenta regresiva hasta el festivo!',
    countdownSubtitle: '¡Feliz descanso!',

};

const url = "https://script.googleusercontent.com/macros/echo?user_content_key=YpLUABsxjjIoutlloQp-OEYdDINDfZG5ywOBNflEgNeBHf1QMM70i1i8Ai6YIFP7z9BQkV5SLEN6G2N2AoXr4MLuoYUhqa-fm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMSk1hKidNPigzJD4VOywdWCAEAFGvgXH3IHta_Hv2_FLqzCk1VN72P5bIwK08l-mGOi-uRIrT1Rsa1D_gtQU_VKdYxk-bn_mNz9Jw9Md8uu&lib=MZj75W6tlZ-AOX3FuhBPRx0_xGF0snHn-"
const getData = () => new Promise(async (resolve, reject) => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        resolve(data.map((item) => ({
            fecha: dayjs(item.Fecha),
            motivo: item.Motivo,
            dow: item.DOW,
        })))
    } catch (error) {
        reject(error)
    }
})

const getFestivo = () => {
    const festivo = festivos.find(f => dayjs(f.fecha).isAfter(today, "day"));
    if (!festivo) return null;

    return {
        ...festivo,
        fecha: dayjs(festivo.fecha).valueOf() / 1000
    }
};


const title = "Festivos Colombia " + new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    update();
    initParticlesJS();
});

function update() {

    const loader = $("#loader")
    getData().then((data) => {
        let {fecha, motivo} = data.find(f => f.fecha.isAfter(today, "day"))

        // Actualizar título con el próximo festivo
        const festivoTitle = `${motivo} - ${fecha.format('DD [de] MMMM')}`;
        $("title").innerHTML = festivoTitle;
        $(".title").innerHTML = festivoTitle;
        $("#flipdown").innerHTML = ""


        const milliseconds = Math.floor(fecha.valueOf() / 1000);

        currentFlipDown = new FlipDown(milliseconds, {
            language,
            headings: ['Días', 'Horas', 'Minutos', 'Segundos'],
        });

        currentFlipDown.start().ifEnded(() => {
           location.reload();
        });

        loader.classList.add("hidden")

        const isToday = data.find(f => f.fecha.isSame(today, "day"))

        if (isToday) throwConffeti()

        // Generar línea de tiempo
        generateTimeline(data)
    }).catch((error) => {
        console.log(error)
    })
}

// Función para generar la línea de tiempo
function generateTimeline(festivosData) {
    const timelineContainer = $("#timeline");

    // Ordenar los festivos por fecha
    const festivosOrdenados = festivosData.sort((a, b) => a.fecha - b.fecha);

    // Obtener 2 festivos pasados y 3 próximos
    const festivosPasados = festivosOrdenados.filter(f => f.fecha.isBefore(today, 'day')).slice(-2);
    const festivosFuturos = festivosOrdenados.filter(f => f.fecha.isSameOrAfter(today, 'day')).slice(0, 3);

    const festivosSeleccionados = [...festivosPasados, ...festivosFuturos];

    // Limpiar contenedor
    timelineContainer.innerHTML = "";

    festivosSeleccionados.forEach((festivo, index) => {
        const { fecha, motivo } = festivo;

        // Determinar el estado del festivo
        let status = 'future';
        let statusText = 'Próximo';
        let dotClass = 'future';

        if (fecha.isBefore(today, 'day')) {
            status = 'past';
            statusText = 'Pasado';
            dotClass = 'past';
        } else if (fecha.isSame(today, 'day')) {
            status = 'current';
            statusText = 'Hoy';
            dotClass = 'current';
        }

        // Crear elemento de la línea de tiempo
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.style.setProperty('--index', index);

        // Añadir clase especial a la tarjeta del medio (índice 2)
        if (index === 2) {
            timelineItem.classList.add('middle-item');
        }

        // Hacer clickeables las tarjetas futuras
        if (status === 'future' || status === 'current') {
            timelineItem.classList.add('clickeable');
            timelineItem.addEventListener('click', () => {
                updateFlipDownAndTitle(festivo);
                updateSelectedCard(timelineItem);
            });
        }

        timelineItem.innerHTML = `
            <div class="timeline-card">
                <span class="timeline-card-pointer" aria-hidden="true"></span>
                <div class="timeline-date">${fecha.format('DD MMM')}</div>
                <div class="timeline-event">${motivo}</div>
                <span class="timeline-status status-${status}">${statusText}</span>
            </div>
            <div class="timeline-dot ${dotClass}"></div>
        `;

        timelineContainer.appendChild(timelineItem);
    });
}

// Variable global para almacenar el FlipDown actual
let currentFlipDown = null;

// Función para actualizar FlipDown y título
function updateFlipDownAndTitle(festivo) {
    const { fecha, motivo } = festivo;

    // Actualizar el título
    const newTitle = `${motivo} - ${fecha.format('DD [de] MMMM')}`;
    $(".title").innerHTML = newTitle;
    $("title").innerHTML = newTitle;

    // Limpiar el contenedor del FlipDown
    $("#flipdown").innerHTML = "";

    // Crear nuevo FlipDown
    const milliseconds = Math.floor(fecha.valueOf() / 1000);

    // Destruir el FlipDown anterior si existe
    if (currentFlipDown) {
        try {
            currentFlipDown.destroy();
        } catch (e) {
            // Ignorar errores de destrucción
        }
    }

    // Crear nuevo FlipDown
    currentFlipDown = new FlipDown(milliseconds, {
        language,
        headings: ['Días', 'Horas', 'Minutos', 'Segundos'],
    });

    currentFlipDown.start().ifEnded(() => {
        location.reload();
    });
}

// Función para actualizar la tarjeta seleccionada
function updateSelectedCard(selectedItem) {
    // Remover clase selected de todas las tarjetas
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Añadir clase selected a la tarjeta clickeada
    selectedItem.classList.add('selected');
}

// Inicializa particles.js sobre el contenedor existente
function initParticlesJS() {
    const containerId = 'particles-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Asegura que la lib esté cargada
    if (typeof window.particlesJS !== 'function') {
        // reintenta brevemente por si carga lenta del CDN
        setTimeout(initParticlesJS, 100);
        return;
    }

    window.particlesJS(containerId, {
        particles: {
            number: { value: window.innerWidth < 768 ? 60 : 120, density: { enable: true, value_area: 900 } },
            color: { value: ["#ffffff", "#a3bffa", "#7aa2ff"] },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 140, color: "#a3bffa", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1.4, direction: "none", random: false, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "window",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "repulse" },
                resize: true
            },
            modes: {
                grab: { distance: 160, line_linked: { opacity: 0.35 } },
                repulse: { distance: 180, duration: 0.4 }
            }
        },
        retina_detect: true
    });
}
