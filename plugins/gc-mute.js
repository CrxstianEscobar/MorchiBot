import fs from 'fs';

let mutedUsers = new Set();

try {
const data = fs.readFileSync('./muted-users.json', 'utf-8');
mutedUsers = new Set(JSON.parse(data));
} catch (e) {
mutedUsers = new Set();
}

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {

if (!isBotAdmin) return conn.reply(m.chat, `${emojis} El bot necesita ser administrador.`, m);
if (!isAdmin) return conn.reply(m.chat, `${emojis} Solo los administradores pueden usar este comando.`, m);

let user;
if (m.quoted) {
  user = m.quoted.sender;
} else if (m.mentionedJid && m.mentionedJid.length) {
  user = m.mentionedJid[0];
} else {
  return conn.reply(m.chat, `${emojis} Responde al mensaje *o menciona* al usuario que quieres mutear.`, m);
}
/*
const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
if (user === ownerBot) {
return conn.reply(m.chat, `${emojis} No puedo mutear al propietario del bot.`, m);
}*/
const ownerBot = global.owner.map(owner => owner[0] + '@s.whatsapp.net');

if (ownerBot.includes(user)) {
  return conn.reply(m.chat, `${emojis} No puedo mutear al propietario del bot.`, m);
}

if (command === "mute") {
mutedUsers.add(user);
guardarMuteos();
conn.reply(m.chat, `🔇 *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
} else if (command === "unmute") {
mutedUsers.delete(user);
guardarMuteos();
conn.reply(m.chat, `🔊 *Usuario desmuteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
}
};

// Función para guardar los usuarios muteados en archivo
function guardarMuteos() {
fs.writeFileSync('./muted-users.json', JSON.stringify([...mutedUsers]));
}

handler.before = async (m, { conn }) => {
if (mutedUsers.has(m.sender)) {
try {
await conn.sendMessage(m.chat, { delete: m.key });
} catch (e) {
console.error('Error eliminando mensaje de usuario muteado:', e);
}
}
};

handler.help = ['mute', 'unmute'];
handler.tags = ['grupo'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;