import { Button, Divider, MenuItem, MenuList } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";

function TargetMenu({ state, func }) {
    const targets_stats = ["HP", "ATK", "DEF", "SPD", "Crit Rate", "Crit DMG"];
    const targets_skills = ["Basic ATK", "Skill", "Ultimate", "Talent"];
    const [buttonText, setButtonText] = useState("Select Optimization Target");

    useEffect(() => {
        if (state && state.label) {
            setButtonText("Target: " + state.label);
        } else {
            setButtonText("Select Optimization Target");
        }
    }, [state])

    return (
        <Popup trigger={<Button variant="contained">{buttonText}</Button>} modal nested>
            {
                close => (
                    <div className="modal">
                        <div className="content">
                            <Masonry columns={3} spacing={2}>
                                <MenuList>
                                    Stats
                                    <Divider />
                                    {targets_stats.map((item) => (
                                        <MenuItem key={item} onClick={() => {func({section: "stats", label: item.toLowerCase()}); close()}}>{item}</MenuItem>
                                    ))}
                                </MenuList>
                                <MenuList>
                                    Skills
                                    <Divider />
                                    {targets_skills.map((item) => (
                                        <MenuItem key={item} onClick={() => {func({section: "skills", label: item.toLowerCase()}); close()}}>{item}</MenuItem>
                                    ))}
                                </MenuList>
                            </Masonry>
                        </div>
                    </div>
                )
            }
        </Popup>
    );
}

export default TargetMenu;