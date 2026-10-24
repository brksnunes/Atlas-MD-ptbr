import fs from "fs";
import moment from "moment-timezone";
import {
  setWelcome,
  checkWelcome,
  delWelcome,
  setAntilink,
  checkAntilink,
  delAntilink,
  setGroupChatbot,
  checkGroupChatbot,
  delGroupChatbot,
  setAntidelete,
  checkAntidelete,
  delAntidelete,
  checkMod,
} from "../System/MongoDB/MongoDb_Core.js";

const mergedCommands = [
  "admins",
  "admin",
  "setgcname",
  "delete",
  "antilink",
  "welcome",
  "del",
  "demote",
  "gclink",
  "grouplink",
  "group",
  "gc",
  "groupinfo",
  "gcinfo",
  "hidetag",
  "htag",
  "leave",
  "promote",
  "remove",
  "revoke",
  "setgcdesc",
  "setppgc",
  "tagall",
  "chatbotgc",
  "antidel",
  "antidelete",
];

export default {
  name: "groupanagement",
  alias: [...mergedCommands],
  uniquecommands: [
    "admins",
    "setgcname",
    "delete",
    "demote",
    "gclink",
    "antilink",
    "welcome",
    "group",
    "gcinfo",
    "tagall",
    "hidetag",
    "leave",
    "promote",
    "remove",
    "revoke",
    "setgcdesc",
    "setppgc",
    "chatbotgc",
    "antidel",
  ],
  description: "Todos os comandos de gestão de grupo",
  start: async (
    Atlas,
    m,
    {
      inputCMD,
      text,
      prefix,
      doReact,
      args,
      itsMe,
      participants,
      metadata,
      mentionByTag,
      mime,
      isMedia,
      quoted,
      botNumber,
      botLid,
      isBotAdmin,
      groupAdmin,
      isAdmin,
    },
  ) => {
    const messageSender = m.sender;
    const quotedsender = m.quoted ? m.quoted.sender : mentionByTag[0];
    // Helper: check if a JID belongs to the bot (handles phone JID, LID, or any format)
    const isBotJid = (jid) => {
      if (!jid) return false;
      if (jid === botNumber || jid === botLid) return true;
      // Also check via the LID<->JID map
      const mapped = global.lidToJidMap?.get(jid);
      if (mapped && (mapped === botNumber || mapped === botLid)) return true;
      return false;
    };
    switch (inputCMD) {
      case "admins":
      case "admin": {
        let message;
        if (!isMedia) {
          if (m.quoted) {
            message = m.quoted.msg || "『 *Atenção, admins* 』";
          } else if (args.length) {
            message = `『 *Atenção, admins* 』\n\n*🎀 Message:* ${args.join(" ")}`;
          } else {
            message = "『 *Atenção, admins* 』";
          }
        } else {
          // Capture caption from the quoted media or from args
          const caption = m.quoted?.msg?.caption || m.msg?.caption || (args.length ? args.join(" ") : "");
          message = caption
            ? `『 *Atenção, admins* 』\n\n*🎀 Message:* ${caption}`
            : "『 *Atenção, admins* 』\n\n*🎀 Message:* Confira isso!";
        }
        await doReact("🏅");
        Atlas.sendMessage(
          m.from,
          { text: message, mentions: groupAdmin },
          { quoted: m },
        );
        break;
      }

      case "setgcname": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Informe um novo nome para o grupo!\n\nExemplo: *${prefix}setgcname Bot de Teste*`,
          );
        }
        await doReact("🎐");
        const oldGCName = metadata.subject;
        let ppgc;
        try {
          ppgc = await Atlas.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        try {
          await Atlas.groupUpdateSubject(m.from, text);
          await Atlas.sendMessage(
            m.from,
            {
              image: { url: ppgc },
              caption: `*『 Nome do grupo atualizado 』*\n\n_🔶 Nome antigo:_\n*${oldGCName}*\n\n_🔷 Novo nome:_\n*${text}*\n`,
            },
            { quoted: m },
          );
        } catch (err) {
          await m.reply(`Falha ao atualizar o nome do grupo: ${err.message}`);
        }
        break;
      }

      case "delete":
      case "del": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!m.quoted) {
          await doReact("❔");
          return m.reply(`Responda *uma mensagem* para apagá-la!`);
        }
        if (!isBotAdmin) {
          if (!m.quoted.sender.includes(botNumber)) {
            await doReact("❌");
            return m.reply(
              `Desculpe, sem permissão de *Admin* eu só posso apagar minhas próprias mensagens!`,
            );
          }
          const key = { remoteJid: m.from, fromMe: true, id: m.quoted.id };
          if (!global.botDeletedMsgIds) global.botDeletedMsgIds = new Set();
          global.botDeletedMsgIds.add(m.quoted.id);
          setTimeout(() => global.botDeletedMsgIds?.delete(m.quoted.id), 300000);
          await doReact("📛");
          await Atlas.sendMessage(m.from, { delete: key });
        } else {
          if (!isAdmin) {
            await doReact("❌");
            return m.reply(
              `Desculpe, só *Admins* podem apagar mensagens de outros!`,
            );
          }
          const key = {
            remoteJid: m.from,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender,
          };
          if (!global.botDeletedMsgIds) global.botDeletedMsgIds = new Set();
          global.botDeletedMsgIds.add(m.quoted.id);
          setTimeout(() => global.botDeletedMsgIds?.delete(m.quoted.id), 300000);
          await Atlas.sendMessage(m.from, { delete: key });
        }
        break;
      }

      case "demote": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`Marque um usuário ou responda a mensagem dele para *rebaixar*!`);
        }
        if (quotedsender && quotedsender === m.sender) {
          await doReact("❌");
          return m.reply(`Você não pode rebaixar a si mesmo(a)!`);
        }
        if (isBotJid(quotedsender)) {
          await doReact("❌");
          return m.reply(`Desculpe, não posso me rebaixar!`);
        }
        const mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        const userId = mentionedUser || m.msg.contextInfo.participant;
        if (!groupAdmin.includes(userId)) {
          return Atlas.sendMessage(
            m.from,
            {
              text: `@${mentionedUser.split("@")[0]} Senpai não é *Admin* deste grupo!`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        }
        // Cannot demote the bot itself (second check after userId is resolved)
        if (isBotJid(userId)) {
          await doReact("❌");
          return m.reply(`Desculpe, não posso me rebaixar!`);
        }
        // Cannot demote the group creator
        if (metadata.owner && (userId === metadata.owner || userId.replace(/[^0-9]/g, "") === metadata.owner.replace(/[^0-9]/g, ""))) {
          await doReact("❌");
          return m.reply(`*Comando recusado!* Você não pode rebaixar o *criador do grupo*!`);
        }
        await doReact("📉");
        try {
          await Atlas.groupParticipantsUpdate(m.from, [userId], "demote");
          await Atlas.sendMessage(
            m.from,
            {
              text: `Sorry @${mentionedUser.split("@")[0]} Senpai, você foi *rebaixado(a)* por @${messageSender.split("@")[0]} !`,
              mentions: [mentionedUser, messageSender],
            },
            { quoted: m },
          );
        } catch (error) {
          await doReact("❌");
          await Atlas.sendMessage(
            m.from,
            {
              text: `Ocorreu um erro ao rebaixar @${mentionedUser.split("@")[0]} Senpai !\n\n*Error:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        }
        break;
      }

      case "gclink":
      case "grouplink": {
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        await doReact("🧩");
        const link = await Atlas.groupInviteCode(m.from);
        const linkcode = `https://chat.whatsapp.com/${link}`;
        let ppgc;
        try {
          ppgc = await Atlas.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        try {
          await Atlas.sendMessage(
            m.from,
            {
              image: { url: ppgc },
              caption: `\n_🎀 Nome do grupo:_ *${metadata.subject}*\n\n_🧩 Link do grupo:_\n${linkcode}\n`,
            },
            { quoted: m },
          );
        } catch (err) {
          await Atlas.sendMessage(
            m.from,
            { text: `Falha ao obter o link do grupo: ${err.message}` },
            { quoted: m },
          );
        }
        break;
      }

      case "group":
      case "gc": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        await doReact("⚜️");
        if (text === "close") {
          await Atlas.groupSettingUpdate(m.from, "announcement");
          await m.reply(`Grupo fechado!`);
        } else if (text === "open") {
          await Atlas.groupSettingUpdate(m.from, "not_announcement");
          await m.reply(`Grupo aberto!`);
        } else {
          await Atlas.sendMessage(
            m.from,
            {
              image: { url: botImage2 },
              caption: `\n*「 Config. de mensagens do grupo 」*\n\nEscolha uma opção abaixo.\n\n*_Uso:_*\n\n*${prefix}group open*\n*${prefix}group close*\n`,
            },
            { quoted: m },
          );
        }
        break;
      }

      case "groupinfo":
      case "gcinfo": {
        if (!m.isGroup) {
          await doReact("❌");
          return m.reply(`Este comando só pode ser usado em grupos!`);
        }
        await doReact("🎊");
        let ppgc;
        try {
          ppgc = await Atlas.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        const groupParticipants = m.isGroup ? await metadata.participants : "";
        const groupAdmins = m.isGroup
          ? groupParticipants.filter((v) => v.admin !== null).map((v) => v.id)
          : "";
        const desc = metadata.desc ? metadata.desc : "Sem descrição";
        const txt = `                 *『 Informações do grupo 』*\n\n_🎀 Nome do grupo:_ *${
          metadata.subject
        }*\n\n_🧩 Group Description:_\n${desc}\n\n_👑 Dono:_ @${
          metadata.owner.split("@")[0]
        }\n_💫 Criado em:_ *${moment(`${metadata.creation}` * 1000)
          .tz("Asia/Kolkata")
          .format("DD/MM/YYYY")}*\n_📛 Total Admins:_ *${
          groupAdmins.length
        }*\n_🎈 Total Participants:_ *${metadata.participants.length}*\n`;

        await Atlas.sendMessage(
          m.from,
          {
            image: { url: ppgc },
            caption: txt,
            mentions: [metadata.owner],
          },
          { quoted: m },
        );
        break;
      }

      case "hidetag":
      case "htag": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        let message2;
        if (!isMedia) {
          if (m.quoted) {
            message2 = m.quoted.msg || "『 *Atenção, pessoal* 』";
          } else if (args.length) {
            message2 = `『 *Atenção, pessoal* 』\n\n*🎀 Message:* ${args.join(" ")}`;
          } else {
            message2 = "『 *Atenção, pessoal* 』";
          }
        } else {
          const caption = m.quoted?.msg?.caption || m.msg?.caption || (args.length ? args.join(" ") : "");
          message2 = caption
            ? `『 *Atenção, pessoal* 』\n\n*🎀 Message:* ${caption}`
            : "『 *Atenção, pessoal* 』\n\n*🎀 Message:* Confira isso!";
        }
        await doReact("🎌");
        Atlas.sendMessage(
          m.from,
          { text: message2, mentions: participants.map((a) => a.id) },
          { quoted: m },
        );
        break;
      }

      case "leave": {
        // Only bot owners and mods can force the bot to leave
        const isOwnerForLeave = (global.owner || []).some(
          (o) => o.replace(/[^0-9]/g, "") === m.sender.replace(/[^0-9]/g, ""),
        );
        const isModForLeave = await checkMod(m.sender);
        if (!isOwnerForLeave && !isModForLeave) {
          await doReact("❌");
          return m.reply(`Somente *donos do bot* e *mods* podem usar este comando!`);
        }
        await doReact("👋");
        try {
          await Atlas.sendMessage(m.from, {
            image: { url: "https://wallpapercave.com/wp/wp9667218.png" },
            caption: `Estou saindo deste grupo a pedido... \n\nSe cuidem, pessoal :)`,
            mentions: participants.map((a) => a.id),
            quoted: m,
          });
          await Atlas.groupLeave(m.from);
        } catch (e) {
          await Atlas.sendMessage(
            m.from,
            { text: `Ocorreu um erro!` },
            { quoted: m },
          );
        }
        break;
      }

      case "promote": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text && !m.quoted) {
          await doReact("❔");
          return m.reply(`Marque um usuário ou responda a mensagem dele para *promover*!`);
        }
        if (quotedsender && quotedsender === m.sender) {
          await doReact("❌");
          return m.reply(`Você já é *Admin* deste grupo!`);
        }
        if (isBotJid(quotedsender)) {
          await doReact("❌");
          return m.reply(`Eu já sou *Admin* deste grupo!`);
        }
        const mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        const userId = mentionedUser || m.msg.contextInfo.participant;
        if (groupAdmin.includes(userId)) {
          return Atlas.sendMessage(
            m.from,
            {
              text: `@${mentionedUser.split("@")[0]} Senpai já é *Admin* deste grupo!`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        }
        await doReact("💹");
        try {
          await Atlas.groupParticipantsUpdate(m.from, [userId], "promote");
          await Atlas.sendMessage(
            m.from,
            {
              text: `Congratulations @${mentionedUser.split("@")[0]} Senpai 🥳, você foi *promovido(a)* por @${messageSender.split("@")[0]} !`,
              mentions: [mentionedUser, messageSender],
            },
            { quoted: m },
          );
        } catch (error) {
          await Atlas.sendMessage(
            m.from,
            {
              text: `Ocorreu um erro ao promover @${mentionedUser.split("@")[0]} Senpai !\n\n*Error:* ${error}`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        }
        break;
      }

      case "remove": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text && !m.quoted) {
          await doReact("❔");
          return Atlas.sendMessage(
            m.from,
            { text: `Marque um usuário ou responda a mensagem dele para *remover*!` },
            { quoted: m },
          );
        }
        if (quotedsender && quotedsender === m.sender) {
          await doReact("❌");
          return m.reply(`Você não pode se *remover* deste grupo!`);
        }
        if (isBotJid(quotedsender)) {
          await doReact("❌");
          return m.reply(`Não posso me *remover* deste grupo!`);
        }
        const mentionedUser = m.quoted ? m.quoted.sender : mentionByTag[0];
        const users = mentionedUser || m.msg.contextInfo.participant;
        await doReact("⛔");
        // Cannot remove the group creator
        if (metadata.owner && (users === metadata.owner || users.replace(/[^0-9]/g, "") === metadata.owner.replace(/[^0-9]/g, ""))) {
          await doReact("❌");
          return m.reply(`*Comando recusado!* Você não pode remover o *criador do grupo*!`);
        }
        // Cannot remove bot owners
        const ownerDigits = (global.owner || []).map((o) => o.replace(/[^0-9]/g, ""));
        if (ownerDigits.includes(users.replace(/[^0-9]/g, ""))) {
          await doReact("❌");
          return m.reply(`*Comando recusado!* Você não pode remover um *dono do bot*!`);
        }
        if (groupAdmin.includes(users)) {
          return Atlas.sendMessage(
            m.from,
            {
              text: `*Command Rejected !* @${mentionedUser.split("@")[0]} Senpai é *Admin* deste grupo, então você não pode removê-lo!`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        }
        try {
          await Atlas.groupParticipantsUpdate(m.from, [users], "remove");
          await Atlas.sendMessage(
            m.from,
            {
              text: `@${mentionedUser.split("@")[0]} foi *removido(a)* com sucesso de *${metadata.subject}*`,
              mentions: [mentionedUser],
            },
            { quoted: m },
          );
        } catch (err) {
          await m.reply(`Falha ao remover o usuário: ${err.message}`);
        }
        break;
      }

      case "setppgc": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!/image/.test(mime)) {
          await doReact("❌");
          return Atlas.sendMessage(
            m.from,
            {
              text: `Envie/responda uma imagem com a legenda ${prefix + "setgcpp"} para trocar a foto do grupo.`,
            },
            { quoted: m },
          );
        }
        await doReact("🎴");
        const quotedimage = await Atlas.downloadAndSaveMediaMessage(quoted);
        try {
          await Atlas.updateProfilePicture(m.from, { url: quotedimage });
        } catch (error) {
          await m.reply(
            `*Error:* Falha ao trocar a foto de perfil. Garanta que o bot tenha as permissões de admin.`,
          );
        } finally {
          fs.unlinkSync(quotedimage);
        }
        let ppgc;
        try {
          ppgc = await Atlas.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        Atlas.sendMessage(
          m.from,
          {
            image: { url: ppgc },
            caption: `\nA foto do grupo foi atualizada com sucesso por @${messageSender.split("@")[0]} !`,
            mentions: [messageSender],
          },
          { quoted: m },
        );
        break;
      }

      case "setgcdesc": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text && !m.quoted) {
          await doReact("❔");
          return Atlas.sendMessage(
            m.from,
            { text: `Informe uma nova descrição para o grupo!` },
            { quoted: m },
          );
        }
        await doReact("📑");
        let ppgc;
        try {
          ppgc = await Atlas.profilePictureUrl(m.from, "image");
        } catch {
          ppgc = botImage1;
        }
        const newGCdesc = m.quoted ? m.quoted.msg : text;
        try {
          await Atlas.groupUpdateDescription(m.from, newGCdesc);
          await Atlas.sendMessage(
            m.from,
            {
              image: { url: ppgc },
              caption: `*『 Descrição do grupo alterada 』*\n\n_🧩 Nova descrição:_\n*${newGCdesc}*`,
            },
            { quoted: m },
          );
        } catch (err) {
          await m.reply(`Falha ao atualizar a descrição: ${err.message}`);
        }
        break;
      }

      case "revoke": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (m.from == "120363040838753957@g.us") {
          await doReact("❌");
          return m.reply(
            "Desculpe, este comando não é permitido no *grupo de suporte do Atlas*!\n\nVocê não pode alterar o link do grupo de suporte!",
          );
        }
        await doReact("💫");
        try {
          await Atlas.groupRevokeInvite(m.from);
          await Atlas.sendMessage(
            m.from,
            { text: `Link do grupo *atualizado* com sucesso!` },
            { quoted: m },
          );
        } catch (err) {
          await m.reply(`Falha ao revogar o link: ${err.message}`);
        }
        break;
      }

      case "tagall": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        let message2;
        if (!isMedia) {
          message2 = m.quoted
            ? (m.quoted.msg || "No message")
            : args[0]
              ? args.join(" ")
              : "No message";
        } else {
          const caption = m.quoted?.msg?.caption || m.msg?.caption || (args.length ? args.join(" ") : "");
          message2 = caption || "Confira isso!";
        }

        let mess = `            『 *Atenção, pessoal* 』

*⚜️ Marcado por:* @${m.sender.split("@")[0]}

*🧩 Mensagem:* ${message2};
│\n`;
        for (const mem of participants) {
          mess += `┟ @${mem.id.split("@")[0]}\n`;
        }
        mess += `╰────────────⊰\n\n                    *Obrigado*\n`;
        await doReact("〽️");
        Atlas.sendMessage(
          m.from,
          { text: mess, mentions: participants.map((a) => a.id) },
          { quoted: m },
        );
        break;
      }

      case "chatbotgc": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}chatbotgc on`,
          );
        }
        const chatbotGCStatus = await checkGroupChatbot(m.from);
        if (args[0] == "on") {
          if (chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Chatbot do grupo* já está *ativado*!`);
          }
          await doReact("🧩");
          await setGroupChatbot(m.from);
          await m.reply(
            `*Chatbot do grupo* foi *ativado* com sucesso! \n\nO bot responderá quando for mencionado!`,
          );
        } else if (args[0] == "off") {
          if (!chatbotGCStatus) {
            await doReact("❌");
            return m.reply(`*Chatbot do grupo* já está *desativado*!`);
          }
          await doReact("🧩");
          await delGroupChatbot(m.from);
          await m.reply(`*Chatbot do grupo* foi *desativado* com sucesso!`);
        } else {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}chatbotgc on`,
          );
        }
        break;
      }

      case "antilink": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}antilink on`,
          );
        }
        const antilinkStatus = await checkAntilink(m.from);
        if (args[0] == "on") {
          if (antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Anti-link* já está *ativado*!`);
          }
          await doReact("⚜️");
          await setAntilink(m.from);
          await m.reply(
            `*Anti-link* foi *ativado* com sucesso! \n\nO bot removerá todos os links das mensagens!`,
          );
        } else if (args[0] == "off") {
          if (!antilinkStatus) {
            await doReact("❌");
            return m.reply(`*Anti-link* já está *desativado*!`);
          }
          await doReact("⚜️");
          await delAntilink(m.from);
          await m.reply(`*Anti-link* foi *desativado* com sucesso!`);
        } else {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}antilink on`,
          );
        }
        break;
      }

      case "welcome": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!isBotAdmin) {
          await doReact("❌");
          return m.reply(`*O bot* precisa ser *Admin* para usar este comando!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}welcome on`,
          );
        }
        const welcomeStatus = await checkWelcome(m.from);
        if (args[0] == "on") {
          if (welcomeStatus) {
            await doReact("❌");
            return m.reply(`*Boas-vindas* já estão *ativadas*!`);
          }
          await doReact("🎀");
          await setWelcome(m.from);
          await m.reply(
            `Mensagens de *boas-vindas/saída* foram *ativadas* com sucesso!`,
          );
        } else if (args[0] == "off") {
          if (!welcomeStatus) {
            await doReact("❌");
            return m.reply(`*Boas-vindas* já estão *desativadas*!`);
          }
          await doReact("🎀");
          await delWelcome(m.from);
          await m.reply(
            `Mensagens de *boas-vindas/saída* foram *desativadas* com sucesso!`,
          );
        } else {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}welcome on`,
          );
        }
        break;
      }

      case "antidel":
      case "antidelete": {
        if (!isAdmin) {
          await doReact("❌");
          return m.reply(`*Você* precisa ser *Admin* para usar este comando!`);
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}antidel on`,
          );
        }
        const antidelStatus = await checkAntidelete(m.from);
        if (args[0] == "on") {
          if (antidelStatus) {
            await doReact("❌");
            return m.reply(`*Anti-apagar* já está *ativado*!`);
          }
          await doReact("🛡️");
          await setAntidelete(m.from);
          await m.reply(
            `*Anti-apagar* foi *ativado* com sucesso!\n\nMensagens apagadas serão reenviadas pelo bot.`,
          );
        } else if (args[0] == "off") {
          if (!antidelStatus) {
            await doReact("❌");
            return m.reply(`*Anti-apagar* já está *desativado*!`);
          }
          await doReact("🛡️");
          await delAntidelete(m.from);
          await m.reply(`*Anti-apagar* foi *desativado* com sucesso!`);
        } else {
          await doReact("❔");
          return m.reply(
            `Informe a ação On/Off!\n\n*Exemplo:*\n\n${prefix}antidel on`,
          );
        }
        break;
      }

      default:
        break;
    }
  },
};
