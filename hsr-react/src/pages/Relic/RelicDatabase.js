import Grid from '@mui/material/Grid';
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

import RelicPreview from './RelicPreview';

function RelicDatabase() {
    console.log("RENDER DATABASE");
    const relics = Object.values(JSON.parse(localStorage.getItem("relics") || "{}"));

    const [update, setUpdate] = useState(0);

    // DELETE RELIC FROM DATABASE
    const deleteRelic = (relic) => {
        const relics = JSON.parse(localStorage.getItem("relics") || "{}");
        delete relics[String(relic.id)];
        console.log("Deleted relic from db");
        console.log(relic.id, relic);
        localStorage.setItem("relics", JSON.stringify(relics));
        setUpdate(update + 1);
    };

    return (
        <Grid container spacing={4}>
            {relics.map((relic, i) => (
                <Grid item key={i} xs="auto">
                    <RelicPreview key={i} relic={relic} />
                    <IconButton aria-label="delete" onClick={() => {deleteRelic(relic);}} >
                        <DeleteIcon style={{ color: 'gray', position: 'absolute', bottom: '240px', left: '250px' }} />
                    </IconButton>
                </Grid>
            ))}
        </Grid>
    );
}

export default RelicDatabase;