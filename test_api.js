var fs = require('fs');


var image_fileName = process.argv[2];

async function get_file_buffer() {
    try {
        var img_buff = await fs.readFileSync(image_fileName);
        await fs.writeFile("img_text1.txt", img_buff, (err) => {
            console.log("Caused here", err);
        });
        console.log("Completed Succesfully");
    }
    catch(err) {
        console.log("Caused Outside", err);
    }
}

get_file_buffer();