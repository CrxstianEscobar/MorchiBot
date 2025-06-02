import { proto, generateWAMessage, areJidsSameUser } from '@whiskeysockets/baileys'

let conn; // Aquí asigna tu conexión Baileys al iniciar el bot

// --- Hook before para "convertir" respuestas de botones a mensajes de texto ---
async function before(m, chatUpdate) {
    if (m.isBaileys) return
    if (!m.message) return

    if (m.mtype === "interactiveResponseMessage" && m.quoted?.fromMe) {
        // Extrae el id del botón pulsado
        const paramsJson = m.msg?.nativeFlowResponseMessage?.paramsJson
        if (!paramsJson) return
        let id = JSON.parse(paramsJson).id
        if (!id) return

        // Genera un mensaje de texto simulando que el usuario escribió el id
        let messages = await generateWAMessage(m.chat, { text: id, mentions: m.mentionedJid }, {
            userJid: conn.user.id,
            quoted: m.quoted?.fakeObj
        })

        messages.key.fromMe = areJidsSameUser(m.sender, conn.user.id)
        messages.key.id = m.key.id
        messages.pushName = m.pushName
        if (m.isGroup) messages.participant = m.sender

        let msg = {
            ...chatUpdate,
            messages: [proto.WebMessageInfo.fromObject(messages)],
            type: 'append'
        }

        conn.ev.emit('messages.upsert', msg)
    }
}

// --- Comando que envía un mensaje con botones interactivos ---
let handler = async (m, { conn }) => {
    conn = conn // Asignar la conexión para que before pueda usarla

    const buttons = [
        {
            buttonId: '.messi',
            buttonText: { displayText: '⚽ Ver Messi' },
            type: 1
        },
        {
            buttonId: '.cr7',
            buttonText: { displayText: '🥅 Ver CR7' },
            type: 1
        }
    ]

    await conn.sendMessage(m.chat, {
        text: 'Elige un jugador:',
        buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = /^(x)$/i

// --- Comandos para procesar los botones simulados como mensajes de texto ---
let messiHandler = async (m) => {
    await m.reply('Aquí tienes una imagen de Messi ⚽')
}

messiHandler.command = /^\.messi$/i

let cr7Handler = async (m) => {
    await m.reply('Aquí tienes una imagen de CR7 🥅')
}

cr7Handler.command = /^\.cr7$/i

export default { before, handler, messiHandler, cr7Handler }