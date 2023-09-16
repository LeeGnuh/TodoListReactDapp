import { Checkbox, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Task.css';

const Task = ({id, task, onClick }) => {
    return (

        <ListItem>
            <ListItemAvatar />
            <ListItemText primary={task} />
            <Checkbox></Checkbox>
            <DeleteIcon onClick={onClick(id)} fontSize="large" style={{ opacity: 0.7 }} />
        </ListItem>
    )
};

export default Task;
