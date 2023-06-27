import RelicPopup from "./RelicPopup";
import RelicDatabase from "./RelicDatabase";

import { useState } from 'react';

function Relic() {

    const [databaseKey, setDatabaseKey] = useState(0);

    return (
        <div>
            <RelicPopup updateDatabase={setDatabaseKey} />
            <RelicDatabase key={databaseKey} />
        </div>
    );
}

export default Relic;