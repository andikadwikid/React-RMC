interface InsightCardProps {
  title: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

export function InsightCard({ title, value, bgColor, textColor }: InsightCardProps) {
  return (
    <div className={`${bgColor} p-3 rounded-lg`}>
      <div className={`text-sm font-medium ${textColor}`}>
        {title}
      </div>
      <div className={`text-lg font-bold ${textColor.replace('800', '600')}`}>
        {value}
      </div>
    </div>
  );
}

interface InsightCardsGridProps {
  insights: InsightCardProps[];
  className?: string;
}

export function InsightCardsGrid({ insights, className = "grid grid-cols-1 md:grid-cols-3 gap-3" }: InsightCardsGridProps) {
  return (
    <div className={className}>
      {insights.map((insight, index) => (
        <InsightCard key={index} {...insight} />
      ))}
    </div>
  );
}
