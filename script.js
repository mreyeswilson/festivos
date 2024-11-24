import festivos from "./festivos.json" with { type: "json" };


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
    const festivo = festivos.find(f => dayjs(f.fecha).isAfter(today, "day"));
    if (!festivo) return null;

    return {
        ...festivo,
        fecha: dayjs(festivo.fecha).valueOf() / 1000
    }
};


const title = "Festivos Colombia " + new Date().getFullYear();

document.addEventListener("DOMContentLoaded", update);


function update() {
    $("title").innerHTML = title;
    $(".title").innerHTML = title;
    $("#flipdown").innerHTML = ""
    
    let nextFextivo = getFestivo();

    if (!nextFextivo) 
        nextFextivo = {
            fecha: 0,
            nombre: ""
        }
    

    $(".next-festivo").innerHTML = `
    <div class="text-left w-full">
        <b class="block w-full text-black">Próximo festivo:</b> 
        <span class="text-sm text-red-500">${dayjs(nextFextivo.fecha * 1000).format("dddd, DD [de] MMMM")} - ${nextFextivo?.nombre}</span>
    <div>
    `;

    new FlipDown(nextFextivo.fecha, {
        language,
        headings: ['Días', 'Horas', 'Minutos', 'Segundos'],
    }).start().ifEnded(() => {
       location.reload()
    })
}



