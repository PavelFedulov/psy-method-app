import type { PropsWithChildren } from 'react';
import type { SuperAdminUser } from '../../features/super-admin-auth/super-admin-auth.types';
import { SuperAdminHeader } from './SuperAdminHeader';

type Props = PropsWithChildren<{
  superAdmin: SuperAdminUser;
}>;

export function SuperAdminLayout({ superAdmin, children }: Props) {
  return (
    <div className="min-h-screen">
      <SuperAdminHeader superAdmin={superAdmin} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}