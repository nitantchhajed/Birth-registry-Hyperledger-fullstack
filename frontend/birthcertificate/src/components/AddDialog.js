import React from "react";
import Button from "@mui/material//Button";
import TextField from "@mui/material//TextField";
import Dialog from "@mui/material//Dialog";
import DialogActions from "@mui/material//DialogActions";
import DialogContent from "@mui/material//DialogContent";
import DialogTitle from "@mui/material//DialogTitle";

export default function AddForm({
  open,
  handleChange,
  handleClose,
  handleSubmit
}) {
  
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            type="text"
            name={"name"}
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <TextField
            margin="dense"
            label="Place"
            name={"place"}
            type="text"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <TextField
            label="Time"
            type="text"
            name={"time"}
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <TextField
            margin="dense"
            label="Gender"
            name={"gender"}
            type="text"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
          <TextField
            margin="dense"
            label="Parent Name"
            name={"parentName"}
            type="text"
            fullWidth
            onChange={(e) => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(e) => handleSubmit(e)} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
