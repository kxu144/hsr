import { Autocomplete, Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import Yanqing from "./Yanqing";
import { useEffect, useState } from "react";
import TargetMenu from "./TargetMenu";
import { optimize } from "../../../utils/relics";

function Character({ name, json, stats, talents }) {
    // OPTIMIZE TARGET
    const [target, setTarget] = useState(null);

    

    console.log(name, json, stats);
    const getChar = (name, json, stats) => {
        switch (name) {
            case 'Yanqing':
                return (
                    <Yanqing json={json} mult={target} stats={stats} />
                );
            default:
                return (
                    <div />
                );
        }
    }

    const optimizeBuild = () => {
        if (!target) {
            return;
        }
        if (target.section === "stats") {
            optimize(stats, {[target.label]: 1});
        }
    };

    return (
        <div>
            {stats &&
                <div>
                    <List>
                        <ListItem disablePadding>
                            <ListItemText primary={`HP: ${stats.hp}`} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary={`ATK: ${stats.atk}`} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary={`DEF: ${stats.def}`} />
                        </ListItem>
                    </List>

                </div>
            }
            {/* {stats && json && json.dmg && talents &&
                <List>
                    <ListItem disablePadding>
                        {["Basic ATK", "Skill", "Ultimate"].map((talent, i) => (
                            <ListItemText key={i} primary={`${talent}: ${json.dmg[talent].reduce((dmg, e) => dmg + getDMG(e, talents[i]), 0)}`} />
                        ))}
                    </ListItem>
                </List>
            } */}
            {stats && json &&
                <TargetMenu state={target} func={setTarget} />
            }
            <Button variant="contained" disabled={!target} onClick={optimizeBuild}>Optimize</Button>
            {/* {multiplier && getChar(name, json, stats)} */}
        </div>
    );
}

export default Character;