import blankRelic from "../../assets/images/arti_blank.png"

function RelicPreview() {
    const bgStyle = {
        pointerEvents: 'none',
        objectFit: 'contain',
        width: '100%',
        zIndex: '-1',
    };
      
    return (
        <div>
            <img src={blankRelic} style={bgStyle} />
        </div>
    );
}

export default RelicPreview;