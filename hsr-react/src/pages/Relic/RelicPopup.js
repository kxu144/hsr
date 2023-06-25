import React, { useState, useEffect } from 'react';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { createWorker, createScheduler, PSM_SPARSE_TEXT } from 'tesseract.js';

import { textToRelic } from '../../utils/relics';
import RelicPreview, {  } from './RelicPreview';

// Initialize OCR workers
const initializeOCRScheduler = async () => {
    const scheduler = await createScheduler();
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_pageseg_mode: PSM_SPARSE_TEXT,
        tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'%+ ",
    });
    scheduler.addWorker(worker);
    return scheduler;
};

function RelicPopup() {
    

    // TESSERACT OCR
    const [scheduler, setScheduler] = useState(null);

    useEffect(() => {
        const loadScheduler = async () => {
            const scheduler = await initializeOCRScheduler();
            setScheduler(scheduler);
        };

        loadScheduler();
    }, []);

    useEffect(() => {
        const addWorkers = async (numWorkers) => {
            if (scheduler) {
                for (let i = 0; i < numWorkers - 1; i++) {
                    const worker = await createWorker();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    await worker.setParameters({
                        tessedit_pageseg_mode: PSM_SPARSE_TEXT,
                        tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'%+ ",
                    });
                    scheduler.addWorker(worker);
                    console.log("Worker %d initialized", i);
                }
            }
        };

        addWorkers(8);

    }, [scheduler]);

    const performOCR = async (image) => {
        const { data: { text } } = await scheduler.addJob('recognize', image);
        console.log(text);
        const relic = textToRelic(text);
        console.log(JSON.stringify(relic));
        return relic;
    };

    const uploadFiles = (event) => {
        const files = event.target.files;
      
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
        
            // Create FileReader to read the file
            const reader = new FileReader();
        
            reader.onload = () => {
                const image = new Image();
                image.onload = () => {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = image.width;
                    canvas.height = image.height;
            
                    // Draw the image on the canvas
                    ctx.drawImage(image, 0, 0);
            
                    // Get the image data from the canvas
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
            
                    // Apply thresholding to convert the image to black and white
                    const threshold = 150;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const grayscale = (r + g + b) / 3;
                        const color = grayscale < threshold ? 0 : 255;
                        data[i] = color;
                        data[i + 1] = color;
                        data[i + 2] = color;
                    }
            
                    // Update the canvas with the thresholded image data
                    ctx.putImageData(imageData, 0, 0);
            
                    // Get the thresholded image as data URL
                    const thresholdedImageDataUrl = canvas.toDataURL();
            
                    // Perform OCR on the thresholded image
                    performOCR(thresholdedImageDataUrl).then(relic => {
                        setPreview(true);
                    });
                };
        
                image.src = reader.result;
            };
        
            reader.readAsDataURL(file);
        }
    };

    // RELIC PREVIEW
    const [preview, setPreview] = useState(false);
      

    return (
        <Popup trigger={<button>Add New Relic</button>} onClose={() => {setPreview(false);}} modal nested>
        {
            close => (
                <div className="modal">
                    <div className="content">
                        Relic Editor
                    </div>
                    <input type="file" accept="image/*" disabled={!scheduler} onChange={uploadFiles} multiple />
                    {preview ? <RelicPreview /> : null}
                    <div>
                        <button>Add Relic</button>
                        <button onClick={close}>Close</button>
                    </div>
                </div>
            )
        }
        </Popup>
    );
}

export default RelicPopup;
