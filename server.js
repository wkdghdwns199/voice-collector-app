const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
var cron = require('node-cron');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const bucketName = 'wavFiles';

const supabase = createClient(supabaseUrl, supabaseKey);

async function downloadFiles() {
    const localDirectoryPath = '/home/database/webServer/wavDir';

    try {
        const { data: doctorIdFolderList, error: doctorIdFolderError } = await supabase.storage.from(bucketName).list();
        if (doctorIdFolderError) {
            throw new Error('Failed to fetch doctor ID folders from Supabase storage');
        }

        for (const doctorIdFolder of doctorIdFolderList) {
            const doctorId = doctorIdFolder.name;
            const { data: patientIdFolderList, error: patientIdFolderError } = await supabase.storage.from(bucketName).list(doctorId);
            if (patientIdFolderError) {
                console.error(`Failed to fetch patient ID folders for doctor ID ${doctorId}`);
                continue;
            }

            for (const patientIdFolder of patientIdFolderList) {
                const patientId = patientIdFolder.name;
                const { data: fileList, error: fileError } = await supabase.storage.from(bucketName).list(`${doctorId}/${patientId}`);
                if (fileError) {
                    console.error(`Failed to fetch files for doctor ID ${doctorId} and patient ID ${patientId}`);
                    continue;
                }

                for (const file of fileList) {
                    const fileName = file.name;
                    const { data: fileData, error: downloadError } = await supabase.storage.from(bucketName).download(`${doctorId}/${patientId}/${fileName}`, localDirectoryPath);
                    if (downloadError) {
                        console.error(`Failed to download file ${fileName} for doctor ID ${doctorId} and patient ID ${patientId}`);
                        continue;
                    }

                    console.log(`Downloaded ${fileName} for doctor ID ${doctorId} and patient ID ${patientId}`);

                    const blob = fileData;
                    const buffer = Buffer.from(await blob.arrayBuffer());

                    const dir = `${localDirectoryPath}/${doctorId}`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    const patientDir = `${dir}/${patientId}`;
                    if (!fs.existsSync(patientDir)) {
                        fs.mkdirSync(patientDir);
                    }

                    const filePath = `${patientDir}/${fileName}`;
                    if (!fs.existsSync(filePath)) {
                        await fs.promises.writeFile(filePath, buffer);
                    }
                }
            }
        }

        console.log('All files downloaded successfully.');
    } catch (err) {
        console.error('An error occurred:', err.message);
    }
}

// Call the function when the script is executed

cron.schedule('* * * * *', () => {
  console.log('running a task');
  downloadFiles();
});

console.log('Scheduler started. downloadFiles() will run every minute.');

