import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/store';

const withAdmin = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AdminComponent = (props: P) => {
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
      if (!user || user.role !== 'admin') {
        navigate('/', { replace: true });
      }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return <WrappedComponent {...props} />;
  };

  AdminComponent.displayName =
    `withAdmin(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AdminComponent;
};

export default withAdmin;