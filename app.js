const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter = require('@bot-whatsapp/database/postgres')
const { EVENTS } = require('@bot-whatsapp/bot')

/**
 * Declaramos las conexiones de PostgreSQL
 */

const POSTGRES_DB_HOST = 'localhost'
const POSTGRES_DB_USER = 'postgres'
const POSTGRES_DB_PASSWORD = '884400'
const POSTGRES_DB_NAME = 'postgres'
const POSTGRES_DB_PORT = '5432'

/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

const flowServices = addKeyword(['ser', 'servicio', 'servicios']).addAnswer(
    '📄 Aquí', {
    media: 'https://chatbot.limitless-agency.online/Servicios-LimitlessAgency.pdf',
}).addAnswer(
    '📄 Aquí tienes un PDF para ver los precios de mis servicios').addAnswer([
        'Puede realizar culquier pregunta', 
        '**Menu** - Volver al menú principal',])


const flowVentas = addKeyword(['ventas', 'venta']).addAnswer(
    [
        '📄 Ya está en el área de ventas, nuestro equipo se pondrá en contacto con usted a la brevedad. Mientras tanto, puedes elegir entre las siguientes opciones:',
        ' ',
        '**Servicios** - Me gustaría ver el catalogo o servicios',
        '**Propuesta** - Me interesa una propuesta comercial',
        ' ',
        '**Menu** - Volver al menú principal',
    ],
    null,
    null,
    [flowServices]
)




const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowDiscord = addKeyword(['discord']).addAnswer(
    ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
    null,
    null,
    [flowSecundario]
)

const flowBienvenida = addKeyword(EVENTS.WELCOME)
    .addAnswer(['👋Hola , gracias por comunicarte con nuestra Limitless Agency✨ ',
        'Soy el Sr. Bot🤖, tu asistente virtual. Por favor indícame qué es lo que deseas hacer, escribe y te ayudaré.',
        ' ',
        '✍ *Ventas* para ver los Servicios y Precios',
        '✍ *Hablar con un asesor* si deseas agendar una reunion'
    ],
    {
        media: 'https://chatbot.limitless-agency.online/300x400.png',
    },
    null,
    [flowVentas, flowGracias, flowDiscord]
    )

const flowPrincipal = addKeyword(['hola', 'ole', 'alo', 'menu', 'menú'])
    .addAnswer(['👋Hola , gracias por comunicarte con nuestra Limitless Agency✨ ',
            'Soy el Sr. Bot🤖, tu asistente virtual. Por favor indícame qué es lo que deseas hacer, escribe y te ayudaré.',
            ' ',
            '👉 *Ventas* para ver los Servicios y Precios',
            '👉 *Soporte*  Si tienes un problema con algun servicio en linea',
            '👉 *Hablar con un asesor* si deseas agendar una reunion'
        ],
        {
            media: 'https://chatbot.limitless-agency.online/300x400.png',
        },
        null,
        [flowVentas, flowGracias, flowDiscord]
    )



const main = async () => {
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
    })
    const adapterFlow = createFlow([flowPrincipal, flowBienvenida])
    const adapterProvider = createProvider(BaileysProvider)
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    QRPortalWeb()
}

main()
