import { Button } from "@mui/material";
import Popup from "reactjs-popup";
import BuildDisplay from "./BuildDisplay";

function BuildNew() {
    return (
        <Popup trigger={<Button variant="contained">New Build</Button>} onClose={() => {}} modal nested>
        {
            close => (
                <div className="modal">
                    <BuildDisplay />
                    <div style={{position: 'absolute', bottom: '20px'}}>
                        <Button variant="contained" onClick={close}>Close</Button>
                    </div>
                </div>
            )
        }
        </Popup>
    );
};

export default BuildNew;