import React from 'react';
import { Card, CardContent } from './Card';
import { BadgeProps } from './Badge';
import { cn } from '@/lib/utils';

interface StatusSummaryCardProps {
  title: string;
  count: number;
  variant?: BadgeProps["variant"];
  className?: string;
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ title, count, variant = "default", className }) => {
  const variantStyles = {
    default: "text-primary",
    secondary: "text-secondary-foreground",
    destructive: "text-destructive",
    outline: "text-foreground",
    success: "text-green-700",
    warning: "text-yellow-700",
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold", variantStyles[variant])}>{count}</p>
        </div>
      </CardContent>
    </Card>
  );
};
