import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';
import { useLogOutMutation } from 'src/store/services/authService';
import { removeToken } from 'src/store/reducers/authSlice';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

export const AccountPopover = ({ anchorEl, onClose, open, user }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [logOut, { isLoading }] = useLogOutMutation();

  const handleSignOut = async () => {
    try {
      await logOut();
      dispatch(removeToken('AT_Token'));
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = Array.isArray(error.data.message)
        ? error.data.message[0]
        : error.data.message;
      toast.error(errorMessage);
    }
  };

  const handlePopoverClose = () => {
    onClose();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={handlePopoverClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box sx={{ py: 1.5, px: 2 }}>
        <Typography variant="overline">{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.role}
        </Typography>
      </Box>
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem onClick={() => router.push('/account')}>
          Account Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          {isLoading ? 'Loading...' : 'Sign out'}
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};
