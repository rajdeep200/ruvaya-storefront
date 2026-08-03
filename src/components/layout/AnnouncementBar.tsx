type AnnouncementBarProps = {
  messages: string[];
};

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  if (messages.length === 0) return null;

  return (
    <div className="bg-primary py-2 text-center text-[11px] tracking-[0.15em] text-white sm:text-xs">
      <p className="px-4">
        <span aria-hidden="true" className="mr-2">
          +
        </span>
        {messages.join("  |  ")}
        <span aria-hidden="true" className="ml-2">
          +
        </span>
      </p>
    </div>
  );
}
