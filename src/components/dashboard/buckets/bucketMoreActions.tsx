import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";


const BucketMoreActions = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleEdit = () => {
        alert("To be implemented!")
        handleClose();
    };

    const handleHide = () => {
        alert("To be implemented!")
        handleClose();
    };
    
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}>
        <IconButton
            size="small"
            onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
            }}
        >
            <MoreVert fontSize="small" />
        </IconButton>
        
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
            list: {
                'aria-labelledby': 'basic-button',
            },
            }}
        >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleHide}>Hide</MenuItem>
        </Menu>
        
        </div>
    )


}


export default BucketMoreActions;