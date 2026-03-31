import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/axios';
import type { AxiosError } from 'axios';

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, email: user.email });
    }
  }, [user]);

  const onUpdateProfile = async (values: ProfileValues) => {
    try {
      const { data } = await api.patch('/auth/me', values);
      setUser(data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const onChangePassword = async (values: PasswordValues) => {
    try {
      await api.post('/auth/change-password', values);
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err) {
      const error = err as AxiosError<{ error: { message: string } }>;
      toast.error(error.response?.data?.error?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...profileForm.register('name')} />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...profileForm.register('email')} type="email" />
            </div>
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input {...passwordForm.register('currentPassword')} type="password" />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input {...passwordForm.register('newPassword')} type="password" />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
