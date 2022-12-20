const { AttachmentBuilder, SlashCommandBuilder , EmbedBuilder } = require('discord.js');
const fs = require('fs')
const Canvas = require('canvas')
const { registerFont } = require('canvas');
var crypto = require("crypto");


module.exports = {
	data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('creates images')
        .addStringOption((option)=>option.setName("text").setDescription("The text on the image").setRequired(true)),
     
	async execute(interaction) {

        let returnEmbed = new EmbedBuilder()



        const Text = interaction.options.getString("text")

        registerFont('./files/fonts/B-NAZANIN.ttf', { family: 'Fonto' });
        registerFont('./files/fonts/Rajdhani-Bold.ttf', { family: 'Fonte' });

        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            // Declare a base size of the font
            let fontSize = 80;
            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize -= 10}px fonto`;
            ctx.font = `${fontSize -= 10}px fonte`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(text).width > canvas.width - 300);
            // Return the result to use in the actual canvas
            return ctx.font;
        };

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./files/background.jpg');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        //import convas
        ctx.font = applyText(canvas, Text);
        ctx.fillStyle = 'BLACK';
        ctx.fillText(Text, canvas.width / 4.7,   canvas.height / 1.7);
        ctx.beginPath();
        ctx.arc(125, 125, 0, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        //create picture

        var id = crypto.randomBytes(5).toString('hex');
    
        await fs.writeFileSync(`./${id}-crimg.png`, canvas.toBuffer());




        const theImage = new AttachmentBuilder(`./${id}-crimg.png`);
      
        returnEmbed
      	    .setTitle('Here is your image')
      	    .setImage(`attachment://${id}-crimg.png`);

        await interaction.reply({ embeds: [returnEmbed], files: [theImage] });

        setTimeout(() =>{

            fs.unlink(`./files/temp/${id}-crimg.png`, (err) => {
                if (err) {
                    throw err;
                }
            });
        }, 10000);
    
	},
};
