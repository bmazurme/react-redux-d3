import React, { ReactNode } from 'react';

export type NotificationProps = {
  type: 'error' | 'success' | 'notification',
  children: ReactNode | string,
  className?: string,
};

export default function Notification({ type = 'notification', children, className }: NotificationProps) {
  return (
    <div className="notification__container">
      { children }
    </div>
  );
}
