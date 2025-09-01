import { formatDateForTooltip } from '@/utils';
import React from 'react';

interface TooltipData {
  x: number;
  y: number;
  score: number;
  mood: string;
  color: string;
  date: Date;
}

interface MoodTooltipProps {
  tooltip: TooltipData | null;
  mousePosition?: { x: number; y: number };
}

const getSentimentIndicator = (
  score: number
): { label: string; color: string } => {
  if (score >= 7) return { label: 'Very Positive', color: 'text-green-400' };
  if (score >= 3) return { label: 'Positive', color: 'text-green-300' };
  if (score >= -2) return { label: 'Neutral', color: 'text-yellow-400' };
  if (score >= -6) return { label: 'Negative', color: 'text-orange-400' };
  return { label: 'Very Negative', color: 'text-red-400' };
};

export const MoodTooltip = ({ tooltip, mousePosition }: MoodTooltipProps) => {
  if (!tooltip) return null;

  const x = mousePosition?.x ?? tooltip.x;
  const y = mousePosition?.y ?? tooltip.y;
  const sentiment = getSentimentIndicator(tooltip.score);

  return (
    <div
      className="fixed bg-neutral-900 border border-neutral-600 rounded-lg p-4 shadow-lg z-50 pointer-events-none min-w-[180px]"
      style={{
        left: x + 10,
        top: y - 70,
        transform: x > window.innerWidth - 220 ? 'translateX(-100%)' : 'none',
      }}
    >
      <div className="text-sm space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: tooltip.color }}
          />
          <span className="font-medium text-white capitalize">
            {tooltip.mood}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400 min-w-[45px]">Score:</span>
            <span className="font-medium text-white">
              {tooltip.score > 0 ? '+' : ''}
              {tooltip.score}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-neutral-400 min-w-[45px]">Level:</span>
            <span className={`font-medium ${sentiment.color}`}>
              {sentiment.label}
            </span>
          </div>
        </div>

        <div className="text-neutral-400 text-xs border-t border-neutral-700 pt-2">
          {formatDateForTooltip(tooltip.date)}
        </div>
      </div>
    </div>
  );
};
