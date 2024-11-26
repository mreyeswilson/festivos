import { throwConffeti } from "./confetti.js";
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

const url = "https://script.googleusercontent.com/macros/echo?user_content_key=YpLUABsxjjIoutlloQp-OEYdDINDfZG5ywOBNflEgNeBHf1QMM70i1i8Ai6YIFP7z9BQkV5SLEN6G2N2AoXr4MLuoYUhqa-fm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMSk1hKidNPigzJD4VOywdWCAEAFGvgXH3IHta_Hv2_FLqzCk1VN72P5bIwK08l-mGOi-uRIrT1Rsa1D_gtQU_VKdYxk-bn_mNz9Jw9Md8uu&lib=MZj75W6tlZ-AOX3FuhBPRx0_xGF0snHn-"
const getData = () => new Promise(async (resolve, reject) => {
    const res = await fetch(url)
    const data = await res.json()
    resolve(data.map((item) => ({
        fecha: dayjs(item.Fecha),
        motivo: item.Motivo,
        dow: item.DOW,
    })))
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

document.addEventListener("DOMContentLoaded", update);

function update() {

    const loader = $("#loader")
    getData().then((data) => {
        $("title").innerHTML = title;
        $(".title").innerHTML = title;
        $("#flipdown").innerHTML = ""

        
        let {fecha, motivo} = data.find(f => f.fecha.isAfter(today, "day"));
    
        $(".next-festivo").innerHTML = `
        <div class="text-left w-full">
            <b class="block w-full text-black">Próximo festivo:</b> 
            <span class="text-sm text-red-500">${fecha.format("dddd, DD [de] MMMM")} - ${motivo}</span>
        <div>
        `;

        const milliseconds = fecha.valueOf() / 1000 ?? 0;
    
        new FlipDown(milliseconds, {
            language,
            headings: ['Días', 'Horas', 'Minutos', 'Segundos'],
        }).start().ifEnded(() => {
           location.reload()
        })

        loader.classList.add("hidden")

        const isToday = data.find(f => f.fecha.isSame(today, "day"))

        if (isToday) throwConffeti()
    })

    
}



