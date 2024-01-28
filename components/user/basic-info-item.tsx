interface BasicInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

export function BasicInfoItem({ icon, label, value }: BasicInfoItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full w-12 h-12 bg-muted flex items-center justify-center">
        {/* <MailIcon /> */}
        {icon}
      </div>
      <div className="flex flex-col text-sm">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="font-medium">{value || "-"}</span>
      </div>
    </div>
  );
}
