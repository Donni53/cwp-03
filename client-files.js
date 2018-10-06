const net = require('net');
const fs = require('fs');


const shuffle = require('shuffle-array');
const port = 10124;

const client = new net.Socket();

process.on('uncaughtException', function (err)
{
    console.log(err);
});
client.setEncoding('utf8');

let files = [];
client.connect(port, function()
{
    //client.setNoDelay(true);
    console.log(client);

    client.write('FILES', ()=>
    {
        console.log('Connected');
        for(let i = 2; i<process.argv.length; i++)
        {
            fs.readdir(`${process.argv[i]}`,  (err, files) =>
            {
                for(const file of files)
                {
                    let str = `${process.argv[i]}\\${file}`;
                    console.log(str);
                    fs.stat(str, (err, st) => {
                        if(st.isFile())
                        {
                            files.push(str);
                            console.log(str);
                            fs.readFile(str, "base64", (err, dataFiles) =>
                            {
                                s = (`{\n"fileName":"${file}",\n"info":"${dataFiles.toString().replace(/\n/g,"").replace(/\r/g,"")}"\n}`);
                                console.log(s);
                                client.write(s+'\n');
                            });
                        }
                    });
                }
            });
        }
    });
});


client.on('data', function(data) {
    if(data === 'DES')
    {
        client.destroy();
    }
});


client.on('close', function() {
    console.log('Connection closed');
});