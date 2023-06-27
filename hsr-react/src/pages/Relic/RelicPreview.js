import "./RelicPreview.css";
import blankRelic from "../../assets/images/relics/relic_blank.png";
import React, { useState, useEffect } from 'react';
import { RELICSETS, RELICSLOTS } from "../../utils/relics";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function RelicPreview({ relic, setRelic }) {
    const [setKey, setSetKey] = useState({label: relic.setKey, json: RELICSETS.find((item) => item.label === relic.setKey)?.json});
    const [slotKey, setSlotKey] = useState({label: relic.slotKey, id: RELICSLOTS.find((item) => item.label === relic.slotKey)?.id});
    const [level, setLevel] = useState(relic.level || 0);
    const [mainStat, setMainStat] = useState([relic.mainStatKey, (relic.substats && relic.substats[relic.mainStatKey])]);
    const [substats, setSubstats] = useState([
        ...Object.entries(relic.substats).filter((e) => e[0] !== relic.mainStatKey),
        ...Array.from({ length: Math.max(4 - Object.keys(relic.substats).length, 0) }, () => ["", ""]),
    ]);
    const [raw, setRaw] = useState(relic.raw);

    const [artPath, setArtPath] = useState("");
    const [slotBlur, setSlotBlur] = useState(true);
    const [json, setJSON] = useState(null);

    useEffect(() => {
        console.log("relic update");
        setSetKey({label: relic.setKey, json: RELICSETS.find((item) => item.label === relic.setKey)?.json});
        setSlotKey({label: relic.slotKey, id: RELICSLOTS.find((item) => item.label === relic.slotKey)?.id});
        setLevel(relic.level || 0);
        setMainStat([relic.mainStatKey, (relic.substats && relic.substats[relic.mainStatKey])]);
        setSubstats([
            ...Object.entries(relic.substats).filter((e) => e[0] !== relic.mainStatKey),
            ...Array.from({ length: Math.max(4 - Object.keys(relic.substats).length, 0) }, () => ["", ""]),
        ]);
        setRaw(relic.raw);
        setSlotBlur(true);
        
    }, [relic]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/relics/${setKey.json}`);
                const json = await response.json();
                setJSON(json);
                console.log(json);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        if (slotBlur) {
            fetchData();
            setSlotBlur(false);
        }
    }, [setKey, slotKey, slotBlur]);

    useEffect(() => {
        const inferSlot = () => {
            console.log("INFERRING SLOT", json.pieces);
            for (let piece of Object.values(json.pieces)) {
                console.log("PIECE", piece);
                if (raw.includes(piece.name)) {
                    console.log("FOUND", piece.baseTypeText);
                    let copy = {...relic};
                    copy.slotKey = piece.baseTypeText;
                    setRelic(copy);
                }
            }
        };

        if (raw && json && slotKey) {
            console.log("INFER", slotKey);
            if (!RELICSLOTS.some((e) => e.label === slotKey.label)) {
                inferSlot();
            }
        }
    }, [relic, setRelic, raw, json, slotKey]);

    useEffect(() => {
        if (slotKey && json && slotKey.id in json.pieces) {
            setArtPath(`${process.env.PUBLIC_URL}/image/relics/${json.pieces[slotKey.id].iconPath}.webp`);
        } else {
            setArtPath("");
        }
    }, [slotKey, json]);

    const save = () => {
        console.log("SAVE");
        setSlotBlur(true);
        relic.level = level;
        relic.mainStatKey = mainStat[0];
        relic.substats = Object.fromEntries(substats);
        
        if ("id" in relic) {
            const relics = JSON.parse(localStorage.getItem("relics") || "{}");
            relics[String(relic.id)] = relic;
            localStorage.setItem("relics", JSON.stringify(relics));
        }
    };

    return (
        <div style={{ position: 'relative', width: '286px', height: '315px' }}>
            <img alt="" src={blankRelic} style={{ width: '100%', position: 'absolute', top: 0, left: 0 }} />
            <img alt="" src={artPath} style={{ width: '35%', position: 'absolute', top: '20%', right: '20%' }}/>
            <div style={{ color: 'white', fontSize: '15px' }}>
                <Autocomplete 
                    isOptionEqualToValue={(o, value) => value === "" || o === value || o.label === value}
                    value={(setKey && setKey.label) || null} onChange={(_e,v) => {setSetKey(v);relic.setKey = v && v.label;save();}} 
                    disablePortal disableClearable blurOnSelect options={RELICSETS} 
                    style={{ position: 'absolute', width: '100%', top: '2%' }}
                    renderInput={(params) => 
                        <TextField 
                            {...params}
                            inputProps={
                                {...params.inputProps, style: { color: 'white', padding: '0px' }}
                            }
                        />
                    }
                />
                <Autocomplete 
                    isOptionEqualToValue={(o, value) => value === "" || o === value || o.label === value}
                    value={(slotKey && slotKey.label) || null} onChange={(_e, v) => {setSlotKey(v);relic.slotKey = v && v.label;save();}}
                    disablePortal disableClearable blurOnSelect options={RELICSLOTS} 
                    style={{ position: 'absolute', width: '55%', top: '20%' }}
                    renderInput={(params) => 
                        <TextField 
                            {...params}
                            inputProps={
                                {...params.inputProps, style: { color: 'white', padding: '0px' }}
                            }
                        />
                    }
                />
                <input type="text" value={"+" + level} onBlur={save} onChange={(e)=> {setLevel(e.target.value.slice(1));}} style={{ position: 'absolute', width: '20%', top: '45%', left: '3%', color: (level !== null) ? 'white' : 'red' }} /> 
                <input type="text" value={(mainStat && mainStat[0])} onBlur={save} onChange={(e) => {setMainStat([e.target.value, mainStat[1]])}} style={{ position: 'absolute', width: '70%', top: '54%', left: '2%', color: (mainStat && mainStat[0]) ? 'white' : 'red' }} />
                <input type="text" value={(mainStat && mainStat[1])} onChange={(e) => {setMainStat([mainStat[0], e.target.value])}} style={{ position: 'absolute', textAlign: 'right', width: '15%', top: '54%', right: '2%', color: (mainStat && mainStat[1]) ? 'white' : 'red' }} />
                {substats.map((_substat, i) => (
                    <div key={i}>
                        <input type="text" value={substats[i][0]} onChange={(e) => {let copy = [...substats]; copy[i][0] = e.target.value; setSubstats(copy);}} style={{ position: 'absolute', width: '70%', top: `${62 + 8*i}%`, left: '2%', color: 'white' }} />
                        <input type="text" value={substats[i][1]} onChange={(e) => {let copy = [...substats]; copy[i][1] = e.target.value; setSubstats(copy);}} style={{ position: 'absolute', textAlign: 'right', width: '15%', top: `${62 + 8*i}%`, right: '2%', color: 'white' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RelicPreview;