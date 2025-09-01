/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { titleFont } from '@/config';
import { MoodTooltip } from './MoodTooltip';

interface DataPoint {
  sentimentScore: number;
  mood: string;
  color: string;
  createdAt: Date;
}

interface MoodChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
  className?: string;
}

interface TooltipData {
  x: number;
  y: number;
  score: number;
  mood: string;
  color: string;
  date: Date;
}

export const MoodChart = ({
  data,
  title = 'Sentiment Analysis Over Time',
  subtitle = 'Track your emotional journey',
  className,
}: MoodChartProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [mousePosition, setMousePosition] = useState<
    { x: number; y: number } | undefined
  >();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePointHover = (point: DataPoint, event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    setTooltip({
      x: event.clientX,
      y: event.clientY,
      score: point.sentimentScore,
      mood: point.mood,
      color: point.color,
      date: point.createdAt,
    });

    setMousePosition({ x, y });
  };

  const handlePointLeave = () => {
    setTooltip(null);
    setMousePosition(undefined);
  };

  if (!data.length) {
    return (
      <div
        className={cn(
          'bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-violet-500',
          className
        )}
      >
        <div className="bg-violet-700 bg-opacity-50 px-4 sm:px-6 py-4 rounded-t-xl">
          <h2
            className={cn(
              titleFont.className,
              'text-xl sm:text-2xl font-bold text-violet-100'
            )}
          >
            {title}
          </h2>
          <p className="text-violet-200 text-sm mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center justify-center h-64 text-neutral-400">
          <p className={cn(titleFont.className, 'text-lg')}>
            No data available
          </p>
        </div>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );

  // Responsive padding based on screen size
  const isMobile = dimensions.width < 640;
  const padding = {
    top: 20,
    right: isMobile ? 30 : 50,
    bottom: isMobile ? 40 : 50,
    left: isMobile ? 30 : 50,
  };

  const chartWidth = Math.max(
    0,
    dimensions.width - padding.left - padding.right
  );
  const chartHeight = Math.max(
    0,
    dimensions.height - padding.top - padding.bottom
  );

  // Scale functions
  const minDate = sortedData[0]?.createdAt.getTime() || 0;
  const maxDate = sortedData[sortedData.length - 1]?.createdAt.getTime() || 0;
  const dateRange = maxDate - minDate || 1;

  const getX = (date: Date) =>
    ((date.getTime() - minDate) / dateRange) * chartWidth;
  const getY = (score: number) =>
    chartHeight - ((score + 10) / 20) * chartHeight;

  // Generate smooth curved path using quadratic curves
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];

      if (i === 1) {
        // First curve
        const controlX = previous.x + (current.x - previous.x) * 0.5;
        path += ` Q ${controlX} ${previous.y} ${current.x} ${current.y}`;
      } else {
        // Smooth curves for subsequent points
        const prev = points[i - 2];
        const controlX1 = previous.x + (current.x - prev.x) * 0.2;
        const controlY1 = previous.y;
        const controlX2 = current.x - (current.x - previous.x) * 0.2;
        const controlY2 = current.y;

        path += ` C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${current.x} ${current.y}`;
      }
    }

    return path;
  };

  const points = sortedData.map((point) => ({
    x: getX(point.createdAt),
    y: getY(point.sentimentScore),
  }));

  const pathData = generateSmoothPath(points);

  // Generate smooth area path
  const areaPath =
    points.length > 0
      ? [
          `M ${points[0].x} ${chartHeight}`,
          pathData.substring(2), // Remove the 'M' from the beginning
          `L ${points[points.length - 1].x} ${chartHeight}`,
          'Z',
        ].join(' ')
      : '';

  // Y-axis labels
  const yLabels = [
    { value: 10, label: '+10', y: getY(10) },
    { value: 0, label: '0', y: getY(0) },
    { value: -10, label: '-10', y: getY(-10) },
  ];

  // X-axis labels (responsive)
  const getXLabels = () => {
    if (sortedData.length === 0) return [];

    if (isMobile && sortedData.length > 3) {
      // On mobile, show only first and last
      return [
        { date: sortedData[0].createdAt, x: getX(sortedData[0].createdAt) },
        {
          date: sortedData[sortedData.length - 1].createdAt,
          x: getX(sortedData[sortedData.length - 1].createdAt),
        },
      ];
    } else {
      // On desktop, show first, middle, and last
      return [
        { date: sortedData[0].createdAt, x: getX(sortedData[0].createdAt) },
        ...(sortedData.length > 2
          ? [
              {
                date: sortedData[Math.floor(sortedData.length / 2)].createdAt,
                x: getX(
                  sortedData[Math.floor(sortedData.length / 2)].createdAt
                ),
              },
            ]
          : []),
        ...(sortedData.length > 1
          ? [
              {
                date: sortedData[sortedData.length - 1].createdAt,
                x: getX(sortedData[sortedData.length - 1].createdAt),
              },
            ]
          : []),
      ];
    }
  };

  const xLabels = getXLabels();

  const formatDate = (date: Date) => {
    return isMobile
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div
        className={cn(
          'bg-neutral-800 bg-opacity-50 backdrop-blur-md rounded-xl md:border md:border-violet-500 overflow-hidden w-full',
          className
        )}
      >
        <div className="md:bg-violet-700 bg-opacity-50 px-4 sm:px-6 py-4">
          <h2
            className={cn(
              titleFont.className,
              'text-lg font-semibold text-violet-100'
            )}
          >
            {title}
          </h2>
          <p className="text-violet-200 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="w-full">
          <div
            ref={containerRef}
            className="w-full h-64 sm:h-80 md:h-96 relative"
          >
            {dimensions.width > 0 && chartWidth > 0 && chartHeight > 0 && (
              <svg
                width={dimensions.width}
                height={dimensions.height}
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgb(139, 92, 246)"
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor="rgb(139, 92, 246)"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                  <filter
                    id="pointShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodColor="rgb(139, 92, 246)"
                      floodOpacity="0.4"
                    />
                  </filter>
                </defs>

                <g transform={`translate(${padding.left}, ${padding.top})`}>
                  {/* Grid lines */}
                  {yLabels.map((label) => (
                    <line
                      key={label.value}
                      x1={0}
                      y1={label.y}
                      x2={chartWidth}
                      y2={label.y}
                      stroke="rgb(107, 114, 128)"
                      strokeOpacity="0.3"
                      strokeDasharray="2,2"
                    />
                  ))}

                  {/* Area fill */}
                  <motion.path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />

                  {/* Smooth curved line */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke="rgb(139, 92, 246)"
                    strokeWidth={isMobile ? '2' : '3'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />

                  {/* Data points */}
                  {sortedData.map((point, index) => {
                    const x = getX(point.createdAt);
                    const y = getY(point.sentimentScore);
                    const radius = isMobile ? 4 : 6;

                    return (
                      <motion.circle
                        key={index}
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="rgb(139, 92, 246)"
                        filter="url(#pointShadow)"
                        className="cursor-pointer transition-all duration-200"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={(e) =>
                          handlePointHover(point, e.nativeEvent as any)
                        }
                        onMouseLeave={handlePointLeave}
                      />
                    );
                  })}

                  {/* Y-axis labels */}
                  {yLabels.map((label) => (
                    <text
                      key={label.value}
                      x={-10}
                      y={label.y + (isMobile ? 3 : 5)}
                      textAnchor="end"
                      className={cn(
                        titleFont.className,
                        isMobile ? 'text-xs' : 'text-xs'
                      )}
                      fill="rgb(156, 163, 175)"
                    >
                      {label.label}
                    </text>
                  ))}

                  {/* X-axis labels */}
                  {xLabels.map((label, index) => (
                    <text
                      key={index}
                      x={label.x}
                      y={chartHeight + (isMobile ? 20 : 25)}
                      textAnchor="middle"
                      className={cn(
                        titleFont.className,
                        isMobile ? 'text-xs' : 'text-xs'
                      )}
                      fill="rgb(156, 163, 175)"
                    >
                      {formatDate(label.date)}
                    </text>
                  ))}

                  {/* Axis lines */}
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={chartHeight}
                    stroke="rgb(107, 114, 128)"
                    strokeWidth="1"
                  />
                  <line
                    x1={0}
                    y1={chartHeight}
                    x2={chartWidth}
                    y2={chartHeight}
                    stroke="rgb(107, 114, 128)"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>

      <MoodTooltip tooltip={tooltip} mousePosition={mousePosition} />
    </>
  );
};
