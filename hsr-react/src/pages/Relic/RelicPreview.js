import "./RelicPreview.css";
import blankRelic from "../../assets/images/arti_blank.png";

function RelicPreview({ relic }) {
    const defaultText = "N/A";
    const stats = Object.entries(relic.substats).filter((e) => e[0] !== relic.mainStatKey);
    while (stats.length < 4) {
        stats.push(["", ""]);
    }
    console.log(stats);
    return (
        <div style={{ position: 'relative', width: '286px', height: '315px' }}>
            <img alt="" src={blankRelic} style={{ width: '100%', position: 'absolute', top: 0, left: 0 }} />
            <div style={{ color: 'white', fontSize: '15px' }}>
                <div id="set" style={{ position: 'absolute', transform: 'translateY(100%)', top: '2%', left: '2%', color: relic.setKey ? 'white' : 'red' }}>
                    {relic.setKey || defaultText}
                </div>
                <div id="slot" style={{ position: 'absolute', top: '40%', left: '3%', color: relic.slotKey ? 'white' : 'red' }}>
                    {relic.slotKey || defaultText}
                </div>
                <div id="level" style={{ position: 'absolute', top: '45%', left: '3%', color: relic.level !== null ? 'white' : 'red' }}>
                    {"+" + relic.level || defaultText}
                </div>
                <div id="mainStat">
                    <div style={{ position: 'absolute', top: '54%', left: '2%', color: relic.mainStatKey ? 'white' : 'red' }}>
                        {relic.mainStatKey || defaultText}
                    </div>
                    <div style={{ position: 'absolute', top: '54%', right: '2%', color: relic.substats[relic.mainStatKey] !== null ? 'white' : 'red' }}>
                        {relic.substats[relic.mainStatKey] || defaultText}
                    </div>
                </div>
                <div id="substats">
                    <div style={{ position: 'absolute', top: '62%', left: '2%', color: 'white' }}>
                        {stats[0][0]}
                    </div>
                    <div style={{ position: 'absolute', top: '62%', right: '2%', color: 'white' }}>
                        {stats[0][1]}
                    </div>
                    <div style={{ position: 'absolute', top: '70%', left: '2%', color: 'white' }}>
                        {stats[1][0]}
                    </div>
                    <div style={{ position: 'absolute', top: '70%', right: '2%', color: 'white' }}>
                        {stats[1][1]}
                    </div>
                    <div style={{ position: 'absolute', top: '78%', left: '2%', color: 'white' }}>
                        {stats[2][0]}
                    </div>
                    <div style={{ position: 'absolute', top: '78%', right: '2%', color: 'white' }}>
                        {stats[2][1]}
                    </div>
                    <div style={{ position: 'absolute', top: '86%', left: '2%', color: 'white' }}>
                        {stats[3][0]}
                    </div>
                    <div style={{ position: 'absolute', top: '86%', right: '2%', color: 'white' }}>
                        {stats[3][1]}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelicPreview;