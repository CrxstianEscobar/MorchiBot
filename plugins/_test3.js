let handler = async (m, { conn }) => {
    const sections = [
        {
            title: "Opciones de imagen",
            rows: [
                { title: "Ver Messi", rowId: ".messi" },
                { title: "Ver CR7", rowId: ".cr7" }
            ]
        }
    ];

    const listMessage = {
        text: "¿Qué imagen quieres ver?",
        buttonText: "Elegir",
        sections,
        viewOnce: true
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = /^tesj$/i;
export default handler;