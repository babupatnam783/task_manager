import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export const ViewTaskDetailsDialog = ({ open, setOpenViewTask, task }) => {
    
    const handleClose = () => {
        setOpenViewTask(false); 
    };

    return (
        <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
            <DialogTitle>View Task Details</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Task Title:</Typography>
                            <Typography variant="body1">{task?.Title|| 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Task Description:</Typography>
                            <Typography variant="body1">{task?.Description || 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Created Date:</Typography>
                            <Typography variant="body1">{task?.CreatedAt ? new Date(task.CreatedAt).toLocaleDateString() : 'N/A'}</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Priority:</Typography>
                            <Typography variant="body1">{task?.Priority || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Cancel</Button>
                <Button variant="contained" color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};
