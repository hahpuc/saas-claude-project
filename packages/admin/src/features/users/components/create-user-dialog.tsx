import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Role } from '@/types';
import { useCreateUser } from '../hooks/use-users';
import { createUserSchema, type CreateUserFormValues } from '../schemas/user.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: Props) {
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', name: '', password: '', role: Role.USER },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUser.mutate(values, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register('name')} placeholder="John Doe" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register('email')} type="email" placeholder="user@example.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input {...register('password')} type="password" placeholder="••••••••" />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue={Role.USER} onValueChange={(v) => setValue('role', v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(Role).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={createUser.isPending}>
            {createUser.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
