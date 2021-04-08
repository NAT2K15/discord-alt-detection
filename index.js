const { Client, MessageEmbed } = require('discord.js');
const nat = new Client();
const chalk = require('chalk');
const config = require('./config.json');
const moment = require('moment')

nat.once('ready', () => {
    console.log(chalk.red `[MADE BY NAT2K15] ` + chalk.white `${nat.user.tag} is now online!`)
})
nat.on('guildMemberAdd', async(member) => {
    let userjoin = moment(member.user.createdAt);
    let daysconfig = config.settings.days;
    if (isNaN(daysconfig)) {
        if (config.debug) console.log(chalk.green `[DEBUG] ` + chalk.white `I had to change the days to 30 because your days in the config file was not a number!`)
        daysconfig = 30;
    }
    let days = moment().subtract(daysconfig, 'days')
    let isit = userjoin.isBefore(days);
    if (isit) {
        let data = moment(member.user.createdAt).format("YYYY/MM/DD");
        let chann = member.guild.channels.cache.get(config.settings.channel)
        if (!chann) {
            if (config.debug) {
                console.log(chalk.red `[ERROR] ` + chalk.white `You have an invaild channel in config`)
            }
        } else {
            let altaccountembed = new MessageEmbed()
                .setTitle(`Alt account detected`)
                .setDescription(`${member.user.tag} || \`${member.user.id}\` has an account that is not older then ${daysconfig} days!`)
                .addField(`Data the account was created`, `${data}`)
                .addField(`Time the account was made`, `${member.user.createdAt}`)
                .addField(`User joined at`, member.joinedAt)
                .setTimestamp()
                .setThumbnail(member.user.displayAvatarURL({ format: `png`, dynamic: true }))
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
            chann.send(`<@${member.user.id}>,`)
            chann.send(altaccountembed).catch(e => {
                if (e && config.debug) return console.log(`I was not able to send a message in the alt account channel. alt account channel is "${chann.name}"`)
            })
            if (config.settings.kick_on_join) {
                let kick_message = config.settings.kick_message;
                if (!kick_message || kick_message.length > 1028) {
                    kick_message = 'You have been kicked because your account creation does not meet our server requirements'
                    if (config.debug) console.log(chalk.red `[ERROR] ` + chalk.white `Your message either was longer then 1028 charcters or you put nothing in there. The kick message has been changed to "${kick_message}"`)
                }
                let users_dm = new MessageEmbed()
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                    .setTitle(`__You have been kicked from ${member.guild.name}__`)
                    .addField(`Staff`, nat.user.tag)
                    .addField(`Reason`, kick_message)
                    .setThumbnail(member.user.displayAvatarURL({ format: `png`, dynamic: true }))
                member.send(users_dm).catch(e => {
                    if (e) {
                        let e1 = new MessageEmbed()
                            .setDescription(`I was not able to DM ${member.user.tag}`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                        chann.send(e1)
                    }
                })
                setTimeout(async() => {
                    let usercheck = await member.kick(`${kick_message}`).catch(e => {
                        if (config.debug) console.log(chalk.red `[ERROR] ` + chalk.white `I was not able to kick ${member.user.tag}`)
                    })
                    if (usercheck === undefined) {
                        let e1 = new MessageEmbed()
                            .setDescription(`I was not able to kick ${member.user.tag}`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                            .setTimestamp()
                        chann.send(e1).catch(e => {
                            if (e && config.debug) return console.log(`I was not able to send a message in the alt account channel. alt account channel is "${chann.name}"`)
                        })
                    } else {
                        let e2 = new MessageEmbed()
                            .setDescription(`I have kicked ${member.user.tag}`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                        chann.send(e2).catch(e => {
                            if (e && config.debug) return console.log(`I was not able to send a message in the alt account channel. alt account channel is "${chann.name}"`)
                        })
                    }
                }, 2000);
            }
        }
    }
})

nat.login(config.token).catch(e => {
    if (e) {
        if (config.debug) {
            console.log(chalk.red `[ERROR] ` + chalk.white `You token is invalid within the config file!\n${e}`)
        }
    }
})