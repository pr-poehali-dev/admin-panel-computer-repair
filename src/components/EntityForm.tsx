import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/types';
import Icon from '@/components/ui/icon';

interface EntityFormProps<T> {
  fields: FormField[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'view';
}

export function EntityForm<T extends Record<string, any>>({
  fields,
  initialData,
  onSubmit,
  onCancel,
  mode,
}: EntityFormProps<T>) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<T>({
    defaultValues: initialData as any,
  });

  const isViewMode = mode === 'view';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <Label htmlFor={field.name} className="mb-2 block">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {field.type === 'text' || field.type === 'email' || field.type === 'number' || field.type === 'date' ? (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                disabled={isViewMode || field.disabled}
                {...register(field.name as any, { required: field.required })}
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                disabled={isViewMode || field.disabled}
                rows={4}
                {...register(field.name as any, { required: field.required })}
              />
            ) : field.type === 'select' ? (
              <Select
                disabled={isViewMode || field.disabled}
                value={watch(field.name as any)}
                onValueChange={(value) => setValue(field.name as any, value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Выберите ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === 'switch' ? (
              <div className="flex items-center gap-2">
                <Switch
                  id={field.name}
                  disabled={isViewMode || field.disabled}
                  checked={watch(field.name as any)}
                  onCheckedChange={(checked) => setValue(field.name as any, checked as any)}
                />
              </div>
            ) : null}

            {errors[field.name] && (
              <p className="text-sm text-destructive mt-1">Это поле обязательно</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <Icon name="X" size={16} />
          {isViewMode ? 'Закрыть' : 'Отмена'}
        </Button>
        {!isViewMode && (
          <Button type="submit">
            <Icon name="Save" size={16} />
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        )}
      </div>
    </form>
  );
}
