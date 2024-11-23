import festivos from "./festivos.json" with {type: "json"}


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

const getFestivo = () => {
    const festivo = festivos.find(f => dayjs(f.fecha).isSameOrAfter(today, "day"));
    if (!festivo) return null;

    return {
        ...festivo,
        fecha: dayjs(festivo.fecha).valueOf() / 1000
    }
};


const title = "Festivos Colombia " + new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    $("title").innerHTML = title;
    $(".title").innerHTML = title;
    
    let nextFextivo = getFestivo();

    $("main span").innerHTML = `<span class="text-red-800"><b class="text-black">Próximo festivo:</b> ${dayjs(nextFextivo.fecha * 1000).format("DD [de] MMMM")} - ${nextFextivo.nombre}</span>`;
    
    new FlipDown(nextFextivo.fecha, {
        language,
        headings: ['Días', 'Horas', 'Minutos', 'Segundos'],
    }).start().ifEnded(() => {
        nextFextivo = getFestivo();
    });
});




