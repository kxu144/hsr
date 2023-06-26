import Grid from '@mui/material/Grid';

import RelicPreview from './RelicPreview';

function RelicDatabase() {
    console.log("RENDER DATABASE");
    const relics = Object.values(JSON.parse(localStorage.getItem("relics") || "{}"));
    console.log(relics);

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