import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { UserProfile } from "../types/auth.js";

interface HeaderProps {
  onMenuToggle: () => void;
  user?: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getInitials = () => {
    if (!user) return "?";
    const firstInitial = user.firstname?.[0] ?? "";
    const lastInitial = user.lastname?.[0] ?? "";
    return `${firstInitial.toUpperCase()}${lastInitial.toUpperCase()}`;
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, height: "64px" }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Typography variant="h6" noWrap>
            Weather
          </Typography>
        </Box>
        <Tooltip title="Open profile menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar>{getInitials()}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
        >
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              onLogout();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
