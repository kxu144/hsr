import React, { useState, useEffect, useRef } from 'react';
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import { createWorker, createScheduler, PSM_SPARSE_TEXT } from 'tesseract.js';
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { MAX_QUEUE_LEN, textToRelic } from '../../utils/relics';
import RelicPreview, {  } from './RelicPreview';

import "./RelicPopup.css";

// Initialize OCR workers
const initializeOCRScheduler = async () => {
    const scheduler = await createScheduler();
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
        tessedit_pageseg_mode: PSM_SPARSE_TEXT,
        tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'%+- ",
    });
    scheduler.addWorker(worker);
    return scheduler;
};

function RelicPopup({ updateDatabase }) {
    

    // TESSERACT OCR
    const [newScheduler, setNewScheduler] = useState(true);
    const [scheduler, setScheduler] = useState(null);

    useEffect(() => {
        const loadScheduler = async () => {
            if (scheduler) {
                scheduler.terminate();
            }
            const copy = await initializeOCRScheduler();
            setScheduler(copy);
        };

        if (newScheduler) {
            loadScheduler();
            setNewScheduler(false);
        }
    }, [scheduler, newScheduler]);

    useEffect(() => {
        const addWorkers = async (numWorkers) => {
            if (scheduler) {
                for (let i = 0; i < numWorkers - 1; i++) {
                    const worker = await createWorker();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    await worker.setParameters({
                        tessedit_pageseg_mode: PSM_SPARSE_TEXT,
                        tessedit_char_whitelist: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.'%+- ",
                    });
                    scheduler.addWorker(worker);
                    console.log("Worker %d initialized", i);
                }
            }
        };

        addWorkers(4);

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
            if (preview.length >= MAX_QUEUE_LEN) {
                console.error("Exceeded MAX_QUEUE_LEN");
                break;
            }

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
                        setPreview((arr) => [...arr, relic]);
                    });
                };
        
                image.src = reader.result;
            };
        
            reader.readAsDataURL(file);
        }
    };

    // RELIC PREVIEW
    const [preview, setPreview] = useState([]);
    const [previewRelic, setPreviewRelic] = useState(null);
    useEffect(() => {
        if (preview.length > 0) {
            setPreviewRelic(preview[0]);
        }
    }, [preview]);

    // ADD RELIC TO DATABASE
    const addRelic = (relic) => {
        setPreview(preview.slice(1));

        const relics = JSON.parse(localStorage.getItem("relics") || "{}");
        let i = 0;
        while (String(i) in relics) {
            i++;
        }
        relic.id = i;
        console.log("Adding relic to db");
        console.log(i, relic);
        relics[String(i)] = relic;
        localStorage.setItem("relics", JSON.stringify(relics));

        updateDatabase(key => key + 1);
    };

    // PASTE IMAGE
    const fileInputRef = useRef(null);
    useEffect(() => {
        window.addEventListener("paste", (e) => {
            if (fileInputRef.current) {
                fileInputRef.current.files = e.clipboardData.files;
                fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
        });
    }, []);

    // UNDO?
    const [delStack, setDelStack] = useState([]);

    return (
        <Popup trigger={<Button variant="contained">Add New Relic</Button>} onClose={() => {setNewScheduler(true);setPreview([]);}} modal nested>
        {
            close => (
                <div className="modal">
                    <div className="content">
                        Relic Editor
                        <input type="file" ref={fileInputRef} accept="image/*" disabled={!scheduler} onChange={uploadFiles} multiple />
                        {(preview && preview.length > 0 && previewRelic) ? 
                        <div style={{position: 'relative'}}>
                            <RelicPreview relic={previewRelic} setRelic={setPreviewRelic} />
                            <IconButton aria-label="delete" onClick={() => {setDelStack([previewRelic, ...delStack]);setPreview(preview.slice(1));}} >
                                    <DeleteIcon style={{ color: 'gray', position: 'absolute', bottom: '240px', left: '250px' }} />
                            </IconButton>
                        </div>
                        : null}
                    </div>
                    <div style={{position: 'absolute', bottom: '20px'}}>
                        <Button variant="contained" disabled={!preview || preview.length === 0} onClick={() => {addRelic(previewRelic);}}>Add Relic</Button>
                        <Button variant="contained" onClick={close}>Close</Button>
                        {(delStack && delStack.length !== 0) && <Button variant="contained" onClick={() => {setPreview([delStack[0], ...preview]);setDelStack(delStack.slice(1));}}>Undo Delete</Button>}
                    </div>
                </div>
            )
        }
        </Popup>
    );
}

export default RelicPopup;
