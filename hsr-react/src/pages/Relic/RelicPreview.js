import "./RelicPreview.css";
import blankRelic from "../../assets/images/relics/relic_blank.png";
import React, { useState, useEffect } from 'react';
import { RELICSET2JSON, RELICSLOT2ID } from "../../utils/relics";

function RelicPreview({ relic }) {
    const [setKey, setSetKey] = useState(relic.setKey);
    const [slotKey, setSlotKey] = useState(relic.slotKey);
    const [level, setLevel] = useState(relic.level || 0);
    const [mainStat, setMainStat] = useState([relic.mainStatKey, (relic.substats && relic.substats[relic.mainStatKey])]);
    const [substats, setSubstats] = useState([
        ...Object.entries(relic.substats).filter((e) => e[0] !== relic.mainStatKey),
        ...Array.from({ length: Math.max(4 - Object.keys(relic.substats).length, 0) }, () => ["", ""]),
    ]);

    const [artPath, setArtPath] = useState("");
    const [slotBlur, setSlotBlur] = useState(true);

    useEffect(() => {
        setArtPath("");
        setSetKey(relic.setKey);
        setSlotKey(relic.slotKey);
        setLevel(relic.level || 0);
        setMainStat([relic.mainStatKey, (relic.substats && relic.substats[relic.mainStatKey])]);
        setSubstats([
            ...Object.entries(relic.substats).filter((e) => e[0] !== relic.mainStatKey),
            ...Array.from({ length: Math.max(4 - Object.keys(relic.substats).length, 0) }, () => ["", ""]),
        ]);
    }, [relic]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(RELICSET2JSON[setKey]);
                const response = await fetch(`${process.env.PUBLIC_URL}/json/relics/${RELICSET2JSON[setKey]}`);
                const json = await response.json();
                console.log(json);
                setArtPath(`${process.env.PUBLIC_URL}/image/relics/${json.pieces[RELICSLOT2ID[slotKey]].iconPath}.webp`);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        if (slotBlur) {
            fetchData();
            setSlotBlur(false);
        }
    }, [setKey, slotKey, slotBlur]);

    const save = () => {
        relic.setKey = setKey;
        if (relic.slotKey !== slotKey) {
            setSlotBlur(true);
        }
        relic.slotKey = slotKey;
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
                <input type="text" value={setKey} onBlur={save} onChange={(e) => {setSetKey(e.target.value);}} style={{ position: 'absolute', width: '90%', top: '7%', left: '2%', color: setKey && setKey ? 'white' : 'red' }} />
                <input type="text" value={slotKey} onBlur={save} onChange={(e) => {setSlotKey(e.target.value);}} style={{ position: 'absolute', width: '20%', top: '40%', left: '3%', color: slotKey && slotKey ? 'white' : 'red' }} />
                <input type="text" value={"+" + level} onBlur={save} onChange={(e) => {setLevel(e.target.value.slice(1));}} style={{ position: 'absolute', width: '20%', top: '45%', left: '3%', color: (level !== null) ? 'white' : 'red' }} /> 
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