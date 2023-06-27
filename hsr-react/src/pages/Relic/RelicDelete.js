import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function RelicDelete() {
    return (
        <IconButton aria-label="delete" onClick={() => {setDel(true);}} >
                <DeleteIcon style={{ color: 'gray', position: 'absolute', top: '70px', left: '250px' }} />
        </IconButton>
    );
}

export default RelicDelete;