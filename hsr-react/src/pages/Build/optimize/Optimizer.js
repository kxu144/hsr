import { Button, List, ListItem, ListItemText } from "@mui/material";
import LongMenu from "../OptimizationTarget";
import Yanqing from "./Yanqing";
import { useEffect, useState } from "react";

function Character({ name, json, stats, talents }) {
    // OPTIMIZE TARGET
    const [target, setTarget] = useState(null);
    const [multiplier, setMultiplier] = useState(null);
    useEffect(() => {
        if (target && json && json.dmg) {
            console.log(target);
            setMultiplier(json.dmg[target]);
        }
    }, [target, json]);

    

    console.log(name, json, stats);
    const getChar = (name, json, stats) => {
        switch (name) {
            case 'Yanqing':
                return (
                    <Yanqing json={json} mult={multiplier} stats={stats} />
                );
            default:
                return (
                    <div />
                );
        }
    }

    const getDMG = (dmg, talentLvl) => {
        return stats[dmg.stat] * dmg.multipliers[talentLvl]
    }

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
            {stats && json && json.dmg && talents &&
                <List>
                    <ListItem disablePadding>
                        {["Basic ATK", "Skill", "Ultimate"].map((talent, i) => (
                            <ListItemText key={i} primary={`${talent}: ${json.dmg[talent].reduce((dmg, e) => dmg + getDMG(e, talents[i]), 0)}`} />
                        ))}
                    </ListItem>
                </List>
            }
            {stats && json && json.dmg &&
                <LongMenu setTarget={setTarget}></LongMenu>
            }
            <Button variant="contained" disabled={!target}>Optimize</Button>
            {multiplier && getChar(name, json, stats)}
        </div>
    );
}

export default Character;