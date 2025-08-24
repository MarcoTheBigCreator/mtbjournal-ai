import { redirect } from 'next/navigation';
import { createNewUser } from '@/actions';

export default async function NewUserPage() {
  await createNewUser();
  redirect('/journal');
}
