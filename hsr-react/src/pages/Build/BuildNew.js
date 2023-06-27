import { Button } from "@mui/material";
import Popup from "reactjs-popup";

function BuildNew() {
    return (
        <Popup trigger={<Button variant="contained">New Build</Button>} onClose={() => {}} modal nested>
        {
            close => (
                <div className="modal">
                    <div className="content">
                        Test
                    </div>
                    <div>
                        <Button variant="contained" onClick={close}>Close</Button>
                    </div>
                </div>
            )
        }
        </Popup>
    );
};

export default BuildNew;