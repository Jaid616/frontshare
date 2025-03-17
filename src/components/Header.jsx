import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Box
} from '@mui/material';
import { CirclePlus, EllipsisVertical } from 'lucide-react';

const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Business Name Input */}
        <TextField
          placeholder="Enter Business Name"
          variant="standard"
          sx={{
            '& .MuiInput-underline:before': { borderBottom: '2px dotted #e0e0e0' },
            '& .MuiInput-underline:hover:before': { borderBottom: '2px dotted #e0e0e0' },
            '& .MuiInput-underline:after': { borderBottom: '2px dotted #e0e0e0' },
            '& input': { color: '#666' },
          }}
        />
        
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Action Buttons */}
        <Button 
          startIcon={<CirclePlus  size={16} />} 
          sx={{ 
            bgcolor: '#F5D2D2', 
            color: '#ffffff',
            '&:hover': { bgcolor: '#ffcdd2' }
          }}
        >
          Add Sale
        </Button>

        <Button
          startIcon={<CirclePlus  size={16} />}
          sx={{
            bgcolor: '#e3f2fd',
            color: '#2196f3',
            '&:hover': { bgcolor: '#bbdefb' }
          }}
        >
          Add Purchase
        </Button>

        {/* <IconButton 
          sx={{ 
            bgcolor: '#f5f5f5',
            '&:hover': { bgcolor: '#eeeeee' }
          }}
        >
          <CirclePlus  size={20} />
        </IconButton> */}

        {/* <IconButton>
          <EllipsisVertical size={20} />
        </IconButton> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;