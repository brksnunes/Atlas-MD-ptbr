import { checkWelcome } from "./MongoDB/MongoDb_Core.js";

export default async (Atlas, anu) => {
  try {
    const metadata = await Atlas.groupMetadata(anu.id);
    const participants = anu.participants;
    let desc = metadata.desc;
    if (desc == undefined) desc = "Sem descrição";

    for (const numEntry of participants) {
      // Baileys v7 returns participants as objects {id, lid} instead of plain strings
      const num = typeof numEntry === "string" ? numEntry : numEntry.id;
      let ppuser;
      try {
        ppuser = await Atlas.profilePictureUrl(num, "image");
      } catch {
        ppuser = "https://i.imgur.com/MClOeqe.jpeg";
      }

      if (anu.action == "add") {
        const WELstatus = await checkWelcome(anu.id);
        const WAuserName = num;

        const Atlastext = `
Olá @${WAuserName.split("@")[0]}! 👋

Bem-vindo(a) ao grupo *${metadata.subject}*.

*🧣 Descrição do grupo 🧣*

${desc}

*Seja bem-vindo(a)!*
  `;
        if (WELstatus) {
          await Atlas.sendMessage(anu.id, {
            image: { url: ppuser },
            caption: Atlastext,
            mentions: [num],
          });
        }
      } else if (anu.action == "remove") {
        const WELstatus = await checkWelcome(anu.id);
        const WAuserName = num;

        const Atlastext = `
  @${WAuserName.split("@")[0]} saiu do grupo.
  `;
        if (WELstatus) {
          await Atlas.sendMessage(anu.id, {
            image: { url: ppuser },
            caption: Atlastext,
            mentions: [num],
          });
        }
      }
    }
  } catch (err) {
    console.error("[ EXCEPTION ]", err);
  }
};
