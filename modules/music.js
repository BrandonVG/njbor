const ytdl = require("ytdl-core");
const queue = new Map();
const btsong = ["https://www.youtube.com/watch?v=OiMWFojB9Ok","https://www.youtube.com/watch?v=WMweEpGlu_U",
"https://www.youtube.com/watch?v=0tWU94w_3ig","https://www.youtube.com/watch?v=tuEZ_8HdnwQ",
"https://www.youtube.com/watch?v=Cvb76hBX_Oc","https://www.youtube.com/watch?v=v-bf1beaRXI",
"https://www.youtube.com/watch?v=5abamRO41fE","https://www.youtube.com/watch?v=jHUEwcOQjjI",
"https://www.youtube.com/watch?v=BdtrgP5n6tw","https://www.youtube.com/watch?v=EuJ6UR_pD5s","https://www.youtube.com/watch?v=UvD4Zv146FI",
"https://www.youtube.com/watch?v=v4BVENVywWA","https://www.youtube.com/watch?v=Ti2pA5JgrMI",
"https://www.youtube.com/watch?v=boFBGUZiFw4","https://www.youtube.com/watch?v=Ar-IEE_DIEo"];


    async function execute(message, serverQueue){
        let rndNumber = Math.ceil(Math.random() * btsong.length-1);
        const args = btsong[rndNumber];
        let vc = message.member.voice.channel;
        if (!vc) return;
        const songInfo = await ytdl.getInfo(args);
        const song ={
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
        console.log(song.title);
        if (!serverQueue){
            const queueConstruct ={
                voiceChannel: vc,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try{
                var connection = await vc.join();
                queueConstruct.connection = connection;
                play(message.guild, queueConstruct.songs[0]);
            }
            catch(err){
                console.log(err);
                queue.delete(message.guild.id);
                return;
            }
        }
        else{
            serverQueue.songs.push(song);
        }
        
        
    }
    function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () =>{
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }
module.exports = execute;