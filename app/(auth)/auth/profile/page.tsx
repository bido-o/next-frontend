import { AuthHeader } from '@/components/auth/auth-header';
import { ClientProfileForm } from '@/components/auth/client-profile-form';
import { SupplierProfileForm } from '@/components/auth/supplier-profile-form';
import { decodeJwt } from '@/lib/auth/jwt';
import { requireSession } from '@/lib/auth/session';
import { ROLES } from '@/lib/constants';

export default async function ProfilePage() {
  const session = await requireSession();
  const role = decodeJwt(session.accessToken)?.role;

  return (
    <>
      <AuthHeader showBack={false} />
      {role === ROLES.SUPPLIER ? (
        <SupplierProfileForm />
      ) : (
        <ClientProfileForm />
      )}
    </>
  );
}
