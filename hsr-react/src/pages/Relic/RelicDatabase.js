import Grid from '@mui/material/Grid';

import RelicPreview from './RelicPreview';

function RelicDatabase() {
    const relics = JSON.parse(localStorage.getItem("relics") || "[]");

    return (
        <Grid container spacing={4}>
            {relics.map((relic, i) => (
                <Grid item key={i} xs="auto">
                    <RelicPreview key={i} relic={relic} />
                </Grid>
            ))}
        </Grid>
    );
}

export default RelicDatabase;