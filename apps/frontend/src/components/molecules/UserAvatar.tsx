import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';

export interface UserAvatarProps extends AvatarProps {
    initials: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials, ...props }) => {
    return (
        <Avatar
            {...props}
            sx={{
                width: 36,
                height: 36,
                backgroundColor: '#0D5CCF',
                color: '#FFFFFF',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                ...props.sx,
            }}
        >
            {initials}
        </Avatar>
    );
};

export default UserAvatar;
