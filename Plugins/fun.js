import axios from "axios";

let mergedCommands = ["truth", "dare", "coinflip", "dice", "fact"];

export default {
  name: "fun",
  alias: [...mergedCommands],
  uniquecommands: ["truth", "dare", "coinflip", "dice", "fact"],
  description: "All fun Commands",
  start: async (
    Atlas,
    m,
    { text, args, prefix, inputCMD, mentionedJid, mentionByTag, doReact },
  ) => {
    function randomNumberPicker(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    switch (inputCMD) {
      case "truth":
        await doReact("🤔");
        const truth = [
          "Qual é o seu maior medo?",
          "Você já mentiu pra se livrar de um problema?",
          "Qual a coisa mais vergonhosa que você já fez?",
          "Você já guardou segredo do seu melhor amigo(a)?",
          "Qual mania sua você acha esquisita?",
          "Quem é o seu crush secreto?",
          "Qual a pior mentira que você já contou?",
          "Você já colou numa prova?",
          "Qual a coisa mais infantil que você ainda faz?",
          "Você já fez xixi na piscina?",
          "Qual a mensagem mais constrangedora que você já mandou?",
          "Se pudesse trocar de lugar com alguém por um dia, quem seria?",
          "Qual o sonho mais assustador que você já teve?",
          "Você já quebrou algo e culpou outra pessoa?",
          "Qual o maior tempo que você já ficou sem escovar os dentes?",
          "Que segredo você nunca contou a ninguém?",
          "Quem neste grupo você acha o mais inteligente?",
          "Você já deu gelo em alguém?",
          "Qual é o seu pior hábito?",
          "Você já riu numa hora inapropriada?",
          "Qual o seu maior arrependimento na vida?",
          "Você canta no banho? Se sim, o quê?",
          "Você já fuçou o celular de outra pessoa?",
          "Qual o momento romântico mais constrangedor da sua vida?",
          "Você já matou aula?",
          "Quem foi o seu primeiro crush?",
          "Qual o seu medo mais bobo?",
          "Você já treinou beijo no espelho?",
          "Qual o apelido mais vergonhoso que você já teve?",
          "Qual a coisa mais irritante no seu melhor amigo(a)?",
          "Você já sentiu ciúmes de um amigo(a)? Por quê?",
          "Você já mandou mensagem pra pessoa errada sem querer?",
          "Qual a coisa mais nojenta que você já comeu?",
          "Quem é a pessoa mais irritante que você conhece?",
          "Qual moda você seguiu e hoje se arrepende?",
          "Você já fingiu estar doente pra fugir de um compromisso?",
          "Qual o sonho mais estranho que você já teve com alguém deste grupo?",
          "Quem você acha o(a) mais bonito(a) deste grupo?",
          "Qual o pior presente que você já ganhou?",
          "Você já chorou vendo filme? Qual?",
          "Qual música você ama em segredo mas finge odiar?",
          "Se tivesse que apagar um app do celular, qual seria?",
          "Qual o maior tempo que você já passou nas redes sociais num dia?",
          "Você já derrubou comida no chão e comeu?",
          "Qual a sua maior insegurança?",
          "Você já tentou pagar de descolado(a) e falhou feio?",
          "Qual a coisa mais estranha que você faz quando está sozinho(a)?",
          "Quem foi o seu pior professor(a) e por quê?",
          "Você já ouviu escondido(a) a conversa de alguém?",
          "Qual foi a maior encrenca em que você já se meteu?",
          "Qual foi a roupa mais vergonhosa que você já usou?",
          "Você já riu tanto a ponto de chorar?",
          "Qual mentira que você contou saiu totalmente do controle?",
          "Você já roubou alguma coisa?",
          "Quem foi a última pessoa que você pesquisou no Instagram?",
          "Qual foi o pior encontro (date) da sua vida?",
          "Você já usou alguém pra se dar bem?",
          "Quem você finge gostar, mas na real não gosta?",
          "Qual a coisa mais vergonhosa que seus pais já te pegaram fazendo?",
          "Qual a coisa mais estranha que você já comprou?",
          "Você já estragou uma festa surpresa?",
          "Qual o motivo mais bobo pelo qual você já ficou bravo(a) com alguém?",
          "Qual o seu pior hábito ao mandar mensagens?",
          "Pra quem você mais manda mensagens?",
          "Qual a coisa mais estranha no seu quarto?",
          "Você já teve crush em personagem fictício?",
          "O que você faz que acha que mais ninguém faz?",
          "Você já curtiu sem querer uma foto antiga de alguém que estava stalkeando?",
          "Quem neste grupo mais te faz rir?",
          "Qual a coisa mais boba que você acreditava quando criança?",
          "Você já furtou algo de uma loja?",
          "Qual o seu pensamento mais estranho no banho?",
          "Qual fobia sua que é totalmente irracional?",
          "Se só pudesse comer uma comida pelo resto da vida, qual seria?",
          "Qual a coisa mais vergonhosa que você já mandou pro crush?",
          "Você já teve uma experiência paranormal?",
          "Quem é a pessoa que você se arrepende de ter namorado/ficado?",
          "Qual foi o maior boato que espalharam sobre você?",
          "Você já espalhou um boato sobre alguém?",
          "O que você fica feliz da sua família não saber sobre você?",
          "Você tem um talento escondido? Qual?",
          "Você já esqueceu totalmente o que ia falar no meio da frase?",
          "Você já dormiu em público?",
          "Qual o maior tempo que você já ficou acordado(a)?",
          "Qual a combinação de comida mais estranha que você gosta?",
          "Se ganhasse na loteria amanhã, qual seria a primeira coisa que compraria?",
          "Que filme você já viu mais de 5 vezes?",
          "Você já chorou pra escapar de multa ou encrenca?",
          "Qual o boato mais estranho que você já ouviu sobre si mesmo(a)?",
          "Você já saiu escondido(a) de casa?",
          "Qual foi a pior coisa que você já disse a alguém?",
          "Pra quem você ligaria pra ajudar a enterrar um corpo?",
          "Você conversa consigo mesmo(a) no espelho?",
          "Você já mentiu sobre a sua idade?",
          "Qual o seu prazer mais culpado?",
          "Se a sua vida fosse um filme, qual seria o título?",
          "Você já fingiu estar doente pra ficar em casa?",
          "O que você faz que irrita os outros?",
          "Você já tropeçou e caiu em público? O que aconteceu?",
          "Quem você stalkeia em segredo nas redes sociais?",
          "Qual a coisa mais ridícula que você já comprou online?",
        ];
        const truthData = truth[Math.floor(Math.random() * truth.length)];

        await Atlas.sendMessage(
          m.from,
          { image: { url: botImage3 }, caption: `*${truthData}*` },
          { quoted: m },
        );
        break;

      case "dare":
        await doReact("😎");
        const dare = [
          "Faça uma dança boba por 30 segundos.",
          "Deixe alguém escrever uma palavra na sua testa.",
          "Eat a raw slice of onion.",
          "Tente fazer malabarismo com 3 itens escolhidos pelo grupo.",
          "Fale com sotaque estranho nas próximas 3 rodadas.",
          "Deixe o grupo olhar sua galeria por 1 minuto.",
          "Poste um status totalmente aleatório e sem sentido agora.",
          "Mande um emoji estranho pra 5ª pessoa da sua lista de contatos.",
          "Lata como cachorro por 10 segundos.",
          "Tente lamber o próprio cotovelo.",
          "Segure a respiração por 15 segundos.",
          "Ligue pra um número aleatório e cante Parabéns.",
          "Deixe alguém te fazer cócegas por 30 segundos.",
          "Eat a spoonful of hot sauce.",
          "Desenhe um bigode no rosto com caneta.",
          "Use as meias nas mãos pelos próximos 10 minutos.",
          "Fale sem fechar a boca nas próximas 2 rodadas.",
          "Gire 10 vezes e tente andar em linha reta.",
          "Deixe o grupo inventar um apelido engraçado e te chamar por ele.",
          "Aja como um macaco até chegar sua vez de novo.",
          "Mande um eu te amo pra um contato aleatório.",
          "Tire uma selfie fazendo a cara mais feia possível e poste.",
          "Fique em posição de prancha por 30 segundos.",
          "Do 20 jumping jacks.",
          "Cheire o interior do sapato de outra pessoa.",
          "Beba um copo d'água sem usar as mãos.",
          "Deixe alguém pentear seu cabelo de um jeito estranho.",
          "Tente dançar break.",
          "Fale rimando pelos próximos 5 minutos.",
          "Eat a spoonful of mustard.",
          "Use só linguagem de sinais na próxima rodada.",
          "Recite o alfabeto de trás pra frente.",
          "Equilibre uma colher no nariz por 10 segundos.",
          "Fique de olhos fechados até a sua próxima vez.",
          "Cante tudo o que disser nas próximas 3 rodadas.",
          "Tente fazer a dança da minhoca (the worm).",
          "Tente encostar nos dedos dos pés sem dobrar os joelhos por 30 segundos.",
          "Fale com um amigo imaginário por 1 minuto.",
          "Fique imóvel como estátua por 1 minuto.",
          "Tente espirrar de propósito.",
          "Fale o alfabeto em voz alta fazendo agachamento.",
          "Eat a slice of lemon without making a face.",
          "Escove os dentes com mostarda.",
          "Deixe outra pessoa digitar e enviar uma mensagem do seu celular.",
          "Coloque cubos de gelo dentro da camisa por 1 minuto.",
          "Finja ser garçom e anote o pedido de todo mundo.",
          "Tente dar uma estrelinha.",
          "Aja como robô pelos próximos 5 minutos.",
          "Vista a roupa ao contrário.",
          "Finja que está nadando no chão.",
          "Tente fazer 10 flexões.",
          "Cante uma música o mais alto que puder.",
          "Deixe alguém desenhar no seu braço com caneta.",
          "Dê as mãos com a pessoa ao seu lado por 3 rodadas.",
          "Fique numa perna só por 1 minuto.",
          "Tente tocar o nariz com a língua.",
          "Leia em voz alta a última mensagem que você recebeu.",
          "Invente um poema sobre a pessoa à sua esquerda.",
          "Ligue pra sua mãe e diga que a ama.",
          "Finja ser um avião por 1 minuto.",
          "Tente assoviar uma música popular.",
          "Coma uma mistura de ketchup com maionese.",
          "Fale com a língua pra fora na próxima rodada.",
          "Tente pegar uma mosca imaginária.",
          "Finja ser apresentador(a) da previsão do tempo e faça uma previsão dramática.",
          "Aja como uma pessoa idosa pelos próximos 5 minutos.",
          "Deixe alguém te vendar e te dar algo da geladeira pra comer.",
          "Tente falar um trava-língua 5 vezes rápido.",
          "Tell a really bad dad joke.",
          "Finja chorar por 30 segundos.",
          "Dance com uma vassoura ou rodo.",
          "Give a dramatic reading of a random article.",
          "Ligue pra um amigo(a) e fale tudo em enrolado.",
          "Use um chapéu engraçado pelo resto do jogo.",
          "Finja ser um alienígena se comunicando com humanos pela primeira vez.",
          "Coloque uma venda e tente adivinhar o que é o objeto.",
          "Mime being trapped in a box.",
          "Ruja como um leão o mais alto que puder.",
          "Finja ser um super-herói e explique sua história de origem.",
          "Vá lá fora e grite Eu acredito em fadas!.",
          "Tente equilibrar um livro na cabeça e atravessar o cômodo.",
          "Encene sua cena de filme favorita.",
          "Speak in an extremely high-pitched voice.",
          "Fale como pirata nas próximas 3 frases.",
          "Finja ser um gato e ronrone pra alguém.",
          "Faça um discurso de 1 minuto sobre por que o céu é azul.",
          "Ande de costas pelos próximos 5 minutos.",
          "Faça sua melhor imitação de uma celebridade famosa.",
          "Aja como se tivesse uma bola de pelo na garganta.",
          "Deixe o grupo escolher um objeto pra você vender pra eles.",
          "Finja montar um cavalo pelo cômodo.",
          "Deite no chão e aja como uma fatia de bacon fritando.",
          "Eat a handful of dry oats.",
          "Finja ser um bebê até a sua próxima vez.",
          "Deixe alguém colocar um cubo de gelo nas suas costas.",
          "Give someone a piggyback ride.",
          "Tente lamber os dedos do pé.",
          "Do 15 sit-ups.",
          "Fale como se estivesse debaixo d'água por 2 minutos.",
          "Deixe o grupo te enrolar em papel higiênico.",
          "Do an impression of a baby crying.",
        ];

        const dareData = dare[Math.floor(Math.random() * dare.length)];

        await Atlas.sendMessage(
          m.from,
          { image: { url: botImage3 }, caption: `*${dareData}*` },
          { quoted: m },
        );
        break;

      case "coinflip":
        await doReact("🧫️");
        let result = Math.floor(Math.random() * 2) + 1;
        if (result === 1) {
          await Atlas.sendMessage(m.from, { text: "Heads" }, { quoted: m });
        } else {
          await Atlas.sendMessage(m.from, { text: "Tails" }, { quoted: m });
        }
        break;

      case "dice":
        await doReact("🎲️");
        let max = parseInt(args[0]);
        if (!max)
          return Atlas.sendMessage(
            m.from,
            { text: "Informe o número máximo de lados do dado." },
            { quoted: m },
          );
        let roll = Math.floor(Math.random() * max) + 1;
        Atlas.sendMessage(
          m.from,
          { text: `Você tirou ${roll}!` },
          { quoted: m },
        );
        break;

      case "fact":
        await doReact("🤓");
        try {
          const response = await axios.get(`https://nekos.life/api/v2/fact`);
          const tet = `*『  Random Facts  』* \n\n${response.data.fact}`;
          await Atlas.sendMessage(
            m.from,
            { image: { url: botImage4 }, caption: tet + "\n" },
            { quoted: m },
          );
        } catch (err) {
          await m.reply(`Ocorreu um erro.`);
        }
        break;

      default:
        break;
    }
  },
};
