import Grid from '@mui/material/Grid';
import { Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { useState } from 'react';

import RelicPreview from './RelicPreview';

function RelicDatabase() {
    console.log("RENDER DATABASE");
    const relics = Object.values(JSON.parse(localStorage.getItem("relics") || "{}"));

    const [delStack, setDelStack] = useState([]);

    // DELETE RELIC FROM DATABASE
    const deleteRelic = (relic) => {
        const relics = JSON.parse(localStorage.getItem("relics") || "{}");
        delete relics[String(relic.id)];
        console.log("Deleted relic from db");
        console.log(relic.id, relic);
        localStorage.setItem("relics", JSON.stringify(relics));
        setDelStack([relic, ...delStack]);
    };

    // RESTORE RELIC
    const undoDelete = (relic) => {
        if (delStack.length === 0) {
            return;
        }
        const relics = JSON.parse(localStorage.getItem("relics") || "{}");
        console.log("Restore relic", relic);
        relics[String(relic.id)] = relic;
        localStorage.setItem("relics", JSON.stringify(relics));
        setDelStack(delStack.slice(1));
    }

    return (
        <div>
            {(delStack && delStack.length !== 0) && <Button variant="contained" onClick={() => {delStack.length > 0 && undoDelete(delStack[0]);}}>Undo Delete</Button>}
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
        </div>
    );
}

export default RelicDatabase;