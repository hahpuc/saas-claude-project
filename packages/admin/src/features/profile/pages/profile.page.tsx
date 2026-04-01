import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/lib/axios';
import type { AxiosError } from 'axios';
import { User, Lock } from 'lucide-react';

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

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and security settings.
        </p>
      </div>

      {/* Avatar section */}
      <Card className="shadow-sm">
        <CardContent className="flex items-center gap-5 p-6">
          <Avatar className="h-20 w-20 ring-4 ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Badge className="mt-2 capitalize" variant="outline">{user?.role || 'User'}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your name and email address.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...profileForm.register('name')} className="h-10" />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...profileForm.register('email')} type="email" className="h-10" />
            </div>
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <Lock className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Ensure your account is using a strong password.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input {...passwordForm.register('currentPassword')} type="password" className="h-10" />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input {...passwordForm.register('newPassword')} type="password" className="h-10" />
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
