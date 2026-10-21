import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonStyles = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button-primary',
      secondary: 'ui-button-secondary',
      outline: 'ui-button-outline',
      ghost: 'ui-button-ghost',
      destructive: 'ui-button-danger',
      success: 'ui-button-success',
    },
    size: {
      default: '',
      sm: 'ui-button-sm',
      icon: 'ui-button-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export function Button({ variant, size, className, type = 'button', ...props }) {
  return <button className={cn(buttonStyles({ variant, size }), className)} type={type} {...props} />;
}

export function Card({ className, ...props }) {
  return <section className={cn('ui-card', className)} {...props} />;
}

export function Input({ className, ...props }) {
  return <input className={cn('ui-input', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('ui-input ui-textarea', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return <select className={cn('ui-input ui-select', className)} {...props}>{children}</select>;
}

export function Badge({ tone = 'neutral', className, ...props }) {
  return <span className={cn('ui-badge', `ui-badge-${tone}`, className)} {...props} />;
}

export function Dialog({ open, onOpenChange, title, description, children, className }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay" />
        <DialogPrimitive.Content className={cn('dialog-content', className)}>
          <div className="dialog-heading">
            <div>
              <DialogPrimitive.Title className="dialog-title">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="dialog-description">{description}</DialogPrimitive.Description>}
            </div>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close dialog"><X size={18} /></Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Field({ label, htmlFor, hint, children }) {
  return (
    <label className="field" htmlFor={htmlFor}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

