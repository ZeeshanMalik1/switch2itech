import { Star } from "lucide-react";

export function ReviewCard({ name, avatar, role, rating, comment, date }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-colors duration-300">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="h-12 w-12 rounded-full border border-border object-cover ring-2 ring-background"
            />
          </div>
          <div>
            <h4 className="font-bold text-foreground leading-tight">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
          {date}
        </span>
      </div>
      
      <div className="mb-4 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating 
                ? "fill-yellow-500 text-yellow-500" 
                : "text-muted/30"
            }`}
          />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {comment}
      </p>
    </div>
  );
}