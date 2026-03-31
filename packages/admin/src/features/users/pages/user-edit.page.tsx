import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@/types';
import { useUserDetail, useUpdateUser } from '../hooks/use-users';
import { updateUserSchema, type UpdateUserFormValues } from '../schemas/user.schema';
import { useEffect } from 'react';

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserDetail(id!);
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({ email: user.email, name: user.name, role: user.role });
    }
  }, [user, reset]);

  const onSubmit = (values: UpdateUserFormValues) => {
    updateUser.mutate(
      { id: id!, data: values },
      { onSuccess: () => navigate('/users') },
    );
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!user) {
    return <p className="text-muted-foreground">User not found</p>;
  }

  return (
    <div className="max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/users')}>
        ← Back to Users
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...register('email')} type="email" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue={user.role} onValueChange={(v) => setValue('role', v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(Role).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
