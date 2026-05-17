import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSuperAdminMe } from '../../api/super-admin-auth';
import { Loader } from '../../components/ui/Loader';
import { SuperAdminLayout } from '../../components/layout/SuperAdminLayout';
import type { SuperAdminUser } from './super-admin-auth.types';

type Props = {
  children: (superAdmin: SuperAdminUser) => React.ReactNode;
};

export function RequireSuperAdminAuth({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [superAdmin, setSuperAdmin] = useState<SuperAdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getSuperAdminMe();

        if (!cancelled) {
          setSuperAdmin(
            result.authenticated && result.superAdmin ? result.superAdmin : null,
          );
        }
      } catch {
        if (!cancelled) {
          setSuperAdmin(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!superAdmin) {
    return <Navigate to="/super-admin/login" replace />;
  }

  return <SuperAdminLayout superAdmin={superAdmin}>{children(superAdmin)}</SuperAdminLayout>;
}